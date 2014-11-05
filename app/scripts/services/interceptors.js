'use strict';
angular.module('Trendicity')

.factory('LoadingInterceptor',
  function ($injector) {
    return {
      request: function(config) {
        $injector.get('$ionicLoading').show();
        return config;
      },
      response: function(response) {
        var $http = $injector.get('$http');
        if ($http.pendingRequests.length < 1) {
          $injector.get('$ionicLoading').hide();
        }
        return response;
      },
      responseError: function(rejection) {
        var $http = $injector.get('$http');
        if ($http.pendingRequests.length < 1) {
          $injector.get('$ionicLoading').hide();
        }
        return rejection;
      }
    };
  }
);