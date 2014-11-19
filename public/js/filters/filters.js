(function(ng){
    "use strict";

    var app = ng.module('custom-filters', []);

    /*
    * Customize filter to display the current user at the top of the user list.
    */
    app.filter('moveCurrentUserToTop', [function(){
      return function(friends, name){
        var newList = [];

        ng.forEach(friends, function(u){
          if(u === name){
            newList.unshift(u);
          }else{
            newList.push(u);
          }
        });

        return newList;
      }
    }]);
})(angular);