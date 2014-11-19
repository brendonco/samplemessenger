var friends = {};
friends.names = {};

friends.claim = function(name){
    if(!name || friends.names[name]){
        return false;
    }else{
        friends.names[name] = true;
        return true;
    }
}

/*
* Use LRU pattern to find unused guest name and claim it.
**/
friends.getGuestName = function(){
    var name; var nextUserId = 1;

    do{
        name = 'Guest ' + nextUserId;
        nextUserId += 1;
    }while(!friends.claim(name));

    return name;
}

/**
* Serialize claimed names.
*/
friends.getFriends = function(){
    var names = [];
    var name;

    for(name in friends.names){
        names.push(name);
    }

    return names;
}

/**
* Delete friend.
*/
friends.removeFriend = function(name){
    if(friends.names[name]){
        delete friends.names[name];
    }
}

module.exports = friends;