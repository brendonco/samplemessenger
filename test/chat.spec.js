var assert = require("assert");
var io = require('socket.io-client');

var options ={
  transports: ['websocket'],
  'force new connection': true
};

var url = "http://localhost:3000";

var chatUser1 = {
  user: 'chatroom',
  text: 'User has joined.'
};

describe('Sample Messenger Test', function(){
    it('Broadcast user to all users', function(done){
      var client1 = io.connect(url, options);

      client1.on('connect', function(data){
        client1.emit('user:join', chatUser1);

        done();
      });
    });


    it('Broadcast messages to the whole group', function(done){
      var client1, client2, client3;

      var message = {msg: 'Hello World'};

      var checkMsg = function(client){
        client.on('send:message', function(msg){
            assert.equal(message.msg, msg.text);

            client.disconnect();
        });
      };

      client1 = io.connect(url, options);
      checkMsg(client1);

      client1.on('connect', function(data){
        client2 = io.connect(url, options);
        checkMsg(client2);

        client2.on('connect', function(data){
          client3 = io.connect(url, options);
          checkMsg(client3);

          client3.on('connect', function(data){
            client2.emit('send:message', message);

            done();
          });
        });
      });
    });
});