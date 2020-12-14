"use strict";

const _ = require('lodash');
const db = require('../../components/db');

module.exports.getKind = async function (kindId = 0) {
  const defaultKind = {
    kindId: 0,
    kingName: '未知'
  };
  if (kindId <= 0) {
    return defaultKind;
  }
  var sql = `SELECT * FROM pets.kind WHERE kindId = ?`;
  const data = await db.query(sql, [kindId]);

  return _.isEmpty(data) ? defaultKind : data[0];
};
