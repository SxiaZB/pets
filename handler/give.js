"use strict";

const _ = require('lodash');
const db = require('../components/db');
const errors = require('../components/bizerror');
const image = require('./common/image');

module.exports.getAdoptionList = function (req, res) {
  (async function () {
    const {city, kindId} = req.body;

    var sql = `SELECT * FROM pets.adoption WHERE city = '${city}'`;
    if (_.isNumber(kindId) && kindId > 0) {
      sql += ` AND kindId = ${kindId}`
    }
    const data = await db.query(sql);
    const adids = _.map(data, 'adid');
    const imageMap = await image.listPetImages(adids);
    _.map(data, it => {
      it.petImages = imageMap[it.adid] || [];
    });
    res.send(data);
  })().catch(err => {
    res.send(errors.internalServerError(err.message || err.toString()));
  });
};
module.exports.getRelationship = function (req, res) {
  (async function () {
    const {adid} = req.body;

    var sql = ` SELECT a.*,p.age,r.acId,pe.img,ad.conditions,u.username,u.img as uImg,u.phone
        FROM relationship r,adoption a,adoptionConditions ad,mb_user u,petAge p,petImages pe
        where r.adid=a.adid and r.acId=ad.acId and a.adid=pe.adid and a.petAgeId=p.ageId
        and u.id=a.userId and r.adid=?`;
    const data = await db.query(sql, [adid]);
    const r = {};
    if (!_.isEmpty(data)) {
      r.acId = data[0].acId;
      r.adoption = {
        sex: data[0].sex,
        isVaccine: data[0].isVaccine,
        name: data[0].name,
        isEP: data[0].isEP,
        isNeuter: data[0].isNeuter,
        describe: data[0].describe,
        city: data[0].city,
        userId: data[0].detailed,
        petImages: [
          {img: data[0].img}
        ],
        petAge: {age: data[0].age},
        userEntity: {
          username: data[0].username,
          img: data[0].uImg,
          phone: data[0].phone,
        },
        as: {
          conditions: data[0].conditions,
        },
      };
    }
    res.send([r]);
  })().catch(err => {
    res.send(errors.internalServerError(err.message || err.toString()));
  });
};

const addRelationship = async function (tj = [], adid) {
  if (_.isEmpty(tj)) {
    return;
  }
  var sql = `INSERT INTO relationship VALUES `;
  var li = [];
  _.map(tj, it => {
    li.push(`(null,${it},${adid})`)
  });
  sql += li.join(',');
  await db.execute(sql);
};
module.exports.insertAdopter = function (req, res) {
  (async function () {
    const {name, sex, isVaccine, isNeuter, isEP, describe, city, detailed, kindId, petAgeId, userid, imgss, tj} = req.body;

    var sql = `INSERT INTO adoption VALUES(null,?,?,?,?,?,?,?,?,?,?,?);`;
    await db.execute(sql, [name, sex, isVaccine, isNeuter, isEP, describe, city, detailed, kindId, petAgeId, userid]);
    const data = await db.queryOne(`SELECT * FROM pets.adoption WHERE userId = ${userid} order by adid desc limit 1`);

    await image.addPetImages(imgss, data.adid);
    await addRelationship(tj, data.adid);
    res.send(data);
  })().catch(err => {
    res.send(errors.internalServerError(err.message || err.toString()));
  });
};
