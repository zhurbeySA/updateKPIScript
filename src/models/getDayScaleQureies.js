import moment from 'moment';
import db from './controllers/statisticsDB';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const constructQueriesForDays = async () => {
  // Get date of last entry in table with precalculated statistics
  const getLastDayInLocal = async () => {
    const newestEntry = await db.oneOrNone('SELECT * FROM day_stat2 ORDER BY day DESC LIMIT 1');
    let lastDate = '';

    if (newestEntry) {
      lastDate = moment(newestEntry.day).startOf('day');

      // Delete last line to insert new one
      await db.none(`DELETE FROM day_stat2 WHERE day = '${moment(newestEntry.day).format('YYYY-MM-DD')}'`);
    } else {
      lastDate = moment(new Date('2017.01.01')).startOf('day');
    }

    return lastDate;
  };

  const lastDate = await getLastDayInLocal();
  // const currentDate = moment().endOf('day');
  // const lastDate = moment(new Date('2019.05.07')).startOf('day');
  // const lastDate = moment(new Date('2020.07.01')).startOf('day');
  // const currentDate = moment().endOf('day');
  const currentDate = moment(new Date('2019.01.01')).endOf('day');
  const queries = [];
  console.log(`From: ${lastDate.format(dateFormat)} To ${currentDate.format(dateFormat)}`);

  for (let i = moment(lastDate); i.isBefore(currentDate); i.add(1, 'days')) {
    // orders_income
    const periodStart = moment(i).startOf('day').format(dateFormat);
    const dayQueriesStack = [];

    const ordersIncome = `SELECT SUM(order_sum) AS result FROM order_sales WHERE created_at BETWEEN '${periodStart}' AND end_of_day('${periodStart}')`;
    dayQueriesStack.push(ordersIncome);

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

    // avg_reciept
    const avgReciept = `SELECT AVG(order_sum) AS result FROM order_sales WHERE created_at BETWEEN '${periodStart}' AND end_of_day('${periodStart}')`;
    dayQueriesStack.push(avgReciept);

    const date = `SELECT '${periodStart}' AS result`;
    dayQueriesStack.push(date);

    queries.push(dayQueriesStack);
  }

  return queries;
};

export default constructQueriesForDays;
