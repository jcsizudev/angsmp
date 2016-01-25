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
    this.markerrefs = [];
    this.addMarker = function (lat, lng) {
      var genid = 'sample-' + (this.markers.length + 1);
      var genMarker = {
        id: genid,
        latitude: lat,
        longitude: lng,
        title: genid
      };
      $log.debug('create marker:' + genid);
      this.markers.push(genMarker);
      this.markerrefs[genid] = genMarker;
      $log.debug(this.markers);
      $log.debug(this.markerrefs);
    };
  }]);
