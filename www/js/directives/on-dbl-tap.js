'use strict';
angular.module('Trendicity')

.directive('onDblTap', function($ionicGesture, $parse) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      var fn = $parse($attr.onDblTap);

      var listener = function(ev) {
        $scope.$apply(function() {
          fn($scope, {
            $event: ev
          });
        });
      };

      var gesture = $ionicGesture.on('doubletap', listener, $element);

      // Remove gesture recognition on DOM element
      $scope.$on('$destroy', function() {
        $ionicGesture.off(gesture, 'doubletap', listener);
      });
    }
  };
});
