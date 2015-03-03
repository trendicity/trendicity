'use strict';
angular.module('Trendicity')

.service('FavoritesService', function(localStorageService, GeolocationService) {
  // ADD
  this.add = function (favorite) {
    var favorites = this.getFavorites() || [];
    var favoritesId =  new Date().getTime();

    if (favorite.city && favorite.region) {
      var address = favorite.city + ', ' + favorite.region;
      return GeolocationService.addressToPosition(address).then(function (data) {
        var newLocation = {
          id: favoritesId,
          city: address,
          lat: data.latitude,
          lng: data.longitude
        };
        favorites.push(newLocation);
        localStorageService.set('Favorites', favorites);
      });
    } else {
      var newLocation = {
        id: favoritesId,
        city: favorite.city,
        lat: favorite.lat,
        lng: favorite.lng
      };
      favorites.push(newLocation);
      localStorageService.set('Favorites', favorites);
    }
  };

  // GET
  this.getFavorites = function () {
    return localStorageService.get('Favorites');
  };

  // DELETE
  this.delete = function (favorite) {
    var favorites = this.getFavorites();
    _.remove(favorites, favorite); // jshint ignore:line
    localStorageService.set('Favorites', favorites);
    return this.getFavorites();
  };
});
