"use strict";

const _ = require('lodash');
const db = require('../../components/db');

module.exports.getUser = async function (id = 0) {

  var sql = `select * from mb_user WHERE id=? `;
  const data = await db.query(sql, [id]);

  return _.isEmpty(data) ? null : data[0];
};
