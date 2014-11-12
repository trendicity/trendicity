'use strict';
angular.module('Trendicity')

.controller('ListViewCtrl', function ($scope, InstagramService) {
  console.log('Inside ListViewCtrl...');

  // Refresh feed posts
  $scope.doRefresh = function() {
    $scope.getPosts($scope.search.value);

    // Hide ion-refresher
    $scope.$broadcast('scroll.refreshComplete');
  };

  // Like a post
  $scope.like = function(index) {
    if (!InstagramService.isLoggedIn()) {
      // Show login modal
      $scope.modal.show();
      return;
    }

    var post = $scope.posts[index];
    if (!post.user_has_liked) { // jshint ignore:line
      InstagramService.likePost(post.id)
        .success(function () {
          console.log('you liked it!');

          // Update post to reflect like
          $scope.posts[index]['user_has_liked'] = true;
          $scope.posts[index]['likes']['count'] = post.likes.count + 1;
        });
    } else {
      console.log('you already liked it previously!');
    }
  };
});
