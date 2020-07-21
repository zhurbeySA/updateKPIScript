## Get KPI's script
Script which upload new statistics data from API server, calculate KPI's and write them in database. Calculate KPI's only for period of time between last date in table where calculated KPI's are stored and current date. All queries to database happen asynchronously.

## How to run
Run next command:
1. ```npm install```
2. ```npm build```

Script is supposed to be runned on server with UNIX like OS. To run script every 5 minutes we can use cronjobs.\
Cron tasks have next syntax: * * * * * commandToRun\
#1 * - minute (0 - 59)\
#2 * - hour (0 - 23)\
#3 * - day of month (1 - 31)\
#4 * - month (1 - 12)\
#5 * - day of week (0 - 6) (Sunday to Saturday; 7 is also a Saturday on some systems)\

Run command:\
  ```crontab -e```

Add there new line:\
  ```*\5 * * * * node /pathToDistFolder/dist/app.js```

It will upload new KPI's to table every 5 minutes

