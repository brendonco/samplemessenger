(function(ng){
  "use strict";

  var app = ng.module('dialog', []);

  app.directive('popupWindow', [function(){
    return {
        restrict: 'E',
        replace: true,
        link: function(scope, element, attr){
          scope.hideModal = function(){
            element.modal('hide');
          };

          scope.showModal = function(state){
            scope.state = state;

            element.modal('show');
          };
        },
        templateUrl: '../html/dialog/dialog.html'
    };
  }]);
})(angular);