'use strict';
angular.module('Trendicity')

.service('InstagramService', function($rootScope, $http, $interval, localStorageService, authService, ENV) {
  var self = this;
  var CLIENT_ID = ENV.instagram.clientId;
  var API_ENDPOINT = ENV.instagram.apiEndpoint;
  var AUTH_URL = ENV.instagram.authUrl;
  var AUTH_REDIRECT_URL = ENV.instagram.authRedirectUrl;
  var LOGOUT_URL = ENV.instagram.logoutUrl;

  this.login = function() {
    var loginWindow = window.open(AUTH_URL + '?client_id=' +
      CLIENT_ID + '&scope=likes+comments&response_type=token&redirect_uri=' +
      AUTH_REDIRECT_URL, '_blank', 'width=400,height=250,location=no,clearsessioncache=yes,clearcache=yes'
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
    } else { // if running on a desktop browser, use this hack
      var intervalCount = 0, timesToRepeat = 100, intervalDelay = 3000;
      var loginListener = function(event) {
        intervalCount++;
        if (self.isLoggedIn()) {
          console.log('user is logged in now');
          $interval.cancel(promise);
          authService.loginConfirmed(null, configUpdater);
        } else {
          console.log('user not logged in yet, we wont wait forever.  Intervals left:', timesToRepeat - intervalCount);
          if (intervalCount >= timesToRepeat) {
            $interval.cancel(promise);
            console.log('Since this is a hack for running the app in the browser, we are now giving up on you logging in.');
            loginWindow.close();
          }
        }
      };
      var promise = $interval(loginListener, intervalDelay, timesToRepeat, false);
    }
  };

  this.findPopularPosts = function(options) {
    options = options || {};
    options.client_id = CLIENT_ID; // jshint ignore:line

    var promise =
      $http.get(API_ENDPOINT + '/media/popular', {
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

    var promise = $http.get(API_ENDPOINT + '/media/search', {
      params: options
    })
    .error(function(data, status) {
      console.log('findNearbyPosts returned status:'  + status);
    });
    return promise;
  };

  this.findUserFeedPosts = function(options) {
    options = options || {};

    var promise = $http.get(API_ENDPOINT + '/users/self/feed', {
      params: options
    })
    .error(function (data, status) {
      console.log('userFeedPosts returned status:' + status);
    });
    return promise;
  };

  this.findLikedPosts = function(options) {
    options = options || {};

    var promise = $http.get(API_ENDPOINT + '/users/self/media/liked', {
      params: options
    })
    .error(function (data, status) {
      console.log('findLikedPosts returned status:' + status);
    });
    return promise;
  };

  this.likePost = function(mediaId) {
    var promise = $http.post(API_ENDPOINT + '/media/' + mediaId + '/likes')
    .error(function (data, status) {
      console.log('likePost returned status:' + status);
    });
    return promise;
  };

  this.dislikePost = function(mediaId) {
    var promise = $http.delete(API_ENDPOINT + '/media/' + mediaId + '/likes')
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
    var promise = ionic.Platform.isWebView() ? $http.post(LOGOUT_URL) : $http.jsonp(LOGOUT_URL);
    promise.error(function (data, status) {
      // expect to get a 404 error on the desktop browser due to the nature of the response from Instagram
      // The Instagram API doesn't officially have a logout function
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
