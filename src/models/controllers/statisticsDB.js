import dotenv from 'dotenv';

const pgPromise = require('pg-promise');

dotenv.config({ path: './.env' });

const initOptions = {};
const cn = {
  host: process.env.statisticsHost,
  port: process.env.statisticsPort,
  database: process.env.statisticsDatabase,
  user: process.env.statisticsUser,
  password: process.env.statisticsPassword,
  max: 30,
};

const pgp = pgPromise(initOptions);
const db = pgp(cn);

export default db;
