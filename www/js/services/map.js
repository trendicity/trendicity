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
            zoom: 14,
            mapTypeId: mapType,
            panControl: true,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            overviewMapControl: false
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
        $log.debug('Got default latlng: ' + JSON.stringify(latLng));

        var mapOptions = this.getMapOptions();
        $log.debug('Got default map options: ' + JSON.stringify(mapOptions));

        this.setMapInstance(
            instanceName,
            new google.maps.Map(
                this.getMapContainerElement(instanceName),
                mapOptions
            )
        );

        // Keep track of last instance
        lastInstance = instanceName;

        return this.getMapInstance(instanceName);
    };

    this.getMap = function () {
        return mapInstance[lastInstance];
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

    this.addMarker = function (markerObject) {
        var latLng = this.getLatLngFromCoords(markerObject.coords),
            map = this.getMapInstance(),
            marker = new google.maps.Marker({
                position: latLng
            });

        if (markerObject.title) {
            marker.setTitle(markerObject.title);
        }

        if (markerObject.image) {
            marker.setIcon(markerObject.image);
        }

        marker.setMap(map);

        console.log(marker);

        $log.debug('Added marker' + markerObject.uid);
    };

    this.setCenter = function (coords) {
        var map = this.getMapInstance(),
            latLng = this.getLatLngFromCoords(coords);

        $log.debug('Set map center to ' + JSON.stringify(latLng));

        map.setCenter(latLng);
    };

    this.clearMarkers = function () {
        if (typeof lastInstance === 'undefined') {
            return; // No map instance to clear markers from.
        }

        var map = that.getMap(),
            currentMarker = map.markers.currentPosition;

        $log.debug('Clearing markers...');


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
