'use strict';
angular.module('Trendicity')

.controller('FavoritesCtrl', function($scope, FavoritesService, $state, $ionicModal, localStorageService, InstagramService) {

    $scope.favorite = {};

    $scope.removeFavorite = function (favorite) {
        $scope.favorites = FavoritesService.delete(favorite);
    };

    $scope.addFavorite = function(location) {
        FavoritesService.add(location).then(function (data) {
            $scope.favorites = FavoritesService.getFavorites();
            $scope.closeAddFavoriteForm();
        });
    };

    $scope.favorites = FavoritesService.getFavorites();

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
