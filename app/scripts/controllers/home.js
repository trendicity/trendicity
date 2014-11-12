'use strict';
angular.module('Trendicity')

.controller('HomeCtrl', function ($rootScope, $scope, $ionicPopover, $ionicScrollDelegate, InstagramService) {
    console.log('Inside HomeCtrl...');

    $scope.posts = [];
    $scope.search = { value: 'TR'};

    var watcher = navigator.geolocation.getCurrentPosition(
      function (location) {
        $scope.location = location;
      });

    $scope.getPosts = function(value) {
      if (value === 'TR') {
        InstagramService.findPopularPosts().success(function (data) {
          $scope.posts = data.data;
        });
      } else if (value === 'NB') {
        InstagramService.findNearbyPosts($scope.location.coords.latitude,
          $scope.location.coords.longitude).success(function (data) {
            $scope.posts = data.data;
          });
      } else if (value === 'UF') {
        if (InstagramService.isLoggedIn()) {
          $scope.findUserFeedPosts();
        } else {
          $rootScope.afterLoginSuccessful = $scope.findUserFeedPosts;
          $scope.closePopover();
          $scope.modal.show();
        }
      } else if (value === 'LP') {
        if (InstagramService.isLoggedIn()) {
          $scope.findLikedPosts();
        } else {
          $rootScope.afterLoginSuccessful = $scope.findLikedPosts;
          $scope.closePopover();
          $scope.modal.show();
        }
      }
    };

    $scope.$watch('search.value', function(newValue) {
      $scope.getPosts(newValue);
      $scope.closePopover();
      $ionicScrollDelegate.scrollTop();
    });

    $scope.findUserFeedPosts = function() {
      InstagramService.findUserFeedPosts().success(function (data) {
        $scope.posts = data.data;
      });
    };

    $scope.findLikedPosts = function() {
      InstagramService.findLikedPosts().success(function (data) {
        $scope.posts = data.data;
      });
    };

    $ionicPopover.fromTemplateUrl('templates/search.html', {
      scope: $scope,
    }).then(function(popover) {
      $scope.popover = popover;
    });

    $scope.openPopover = function($event) {
      $scope.popover.show($event);
    };

    $scope.closePopover = function() {
      if ($scope.popover && $scope.popover.isShown()) {
        $scope.popover.hide();
      }
    };

    // Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
      if ($scope.popover) {
        $scope.popover.remove();
      }
    });
  }
);






