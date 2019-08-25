'use strict';
'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Chat Schema
 */

const ChatSchema = new Schema({
  members: [{ type: Schema.Types.ObjectId, ref: 'User', index: true }],
  type: { type: String, enum: ['grouped', 'single'], default: 'single' },
  lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' }
}, {timestamps: true});

/**
 * Pre-remove hook
 */

ChatSchema.pre('remove', function(next) {
  /**
   * Do stuff befor removing chat
   */
  next();
});

/**
 * Pre-save hook
 */

ChatSchema.pre('save', function(next) {
  /**
   * Do stuff before saving chat
   */
});

ChatSchema.methods = {
    
};

/**
 * Statics
 */

ChatSchema.statics = {
  /**
   * Find chat by id
   *
   * @param {ObjectId} id
   * @api private
   */

  load: function(_id) {
    return this.findOne({ _id })
      .populate([
        {
          path: 'members',
          select: {_id: 1, username: 1}
        }, 
        {
          path: 'lastMessage', select: {message: 1}
        }
      ])
      .exec();
  },

  /**
   * Find chat by name
   *
   * @param {ObjectId} id
   * @api private
   */

  loadByMember: function(member) {
    return this.find({ members: member }, {members: {$elemMatch: {$ne: member}}})
      .populate([
        {
          path: 'members',
          select: {_id: 1, username: 1}
        }, 
        {
          path: 'lastMessage', select: {message: 1}
        }
      ])
      .select('_id type lastMessage')
      .exec();
  },

};

module.exports = mongoose.model('Chat', ChatSchema);
