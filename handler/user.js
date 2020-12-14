"use strict";

const _ = require('lodash');
const db = require('../components/db');
const errors = require('../components/bizerror');


module.exports.login = function (req, res) {
  (async function () {
    const {phone, password} = req.body;

    var sql = `select * from mb_user WHERE phone=? and password=? `;
    const data = await db.query(sql, [phone, password]);
    if (_.isEmpty(data)) {
      throw new Error('手机号或密码错误！');
    }
    res.send(data[0].id);
  })().catch(err => {
    res.send(errors.internalServerError(err.message || err.toString()));
  });
};

module.exports.regist = function (req, res) {
  (async function () {
    const {username, password, phone, email, img} = req.body;
    if (_.isEmpty(phone) || _.isEmpty(password)) {
      throw new Error('手机号或密码未填写！');
    }
    var sql = `INSERT INTO \`pets\`.\`mb_user\`( \`username\`, \`password\`, \`phone\`, \`email\`, \`img\`) VALUES ( ?, ?, ?, ?, ?)`;
    await db.execute(sql, [username || phone, password, phone, email || '', img || '']);
    res.send({msg: 'ok'});
  })().catch(err => {
    res.send(errors.internalServerError(err.message || err.toString()));
  });
};

module.exports.getUser = function (req, res) {
  (async function () {
    const {token} = req.body;
    var sql = `select * from mb_user WHERE id=? `;

    const data = await db.query(sql, [token]);
    if (_.isEmpty(data)) {
      throw new Error('登录失败！');
    }
    res.send(data[0]);
  })().catch(err => {
    res.send(errors.internalServerError(err.message || err.toString()));
  });
};
