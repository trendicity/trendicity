'use strict';

angular.module('Trendicity', [
  'ionic',
  'ionic.contrib.ui.tinderCards',
  'config',
  'LocalStorageModule',
  'ngCordova',
  'leaflet-directive',
  'http-auth-interceptor'
])

.run(function($rootScope, $ionicPlatform, ENV) {
  console.log('Environment:', ENV.name);

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })

    .state('app.intro', {
      url: '/intro',
      views: {
        'menuContent': {
          templateUrl: 'templates/intro.html',
          controller: 'IntroCtrl'
        }
      }
    })

    .state('app.home', {
      url: '/home',
      abstract: true,
      views: {
        'menuContent' :{
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      }
    })

    .state('app.home.map', {
      url: '/map',
      views: {
        'tab-map' :{
          templateUrl: 'templates/tab-map.html',
          controller: 'MapViewCtrl'
        }
      }
    })

    .state('app.home.map.id', {
      url: '/:id'
    })

    .state('app.home.card', {
      url: '/card',
      views: {
        'tab-card' :{
          templateUrl: 'templates/tab-card.html',
          controller: 'CardViewCtrl'
        }
      }
    })

    .state('app.home.card.id', {
      url: '/:id'
    })

    .state('app.home.list', {
      url: '/list',
      views: {
        'tab-list' :{
          templateUrl: 'templates/tab-list.html',
          controller: 'ListViewCtrl'
        }
      }
    })

    .state('app.home.list.id', {
      url: '/:id'
    })

    .state('app.favorites', {
      url: '/favorites',
      views: {
        'menuContent' :{
          templateUrl: 'templates/favorites.html',
          controller: 'FavoritesCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home/map');
})

.constant('$ionicLoadingConfig', {
  template: '<h3><icon ios="ion-ios7-reloading" android="ion-loading-c" default="ion-refreshing"></icon></h3>Loading...'
})

.constant('defaultMapSettings', {
    center: {
        lat: 52.52,
        lng: 13.40,
        zoom: 14
    },
    markers: {
        m1: {
            lat: 52.52,
            lng: 13.40
        }
    },
    layers: {
        baselayers: {
            googleRoadmap: {
                name: 'Google Streets',
                layerType: 'ROADMAP',
                type: 'google'
            }
        }
    }
})

.config(function($httpProvider) {
  $httpProvider.interceptors.push('TrendicityInterceptor');
});
