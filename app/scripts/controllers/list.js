'use strict';
angular.module('Trendicity')

.controller('ListViewCtrl', function ($scope) {
  console.log('Inside ListViewCtrl...');

  // Like a post
  $scope.like = function(post) {
    console.log(post);
  };
});
