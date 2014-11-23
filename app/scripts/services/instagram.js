'use strict';
angular.module('Trendicity')

.service('InstagramService', function($rootScope, $http, $timeout, localStorageService, authService) {
  var CLIENT_ID = '75d27c9457cd4d1abbacf80a228f4a10';
  var API_ROOT = 'https://api.instagram.com/v1/';
  var AUTH_REDIRECT_URL = 'http://localhost:8100/instagram.html';
  var self = this;

  this.obtainAccessToken = function() {
    var loginWindow = window.open('https://instagram.com/oauth/authorize?client_id=' +
      CLIENT_ID + '&scope=likes+comments&response_type=token&redirect_uri=' +
      AUTH_REDIRECT_URL, '_blank', 'location=no,width=400,height=250'
    );

    var configUpdater = function(config) {
      config.params = config.params || {};
      config.params.access_token = self.getAccessToken();
      return config;
    }

    if (ionic.Platform.isWebView()) { // If running in a WebView (i.e. on a mobile device/simulator)
      loginWindow.addEventListener('loadstart', function (event) {
        if ((event.url).indexOf(AUTH_REDIRECT_URL) === 0) {
          var accessToken = (event.url).split('access_token=')[1];
          localStorageService.set('accessToken', accessToken);
          loginWindow.close();
          if (self.isLoggedIn()) {
            authService.loginConfirmed(null, configUpdater);
          }
        }
      });
    } else { // if running on a desktop browser use this hack
      var unloadEventListener = function() {
        // Need to wait a bit for localStorage to be updated
        $timeout(function(){
          if (self.isLoggedIn()) {
            console.log('user is logged in now');
            authService.loginConfirmed(null, configUpdater);
          } else {
            console.log('user not logged in yet');
            // Rebind event listener in case user entered a bad username and/or password
            loginWindow.addEventListener('unload', unloadEventListener);
          }
        }, 1000);
      };
      loginWindow.addEventListener('unload', unloadEventListener);
    }
  };

  this.findPopularPosts = function(options) {
    options = options || {};
    options.client_id = CLIENT_ID; // jshint ignore:line

    var promise =
      $http.get(API_ROOT + 'media/popular', {
        params: options,
        headers: {
          "Content-Type": "application/json"
        }
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

    var promise = $http.get(API_ROOT + 'media/search', {
      params: options
    })
    .error(function(data, status) {
      console.log('findNearbyPosts returned status:'  + status);
    });
    return promise;
  };

  this.findUserFeedPosts = function(options) {
    options = options || {};

    var promise = $http.get(API_ROOT + 'users/self/feed', {
      params: options
    })
    .error(function (data, status) {
      console.log('userFeedPosts returned status:' + status);
    });
    return promise;
  };

  this.findLikedPosts = function(options) {
    options = options || {};

    var promise = $http.get(API_ROOT + 'users/self/media/liked', {
      params: options
    })
    .error(function (data, status) {
      console.log('findLikedPosts returned status:' + status);
    });
    return promise;
  };

  this.likePost = function(mediaId) {
    var promise = $http.post(API_ROOT + 'media/' + mediaId + '/likes')
    .error(function (data, status) {
      console.log('likePost returned status:' + status);
    });
    return promise;
  };

  this.dislikePost = function(mediaId) {
    var promise = $http.delete(API_ROOT + 'media/' + mediaId + '/likes')
      .error(function (data, status) {
        console.log('dislikePost returned status:' + status);
      });
    return promise;
  };

  this.loginCancelled = function() {
    // Let the authService know that login was cancelled so that the http buffer will be cleared.
    authService.loginCancelled();
  };

  this.logout = function() {
    var promise = $http.post('https://instagram.com/accounts/logout')
      .error(function (data, status) {
        console.log('logout returned status:' + status);
      })
      .finally(function() {
         localStorageService.remove('accessToken');
         $rootScope.$broadcast('event:auth-logoutComplete');
      });
    return promise;
  };

  this.getAccessToken = function() {
    return localStorageService.get('accessToken');
  };

  this.isLoggedIn = function() {
    return !!this.getAccessToken();
  };
});
