'use strict';

var StandardError = require('standard-error');
var _ = require('lodash');

module.exports = function checkBizError(err, res, body, isExternal) {
  if (err) {
    return new StandardError("Internal Server Error", {
      statusCode: 500,
      message: "Internal Server Error",
      detail: err,
      isExternal: _.isEmpty(isExternal)? isExternal : false
    });
  }

  if (res.statusCode < 400) {
    return null;
  }

  if (res.statusCode == 501) { // 501 biz error
    var serr = new StandardError({
      code: (body.code || (res.statusCode? "9" + String(res.statusCode) : "9999")),
      statusCode: 501,
      message: body.msg || "Unknown Error",
      detail: body.detail,
      isExternal: _.isEmpty(isExternal)? isExternal : false
    });
    serr.name = "BizError";
    return serr;
  }

  // errors such as 400, 401, 403, 500...
  var serror = new StandardError(res.statusMessage, {
    statusCode: res.statusCode,
    message: body? body.msg : "",
    code: body? body.code : "0" + res.statusCode,
    detail: body? body.detail : undefined,
    isExternal: _.isEmpty(isExternal)? isExternal : false
  });
  serror.name = "HttpError";
  return serror;
};

module.exports.badRequestError = function BadRequestError(msg) {
  var error = new StandardError("Bad Request", {
    statusCode: 400,
    message: msg
  });
  error.name = "BadRequestError";
  return error;
};

module.exports.unauthorizedError = function UnauthorizedError(msg, detail) {
  var error = new StandardError("Unauthorized", {
    statusCode: 401,
    message: msg || 'Unauthorized',
    detail: detail
  });
  error.name = "UnauthorizedError";
  return error;
};

module.exports.forbiddenError = function ForbiddenError(msg) {
  var error = new StandardError("Unauthorized", {
    statusCode: 403,
    code: "9403",
    message: msg || 'Forbidden'
  });
  error.name = "ForbiddenError";
  return error;
};

module.exports.notFoundError = function NotFoundError(msg) {
  var error = new StandardError("Not Found", {
    statusCode: 404,
    message: msg || 'Not Found'
  });
  error.name = "NotFoundError";
  return error;
};


module.exports.methodNotAllowedError = function methodNotAllowedError(method) {
  var error = new StandardError("Method Not Allowed", {
    statusCode: 405,
    message: method + " is not allowed"
  });
  error.name = "methodNotAllowedError";
  return error;
};

var internalServerError = module.exports.internalServerError = function internalServerError(msg) {
  var error = new StandardError("Internal Server Error", {
    statusCode: 500,
    message: msg //|| 'Internal Server Error'
  });
  console.log(msg)
  error.name = "InternalServerError";
  return error;
};

module.exports.timeoutError = function internalServerError(msg) {
  var error = new StandardError('Request Timeout', {
    statusCode: 408,
    message: msg || 'Request Timeout'
  });
  error.name = "RequestTimeoutError";
  return error;
};

module.exports.bizError = function BizError(code, msg, detail) {
  var error = new StandardError({
    statusCode: 501,
    message: msg,
    detail: detail
  });
  error.name = "BizError";
  return error;
};

module.exports.dberror = function DbError(err) {
  if (!err) return;
  console.log(err.message);
  if (_.startsWith(err.message, "ER_DUP_ENTRY")) {
    var match = err.message.match(/ER_DUP_ENTRY: .+ for key '(.+)'/);
    var message = "属性重复";
    if (match) {
      message = "属性" + match[1] + "重复";
    }
    var error = new StandardError({
      code: "6000",
      statusCode: 501,
      msg: message
    });
    error.name = "DB_Dup_Error";
    return error;
  }

  return internalServerError(err.message);
};
