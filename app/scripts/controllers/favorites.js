'use strict';
angular.module('Trendicity')

.controller('FavoritesCtrl', function($scope, FavoritesService, $state) {

    $scope.favorite = {};

    if ( $state.params ) {

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
            lat: 52.52,
            lng: 13.40
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

});
