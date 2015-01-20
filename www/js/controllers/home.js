'use strict';
angular.module('Trendicity')

.controller('HomeCtrl', function ($rootScope, $scope, $ionicPopover, $ionicScrollDelegate, InstagramService, GeolocationService, $state, FavoritesService) {
    console.log('Inside HomeCtrl...');

    // Disable side-menu drag so that it doesnt interfere with our tinder cards functionality
    $scope.$on('$ionicView.beforeEnter', function() {
      $timeout(function() {
        $ionicSideMenuDelegate.canDragContent(false);
      });
    });

    $scope.favorite;
    $scope.data = { posts: [] };
    $scope.search = { value: 'TR'};
    $scope.locationSet = false;

    GeolocationService.getCurrentPosition()
      .then(
        function (location) {
          $scope.location = location;
          $scope.locationSet = true;
        },
        function (fallbackLocation) {
          $scope.location = fallbackLocation;
          $scope.locationSet = true;
        }
      );

    $scope.getPosts = function(value) {
      if ($state.params.id) {
        $scope.getFavoritePosts();
      } else {
        // Remove stored favorite
        $scope.favorite = null;

        if (value === 'TR') {
          $scope.findPopularPosts();
        } else if (value === 'NB') {
          $scope.findNearbyPosts();
        } else if (value === 'UF') {
          $scope.findUserFeedPosts();
        } else if (value === 'LP') {
          $scope.findLikedPosts();
        }
      }
    };

    function updatePosts(searchValue) {
      $scope.getPosts(searchValue);
      $scope.closePopover();
      $ionicScrollDelegate.scrollTop();
    }

    $scope.$watch('search.value', function(newValue) {
      updatePosts(newValue);
    });

    $scope.findPopularPosts = function() {
      InstagramService.findPopularPosts().success(function (data) {
        $scope.data.posts = data.data;
      });
    };

    $scope.findNearbyPosts = function() {
      InstagramService.findNearbyPosts($scope.location.coords.latitude,
        $scope.location.coords.longitude).success(function (data) {
          $scope.data.posts = data.data;
        });
    };

    $scope.findUserFeedPosts = function() {
      InstagramService.findUserFeedPosts().success(function (data) {
        $scope.data.posts = data.data;
      });
    };

    $scope.findLikedPosts = function() {
      InstagramService.findLikedPosts().success(function (data) {
        $scope.data.posts = data.data;
      });
    };

    $scope.getFavoritePosts = function () {
        $scope.favorite = FavoritesService.getFavorite( parseInt($state.params.id, 10) );

        InstagramService.findNearbyPosts( $scope.favorite.lat, $scope.favorite.lng )
        .success( function ( data ) {
            $scope.data.posts = data.data;
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
        $scope.data.posts = [];
      }
    });

    $scope.$on('$ionicView.enter', function() {
      updatePosts($scope.search.value);
    });
  }
);
