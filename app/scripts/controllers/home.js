'use strict';
angular.module('Trendicity')

.controller('HomeCtrl', function ($rootScope, $scope, $ionicPopover, InstagramService) {
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
        if (InstagramService.isLoggedIn()) {
          $scope.findUserFeedPosts();
        } else {
          $rootScope.afterLoginSuccessful = $scope.findUserFeedPosts;
          $scope.closePopover();
          $scope.modal.show();
        }
      }
      $scope.closePopover();
    });

    $scope.findUserFeedPosts = function() {
      InstagramService.findUserFeedPosts().success(function (data) {
        $scope.posts = data.data;
      });
    };

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

    // Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
      if ($scope.popover) {
        $scope.popover.remove();
      }
    });
  }
);






