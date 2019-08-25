'use strict';

const mongoose = require('mongoose');
const modelUser = mongoose.model('User');
const modelChat = mongoose.model('Chat');
const modelMessage = mongoose.model('Message');

module.exports = async (io) => {

  // list of active socket clients
  var clients = [];

  io.sockets.on('connection', function(socket) {

    // first event that fires after connection
    socket.on('init', async function(username) {
      //lookup user in DB
      let userObj = await modelUser.loadByName(username)
      // our idea is to create a user if the username is not found
      if (!userObj){
        userObj = await modelUser.create({username});
      }
      // update list of connected socket clients
      var clientInfo = new Object();
      clientInfo.socketId = socket.id; 
      clientInfo.userId = userObj._id;
      clients.push(clientInfo);

      // send stored username to just the connected user for presentation
      io.to(socket.id).emit('init', userObj.username);
      // send joined user's username to all clients except the sender to inform about availability
      socket.broadcast.emit('is_online',  userObj.username);

      // send existing list of chats to the connected user
      let chatList = await modelChat.loadByMember(userObj._id);
      io.to(socket.id).emit('user_list', chatList);
    });

    socket.on('disconnect', function(username) {
      // remove disconnected client data from socket clients
      clients = clients.filter(client => client.socketId === socket.id);
      // send disconnecting user's username to all clients except the sender
      socket.broadcast.emit('is_offline', username);
    })

    /**
     * @note This should be an API and not a socket event.
     */
    socket.on('get_chat_thread', async function(chatId){
      // send selected chat's thread to the client
      let [chatObj, messagesList] = await Promise.all([modelChat.load(chatId), modelMessage.loadByChat(chatId)]);
      io.to(socket.id).emit('deliver_chat_thread', {chatObj, messagesList});
    });

    
    socket.on('new_message_deliver', async function({chatId, content}){
      // find chat object
      let chatObj = await modelChat.load(chatId);
      
      // get sender and receiver information from socket clients data
      let sender = clients.find(client => String(client.socketId) === String(socket.id));

      /**
       * @description We need to find socket client who is the receiver in the selected chat. 
       * So we pick the member from chat object whose user ID doesn't match the sender but matches a user ID in the socket clients data. 
       * A better way of setting up a chat would be to use the concept of `namespaces` or `rooms` that SocketIO offers.
       */
      let receiver = clients.find(client => String(client.userId) === String(chatObj.members.filter(member => String(member._id) !== String(sender.userId)).map(obj => obj.userId)))
      
      // sending the message to the receiver socket client.
      // Here we only emit an event if the receiver is found in the socket clients list
      if (receiver)
        io.to(receiver.socketId).emit('new_message_receive', content);
      
      // store in DB
      modelMessage.create({chat: chatId, content, sender: sender.userId})
    })
  });
}
