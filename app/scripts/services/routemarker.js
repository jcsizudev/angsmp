'use strict';

/**
 * @ngdoc service
 * @name angsmpApp.RouteMarker
 * @description
 * # RouteMarker
 * Service in the angsmpApp.
 */
angular.module('angsmpApp')
  .service('RouteMarker', ['uiGmapLogger', function ($log) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    $log.currentLevel = $log.LEVELS.debug;
    this.markers = [];
    this.addMarker = function (lat, lng) {
      if (this.markers.length === 0) {
        $log.debug('no marker.');
        this.markers.push({
          id: 'sample-1',
          latitude: lat,
          longitude: lng,
          title: 'sample'
        });
      }
      else {
        $log.debug('marker exists.');
        $log.debug(this.markers);
      }
    };
  }]);
