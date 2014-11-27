'use strict';
angular.module('Trendicity')

.controller('AppCtrl', function($rootScope, $scope, $ionicModal, $timeout, $state, InstagramService, localStorageService) {
  // Check if use has seen intro
  if (!localStorageService.get('seenIntro') || false) {
    $state.go('app.intro');
  }

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginModal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    InstagramService.loginCancelled();
    $scope.loginModal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.loginModal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    $scope.loginModal.hide();
    InstagramService.login();
  };

  // Perform the logout action when the user invokes the logout link
  $scope.logout = function() {
    InstagramService.logout();
  };

  // Determine if the user is logged into Instagram
  $scope.isLoggedIn = function() {
    return InstagramService.isLoggedIn();
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

