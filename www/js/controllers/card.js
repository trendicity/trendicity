'use strict';
angular.module('Trendicity')

.controller('CardViewCtrl', function (
  $scope,
  $ionicSideMenuDelegate,
  $ionicPopup,
  $ionicSlideBoxDelegate,
  $ionicActionSheet,
  $timeout,
  $ionicHistory,
  localStorageService,
  PostsService,
  InstagramService) {

  // Disable side-menu drag so that it doesnt interfere with our tinder cards functionality
  $scope.$on('$ionicView.enter', function() {
    $ionicHistory.clearHistory();
    $ionicSideMenuDelegate.canDragContent(false);
  });

  $scope.$on('$ionicView.leave', function() {
    $ionicSideMenuDelegate.canDragContent(true);
  });

  if (!localStorageService.get('seenCardIntro')) {
    // Mark intro as seen
    localStorageService.set('seenCardIntro', true);

    var slidebox = $ionicSlideBoxDelegate.$getByHandle('card-intro-slidebox');

    // Disable intro slidebox sliding
    $scope.disableSlideBox = function() {
      $ionicSlideBoxDelegate.enableSlide(false);
    };

    // Show explanation message
    $ionicPopup.show({
      title: 'Swipe Cards',
      templateUrl: 'templates/popups/card-intro.html',
      scope: $scope,
      buttons: [
        {
          text: 'Next',
          type: 'button-positive',
          onTap: function(e) {
            if (slidebox.currentIndex() === 0) {
              // Go to next slide
              slidebox.next();

              // Change button text
              e.target.innerHTML = 'OK';

              e.preventDefault();
            } else {
              // Close popup
              return;
            }
          }
        }
      ]
    });
  }

  $scope.cardTransitionedLeft = function(index) {
    console.log('cardTransitionedLeft called with index:' + index);
    if (!InstagramService.isLoggedIn()) {
      console.log('not sure if you liked it before or not since you are not logged in; doing nothing!');
      return;
    }

    var post = $scope.model.currentPosts[index];
    if (post.user_has_liked) { // jshint ignore:line
      PostsService.dislikePost(post.id)
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
      console.log('not sure if you liked it before or not since you are not logged in; if you login, we will like it for you');
    }

    var post = $scope.model.currentPosts[index];
    if (!post.user_has_liked) { // jshint ignore:line
      PostsService.likePost(post.id)
        .success(function () {
          console.log('you liked it!');
        });
    } else {
      console.log('you already liked it previously!');
    }
  };

  $scope.cardDestroyed = function(index) {
    console.log('cardDestroyed called with index:' + index);
    $scope.model.currentPosts.splice(index, 1);
  };

    // Display action sheet
    $scope.displayOptions = function(index) {
      // Get post
      var post = $scope.model.currentPosts[index];
      var buttons = [
        { text: 'Like' }
      ];

      $ionicActionSheet.show({
        buttons: [],
        titleText: 'Options',
        destructiveText: 'Report as offensive',
        cancelText: 'Close',
        destructiveButtonClicked: function () {
          PostsService.reportPost(post).then(function() {
            $ionicPopup.alert({
              title: 'Report Offensive Content',
              template: 'Thanks for reporting this post as offensive.  Our moderators will review this post. If found to be offensive, it will be removed.'
            });
          });
          return true;
        }
      });
    };

});