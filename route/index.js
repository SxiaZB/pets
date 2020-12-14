"use strict";

module.exports = function(fastify, options, next) {
	fastify.get('/pets/check', require('../handler/check'));
	fastify.post('/find/KindIdAndFcity', require('../handler/find').kindIdAndFcity);
	fastify.post('/find/getOneInfo', require('../handler/find').getOneInfo);
	fastify.post('/find/addpets', require('../handler/find').addpets);
	fastify.post('/adoption/getAdoptionList', require('../handler/give').getAdoptionList);
	fastify.post('/adoption/getRelationship', require('../handler/give').getRelationship);
	fastify.post('/adoption/insertAdopter', require('../handler/give').insertAdopter);
	fastify.post('/member/login', require('../handler/user').login);
	fastify.post('/member/regist', require('../handler/user').regist);
	fastify.post('/member/getUser', require('../handler/user').getUser);
	next();
};
