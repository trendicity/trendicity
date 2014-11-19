'use strict';
angular.module('Trendicity')

.controller('FavoritesCtrl', function($scope, FavoritesService, $state, $ionicModal, localStorageService) {

    $scope.favorite = {};

    if ( $state.params.id ) {

        $scope.favorite = FavoritesService.getFavorite( parseInt($state.params.id, 10) );

        $scope.map = {
            center: {
                lat: $scope.favorite.lat,
                lng: $scope.favorite.lng,
                zoom: 14
            },
            markers: {
                m1: {
                    lat: $scope.favorite.lat,
                    lng: $scope.favorite.lng
                }
            },
            layers: {
                baselayers: {
                    googleRoadmap: {
                        name: 'Google Streets',
                        layerType: 'ROADMAP',
                        type: 'google'
                    }
                }
            }
        };

    }

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
