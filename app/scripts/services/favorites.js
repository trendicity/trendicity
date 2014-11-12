'use strict';
angular.module('Trendicity')

.service('FavoritesService', function($cordovaGeolocation, $http) {

    var that = this;

    this.add = function (location) {
        var currentFavorites = this.getFavorites();

        currentFavorites.push(location);
        localStorage.setItem('Trendicity:Favorites', JSON.stringify(currentFavorites));

        return this.getFavorites();
    };

    this.delete = function (favorite) {
        var currentFavorites = this.getFavorites();

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

    this.getFavorite = function (id) {
        var currentFavorites = this.getFavorites(),
            favorite;

        angular.forEach(currentFavorites, function(i){
            if(i.id === id) {
                favorite = i;
                return false;
            }
        });

        return favorite;
    };

    return this;
});
