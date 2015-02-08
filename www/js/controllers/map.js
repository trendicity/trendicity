'use strict';
angular.module('Trendicity')

.controller('MapViewCtrl', function (
  $scope,
  $log,
  $ionicHistory,
  $ionicSideMenuDelegate,
  $ionicLoading,
  $stateParams,
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

    if ($stateParams.latitude && $stateParams.longitude) {
      $scope.map.center = $stateParams;
      uiGmapGoogleMapApi.then(function(maps) {
        $scope.refresh($stateParams);
      });
    } else {
      $scope.locate();
    }
  });

  // Enable menu dragging
  $scope.$on('$ionicView.leave', function() {
    $ionicSideMenuDelegate.canDragContent(true);
  });

  // Helper function for refreshing new posts from map pin
  $scope.refresh = function(position) {
    var pinPos = position || {
      latitude: $scope.map.control.getGMap().center.k,
      longitude: $scope.map.control.getGMap().center.C
    };
    PostsService.findNearbyPosts(pinPos).then(function (posts) {
      var markers = [];
      _.each(posts, function (post) {
        var marker = {
          coords: post.location,
          id: post.id,
          title: post.link,
          data: post
        };
        marker.showPost = function() {
          marker.show = !marker.show;
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
