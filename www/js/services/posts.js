'use strict';
angular.module('Trendicity')

.service('PostsService', function($q, InstagramService) {
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
      });
    };

    this.findNearbyPosts = function(coords) {
      var deferred = $q.defer();
      var options = {
        lat: coords.latitude,
        lng: coords.longitude
      };

      if (options.lat && options.lng) {
        InstagramService.findNearbyPosts(options).success(function (response) {
          model.currentPosts = response.data;
          deferred.resolve(response.data);
        });
      } else {
        console.log('Unable to obtain both latitude and longitude.  position:' + angular.toJson(coords));
        deferred.reject();
      }

      return deferred.promise;
    };

    this.findUserFeedPosts = function() {
      InstagramService.findUserFeedPosts().success(function (response) {
        model.currentPosts = response.data;
      });
    };

    this.findLikedPosts = function() {
      InstagramService.findLikedPosts().success(function (response) {
        model.currentPosts = response.data;
      });
    };

    this.likePost = function(mediaId) {
      return InstagramService.likePost(mediaId);
    };

    this.dislikePost = function(mediaId) {
      return InstagramService.dislikePost(mediaId);
    };
});
