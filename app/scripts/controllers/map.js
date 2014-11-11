'use strict';
angular.module('Trendicity')

.controller('MapViewCtrl', function ($scope, $ionicPlatform, $log, leafletData) {
    var self = this;

    $scope.map = {
        center: {
            lat: 52.52,
            lng: 13.40,
            zoom: 14
        },
        markers: {
            m1: {
                lat: 52.52,
                lng: 13.40
            }
        },
        layers: {
            baselayers: {
                googleRoadmap: {
                    name: 'Google Streets',
                    layerType: 'ROADMAP',
                    type: 'google'
                }
            }
        }
    };

    $scope.$watch('posts', function () {
        for (var i = 0; i < $scope.posts.length; i++) {
            if ($scope.posts[i].location){
                $scope.map.markers['instagram' + i] = {
                    message: '<img src="' + $scope.posts[i].images.thumbnail.url + '" />',
                    lat: $scope.posts[i].location.latitude,
                    lng: $scope.posts[i].location.longitude
                }
            }
        }
    });

    this.registerGeoLocationWatcher = function () {
        var watcher;

        $ionicPlatform.ready(function () {
            watcher = navigator.geolocation.getCurrentPosition(
                function (location) {
                    console.log(location);
                    $log.info('Got your location.', location);
                    $scope.map.markers.currentPosition = {
                        message: '<div class="fm-current-location">Current Location</div>',
                        lat: location.coords.latitude,
                        lng: location.coords.longitude
                    };

                    self.centerMap(location.coords.latitude, location.coords.longitude);
                },
                function (error) {
                    $log.debug('Failed to detect location');
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 0
                }
            );
        });

        $scope.$on('$destroy', function () {
            navigator.geolocation.clearWatch(watcher);
        });
    };

    this.centerMap = function (lat, lng, zoom) {
        $log.info('Center map: ', lat, lng, zoom);

        leafletData.getMap()
            .then(function (Leaflet) {
                Leaflet.panTo([
                    parseFloat(lat),
                    parseFloat(lng)
                ]);

                if (zoom) {
                    Leaflet.setZoom(zoom); // Zoom in
                }
            });
    };

    this.init = function () {
        this.registerGeoLocationWatcher();
    };

    this.init();
});
