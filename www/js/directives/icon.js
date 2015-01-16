'use strict';
angular.module('Trendicity')

.directive('icon', function() {
  return {
    restrict: 'E',
    scope: {
      ios: '@',
      android: '@',
      default: '@'
    },
    link: function($scope) {
      // Set icon depending on device's platform
      if (ionic.Platform.isIOS()) {
        $scope.platform = $scope.ios;
      } else if (ionic.Platform.isAndroid()) {
        $scope.platform = $scope.android;
      }

      // By default, use this icon (if iOS or Android not set)
      if (!$scope.platform) {
        $scope.platform = $scope.default;
      }
    },
    transclude: true,
    replace: true,
    template: '<i class="icon {{ platform }}"></i>'
  };
});