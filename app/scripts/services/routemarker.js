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
      $log.debug('create marker.');
      this.markers.push({
        id: 'sample-' + (this.markers.length + 1),
        latitude: lat,
        longitude: lng,
        title: 'sample'
      });
      $log.debug(this.markers);
    };
  }]);
