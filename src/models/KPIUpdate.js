import moment from 'moment';
import db from './controllers/statisticsDB';

const KPIUpdate = async (getQueriesFunc, scale) => {
  let counter = 0;

  // Get all queries for calculating statistics
  const queries = await getQueriesFunc();

  // Ask database for all statistics
  const results = await Promise.all(queries.map(
    (dayPromisesStack) => Promise.all(dayPromisesStack.map(db.oneOrNone))
      .then((response) => {
        counter += 1;
        console.log(`got ${counter}`);

        if (response) {
          console.log(response[3]);
          return response;
        }

        return null;
      }),
  ));

  console.log('All calculated, start insert data');
  await results.forEach((responsesArr) => {
    const line = responsesArr.map((stat) => stat.result);

    const value0 = !line[0] || line[0] === '0' ? 0 : line[0];
    const value1 = !line[1] || line[1] === '0' ? 0 : line[1];
    const value2 = !line[2] || line[2] === '0' ? 0 : line[2];

    let date = '';
    let dateProp = '';
    if (scale === 'day') {
      date = moment(new Date(line[3])).format('YYYY-MM-DD');
      dateProp = 'day';
    } else if (scale === 'month') {
      date = moment(new Date(line[3])).add(14, 'days').format('YYYY-MM-DD');
      dateProp = 'month_year';
    } else {
      // eslint-disable-next-line
      date = line[3];
      dateProp = 'year';
    }

    db.none(`INSERT INTO ${scale}_stat(cost_price, extra_price, ordered, ${dateProp}) VALUES(${value0}, ${[value1]}, ${value2}, '${date}')`);
  });

  console.log('all done');
};

export default KPIUpdate;
