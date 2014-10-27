'use strict';
angular.module('Trendicity')

.controller('ListViewCtrl', function ($scope, InstagramService) {
  console.log("Inside ListsCtrl...");
  $scope.$root.canDragContent = true;

  InstagramService.findPopularPosts().success(function(data) {
      $scope.popularPosts = data.data;
  });
})
