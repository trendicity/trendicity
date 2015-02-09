'use strict';
angular.module('Trendicity')

.controller('MapViewCtrl', function (
  $scope,
  $log,
  $ionicHistory,
  $ionicPopup,
  $ionicSideMenuDelegate,
  $ionicLoading,
  $stateParams,
  $timeout,
  uiGmapIsReady,
  uiGmapGoogleMapApi,
  GeolocationService,
  PostsService
) {
  // Main map object for this view
  $scope.map = {
    zoom: 15,
    center: GeolocationService.getDefaultPosition(),
    control: {},
    markers: []
  };

  // Dont drag the menu open when we're panning the map
  $scope.$on('$ionicView.enter', function() {
    $ionicHistory.clearHistory();
    $ionicSideMenuDelegate.canDragContent(false);

    uiGmapGoogleMapApi.then(function(maps) {
      if ($stateParams.latitude && $stateParams.longitude) {
        $scope.map.center = $stateParams;
        uiGmapGoogleMapApi.then(function(maps) {
          $scope.refresh($stateParams);
        });
      } else {
        $timeout(function(){
          $scope.locate();
        });
      }
    });
  });

  // Enable menu dragging
  $scope.$on('$ionicView.leave', function() {
    $ionicSideMenuDelegate.canDragContent(true);
  });

  // Show the current post in a popup
  $scope.showPost = function(post) {
    $scope.currentPost = post;
    var postPopup = $ionicPopup.show({
      templateUrl: 'templates/post-popup.html',
      scope: $scope,
      buttons: [{
        text: 'Like',
        type: 'button-default',
        onTap: function(e) {
          e.preventDefault();
          // TODO: Like this post
        }
      }, {
        text: 'Cancel',
        type: 'button-default',
        onTap: function(e) {
          $scope.currentPost = null;
          return true;
        }
      }]
    });
  };

  // Helper function for refreshing new posts from map pin
  $scope.refresh = function(position) {
    var pinPos = position || {
      latitude: $scope.map.control.getGMap().center.k,
      longitude: $scope.map.control.getGMap().center.C
    };
    PostsService.findNearbyPosts(pinPos).then(function (posts) {
      var markers = [];
      _.each(posts, function (post) {
        var image = {
          url: post.images.thumbnail.url,
          scaledSize: new google.maps.Size(20,20),
          origin: new google.maps.Point(0,0)
        };
        var marker = {
          coords: post.location,
          id: post.id,
          title: post.link,
          icon: image,
          data: post
        };
        marker.showPost = function() {
          $scope.showPost(post);
        };
        markers.push(marker);
      });
      $scope.map.markers = markers;
    });
  };

  // Helper function for locating the user before refreshing
  $scope.locate = function () {
    $ionicLoading.show();
    GeolocationService.getCurrentPosition().then(function (position) {
      $scope.map.center = position.coords;
      $scope.map.control.refresh(position.coords);
      $scope.refresh();
      $ionicLoading.hide();
    });
  };
});
