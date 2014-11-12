'use strict';
angular.module('Trendicity')

.service('FavoritesService', function($cordovaGeolocation, $http) {

    var _this = this;

    this.add = function (location) {
        // TODO: Figure out where to call this
        // localStorage.setItem('');
    };

    this.delete = function (favorite) {
        var currentFavorites = JSON.parse(localStorage.getItem('Trendicity:Favorites'));

        angular.forEach(currentFavorites, function(i){
            if(i.id === favorite.id) {
                currentFavorites.splice(i,1);
                return;
            }
        });

        localStorage.setItem('Trendicity:Favorites', JSON.stringify(currentFavorites));

        return JSON.parse(localStorage.getItem('Trendicity:Favorites'));
    };

    this.getFavorites = function () {
        return JSON.parse(localStorage.getItem('Trendicity:Favorites'));
    };

    return this;
});
