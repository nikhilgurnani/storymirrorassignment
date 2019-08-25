'use strict';

module.exports = function (fastify, opts, done) {
  fastify.register(require('./users'), { prefix: '/user' });
  done();
};
