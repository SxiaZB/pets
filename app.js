"use strict";

const fastify = require('fastify'),
      config = require("./config").toJS(),
	  route = require("./route");


const server = fastify();
server.register(route);
// node升级到8.x之后，默认设置了keepAliveTimeout = 5000，之前是不主动断开的。设置成5秒主动断开socket后，在断开的瞬间，如果有请求进来，会导致出现Connection reset的报错。
// 将这个keepAliveTimeout调大后，就会减少上述情况的发生（因为需要很长时间都没有人访问，才会主动断开）
server.server.keepAliveTimeout = 60000; //60 second

server.listen(config.server.port, (err) => {
	  if (err) throw err;
	  console.log(`server listening on ${server.server.address().port}`);
});
