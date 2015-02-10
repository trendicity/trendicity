'use strict';
angular.module('Trendicity')

.controller('FavoritesCtrl', function(
  $scope,
  $state,
  FavoritesService,
  $ionicModal,
  $ionicSideMenuDelegate
) {
  // Initialize variables needed for view
  $scope.favorite = {};
  $scope.favorites = FavoritesService.getFavorites();

  // Enable Menu Dragging
  $scope.$on('$ionicView.enter', function() {
    // Update favorites
    $scope.favorites = FavoritesService.getFavorites();

    $ionicSideMenuDelegate.canDragContent(true);
  });

  // Add a new favorite using the service
  $scope.addFavorite = function(favorite) {
    console.log(favorite);
    FavoritesService.add(favorite).then(function (data) {
      $scope.favorites = FavoritesService.getFavorites();
      $scope.closeAddFavoriteForm();
    });
  };

  // Delete a favorite using the service and update scope var
  $scope.removeFavorite = function (favorite) {
    $scope.favorites = FavoritesService.delete(favorite);
  };

  // Favorite creation modal template and helper functions
  $ionicModal.fromTemplateUrl('add-favorite-modal.html', {
   scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openAddFavoriteForm = function () {
    $scope.modal.show();
  };
  $scope.closeAddFavoriteForm = function() {
    $scope.modal.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
});
