'use strict';
angular.module('Trendicity')

.controller('MapViewCtrl', function ($scope, InstagramService) {
  console.log('Inside MapViewCtrl...');
  $scope.$root.canDragContent = true;

  $scope.nearbyPosts = [];

  InstagramService.findNearbyPosts(48.858844, 2.294351).success(function(data) {
    $scope.nearbyPosts = data.data;
  });
});
