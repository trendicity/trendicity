'use strict';
angular.module('Trendicity')

.service('FavoritesService', function(localStorageService, GeolocationService) {

    var currentFavorite = null;

    this.add = function (favorite) {
        var currentFavorites = this.getFavorites() ? this.getFavorites() : [];
        var id = currentFavorites.length + 1;

        var address = favorite.city + ", " + favorite.region;

        return GeolocationService.addressToPosition(address)
            .then( function ( data ) {
                var newLocation = {
                    id: id,
                    city: address,
                    lat: data.latitude,
                    lng: data.longitude
                };

                currentFavorites.push(newLocation);
                localStorageService.set('Favorites', currentFavorites);
            });
    };

    this.delete = function (favorite) {
        var currentFavorites = this.getFavorites();

        angular.forEach(currentFavorites, function(i){
            if(i.id === favorite.id) {
                currentFavorites.splice(currentFavorites.indexOf(i), 1 );
                return false;
            }
        });

        localStorageService.set('Favorites', currentFavorites);

        return this.getFavorites();
    };

    this.getFavorites = function () {
        return localStorageService.get('Favorites');
    };

    this.getFavorite = function (id) {
        var currentFavorites = this.getFavorites();
        var favorite = null;

        angular.forEach(currentFavorites, function(f){
            if(f.id === id) {
                favorite = f;
                return false;
            }
        });

        return favorite;
    };

    this.getCurrentFavorite = function() {
      return currentFavorite;
    };

    this.setCurrentFavorite = function(id) {
      currentFavorite = this.getFavorite(id);
    };

    this.clearCurrentFavorite = function() {
      currentFavorite = null;
    };

    return this;
});
