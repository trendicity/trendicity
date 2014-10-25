'use strict';
angular.module('Trendicity')

.service('InstagramService', function($http) {

   var client_id = "75d27c9457cd4d1abbacf80a228f4a10";

   this.findPopularPosts = function() {
       var promise =
           $http.get("https://api.instagram.com/v1/media/popular", {
                params: { client_id: client_id }}).
             success(function(data, status, headers, config) {
                console.log(angular.toJson(data, true));
             }).
             error(function(data, status, headers, config) {
                 console.log("findPopularPosts returned status:"  + status);
             });
       return promise;
   };

   // options.distance by default is 1 Kilometer
   this.findNearbyPosts = function(lat, lng, options) {
        if (!options) options = {};

        options.client_id = client_id;
        options.lat = lat;
        options.lng = lng;

        var promise =
            $http.get("https://api.instagram.com/v1/media/search", {
                    params: options
                }).
                success(function(data, status, headers, config) {
                    console.log(angular.toJson(data, true));
                }).
                error(function(data, status, headers, config) {
                    console.log("findNearbyPosts returned status:"  + status);
                });
        return promise;
   };

});
