'use strict';
angular.module('Trendicity')

.controller('HomeCtrl', function ($rootScope, $scope, $ionicPopover, $ionicScrollDelegate, InstagramService, GeolocationService) {
    console.log('Inside HomeCtrl...');

    $scope.posts = [];
    $scope.search = { value: 'TR'};

    GeolocationService.getCurrentPosition()
      .then(
        function (location) {
          $scope.location = location;
        },
        function (fallbackLocation) {
          $scope.location = fallbackLocation;
        }
      );

    GeolocationService.addressToPosition('Willemstad, curacao');

    $scope.getPosts = function(value) {
      if (value === 'TR') {
        $scope.findPopularPosts();
      } else if (value === 'NB') {
        $scope.findNearbyPosts();
      } else if (value === 'UF') {
        $scope.findUserFeedPosts();
      } else if (value === 'LP') {
        $scope.findLikedPosts();
      }
    };

    $scope.$watch('search.value', function(newValue) {
      $scope.getPosts(newValue);
      $scope.closePopover();
      $ionicScrollDelegate.scrollTop();
    });

    $scope.findPopularPosts = function() {
      InstagramService.findPopularPosts().success(function (data) {
        $scope.posts = data.data;
      });
    };

    $scope.findNearbyPosts = function() {
      InstagramService.findNearbyPosts($scope.location.coords.latitude,
        $scope.location.coords.longitude).success(function (data) {
          $scope.posts = data.data;
        });
    };

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

    $scope.$on('event:auth-logoutComplete', function() {
      console.log('handling event:auth-logoutComplete...');
      if ($scope.search.value == 'UF' || $scope.search.value == 'LP') {
        $scope.posts = [];
      }
    });
  }
);






