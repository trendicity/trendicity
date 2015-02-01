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
.controller('HomeCtrl', function (POST_TYPE, $rootScope, $scope, $ionicPopover, $ionicScrollDelegate, InstagramService, GeolocationService, MapService, $state, FavoritesService, $q) {
    var homeCtrl = this;

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

    this.updatePosts = function (searchValue) {
      $scope.getPosts(searchValue);
      $scope.closePopover();
      $ionicScrollDelegate.scrollTop();
    };

    this.setPosts = function (posts) {
        MapService.addMarkersFromPosts(posts);
        $scope.data.posts = posts;
    };

    this.clearPosts = function () {
        MapService.clearMarkers();
        $scope.data.posts = [];
    };

    $scope.$watch('search.value', function(newValue) {
        homeCtrl.updatePosts(newValue);
    });

    $scope.findPopularPosts = function() {
      InstagramService.findPopularPosts().success(function (response) {
          homeCtrl.setPosts(response.data);
      });
    };

    $scope.findNearbyPosts = function() {
      InstagramService.findNearbyPosts(
          GeolocationService.getCurrentPosition()
      )
        .then(function (response) {
          homeCtrl.setPosts(response.data.data);
        });
    };

    $scope.findUserFeedPosts = function() {
      InstagramService.findUserFeedPosts().success(function (response) {
          homeCtrl.setPosts(response.data.data);
      });
    };

    $scope.findLikedPosts = function() {
      InstagramService.findLikedPosts().success(function (response) {
          homeCtrl.setPosts(response.data.data);
      });
    };

    $scope.getFavoritePosts = function () {
        var defer = $q.defer();

        $scope.favorite = FavoritesService.getFavorite( parseInt($state.params.id, 10) );

        defer.resolve({
            coords: {
                latitude: $scope.favorite.lat,
                longitude: $scope.favorite.lng
            }
        });

        InstagramService.findNearbyPosts(
            defer.promise
        )
        .then(function (response) {
            homeCtrl.setPosts(response.data.data);
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

    //*** Register some event handlers
    $scope.$on('event:auth-logoutComplete', function() {
      console.log('handling event:auth-logoutComplete...');
      if ($scope.search.value == POST_TYPE.USER_FEED || $scope.search.value == POST_TYPE.LIKED_POST) {
          homeCtrl.clearPosts();
      }
    });

    $scope.$on('$ionicView.enter', function() {
        $scope.getPosts();
    });
  }
);
