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
            throw new Error('Invalid coords argument passed to GeolocationService.getLatLngFromCoords.');
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
        instanceName = (instanceName) ? instanceName : lastInstance;

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
            map = this.getMapInstance(lastInstance),
            markerLength = map.markers.length,
            marker;

        $log.debug('Clearing markers...');

        for (i = 0; i <= markerLength; i++) {
            marker = map.markers[i];

            marker.setMap(null); // Remove from map
            delete map.markers[i];
        }
    };

    return this;
});
