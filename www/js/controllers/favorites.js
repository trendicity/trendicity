'use strict';
angular.module('Trendicity')

.controller('FavoritesCtrl', function($scope, FavoritesService, $ionicModal, $ionicSideMenuDelegate) {
    $scope.favorite = {};

    $scope.$on('$ionicView.enter', function() {
        $ionicSideMenuDelegate.$getByHandle('sideMenu').canDragContent(true);
    });

    $scope.removeFavorite = function (favorite) {
        $scope.favorites = FavoritesService.delete(favorite);
    };

    $scope.addFavorite = function(favorite) {
        FavoritesService.add(favorite).then(function (data) {
            $scope.favorites = FavoritesService.getFavorites();
            $scope.closeAddFavoriteForm();
        });
    };

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

    $scope.favorites = FavoritesService.getFavorites();
});
