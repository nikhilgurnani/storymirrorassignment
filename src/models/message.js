'use strict';
'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chat = mongoose.model('Chat');

/**
 * Message Schema
 */

const MessageSchema = new Schema({
  chat: { type: Schema.Types.ObjectId, ref: 'Chat', index: true},
  content: { type: String, maxlength: 1000, index: true },
  meta: { type: Schema.Types.Mixed },
  sender: { type: Schema.Types.ObjectId, ref: 'User', index: true },
}, {timestamps: true});

/**
 * Pre-save hook
 */

MessageSchema.post('save', async function(next) {
  /**
   * Do stuff before saving message
   */
  await chat.findByIdAndUpdate({_id: this.chat}, {lastMessage: this._id}).exec();
  return next();
});

MessageSchema.methods = {
    
};

/**
 * Statics
 */

MessageSchema.statics = {
  /**
   * Find message by id
   *
   * @param {ObjectId} id
   * @api private
   */

  load: function(_id) {
    return this.findOne({ _id })
      .exec();
  },

  /**
   * Find messages by chat
   *
   * @param {ObjectId} id
   * @api private
   */

  loadByChat: function(chat) {
    return this.find({ chat })
      .populate(
        {
          path: 'sender'
        }
      )
      .sort({createdAt: -1})
      .exec();
  },

};

module.exports = mongoose.model('Message', MessageSchema);
