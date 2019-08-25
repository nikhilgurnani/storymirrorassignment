'use strict';

const controller = require('./../controllers/users');

module.exports = (fastify, opts, next) => {
  fastify.post(
      '/search',
      {
        description: 'Search users by username',
        tags: ['user',],
        summary: '',
        body: {
          type: 'object',
          properties: {
            keyword: { type: 'string' },
          }
        },
        response: {
          200: {
            description: 'Successful response',
            type: 'object',
            properties: {
              result: { type: 'array' }
            }
          }
        },
      },
      controller.search,
  );
  next();
}
