'use strict';
angular.module('Trendicity')

.service('MapService', function(GeolocationService) {
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
            return GeolocationService.getCurrentPosition();
        }
    }

    return serviceDefintion;
});
