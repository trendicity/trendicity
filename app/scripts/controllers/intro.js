'use strict';
angular.module('Trendicity')

.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate, $ionicSideMenuDelegate, $ionicViewService) {
  // Temporarily disable side-menu drag
  $ionicSideMenuDelegate.canDragContent(false);

  // Clear history since this might have been a forced redirect
  $ionicViewService.clearHistory();

  // Mark intro as seen
  localStorage.setItem('TrendiCity:seenIntro', true);

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
});
