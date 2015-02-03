'use strict';
angular.module('Trendicity')

.controller('MapViewCtrl', function (
        $scope,
        GeolocationService,
        MapService,
        $log,
        $ionicHistory,
        $ionicSideMenuDelegate,
        $state,
        FavoritesService
    ) {
        var mapCtrl = this,
            favoriteIsDefined = false;

        // Dont drag the menu open when we're panning the map
        $scope.$on('$ionicView.enter', function() {
            $ionicHistory.clearHistory();
            $ionicSideMenuDelegate.canDragContent(false);

            mapCtrl.checkForFavorite();
            if (favoriteIsDefined) {
              $scope.getPosts();
            } else {
              MapService.addMarkersFromPosts($scope.data.posts);
            }
        });

        $scope.$on('$ionicView.leave', function() {
          $ionicSideMenuDelegate.canDragContent(true);
        });

        $scope.retrievedPosition = false;

        // Bind it to the scope. Angular will take care of automatically updating
        // this value once the marker bounds change. Very handy.
        $scope.markerBounds = MapService.getMarkerBounds();

        this.mapOptions = MapService.getDefaultOptions();

        this.checkForFavorite = function () {
            var currentFavorite = FavoritesService.getCurrentFavorite();
            if (currentFavorite) {
                // Set a flag for later use.
                favoriteIsDefined = true;

                // Favorite location is set. Focus on that location instead of the geolocation center.
                mapCtrl.setCenter([currentFavorite.lat, currentFavorite.lng]);

                mapCtrl.setZoom(14);

                $log.debug('Got fav', currentFavorite);
            } else {
                // Reset the previously set flag
                favoriteIsDefined = false;
            }
        };

        GeolocationService.getCurrentPosition()
            .then(
                function (position) {
                    MapService.addMarker({
                        coords: position.coords,
                        id: 'currentPosition',
                        title: 'Current position'
                    });

                    $log.debug('got position', position);

                    // Only update map center and zoom level if we haven't
                    // done so previously when resolving the favorite location
                    if (!favoriteIsDefined) {
                        mapCtrl.setCenter(position.coords);
                        mapCtrl.setZoom(14);
                    }
                },
                function (position) {
                    // Same goes for the default location
                    if (!favoriteIsDefined) {
                        mapCtrl.setCenter(position.coords);
                        mapCtrl.setZoom(4);
                    }
                }
            )
            .finally(function () {
                // Positioning is done, show the map
                $scope.retrievedPosition = true;
            });

        this.setCenter = function (coords) {
            this.mapOptions = this.setOption({center: coords});
            $log.debug('Centering on ', coords);
        };

        this.setZoom = function (zoomLevel) {
            this.mapOptions = this.setOption({zoom: zoomLevel});
        };

        this.setOption = function (option) {
            return angular.extend({}, this.mapOptions, option);
        };

        this.getMarkers = function () {
            return MapService.getMarkers();
        };
});
