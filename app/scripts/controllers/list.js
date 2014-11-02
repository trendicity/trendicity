'use strict';
angular.module('Trendicity')

.controller('ListViewCtrl', function ($scope) {
  console.log('Inside ListViewCtrl...');
  $scope.$root.canDragContent = true;

});
