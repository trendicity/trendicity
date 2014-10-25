'use strict';
angular.module('Trendicity')

.controller('HomeCtrl', function ($scope, InstagramService) {
  InstagramService.findPopularPosts().success(function(data) {
      $scope.popularPosts = data.data;
  });

  InstagramService.findNearbyPosts(48.858844, 2.294351).success(function(data) {
      $scope.nearbyPosts = data.data;
  });

});
