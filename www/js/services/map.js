'use strict';
angular.module('Trendicity')

/**
 * MapService is a simple wrapping service around
 * all Google Maps logic in order to make the choice
 * for Google Maps interchangable for any other map
 * solution.
 */
.service('MapService', function($log, GeolocationService, uiGmapMapScriptLoader) {
    var that = this,
        defaultPosition = GeolocationService.getDefaultPosition();

    /**
     * Markers container
     * @type {Array}
     */
    this.markers = [];

    this.getDefaultOptions = function () {
        return {
            zoom: 4,
            center: defaultPosition
        };
    };

    this.addMarker = function (marker) {
        // Add show / hide logic for each marker individually
        if (!marker.showPopup) {
            marker.show = false;
            marker.showPopup = function () {
                marker.show = !marker.show;
            };
        }
        this.markers.push(marker);
    };

    this.removeMarker = function (marker) {
        var i,
            markerLength = this.markers.length;

        for (i = 0; i < markerLength; i++) {
            if (this.markers[i].id === marker.id) {
                delete this.markers[i];
            }
        }
    };

    this.getCurrentPositionMarker = function () {
        var i,
            markerLength = this.markers.length,
            objReturn = null;

        for (i = 0; i < markerLength; i++) {
            if (this.markers[i] && this.markers[i].id === 'currentPosition') {
                objReturn = this.markers[i];
            }
        }

        return objReturn;
    };

    this.clearMarkers = function (blnRemoveCurrentPosition) {
        if (!!blnRemoveCurrentPosition) {
            // Clear all markers, including current position
            this.markers = [];
            return;
        }

        // Store the current position marker
        var currentPositionMarker = this.getCurrentPositionMarker();
        // Clear marker storage
        this.markers = [];
        // Re-add current position marker
        this.markers.push(currentPositionMarker);

    };

    this.getMarkers = function () {
        return this.markers;
    };

    this.addMarkersFromPosts = function (posts) {
        // Clear markers before potentially adding new ones
        this.clearMarkers();

        if (!posts || posts.length == 0) return;

        var i, post, marker;

        for (i = 0; i < posts.length; i++) {
            post = posts[i];

            marker = {
                coords: post.location,
                id: post.id,
                postData: post
            };

            $log.debug('Adding marker', marker);

            this.addMarker(marker);
        }

        this.updateMarkerBounds();
    };

    this.getMarkerBounds = function () {
        return this.markerBounds;
    };

    this.updateMarkerBounds = function () {
        // Check if the global google object is available to do some native Google Maps API coding.
        uiGmapMapScriptLoader.load().then(calculateMarkerBounds);

        function calculateMarkerBounds(googleMaps) {
            var bounds = new googleMaps.LatLngBounds(),
                markersLength = that.markers.length,
                i, marker;

            for (i = 0; i <= markersLength; i++) {
                marker = that.markers[i];

                if (marker && marker.coords && marker.coords.latitude && marker.coords.longitude) {
                    bounds.extend(
                        new googleMaps.LatLng(
                            marker.coords.latitude,
                            marker.coords.longitude
                        )
                    );
                }
            }

            $log.debug('Figured out correct map bounds', bounds);
        }
    };

    return this;
});
