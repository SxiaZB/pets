"use strict";

const db = require('../components/db');
const errors = require('../components/bizerror');


module.exports = function(req, res, next) {
  (async function() {
    const mysql = await db.query('select 1');
    res.send({code:200, msg: "ok", mysql});
    next();
  })().
  catch(err =>{
    res.send(errors.internalServerError(err.message || err.toString()));
  });
};
