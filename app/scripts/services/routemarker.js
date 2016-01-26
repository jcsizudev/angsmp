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
    this.models = [];
    this.modelsByGenId = [];
    this.addMarker = function (lat, lng) {
      var genid = 'sample-' + (this.models.length + 1);
      var genMarker = {
        id: genid,
        latitude: lat,
        longitude: lng,
        title: genid
      };
      $log.debug('create marker:' + genid);
      this.models.push(genMarker);
      this.modelsByGenId[genid] = genMarker;
      $log.debug(this.models);
    };
    this.getModel = function () {
      return this.models;
    }
    this.getMarker = function (id) {
      return this.modelsByGenId[id];
    };
    this.getPrevMarker = function (id) {
      var idNumber = Number(id.split('-')[1]);
      if (idNumber === 1) {
        return undefined;
      }
      else {
        return this.modelsByGenId['sample-' + (idNumber - 1)];
      }
    };
    this.getNextMarker = function (id) {
      var idNumber = Number(id.split('-')[1]);
      if (idNumber === this.models.length) {
        return undefined;
      }
      else {
        return this.modelsByGenId['sample-' + (idNumber + 1)];
      }
    };
  }]);
