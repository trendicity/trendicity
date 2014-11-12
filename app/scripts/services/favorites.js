'use strict';
angular.module('Trendicity')

.service('FavoritesService', function($cordovaGeolocation, $http) {

    this.add = function (location) {
        // TODO: Figure out where to call this
        // localStorage.setItem('');
    };

    this.delete = function (favorite) {
        // TODO: Figure out where to call this
    };

    this.getFavorites = function () {
        return JSON.parse(localStorage.getItem('Trendicity:Favorites'));
    };

    return this;
});
