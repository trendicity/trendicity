'use strict';

angular.module('Trendicity', [
  'ionic',
  'ionic.contrib.ui.tinderCards',
  'ionic.contrib.icon',
  'config',
  'LocalStorageModule',
  'ngCordova',
  'http-auth-interceptor',
  'uiGmapgoogle-maps'
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

    .state('app.favorites', {
      url: '/favorites',
      views: {
        'menuContent': {
          templateUrl: 'templates/favorites.html',
          controller: 'FavoritesCtrl'
        }
      }
    })

    .state('app.home', {
      url: '/home',
      abstract: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      }
    })

    .state('app.home.map', {
      url: '/map/?latitude&longitude',
      views: {
        'tab-map': {
          templateUrl: 'templates/tab-map.html',
          controller: 'MapViewCtrl as mapCtrl'
        }
      }
    })

    .state('app.home.card', {
      url: '/card',
      views: {
        'tab-card': {
          templateUrl: 'templates/tab-card.html',
          controller: 'CardViewCtrl'
        }
      }
    })

    .state('app.home.list', {
      url: '/list',
      views: {
        'tab-list': {
          templateUrl: 'templates/tab-list.html',
          controller: 'ListViewCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home/map/');
})

.constant('$ionicLoadingConfig', {
  template: '<ion-spinner></ion-spinner>Loading...'
})

.config(function($httpProvider) {
  $httpProvider.interceptors.push('TrendicityInterceptor');
})

.config(function($ionicConfigProvider) {
  // Make tabs show up at the bottom for android if you so desire
  // $ionicConfigProvider.tabs.position('bottom');

  // Use native scrolling on Android
  if(ionic.Platform.isAndroid()) $ionicConfigProvider.scrolling.jsScrolling(false);
});