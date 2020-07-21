import moment from 'moment';
import db from './controllers/statisticsDB';

const KPIUpdate = async (getQueriesFunc) => {
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
          console.log(response[5]);
          return response;
        }

        return null;
      }),
  ));

  console.log(results);
  results.forEach((responsesArr) => {
    const line = responsesArr.map((stat) => stat.result);
    console.log(line);

    const value0 = !line[0] || line[0] === '0' ? 0 : line[0];
    const value1 = !line[1] || line[1] === '0' ? 0 : line[1];
    const value2 = !line[2] || line[2] === '0' ? 0 : line[2];
    const value3 = !line[3] || line[3] === '0' ? 0 : line[3];
    const value4 = !line[4] || line[4] === '0' ? 0 : line[4];
    const date = moment(new Date(line[5])).format('YYYY-MM-DD');

    db.none(`INSERT INTO day_stat2(orders_income, cost_price, extra_price, ordered, avg_reciept, day) VALUES(${value0}, ${[value1]}, ${value2}, ${value3}, ${value4}, '${date}')`);

    console.log('insert something !!');
  });
};

export default KPIUpdate;
