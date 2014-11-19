'use strict';

// var Server = require('socket.io');

var express = require('express');
var appHttp = require('http');
// var path = require('path');
var server = require('socket.io');

var MessengerApi = function(){
    var self = this;

    self.init = function(){
        // self.createRoutes();
        self.app = express();

        //For socket.io.client to work
        //pointing to static public/index.html
        self.app.use(express.static(__dirname + '/public'));

        for(var r in self.routes){
            self.app.get(r, self.routes[r]);
        }

        self.http = appHttp.Server(self.app);
        
        //For socket.io.client to work
        self.io = server(appHttp);
    }

    self.startApp = function(){
        self.init();

        //For socket.io.client to work
        //Assigned the 
        self.appServer = self.http.listen(3000, function(){
            console.log('listening on : 3000');
        });

        self.startServerMessenger();
    }

    self.startServerMessenger = function(){
        var CONNECTION = 'connection';
        var SEND_MSG = 'send:message';


        //For socket.io.client to work
        //io.listen should be passed an http.Server instance, 
        //hence http.Server instance returned by self.http.listen
        self.socket = self.io.listen(self.appServer);

        self.socket.on(CONNECTION, function(socket){
            console.log('a user connected');

            socket.on('disconnect', function(){
                console.log('user disconnected');
            });

            socket.on(SEND_MSG, function(msg){
                console.log('message: ' + msg);

                //broadcast to everyone
                self.socket.emit(SEND_MSG, msg);
            });
        });
    }

    /*
    * Create routing table entries and handlers for the application.
    **/
    // self.createRoutes = function(){
    //     self.routes = {};

    //     self.routes['/api/getMsg'] = function(req, res){
    //         // res.send('<h1>Hello World');
    //         res.sendFile(path.join(__dirname,'public', 'index.html'));
    //     }
    // }
   
};

var s = new MessengerApi();
s.startApp();