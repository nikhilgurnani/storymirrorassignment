'use strict';

// loading enviroment 
require('dotenv').config();  

// Require the framework and other components
const fastify = require('fastify')()
const logger = require('./utils/logger');
const join = require('path').join;
const io = require('socket.io')(fastify.server);
const mongoose = require('mongoose');
const fs = require('fs');
const models = join(__dirname, 'models');

// Using Morgan as a request logger with default configuration
fastify.use(require('morgan')("combined"));

// Fastify ecosystem extention for server side rendering
fastify.register(require('point-of-view'), {
  engine: {
    ejs: require('ejs')
  }
});

// Fastify ecosystem extention for API documentation
fastify.register(require('fastify-swagger'), {
  routePrefix: '/api/docs',
  exposeRoute: true,
  swagger: {
    info: {
      title: 'Story Mirror Chat App',
      description: 'testing the api',
      version: '0.1.0'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'user', description: 'User related end-points' },
    ],
    securityDefinitions: {
      apiKey: {
        type: 'apiKey',
        name: 'apiKey',
        in: 'header'
      }
    }
  }
});

fastify.ready(err => {
  if (err) throw err
  fastify.swagger()
});

// Home Route
fastify.get('/', async (request, response) => {
  return response.view('src/views/index.ejs');
});

fastify.register(require('./routes'), {prefix: 'api/'});


// Bootstrap models
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^.].*\.js$/))
  .forEach(file => require(join(models, file)));


// Bootstrap socket
require('./controllers/sockets')(io);

// Run the server!
const start = async () => {
  try {
    await fastify.listen(process.env.SERVER_PORT)
    logger.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

/**
 * Entry point of the app is DB connection, if it cannot establish DB connection it should log and fail silently.
 */
function connect() {
  mongoose.connection
    .on('error', (error)=>{logger.error(error)})
    .on('disconnected', connect)
    .once('open', start);
  if (process.env.MONGOOSE_DEBUG === 'true'){
    mongoose.set('debug', true);
  }
  return mongoose.connect(process.env.DB, { keepAlive: 1, useNewUrlParser: true });
}

module.exports = connect();
