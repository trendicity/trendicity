'use strict';
angular.module('Trendicity')

/**
 * MapService is a simple wrapping service around
 * all Google Maps logic in order to make the choice
 * for Google Maps interchangable for any other map
 * solution.
 */
.service('MapService', function($log, $q, GeolocationService) {
    var that = this,
        mapInstance = {},
        lastInstance,
        defaultLatLng = GeolocationService.getDefaultPosition();

    this.getMapOptions = function () {
        var centerPoint = this.getLatLngFromCoords(defaultLatLng),
            mapType = this.getDefaultMapType();

        return {
            center: centerPoint,
            zoom: 16,
            mapTypeId: mapType
        };
    };

    this.getMapContainerElement = function (elementId) {
        if (!elementId) {
            throw new TypeError('No elementId defined in MapService.getMapContainerElement().');
        }

        return document.getElementById(elementId);
    };

    this.getDefaultMapType = function () {
        return google.maps.MapTypeId.ROADMAP;
    };

    this.getLatLngFromCoords = function (coords) {
        // Throw descriptive error if invalid argument
        if ((!coords.latitude || !coords.longitude) && (!coords instanceof google.maps.LatLng)) {
            throw new Error('Invalid coords argument passed to MapService.getLatLngFromCoords.');
        }

        // If this is already a Google Maps LatLng object, return it.
        if (coords instanceof google.maps.LatLng) {
            return coords;
        }

        // Return, in this case, a Google Maps LatLng object
        return new google.maps.LatLng(coords.latitude, coords.longitude);
    };

    this.initialize = function (instanceName) {
        if (!instanceName) {
            throw new Error('Please define a new map instance name.');
        }

        // Stop initializing if instance already exists.
        if (mapInstance[instanceName]) {
            return mapInstance[instanceName];
        }

        // Get position object
        var latLng = this.getLatLngFromCoords(defaultLatLng);
        $log.debug('Got default latlng: ', latLng);

        var mapOptions = this.getMapOptions();
        $log.debug('Got default map options: ', mapOptions);

        this.setMapInstance(
            instanceName,
            new google.maps.Map(
                this.getMapContainerElement(instanceName),
                mapOptions
            )
        );

        // Keep track of last instance
        lastInstance = instanceName;

        this.addMarker({coords: latLng}, instanceName, 'Current Position');

        return this.getMapInstance(instanceName);
    };

    this.getMapInstance = function (instanceName) {
        instanceName = (instanceName) ? instanceName : lastInstance;

        if (!mapInstance[instanceName]) {
            throw new Error('No map instance found with name \'' + instanceName + '\'.');
        }

        return mapInstance[instanceName].instance;
    };

    this.setMapInstance = function (instanceName, instance) {
        mapInstance[instanceName] = {
            instance: instance,
            markers: []
        };
    };

    this.addMarker = function (markerObject, instanceName, title) {
        var marker = new google.maps.Marker({
            position: that.getLatLngFromCoords(markerObject.coords),
            title: title
        });

        marker.setMap(this.getMapInstance(instanceName));
    };

    this.clearMarkers = function () {
        if (typeof lastInstance === 'undefined') {
            return; // No map instance to clear markers from.
        }

        var i,
            map = this.getMapInstance(),
            markerLength = map.markers.length,
            marker;

        $log.debug('Clearing markers...');

        var currentMarker = map.markers.currentPosition;

        for (var i in map.markers) {
            if (map.markers.hasOwnProperty(i)) {
                map.markers[i].setMap(null);
                delete map.markers[i];
            }
        }

        // Re-add current position marker to collection
        if (currentMarker) {
            map.markers['currentPosition'] = currentMarker;
        }
    };

    this.removeMarker = function (marker) {
        var map = this.getMap(),
            marker;

        if (!map.markers[marker.uid]) {
            return false;
        }

        $log.debug('Removing marker', marker);

        // Remove from map and collection
        map.markers[marker.uid].setMap(null);
        delete map.markers[marker.uid];

        return true;
    };

    return this;
});
