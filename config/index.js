"use strict";

const Immutable = require('immutable');

module.exports = Immutable.fromJS({
  server: {
    version: '0.0.1',
    port: +process.env.SERVER_PORT || 16666,
    gzip: false,
    logging: {
      access: true,
      audit: false,
      level: process.env.LOGGING_LEVEL || 'debug',
      pretty: true
    }
  },
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: +process.env.MYSQL_PORT || 32770,
    user: process.env.MYSQL_USERNAME || 'root',
    password: process.env.MYSQL_PASSWORD || 'ying99-testing',
    database: process.env.MYSQL_DBNAME || 'pets'
  }
});
