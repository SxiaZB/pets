'use strict';

let config = require("../config").toJS();
let mysql = require('mysql');
let bizerror = require('./bizerror');
let debug = require('debug')('db');

let createPool = function(dbConfig){
  let pool = mysql.createPool({
    connectionLimit: 10,
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    typeCast: function(field, next) {
      // convert bit(1) into boolean
      if (field.type == "BIT" && field.length == 1) {
        let bit = field.string();
        return (bit === null ? null : (bit.charCodeAt(0) === 1));
      }
      return next();
    },
    dateStrings: true
  });

  pool.execute =  function _execute(sql, params) {
    return new Promise((resolve, reject) => {
      this.getConnection((err, connection) => {
        if (err) {
        	console.log(`Failed to get the connect, ${err}`);
            return reject(bizerror.internalServerError(err.name + ":" + err.message));
        }

        let query = connection.query(sql, params, (err, result) => {
          connection.release();
          let error = bizerror.dberror(err);
          return error ? reject(error) : resolve(result);
        });
        debug(`db execute: ${query.sql}`);
      });
    });
  };

  pool.query = function _query(sql, params) {
    return this.execute(sql, params);
  };

  pool.queryCount = function _queryCount(sql, params) {
    return this.query(sql, params).then((result) => {
      return result[0].count;
    });
  };

  pool.queryOne = function _queryOne(sql, params) {
    return this.query(sql, params).then((result) => {
      return result.length === 0 ? null : result[0];
    });
  };
  return pool;
};

module.exports = createPool(config.mysql);
