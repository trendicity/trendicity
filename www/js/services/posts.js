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

    this.findNearbyPosts = function(position) {
      var deferred = $q.defer();
      var options = {
        lat: position.latitude,
        lng: position.longitude
      };
      InstagramService.findNearbyPosts(options).success(function (response) {
        model.currentPosts = response.data;
        deferred.resolve(response.data);
      });

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
});
