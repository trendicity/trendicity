'use strict';
angular.module('Trendicity')

.controller('ListViewCtrl', function ($scope) {
  console.log('Inside ListViewCtrl...');

  // Refresh feed posts
  $scope.doRefresh = function() {
    $scope.getPosts($scope.search.value);

    // Hide ion-refresher
    $scope.$broadcast('scroll.refreshComplete');
  };

  // Like a post
  $scope.like = function(post) {
    console.log(post);
  };
});
