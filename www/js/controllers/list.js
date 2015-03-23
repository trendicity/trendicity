'use strict';
angular.module('Trendicity')

.controller('ListViewCtrl', function (
  $scope,
  $ionicActionSheet,
  $ionicLoading,
  InstagramService,
  PostsService,
  FavoritesService
) {
  console.log('Inside ListViewCtrl...');

  // Display action sheet
  $scope.displayOptions = function(index) {
    // Get post
    var post = $scope.model.currentPosts[index];

    var buttons = [{ text: 'Like' }];

    // Add button if location available
    if (post.location !== null &&
      post.location.longitude !== null &&
      post.location.latitude !== null) {
      buttons.push({ text: 'Favorite Post\'s Location' });
    }

    $ionicActionSheet.show({
        buttons: buttons,
        titleText: 'Options',
        cancelText: 'Close',
        buttonClicked: function(i) {
            if (i === 0) {
              // Like post
              $scope.like(index);
            } else if (i === 1) {
              // Add post's location to favorites
              FavoritesService.add({
                city: (post.location.name || post.user.username + '\'s post'),
                lng: post.location.longitude,
                lat: post.location.latitude
              });

              // Display confirmation
              $ionicLoading.show({
                  template: 'Added to Favorites',
                  noBackdrop: true,
                  duration: 1000
              });
            }

            // Close action sheet
            return true;
        }
    });
  };

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
      $scope.loginModal.show();
      return;
    }

    var post = $scope.model.currentPosts[index];
    if (!post.user_has_liked) { // jshint ignore:line
      PostsService.likePost(post.id)
        .success(function () {
          console.log('you liked it!');

          // Update post to reflect like
          $scope.model.currentPosts[index].user_has_liked = true; // jshint ignore:line
          $scope.model.currentPosts[index].likes.count = post.likes.count + 1;
        });
    } else {
      console.log('you already liked it previously!');
    }
  };
});
