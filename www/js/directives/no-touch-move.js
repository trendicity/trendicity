'use strict';
angular.module('Trendicity')

.directive('noTouchMove', function() {
  return {
    restrict: 'A',
    link: function($scope, $element) {
      $element.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  };
});