'use strict';
angular.module('Trendicity')

.service('GeolocationService', function($q, $ionicPlatform, $http) {
    var that = this,
        currentPositionWatcher,
        fallbackPositionObject = {
            latitude: '',
            longitude: '',
            accuracy: 0
        };

    this.getCurrentPosition = function () {
        var defer = $q.defer();

        $ionicPlatform.ready(function () {
            currentPositionWatcher = navigator.geolocation.getCurrentPosition(
                function (position) {
                    defer.resolve(position);
                },
                function (locationError) {
                    defer.reject({
                        code: locationError.code,
                        message: locationError.message,
                        coords: fallbackPositionObject
                    });
                }
            );
        });

        return defer.promise;
    };

    /**
     * Convert any address to a latitude/longitude object.
     * @param strAddress The address as a string, e.g. 'Willemstad, Curaçao'
     * @returns {*}
     */
    this.addressToPosition = function (strAddress) {
        return $http.get('http://maps.googleapis.com/maps/api/geocode/json?address=' + strAddress + '&sensor=false')
            .then(
                function (result) {
                    var location = result.data.results[0].geometry.location;

                    // Transforming the 'location.lat' and 'location.lng' object to 'location.latitude' to be
                    // compatible with other location responses like in getCurrentPosition
                    return {
                        latitude: location.lat,
                        longitude: location.lng
                    }
                },
                function (reason) {
                    $q.reject(reason);
                }
            );
    };

    return this;
});
