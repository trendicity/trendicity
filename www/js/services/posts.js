'use strict';
angular.module('Trendicity')

.service('PostsService', function($state, InstagramService, GeolocationService, MapService) {
    var model = { currentPosts: [] };

    this.getModel = function () {
      return model;
    };

    this.setCurrentPosts = function (posts) {
      model.currentPosts = posts;
    };

    this.clearCurrentPosts = function () {
      model.currentPosts.length = 0;
    };

    this.findPopularPosts = function() {
      InstagramService.findPopularPosts().success(function (response) {
        model.currentPosts = response.data;
        if ($state.current.name == 'app.home.map') {
          MapService.addMarkersFromPosts(model.currentPosts);
        }
      });
    };

    this.findNearbyPosts = function() {
      InstagramService.findNearbyPosts(GeolocationService.getCurrentPosition())
        .then(function (response) {
          model.currentPosts = response.data.data;
          if ($state.current.name == 'app.home.map') {
            MapService.addMarkersFromPosts(model.currentPosts);
          }
        });
    };

    this.findUserFeedPosts = function() {
      InstagramService.findUserFeedPosts().success(function (response) {
        model.currentPosts = response.data;
        if ($state.current.name == 'app.home.map') {
          MapService.addMarkersFromPosts(model.currentPosts);
        }
      });
    };

    this.findLikedPosts = function() {
      InstagramService.findLikedPosts().success(function (response) {
        model.currentPosts = response.data;
        if ($state.current.name == 'app.home.map') {
          MapService.addMarkersFromPosts(model.currentPosts);
        }
      });
    };

    this.getFavoritePosts = function () {
      var defer = $q.defer();

      var favorite = FavoritesService.getCurrentFavorite();

      // TODO: Find out why were are doing this....
      defer.resolve({
        coords: {
          latitude: favorite.lat,
          longitude: favorite.lng
        }
      });

      // TODO: refactor find function to pass in location
      InstagramService.findNearbyPosts(
        defer.promise
      )
        .then(function (response) {
          model.currentPosts = response.data.data;
          if ($state.current.name == 'app.home.map') {
            MapService.addMarkersFromPosts(model.currentPosts);
          }
        });
    };
});
