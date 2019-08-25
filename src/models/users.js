'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcryptjs = require('bcryptjs');

/**
 * User Schema
 */

const UserSchema = new Schema({
  username: { type: String, default: '', trim: true, maxlength: 400, text: true },
  pin: { type: String, maxlength: 1000 },
}, {timestamps: true});

/**
 * Validations
 */

UserSchema.path('username').required(true, 'Username cannot be blank');
// UserSchema.path('pin').required(true, 'Pin cannot be blank');

UserSchema.path('username').unique(true, 'Username not available.');

/**
 * Pre-remove hook
 */

UserSchema.pre('remove', function(next) {
  /**
   * Do stuff befor removing user
   */
  next();
});

/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
  /**
   * Do stuff before saving user
   */
  if(!this.isModified("pin")) {
    return next();
  }
  let hashSalt = bcryptjs.genSaltSync(process.env.SEED_ROUNDS);
  this.pin = bcryptjs.hashSync(this.pin, hashSalt);
  next();
});

UserSchema.methods = {
    comparePassword : function(plaintext) {
        return bcryptjs.compareSync(plaintext, this.pin);
    },
};

/**
 * Statics
 */

UserSchema.statics = {
  /**
   * Find user by id
   *
   * @param {ObjectId} id
   * @api private
   */

  load: function(_id) {
    return this.findOne({ _id })
      .exec();
  },

  /**
   * Find user by name
   *
   * @param {ObjectId} id
   * @api private
   */

  loadByName: function(username) {
    return this.findOne({ username })
      .exec();
  },

  /**
   * search users
   *
   * @param {Object} options
   * @api private
   */

  search: function(keyword, options) {
    const query = {
      'username': {
        '$regex': keyword,
        '$options': 'i'
      }
    };
    const page = options.page || 0;
    const limit = options.limit || 30;
    return this.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * page)
      .exec();
  },

  /**
   * list of users
   * 
   * @api private
   */
  list: function(options){
    const query = options.filters;
    const page = options.page || 0;
    const limit = options.limit || 30;
    return this.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * page)
      .exec();
  }
};

module.exports = mongoose.model('User', UserSchema);
