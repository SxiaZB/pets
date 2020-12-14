"use strict";

const _ = require('lodash');
const db = require('../components/db');
const errors = require('../components/bizerror');
const kind = require('./common/kind');
const user = require('./common/user');


module.exports.kindIdAndFcity = function (req, res) {
  (async function () {
    const {fcity, fkind} = req.body;

    var sql = `SELECT * FROM pets.finds WHERE fcity = '${fcity}'`;
    if (_.isNumber(fkind) && fkind > 0) {
      sql += ` AND fkind = ${fkind}`
    }
    const data = await db.query(sql);
    res.send(data);
  })().catch(err => {
    res.send(errors.internalServerError(err.message || err.toString()));
  });
};

module.exports.getOneInfo = function (req, res) {
  (async function () {
    const {fid} = req.body;

    var sql = `SELECT * FROM pets.finds WHERE fid = ?`;
    const data = await db.query(sql, [fid]);
    if (!_.isEmpty(data)){
      data[0].kindPojo = await kind.getKind(data[0].fkind);
      data[0].userEntity = await user.getUser(data[0].userId);
      res.send(data[0]);
    }
  })().catch(err => {
    res.send(errors.internalServerError(err.message || err.toString()));
  });
};

module.exports.addpets = function (req, res) {
  (async function () {
    const {
      fimg,
      ftype,
      fname,
      fcity,
      ftime,
      faddress,
      fontime,
      fkind,
      fdesc,
      userId
    } = req.body;

    var sql = `
         INSERT INTO finds
        (fimg,ftype,fname,fcity,ftime,faddress,fontime,fkind,fdesc,userId)
        VALUES
        (?,?,?,?,?,?,?,?,?,?)`;
    await db.execute(sql,
      [fimg,
      ftype,
      fname,
      fcity,
      ftime,
      faddress,
      fontime,
      fkind,
      fdesc,
      +(userId)]);
    res.send({msg: 'ok'});
  })().catch(err => {
    res.send(errors.internalServerError(err.message || err.toString()));
  });
};
