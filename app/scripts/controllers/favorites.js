'use strict';
angular.module('Trendicity')

.controller('FavoritesCtrl', function($scope, FavoritesService) {
    $scope.testLocations = [
        {city: 'Dallas, TX', id: 1},
        {city: 'Willemstad, Curaçao', id: 2}
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
