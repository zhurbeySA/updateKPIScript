import moment from 'moment';
import db from './controllers/statisticsDB';

const dateFormat = 'YYYY-MM-DD';

const constructQueriesForYears = async () => {
  // Get date of last entry in table with precalculated statistics
  const getLastYearInLocal = async () => {
    const newestEntry = await db.oneOrNone('SELECT * FROM year_stat ORDER BY year DESC LIMIT 1');
    let lastDate = '';

    if (newestEntry) {
      lastDate = newestEntry.year;

      // Delete last line to insert new one
      await db.none(`DELETE FROM year_stat WHERE year = ${lastDate};`);
    } else {
      lastDate = 2017;
    }

    return lastDate;
  };

  const lastDate = await getLastYearInLocal();
  const currentDate = moment().year();
  const queries = [];
  console.log(`From: ${lastDate} To ${currentDate}`);

  for (let year = lastDate; year <= currentDate; year += 1) {
    const yearQueriesStack = [];
    const periodStart = moment(new Date(`${year}`)).startOf('year').format(dateFormat);

    // cost_price
    const costPrice = `SELECT SUM(cost_price) AS result FROM month_stat WHERE month_year BETWEEN '${periodStart}' AND last_year_day('${periodStart}');`;
    yearQueriesStack.push(costPrice);

    // extra_price
    const extraPrice = `SELECT SUM(extra_price) AS result FROM month_stat WHERE month_year BETWEEN '${periodStart}' AND last_year_day('${periodStart}');`;
    yearQueriesStack.push(extraPrice);

    // income

    // ordered
    const ordered = `SELECT SUM(ordered) AS result FROM month_stat WHERE month_year BETWEEN '${periodStart}' AND last_year_day('${periodStart}')`;
    yearQueriesStack.push(ordered);

    const date = `SELECT '${year}' AS result`;
    yearQueriesStack.push(date);

    queries.push(yearQueriesStack);
  }

  return queries;
};

export default constructQueriesForYears;
