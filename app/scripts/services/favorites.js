'use strict';
angular.module('Trendicity')

.service('FavoritesService', function($cordovaGeolocation, $http) {

    var that = this;

    this.add = function (location) {
        var currentFavorites = JSON.parse(localStorage.getItem('Trendicity:Favorites'));

        currentFavorites.push(location);
        localStorage.setItem('Trendicity:Favorites', JSON.stringify(currentFavorites));

        return this.getFavorites();
    };

    this.delete = function (favorite) {
        var currentFavorites = JSON.parse(localStorage.getItem('Trendicity:Favorites'));

        angular.forEach(currentFavorites, function(i){
            if(i.id === favorite.id) {
                currentFavorites.splice(currentFavorites.indexOf(i), 1 );
                return false;
            }
        });

        localStorage.setItem('Trendicity:Favorites', JSON.stringify(currentFavorites));

        return this.getFavorites();
    };

    this.getFavorites = function () {
        return JSON.parse(localStorage.getItem('Trendicity:Favorites'));
    };

    return this;
});
