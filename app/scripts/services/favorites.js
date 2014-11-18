'use strict';
angular.module('Trendicity')

.service('FavoritesService', function(localStorageService, $http) {

    this.add = function (location) {
        var currentFavorites = this.getFavorites();

        var address = location.address + ", " + location.city + " " + location.state + " " + location.postalCode;

        return $http.get( "http://maps.google.com/maps/api/geocode/json?address=" + address + "&sensor=true_or_false")
        .success( function ( data ) {
            // TODO: Better ID handling
            var newLocation = {
                id: currentFavorites.length + 1,
                city: location.city + ", " + location.state,
                lat: data.results[0].geometry.location.lat,
                lng: data.results[0].geometry.location.lng
            };

            currentFavorites.push(newLocation);
            localStorageService.set('Favorites', currentFavorites);
        })
        .error( function () {
            // TODO: How are we handling errors
            console.warn("There was an error adding location");
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
