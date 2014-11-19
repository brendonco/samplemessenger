(function(ng){

var SEND_MSG = 'send:message';
var INIT = 'init';
var CHANGE_NAME = 'change:name';
var USER_JOIN = 'user:join';
var USER_LEFT = 'user:left';
var CHAT_ROOM = 'chatroom';
var ERR_CHANGING_NAME = 'There was an error changing your name';

var app = ng.module('app', ['services', 'custom-filters', 'dialog']);

app.controller('FormController', ['$scope', 'socket', function($scope, socket){
  $scope.message = "";
  $scope.messages = [];
  $scope.friends = [];
  $scope.friend = {name: ""};

  //Initialize Socket listeners
  socket.on(INIT, function(data){
    $scope.name = data.name;
    $scope.friends = data.friends;
  });

  socket.on(SEND_MSG, function(msg){
    $scope.messages.push(msg);
  });

  socket.on(CHANGE_NAME, function(data){
    changeName(data.prevName, data.currentName);
  });

  socket.on(USER_JOIN, function(data){
    $scope.messages.push({
      user: CHAT_ROOM,
      text: 'User ' + data.name + ' has joined.'
    });

    $scope.friends.push(data.name);
  });

  //Add a message to the conversation when a user is disconnected or leaves the chat room.
  socket.on(USER_LEFT, function(data){
    $scope.messages.push({
      user: CHAT_ROOM,
      text: 'User ' + data.name + ' has left.'
    });

    var i=0; var friend='';

    for(i; i < $scope.friends.length; i++){
      friend = $scope.friends[i];

      if(friend === data.name){
        $scope.friends.splice(i, 1);
        break;
      }
    }
  });

  var changeName = function(prevName, currentName){
    var i=0;

    for(i; i < $scope.friends.length; i++){
      if($scope.friends[i] === prevName){
        $scope.friends[i] = currentName;
        break;
      }
    }

    $scope.messages.push({
      user: CHAT_ROOM,
      text: 'User ' + prevName + ' is now known as ' + currentName + '.'
    });

    //Close dialog box
    $scope.hideModal();
  }

  $scope.changeName = function(){
    socket.emit(CHANGE_NAME, {
      name: $scope.friend.name
    }, function(result){
      if(!result){
        alert(ERR_CHANGING_NAME);
      }else{
        changeName($scope.name, $scope.friend.name);

        $scope.name = $scope.friend.name;
        $scope.friend.name = '';
      }
    });
  }

  $scope.submit = function(){
    socket.emit(SEND_MSG, {msg: $scope.message});

    $scope.messages.push({
        user: $scope.name,
        text: $scope.message
    });

    $scope.message = "";
  }
}]);

})(angular);
