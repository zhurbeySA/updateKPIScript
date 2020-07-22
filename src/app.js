import '@babel/polyfill';
import KPIUpdate from './models/KPIUpdate';
import constructQueriesForDays from './models/getDayScaleQureies';
import constructQueriesForMonths from './models/getMonthScaleQueries';
import constructQueriesForYears from './models/getYearScaleQueries';

const main = async () => {
  await KPIUpdate(constructQueriesForDays, 'day');
  await KPIUpdate(constructQueriesForMonths, 'month');
  await KPIUpdate(constructQueriesForYears, 'year');
};

main();
