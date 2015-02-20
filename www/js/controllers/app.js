'use strict';
angular.module('Trendicity')

.controller('AppCtrl', function(
  $rootScope,
  $scope,
  $ionicModal,
  $timeout,
  $state,
  InstagramService,
  FavoritesService,
  localStorageService) {
  // Check if use has seen intro
  if (!localStorageService.get('seenIntro') || false) {
    $state.go('app.intro');
  }

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/modals/login.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.loginModal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    InstagramService.loginCancelled();
    $scope.loginModal.hide();
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.loginModal.remove();
  });

  // Determine if the user is logged into Instagram
  $scope.isLoggedIn = function() {
    return InstagramService.isLoggedIn();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.loginModal.show();
  };

  // Perform the logout action when the user invokes the logout link
  $scope.logout = function() {
    InstagramService.logout();
  };

  // Perform the OAuth login to Instagram
  $scope.loginToInstagram = function() {
    $scope.loginModal.hide();
    InstagramService.login();
  };

  // Handle the login required event raised by the authService
  $scope.$on('event:auth-loginRequired', function() {
    console.log('handling event:auth-loginRequired  ...');
    $scope.loginModal.show();
  });

  // Handle the login confirmed event raised by the authService
  $scope.$on('event:auth-loginConfirmed', function() {
    console.log('handling event:auth-loginConfirmed...');
  });
});

