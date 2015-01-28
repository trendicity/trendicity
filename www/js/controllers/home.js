'use strict';
angular.module('Trendicity')

// Creating a constant for post type values.
// This adds readability to our code later.
.constant('POST_TYPE', {
    'TRENDING': 'TR',
    'NEARBY': 'NB',
    'USER_FEED': 'UF',
    'LIKED': 'LP'
})
.controller('HomeCtrl', function (POST_TYPE, $rootScope, $scope, $ionicPopover, $ionicScrollDelegate, InstagramService, GeolocationService, MapService, $state, FavoritesService) {
    $scope.favorite;
    $scope.data = { posts: [] };
    $scope.search = { value: POST_TYPE.NEARBY};

    $scope.getPosts = function(value) {
      if ($state.params.id) {
        $scope.getFavoritePosts();
      } else {
        // Remove stored favorite
        $scope.favorite = null;

        if (value === POST_TYPE.TRENDING) {
          $scope.findPopularPosts();
        } else if (value === POST_TYPE.NEARBY) {
          $scope.findNearbyPosts();
        } else if (value === POST_TYPE.USER_FEED) {
          $scope.findUserFeedPosts();
        } else if (value === POST_TYPE.LIKED) {
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
      InstagramService.findPopularPosts().success(function (response) {
          MapService.addMarkersFromPosts(response.data);
      });
    };

    $scope.findNearbyPosts = function() {
      InstagramService.findNearbyPosts(
          GeolocationService.getCurrentPosition()
      )
        .then(function (response) {
          MapService.addMarkersFromPosts(response.data.data);
        });
    };

    $scope.findUserFeedPosts = function() {
      InstagramService.findUserFeedPosts().success(function (response) {
          MapService.addMarkersFromPosts(response.data);
      });
    };

    $scope.findLikedPosts = function() {
      InstagramService.findLikedPosts().success(function (response) {
          MapService.addMarkersFromPosts(response.data);
      });
    };

    $scope.getFavoritePosts = function () {
        $scope.favorite = FavoritesService.getFavorite( parseInt($state.params.id, 10) );

        InstagramService.findNearbyPosts( $scope.favorite.lat, $scope.favorite.lng )
        .success( function ( response ) {
            MapService.addMarkersFromPosts(response.data);
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
  }
);
