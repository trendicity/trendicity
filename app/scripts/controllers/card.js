'use strict';
angular.module('Trendicity')

.controller('CardViewCtrl', function ($scope, InstagramService) {
  console.log('Inside CardViewCtrl...');
  $scope.$root.canDragContent = false;

  $scope.userFeedPosts = [];

  InstagramService.findUserFeedPosts() // change this back to findUserFeedPosts !!!!
    .success(function(data) {
      $scope.userFeedPosts = data.data;
    })
    .finally(function() {
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    });

})

.controller('CardCtrl', function ($scope, InstagramService) {
  console.log('inside CardCtrl....');

  $scope.cardSwipedLeft = function(index) {
    console.log('LEFT SWIPE index:' + index);
    // TODO: Issue a "non-like" on the post
  };

  $scope.cardSwipedRight = function(index) {
    console.log('RIGHT SWIPE index:' + index);
    // TODO: Issue a "like" on the post
    var post = $scope.userFeedPosts[index];
    console.log('post.id:' + post.id);
    //console.log(angular.toJson(post,true));

    InstagramService.likePost(post.id)
    .success(function(data) {
      console.log("you liked it!  data:" + angular.toJson(data,true));
    })
  };

  $scope.cardDestroyed = function(index) {
    $scope.userFeedPosts.splice(index, 1);
  };
});
