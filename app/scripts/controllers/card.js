'use strict';
angular.module('Trendicity')

.controller('CardViewCtrl', function ($scope, $ionicSideMenuDelegate) {
  // Disable side-menu drag so that it doesnt interfere with our swipe cards functionality
  $ionicSideMenuDelegate.canDragContent(false);
})

.controller('CardCtrl', function ($scope, InstagramService, TDCardDelegate) {
  $scope.cardTransitionedLeft = function(index) {
    console.log('cardTransitionedLeft called with index:' + index);
    if (!InstagramService.isLoggedIn()) {
      console.log('not sure if you liked it before or not since you are not logged in');
      return;
    }

    var post = $scope.data.posts[index];
    if (post.user_has_liked) { // jshint ignore:line
      InstagramService.dislikePost(post.id)
        .success(function() {
          console.log('you disliked it!');
        });
    } else {
      console.log('you didnt like it in the first place!');
    }
  };

  $scope.cardTransitionedRight = function(index) {
    console.log('cardTransitionedRight called with index:' + index);
    if (!InstagramService.isLoggedIn()) {
      console.log('not sure if you liked it before or not since you are not logged in');
      return;
    }

    var post = $scope.data.posts[index];
    if (!post.user_has_liked) { // jshint ignore:line
      InstagramService.likePost(post.id)
        .success(function () {
          console.log('you liked it!');
        });
    } else {
      console.log('you already liked it previously!');
    }
  };

  $scope.cardDestroyed = function(index) {
    console.log('cardDestroyed called with index:' + index);
    if (!InstagramService.isLoggedIn()) {
      console.log('snapping card back since you are not logged in...');
      var card = TDCardDelegate.getSwipeableCard($scope);
      card.snapBack();
      $scope.loginModal.show();
    } else {
      $scope.data.posts.splice(index, 1);
    }
  };
});
