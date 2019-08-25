'use strict';

const controller = require('./../controllers/users');

module.exports = (fastify) => {
  fastify.route(
    {
      method: 'POST',
      url: '/register',
      handler: controller.register
    },
    {
      method: 'POST',
      url: '/login',
      handler: controller.login
    }
  )
}
