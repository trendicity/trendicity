'use strict';
angular.module('Trendicity')

.controller('FavoritesCtrl', function($scope, FavoritesService, $state, $ionicModal) {

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

    $scope.testLocations = [
        {
            id: 1,
            city: 'Dallas, TX',
            lat: 32.7758,
            lng: -96.7967
        },
        {
            id: 2,
            city: 'Chicago, IL',
            lat: 41.885736,
            lng: -87.630877
        },
        {
            id: 3,
            city: 'New York, NY',
            lat: 40.584499,
            lng: -74.158591
        }
    ];

    $scope.setFavorites = function () {
        localStorage.setItem('Trendicity:Favorites', JSON.stringify($scope.testLocations));
    };

    $scope.setFavorites();

    $scope.removeFavorite = function (favorite) {
        $scope.favorites = FavoritesService.delete(favorite);
    };

    $scope.addFavorite = function(location) {
        $scope.favorites = FavoritesService.add(location);
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
