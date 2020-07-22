import moment from 'moment';
import db from './controllers/statisticsDB';

const dateFormat = 'YYYY-MM-DD';

const constructQueriesForMonths = async () => {
  // Get date of last entry in table with precalculated statistics
  const getLastMonthInLocal = async () => {
    const newestEntry = await db.oneOrNone('SELECT * FROM month_stat ORDER BY month_year DESC LIMIT 1');
    let lastDate = '';

    if (newestEntry) {
      lastDate = moment(newestEntry.month_year).startOf('month');

      // Delete last line to insert new one
      await db.none(`DELETE FROM month_stat WHERE month_year = '${moment(newestEntry.month_year).format('YYYY-MM-DD')}'`);
    } else {
      lastDate = moment(new Date('2017.01.01')).startOf('month');
    }

    return lastDate;
  };

  const lastDate = await getLastMonthInLocal();
  const currentDate = moment().endOf('month');

  const queries = [];
  console.log(`From: ${lastDate.format(dateFormat)} To ${currentDate.format(dateFormat)}`);

  for (let i = moment(lastDate); i.isBefore(currentDate); i.add(1, 'month')) {
    const periodStart = moment(i).startOf('month').format(dateFormat);
    const monthQueriesStack = [];

    // cost_price
    const costPrice = `SELECT SUM(cost_price) AS result FROM day_stat WHERE day BETWEEN '${periodStart}' AND last_month_day('${periodStart}');`;
    monthQueriesStack.push(costPrice);

    // extra_price
    const extraPrice = `SELECT SUM(extra_price) AS result FROM day_stat WHERE day BETWEEN '${periodStart}' AND last_month_day('${periodStart}');`;
    monthQueriesStack.push(extraPrice);

    // income

    // ordered
    const ordered = `SELECT SUM(ordered) AS result FROM day_stat WHERE day BETWEEN '${periodStart}' AND last_month_day('${periodStart}')`;
    monthQueriesStack.push(ordered);

    const date = `SELECT '${periodStart}' AS result`;
    monthQueriesStack.push(date);

    queries.push(monthQueriesStack);
  }

  return queries;
};

export default constructQueriesForMonths;
