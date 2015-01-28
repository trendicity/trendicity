'use strict';
angular.module('Trendicity')

.controller('MapViewCtrl', function (
        $scope,
        GeolocationService,
        MapService,
        $log
    ) {
        var that = this;

        $scope.retrievedPosition = false;

        this.mapOptions = MapService.getDefaultOptions();

        GeolocationService.getCurrentPosition()
            .then(
                function (position) {
                    MapService.addMarker({
                        coords: position.coords,
                        id: 'currentPosition',
                        title: 'Current position'
                    });

                    that.setCenter(position.coords);
                    that.setZoom(14);
                },
                function (position) {
                    that.setCenter(position.coords);
                    that.setZoom(4);
                }
            )
            .finally(function () {
                // Positioning is done, show the map
                $scope.retrievedPosition = true;
            });

        this.setCenter = function (coords) {
            this.mapOptions = this.setOption({center: coords});
            $log.debug('setCenter', this.mapOptions);
        };

        this.setZoom = function (zoomLevel) {
            this.mapOptions = this.setOption({zoom: zoomLevel});
            $log.debug('setZoom', this.mapOptions);
        };

        this.setOption = function (option) {
            return angular.extend({}, this.mapOptions, option);
        };

        this.getMarkers = function () {
            return MapService.getMarkers();
        };

        this.showThumbnail = function (marker) {
            $log.debug('showThumb', marker);
        };
});
