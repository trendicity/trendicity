'use strict';
angular.module('Trendicity')

.controller('FavoritesCtrl', function(
  $scope,
  $state,
  $ionicModal,
  $ionicSideMenuDelegate,
  FavoritesService
) {
  // Create the add favorite modal that we will use later
  $ionicModal.fromTemplateUrl('templates/modals/favorite-add.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalAddFavorite = modal;
  });

  // Add a new favorite using the service
  $scope.addFavorite = function(favorite) {
    FavoritesService.add(favorite).then(function () {
      $scope.favorites = FavoritesService.getFavorites();
      $scope.hideModalAddFavorite();
    });
  };

  // Remove a favorite using the service and update scope var
  $scope.removeFavorite = function (favorite) {
    $scope.favorites = FavoritesService.delete(favorite);
  };

  $scope.showModalAddFavorite = function () {
    $scope.modalAddFavorite.show();
  };

  $scope.hideModalAddFavorite = function() {
    $scope.modalAddFavorite.hide();
  };

  // Remove add favorite modal
  $scope.$on('$destroy', function() {
    $scope.modalAddFavorite.remove();
  });

  $scope.$on('$ionicView.enter', function() {
    // Update favorites
    $scope.favorites = FavoritesService.getFavorites();

    // Enable menu dragging
    $ionicSideMenuDelegate.canDragContent(true);
  });
});
