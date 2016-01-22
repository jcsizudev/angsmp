'use strict';

/**
 * @ngdoc function
 * @name angsmpApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angsmpApp
 */
angular.module('angsmpApp')
  .controller('MainCtrl', [ '$scope', 'uiGmapLogger', function ($scope, $log) {
    $log.currentLevel = $log.LEVELS.debug;

    angular.extend($scope, {
      map: {
        center: {
          latitude: 45,
          longitude: -73
        },
        zoom: 8,
        events: {
          tilesloaded: function (map, eventName, originalEventArgs) {
            $log.debug(eventName);
            $log.debug(originalEventArgs);
          },
          click: function (mapModel, eventName, originalEventArgs) {
            $log.debug(eventName);
            $log.debug(originalEventArgs[0]);
            if ($scope.randomMarkers.length === 0) {
              $log.debug('no marker.');
              $scope.randomMarkers.push({
                id: 'sample-1',
                latitude: originalEventArgs[0].latLng.lat(),
                longitude: originalEventArgs[0].latLng.lng(),
                title: 'sample'
              });
              $scope.$evalAsync();
            }
            else {
              $log.debug('marker exists.');
            }
          }
        }
      },
      randomMarkers: []
    });
  }]);
