'use strict';
angular.module('Trendicity')

.factory('LoadingInterceptor',
  function ($injector) {
    return {
      request: function (config) {
        $injector.get('$ionicLoading').show();
        return config;
      },
      response: function (response) {
        $injector.get('$ionicLoading').hide();
        return response;
      }
    };
  }
);