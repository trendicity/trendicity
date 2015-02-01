'use strict';
angular.module('Trendicity')

.service('GeolocationService', function($q, $log, $ionicPlatform, $http, $cordovaGeolocation) {
    var fallbackPositionObject = {
            latitude: '51.6673181',
            longitude: '5.6349002',
            accuracy: 0
        };

    this.getCurrentPosition = function () {
        var defer = $q.defer();

        $ionicPlatform.ready(function () {
            var posOptions = {timeout: 10000, enableHighAccuracy: false};

            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(
                    function (position) {
                        $log.debug('Got geolocation');
                        defer.resolve(position);
                    },
                    function (locationError) {

                        $log.debug('Did not get geolocation');

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
                    return $q.reject(reason);
                }
            );
    };

    this.getDefaultPosition = function () {
        return fallbackPositionObject;
    };

    return this;
});
