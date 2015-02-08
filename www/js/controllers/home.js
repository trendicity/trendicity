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
.controller('HomeCtrl', function (
  POST_TYPE,
  $rootScope,
  $scope,
  $ionicPopover,
  $ionicLoading,
  $ionicScrollDelegate,
  InstagramService,
  PostsService,
  GeolocationService,
  $state,
  FavoritesService,
  $q
) {
  var homeCtrl = this;

  // Since the current location is needed for all views, populate it now

/*    $scope.model =  PostsService.getModel();
    $scope.search = { value: POST_TYPE.NEARBY};

    $scope.getPosts = function(value, clearCurrentFavorite) {
      if (value === POST_TYPE.TRENDING) {
        PostsService.findPopularPosts();
      } else if (value === POST_TYPE.NEARBY) {
        GeolocationService.getCurrentPosition().then(function (position) {
          PostsService.findNearbyPosts(position.coords);
        });
      } else if (value === POST_TYPE.USER_FEED) {
        PostsService.findUserFeedPosts();
      } else if (value === POST_TYPE.LIKED) {
        PostsService.findLikedPosts();
      }
    };

    this.updatePosts = function (searchValue, isUserAction) {
      $scope.getPosts(searchValue, isUserAction);
      $scope.closePopover();
      $ionicScrollDelegate.scrollTop();
    };

    $scope.$watch('search.value', function(newValue) {
        // Triggered when user changes search value
        homeCtrl.updatePosts(newValue, true);
    });

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
    });*/
  }
);
