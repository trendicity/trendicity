'use strict';
angular.module('Trendicity')

.service('FavoritesService', function(localStorageService, GeolocationService) {
  // CREATE
  this.add = function (favorite) {
    var favorites = this.getFavorites() ? this.getFavorites() : [];
    var id = favorites.length + 1;

    if (favorite.city && favorite.region) {
      var address = favorite.city + ", " + favorite.region;
      return GeolocationService.addressToPosition(address).then(function (data) {
        var newLocation = {
          id: id,
          city: address,
          lat: data.latitude,
          lng: data.longitude
        };

        favorites.push(newLocation);
        localStorageService.set('Favorites', favorites);
      });
    } else {
      var newLocation = {
        id: id,
        city: favorite.city,
        lat: favorite.latitude,
        lng: favorite.longitude
      };

      favorites.push(newLocation);
      localStorageService.set('Favorites', favorites);
    }
  };

  // READ
  this.getFavorites = function () {
    return localStorageService.get('Favorites');
  };

  // DELETE
  this.delete = function (favorite) {
    var favorites = this.getFavorites();
    _.remove(favorites, favorite);
    localStorageService.set('Favorites', favorites);
    return this.getFavorites();
  };
});
