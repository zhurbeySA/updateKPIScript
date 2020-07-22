import moment from 'moment';
import db from './controllers/statisticsDB';

const dateFormat = 'YYYY-MM-DD';

const constructQueriesForDays = async () => {
  // Get date of last entry in table with precalculated statistics
  const getLastDayInLocal = async () => {
    const newestEntry = await db.oneOrNone('SELECT * FROM day_stat ORDER BY day DESC LIMIT 1');
    let lastDate = '';

    if (newestEntry) {
      lastDate = moment(newestEntry.day);

      // Delete last line to insert new one
      await db.none(`DELETE FROM day_stat WHERE day = '${moment(newestEntry.day).format('YYYY-MM-DD')}'`);
    } else {
      lastDate = moment(new Date('2017.01.01'));
    }

    return lastDate;
  };

  // const lastDate = moment(new Date('2020.01.01'));
  const lastDate = await getLastDayInLocal();
  const currentDate = moment();

  const queries = [];
  console.log(`From: ${lastDate.format(dateFormat)} To ${currentDate.format(dateFormat)}`);

  for (let i = moment(lastDate); i.isBefore(currentDate); i.add(1, 'days')) {
    const periodStart = moment(i).format(dateFormat);
    const dayQueriesStack = [];

    // cost_price
    const costPrice = `SELECT SUM(net_price) AS result FROM order_sales WHERE created_at BETWEEN '${periodStart}' AND end_of_day('${periodStart}');`;
    dayQueriesStack.push(costPrice);

    // extra_price
    const extraPrice = `SELECT SUM(order_sum - net_price) AS result FROM order_sales WHERE created_at BETWEEN '${periodStart}' AND end_of_day('${periodStart}');`;
    dayQueriesStack.push(extraPrice);

    // income

    // ordered
    const ordered = `SELECT COUNT(*) AS result FROM order_sales WHERE created_at BETWEEN '${periodStart}' AND end_of_day('${periodStart}')`;
    dayQueriesStack.push(ordered);

    const date = `SELECT '${periodStart}' AS result`;
    dayQueriesStack.push(date);

    queries.push(dayQueriesStack);
  }

  return queries;
};

export default constructQueriesForDays;
