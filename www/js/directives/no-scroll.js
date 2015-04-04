'use strict';
angular.module('Trendicity')

.directive('noScroll', function() {
  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      // Disable touchmove to fix an Android issue
      $element.find('*').on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  }
})