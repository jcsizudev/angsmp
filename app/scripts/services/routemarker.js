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
    this.nextid = 1;
    this.addMarker = function (lat, lng) {
      var genid = 'sample-' + (this.nextid++);
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
    this.deleteMarker = function (id) {
      delete this.modelsByGenId[id];
      for (var i = 0; i < this.models.length; i++) {
        if (this.models[i].id === id) {
          this.models.splice(i, 1);
          break;
        }
      }
    };
  }]);
