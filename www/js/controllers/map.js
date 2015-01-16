'use strict';
angular.module('Trendicity')

.controller('MapViewCtrl', function (
        $scope,
        $rootScope,
        $state,
        $location,
        $ionicPlatform,
        $log,
        leafletData,
        FavoritesService,
        InstagramService,
        defaultMapSettings,
        localStorageService,
        GeolocationService
    ) {
    var self = this;

    $scope.map = defaultMapSettings;
    var location = localStorageService.get('defaultPosition');
    if (location) {
        $scope.map.center = {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
            zoom: 12
        };
    }

    $scope.$watch('data.posts', function () {
        if ($scope.map.markers.currentPosition) {
            $scope.map.markers = {
                currentPosition: $scope.map.markers.currentPosition
            };
        }

        var location;
        if ($scope.data.posts) {
          for (var i = 0; i < $scope.data.posts.length; i++) {
            location = $scope.data.posts[i].location;
            if (location && location.latitude && location.longitude){
              $scope.map.markers['instagram' + i] = {
                message: '<img src="' + $scope.data.posts[i].images.thumbnail.url + '" />',
                lat: location.latitude,
                lng: location.longitude
              };
            }
          }
        }
    });

    $scope.registerGeoLocationWatcher = function () {
        var updateLocation = function (location) {
            $scope.map.markers.currentPosition = {
                message: '<div class="fm-current-location">Current Location</div>',
                lat: location.coords.latitude,
                lng: location.coords.longitude
            };

            self.centerMap(location.coords.latitude, location.coords.longitude);
        };

        $ionicPlatform.ready(function () {
            // We get either a location object or a fallback location object.
            // Either way, call updateLocation with one of these objects as an argument.
            GeolocationService.getCurrentPosition().then(updateLocation, updateLocation);
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

    $scope.init = function () {
        $scope.registerGeoLocationWatcher();
    };

    // Load favorite
    if ($state.params.id) {
        $scope.favorite = FavoritesService.getFavorite( parseInt($state.params.id, 10) );
        InstagramService.findNearbyPosts( $scope.favorite.lat, $scope.favorite.lng )
            .success( function ( data ) {
                $scope.data.posts = data.data;
            });

        $scope.map = {
            center: {
                lat: $scope.favorite.lat,
                lng: $scope.favorite.lng,
                zoom: 14
            },
            markers: {
                m1: {
                    lat: $scope.favorite.lat,
                    lng: $scope.favorite.lng
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


    } else {
        $scope.init();
    }
});
