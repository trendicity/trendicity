'use strict';
angular.module('Trendicity')

.service('InstagramService', function($rootScope, $http, localStorageService) {
  var CLIENT_ID = '75d27c9457cd4d1abbacf80a228f4a10';
  var API_ROOT = 'https://api.instagram.com/v1/';
  var AUTH_REDIRECT_URL = 'http://localhost:8100/instagram.html';
  var self = this;

  this.obtainAccessToken = function() {
    var ref = window.open('https://instagram.com/oauth/authorize?client_id=' +
      CLIENT_ID + '&scope=likes+comments&response_type=token&redirect_uri=' +
      AUTH_REDIRECT_URL, '_blank', 'location=no');

    // If the app is being run outside a cordova webview envrionment, just return since we will use the
    // redirect to instagram.html to get the access token.  On the desktop, the event:loginSuccessful will not be raised.
    if (!ionic.Platform.isWebView()) {
      return;
    }

    if (ref) { // maybe we are being launched by a desktop browser
      ref.addEventListener('loadstart', function(event) {
        if((event.url).indexOf('http://localhost') === 0) {
          var accessToken = (event.url).split('access_token=')[1];
          localStorageService.set('accessToken', accessToken);
          ref.close();
          if (self.isLoggedIn()) {
            $rootScope.$broadcast('event:loginSuccessful');
          }
        }
      });
    }
  };

  this.findPopularPosts = function(options) {
    options = options || {};

    options.client_id = CLIENT_ID; // jshint ignore:line
    options.callback = 'JSON_CALLBACK';
    options.access_token = localStorageService.get('accessToken'); // jshint ignore:line

    var promise =
      $http.jsonp(API_ROOT + 'media/popular', {
        params: options
      })
      .error(function(data, status) {
        console.log('findPopularPosts returned status:'  + status);
      });
    return promise;
  };

  // options.distance by default is 1 Kilometer
  this.findNearbyPosts = function(lat, lng, options) {
    options = options || {};

    options.client_id = CLIENT_ID; // jshint ignore:line
    options.lat = lat;
    options.lng = lng;
    options.callback = 'JSON_CALLBACK';
    options.access_token = localStorageService.get('accessToken'); // jshint ignore:line

    var promise = $http.jsonp(API_ROOT + 'media/search', {
      params: options
    })
    .error(function(data, status) {
      console.log('findNearbyPosts returned status:'  + status);
    });
    return promise;
  };

  this.findUserFeedPosts = function(options) {
    options = options || {};

    options.callback = 'JSON_CALLBACK';
    options.access_token = localStorageService.get('accessToken'); // jshint ignore:line

    var promise = $http.jsonp(API_ROOT + 'users/self/feed', {
      params: options
    })
    .error(function (data, status) {
      console.log('userFeedPosts returned status:' + status);
    });
    return promise;
  };

  this.findLikedPosts = function(options) {
    options = options || {};

    options.callback = 'JSON_CALLBACK';
    options.access_token = localStorageService.get('accessToken'); // jshint ignore:line

    var promise = $http.jsonp(API_ROOT + 'users/self/media/liked', {
      params: options
    })
    .error(function (data, status) {
      console.log('findLikedPosts returned status:' + status);
    });
    return promise;
  };

  this.likePost = function(mediaId) {
    var access_token = localStorageService.get('accessToken'); // jshint ignore:line

    var promise = $http.post(API_ROOT + 'media/' + mediaId + '/likes?access_token=' + access_token) // jshint ignore:line
    .error(function (data, status) {
      console.log('likePost returned status:' + status);
    });
    return promise;
  };

  this.dislikePost = function(mediaId) {
    var access_token = localStorageService.get('accessToken'); // jshint ignore:line

    var promise = $http.delete(API_ROOT + 'media/' + mediaId + '/likes?access_token=' + access_token) // jshint ignore:line
      .error(function (data, status) {
        console.log('dislikePost returned status:' + status);
      });
    return promise;
  };

  this.logout = function() {
    var access_token = localStorageService.get('accessToken'); // jshint ignore:line
    var promise = $http.post('https://instagram.com/oauth/revoke_access', 'token=' + access_token, // jshint ignore:line
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded' // Use the normal form based logout; no REST API for this
        }
      })
      .error(function (data, status) {
        console.log('logout returned status:' + status);
      })
      .finally(function() {
         localStorageService.remove('accessToken');
      });
    return promise;
  };

  this.isLoggedIn = function() {
    return !!localStorageService.get('accessToken');
  };
});
