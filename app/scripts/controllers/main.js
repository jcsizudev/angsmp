'use strict';

/**
 * @ngdoc function
 * @name angsmpApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angsmpApp
 */
angular.module('angsmpApp')
  .controller('MainCtrl', [ '$scope', 'uiGmapLogger', 'RouteMarker', function ($scope, $log, RouteMarker) {
    $log.currentLevel = $log.LEVELS.debug;

    angular.extend($scope, {
      map: {
        center: {
          latitude: 45,
          longitude: -73
        },
        zoom: 8,
        events: {
          tilesloaded: function (map, eventName, orgEv) {
            $log.debug(eventName);
            $log.debug(orgEv);
          },
          click: function (mapModel, eventName, orgEv) {
            $log.debug(eventName);
            $log.debug(orgEv);
            RouteMarker.addMarker(orgEv[0].latLng.lat(), orgEv[0].latLng.lng());
            $scope.$evalAsync();
          }
        }
      },
      markers: RouteMarker.markers,
      marker: {
        events: {
          dragend: function (marker, eventName, args) {
            $log.debug('marker dragend');
            $log.debug(marker.getPosition().lat());
            $log.debug(marker.getPosition().lng());
            $log.debug(marker);
          }
        }
      }
    });
  }]);
