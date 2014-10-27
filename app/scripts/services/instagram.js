'use strict';
angular.module('Trendicity')

.service('InstagramService', function($http) {
   var CLIENT_ID = "75d27c9457cd4d1abbacf80a228f4a10";
   var API_ROOT = "https://api.instagram.com/v1/";

   this.obtainAccessToken = function() {
       // TOOD: See if we already have one and return that one first
       // TODO: May need to return a promise
       var ref = window.open('https://instagram.com/oauth/authorize?client_id=' + CLIENT_ID
                           + '&response_type=token&redirect_uri=http://localhost', '_blank', 'location=no');
       console.log("Window opened....");
       console.log("ref:", ref);
       if (ref) { // maybe we are being launched by a desktop browser
           ref.addEventListener('loadstart', function(event) {
               //alert(event.url);
               console.log("event.url:" + event.url);
               if((event.url).indexOf("http://localhost") == 0) {
                   console.log("inside if.....");
                   var accessToken = (event.url).split("access_token=")[1];
                   console.log("accessToken:" + accessToken);
                   localStorage['TrendiCity:accessToken'] = accessToken;
                   ref.close();
               }
           });
       }
   }

   this.findPopularPosts = function() {
       var promise =
           $http.get(API_ROOT + "media/popular", {
                params: { client_id: CLIENT_ID }}).
             success(function(data, status, headers, config) {
                //console.log(angular.toJson(data, true));
             }).
             error(function(data, status, headers, config) {
                 console.log("findPopularPosts returned status:"  + status);
             });
       return promise;
   };

   // options.distance by default is 1 Kilometer
   this.findNearbyPosts = function(lat, lng, options) {
        if (!options) options = {};

        options.client_id = CLIENT_ID;
        options.lat = lat;
        options.lng = lng;

        var promise =
            $http.get(API_ROOT + "media/search", {
                    params: options
                }).
                success(function(data, status, headers, config) {
                    //console.log(angular.toJson(data, true));
                }).
                error(function(data, status, headers, config) {
                    console.log("findNearbyPosts returned status:"  + status);
                });
        return promise;
   };

   this.findUserFeedPosts = function(options) {
       if (!options) options = {};

       var accessToken = localStorage['TrendiCity:accessToken'];

       if (accessToken) options.access_token = accessToken;

       console.log("options.access_token:" + options.access_token);

       var promise =
           $http.get(API_ROOT + "users/self/feed", {
               params: options
           })
           .success(function (data, status, headers, config) {
               //console.log(angular.toJson(data, true));
           })
           .error(function (data, status, headers, config) {
               console.log("userFeedPosts returned status:" + status);
           });
       return promise;
   };

});
