import '@babel/polyfill';
import KPIUpdate from './models/KPIUpdate';
import constructQueriesForDays from './models/getDayScaleQureies';

const main = () => {
  KPIUpdate(constructQueriesForDays);
};

main();
