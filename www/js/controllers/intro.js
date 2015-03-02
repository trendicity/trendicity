'use strict';
angular.module('Trendicity')

.constant('BUTTON_ACTION', {'BACK': 0, 'NEXT': 1})
.controller('IntroCtrl', function(
  $scope,
  $state,
  $timeout,
  $ionicSlideBoxDelegate,
  $ionicSideMenuDelegate,
  $ionicHistory,
  localStorageService,
  BUTTON_ACTION) {
  $scope.$on('$ionicView.beforeEnter', function() {
    // Clear history since this might have been a forced redirect
    $ionicHistory.clearHistory();
    // Fix issue when coming from map
    $ionicSlideBoxDelegate.update();
  });

  // Mark intro as seen
  localStorageService.set('seenIntro', true);

  // Default button labels for the first slideIndex
  $scope.backButtonLabel = 'Skip';
  $scope.nextButtonLabel = 'Next';

  // Set the slideIndex on 0 by default to prevent 'undefined' value.
  $scope.slideIndex = 0;

  // Called to navigate to the main app
  var startApp = function() {
    $state.go('app.home.map');
  };

  var updateButtonLabel = function (slideIndex, buttonAction) {
    switch (slideIndex) {
      case 0:
        if (buttonAction === BUTTON_ACTION.BACK) {
          // Skip was clicked
          startApp();
        } else {
          console.log('nextback');
          $scope.backButtonLabel = 'Back';
          $scope.nextButtonLabel = 'Next';
        }
        break;
      case 1:
        if (buttonAction === BUTTON_ACTION.BACK) {
          $scope.backButtonLabel = 'Skip';
          $scope.nextButtonLabel = 'Next';
        } else {
          $scope.backButtonLabel = 'Back';
          $scope.nextButtonLabel = 'Explore';
        }

        break;
      case 2:
        if (buttonAction === BUTTON_ACTION.BACK) {
          $scope.backButtonLabel = 'Back';
          $scope.nextButtonLabel = 'Next';
        } else {
          // 'Explore' was clicked.
          startApp();
        }
        break;
    }
  };

  $scope.next = function(slideIndex) {
    updateButtonLabel(slideIndex, BUTTON_ACTION.NEXT);

    $ionicSlideBoxDelegate.next();
  };

  $scope.previous = function(slideIndex) {
    updateButtonLabel(slideIndex, BUTTON_ACTION.BACK);

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
