'use strict';

var express = require('express');
var appHttp = require('http');
var server = require('socket.io');
var userNames = require('./friends');

var MessengerApi = function(){
    var self = this;

    self.init = function(){
        // self.createRoutes();
        self.app = express();

        //For socket.io.client to work
        //pointing to static public/index.html
        self.app.use(express.static(__dirname + '/public/dist'));

        self.http = appHttp.Server(self.app);
        
        //For socket.io.client to work
        self.io = server(appHttp);
    }

    self.startApp = function(){
        self.init();

        //For socket.io.client to work
        //Assigned the 
        self.appServer = self.http.listen(process.env.PORT || 3000, function(){
            console.log('listening on : 3000');
        });

        self.startServerMessenger();
    }

    self.startServerMessenger = function(){
        var CONNECTION = 'connection';
        var DISCONNECT = 'disconnect';

        var SEND_MSG = 'send:message';
        var INIT = 'init';
        var CHANGE_NAME = 'change:name';
        var USER_JOIN = 'user:join';
        var USER_LEFT = 'user:left';
        var CHAT_ROOM = 'chatroom';

        //For socket.io.client to work
        //io.listen should be passed an http.Server instance, 
        //hence http.Server instance returned by self.http.listen
        self.socket = self.io.listen(self.appServer);

        self.socket.on(CONNECTION, function(socket){
            console.log('a user connected');

            var name = userNames.getGuestName();

            //send the new user their name and a list of friends
            socket.emit(INIT, {name: name, friends: userNames.getFriends()});

            //notify other clients that a new user has joined
            socket.broadcast.emit(USER_JOIN, {name: name});

            //broadcast a user's message to other users
            socket.on(SEND_MSG, function(data){
                socket.broadcast.emit(SEND_MSG, {user: name, text: data.msg});
            });

            //validate a user's name change, and broadcast it on success
            socket.on(CHANGE_NAME, function(data, fn){
                console.log("prepare to change name " + data.name);
                if(userNames.claim(data.name)){
                    var prevName = name;

                    userNames.removeFriend(prevName);

                    name = data.name;

                    console.log(CHANGE_NAME + " prev name: " + prevName + " new name: " + name);

                    socket.broadcast.emit(CHANGE_NAME,{prevName: prevName, currentName: name});

                    fn(true);
                }else{
                    fn(false);
                }
            });

            socket.on(DISCONNECT, function(){
                console.log('user ' + name + ' has left.');

                socket.broadcast.emit(USER_LEFT, {name: name});

                userNames.removeFriend(name);
            });
        });
    }
};

var s = new MessengerApi();
s.startApp();