'use strict';

let modelUser = require('mongoose').model('User');

module.exports = {

  register: async (request, response) => {
    return response.send({'msg': 'Coming Soon!'});
  },

  login: async (request, response) => {
    return response.send({'msg': 'Coming Soon!'});
  },

  search: async (request, response) => {
    return response.send(await modelUser.search(request.body.keyword, {}));
  }

}
