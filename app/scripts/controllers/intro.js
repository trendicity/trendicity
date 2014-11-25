'use strict';
angular.module('Trendicity')

.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate, $ionicSideMenuDelegate, $ionicViewService, localStorageService, GeolocationService) {

    //** Settings some default scope variables.
    $scope.fetchingPosition = false;
    $scope.noPosition = false;

  // Temporarily disable side-menu drag
  $ionicSideMenuDelegate.canDragContent(false);

  // Clear history since this might have been a forced redirect
  $ionicViewService.clearHistory();

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

        $scope.getCurrentPosition = function () {
            $scope.fetchingPosition = true;
            GeolocationService.getCurrentPosition()
                .then(
                    function (position) {
                        localStorageService.set('defaultPosition', position);
                        $scope.next();
                    },
                    function (fallbackPosition) {
                        localStorageService.set('defaultPosition', fallbackPosition);

                        // Show error message
                        $scope.noPosition = true;
                    }
                )
                ['finally'](function () {
                    $scope.fetchingPosition = false;
                });
        };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
});
