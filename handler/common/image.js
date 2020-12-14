"use strict";

const _ = require('lodash');
const db = require('../../components/db');

module.exports.listPetImages = async function (adids = []) {
  if (_.isEmpty(adids)) {
    return {};
  }
  var sql = `SELECT * FROM pets.petImages WHERE adid in( ?)`;
  const data = await db.query(sql, [adids]);

  return _.groupBy(data, 'adid');
};

module.exports.addPetImages = async function (imgs = [], adid = 0) {
  if (_.isEmpty(imgs)) {
    return ;
  }
  var sql = `INSERT INTO petImages VALUES `;
  var petImages = [];
  _.map(imgs, it => {
    petImages.push(`(null,'${it}',${adid})`)
  });
  sql += petImages.join(',');
  await db.execute(sql);
};
