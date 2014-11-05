'use strict';
angular.module('Trendicity')

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, InstagramService) {
  // Check if use has seen intro
  if (!localStorage.getItem('TrendiCity:seenIntro') || false) {
    $state.go('app.intro');
  }

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    $scope.modal.hide();
    InstagramService.obtainAccessToken();
  };

  // Perform the login action when the user submits the login form
  $scope.logout = function() {
    localStorage.removeItem('TrendiCity:accessToken');
  };

  $scope.isLoggedIn = function() {
    return localStorage.getItem('TrendiCity:accessToken') || false;
  };
});

