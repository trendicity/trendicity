'use strict';
angular.module('Trendicity')

.controller('MapViewCtrl', function ($scope, $rootScope, $state, $location, $ionicPlatform, $log, leafletData, FavoritesService, InstagramService) {
    var self = this;

    // TODO: Figure out whats going on with manual $state.go('app.home.map', {}, {reload:true});
    // Have an issue with controller not reinitializing on state change, which we need
    // to reset the map
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if ( toState.name === "app.home.map" ) {
            $scope.init();
        }
    });

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
        if ($scope.map.markers.currentPosition) {
            $scope.map.markers = {
                currentPosition: $scope.map.markers.currentPosition
            };
        }

        var location;
        if ($scope.posts) {
          for (var i = 0; i < $scope.posts.length; i++) {
            location = $scope.posts[i].location;
            if (location && location.latitude && location.longitude){
              $scope.map.markers['instagram' + i] = {
                message: '<img src="' + $scope.posts[i].images.thumbnail.url + '" />',
                lat: location.latitude,
                lng: location.longitude
              };
            }
          }
        }
    });

    $scope.registerGeoLocationWatcher = function () {
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

    $scope.init = function () {
        $scope.registerGeoLocationWatcher();
    };

    // Load favorite
    if ($state.params.id) {
        $scope.favorite = FavoritesService.getFavorite( parseInt($state.params.id, 10) );
        InstagramService.findNearbyPosts( $scope.favorite.lat, $scope.favorite.lng )
        .success( function ( data ) {
            $scope.posts = data.data;
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
