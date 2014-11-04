'use strict';
angular.module('Trendicity')

.service('MapService', function($cordovaGeolocation) {
    var serviceDefintion = {
        getMapOptions: function (options) {
            options = options || {};

            var defaultOptions = {
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            return angular.extend(defaultOptions, options);
        },

        toGoogleLatLng: function (lat, lng) {
            var args = Array.prototype.slice.call(arguments);

            return google.maps.LatLng.apply(this, args);
        },

        getPosition: function () {
            var args = Array.prototype.slice.call(arguments);
            return $cordovaGeolocation.getCurrentPosition.apply(this, args);
        }
    }

    return serviceDefintion;
});
