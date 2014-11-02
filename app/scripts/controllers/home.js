'use strict';
angular.module('Trendicity')

.controller('HomeCtrl', function ($scope, $ionicPopover, InstagramService) {
    console.log('Inside HomeCtrl...');

    $scope.posts = [];
    $scope.search = { value: 'TR'};

    $scope.$watch('search.value', function(newValue) {
      if (newValue === 'TR') {
        InstagramService.findPopularPosts().success(function (data) {
          $scope.posts = data.data;
        });
      } else if (newValue === 'NB') {
        InstagramService.findNearbyPosts(48.858844, 2.294351).success(function (data) {
          $scope.posts = data.data;
        });
      } else if (newValue === 'UF') {
        InstagramService.findUserFeedPosts().success(function (data) {
          $scope.posts = data.data;
        });
      }
      $scope.closePopover();
    });

    $ionicPopover.fromTemplateUrl('templates/search.html', {
      scope: $scope,
    }).then(function(popover) {
      $scope.popover = popover;
    });

    $scope.openPopover = function($event) {
      $scope.popover.show($event);
    };

    $scope.closePopover = function() {
      if ($scope.popover && $scope.popover.isShown()) {
        $scope.popover.hide();
      }
    };

    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.popover.remove();
    });

    // Execute action on hide popover
    $scope.$on('popover.hidden', function() {
      // Execute action
    });

    // Execute action on remove popover
    $scope.$on('popover.removed', function() {
      // Execute action
    });
  }
);






