'use strict';
angular.module('Trendicity')

.controller('IntroCtrl', function(
  $scope,
  $state,
  $timeout,
  $ionicSlideBoxDelegate,
  $ionicSideMenuDelegate,
  $ionicHistory,
  localStorageService) {
  $scope.$on('$ionicView.beforeEnter', function() {
    // Clear history since this might have been a forced redirect
    $ionicHistory.clearHistory();
    // Fix issue when coming from map
    $ionicSlideBoxDelegate.update();
  });

  // Mark intro as seen
  localStorageService.set('seenIntro', true);

  // Called to navigate to the main app
  $scope.startApp = function() {
    $state.go('app.home.map');
  };

  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };

  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };

  $scope.openWindow = function(url) {
    window.open(url, '_system', 'location=no,clearsessioncache=yes,clearcache=yes');
  };
});
