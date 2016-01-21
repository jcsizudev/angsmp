'use strict';

/**
 * @ngdoc function
 * @name angsmpApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angsmpApp
 */
angular.module('angsmpApp')
  .controller('MainCtrl', [ '$scope', function ($scope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
    angular.extend($scope, {
      map: {
        center: {
          latitude: 45,
          longitude: -73
        },
        zoom: 8,
        events: {
          tilesloaded: function (map, eventName, originalEventArgs) {
            console.log(map);
          }
        }
      }
    });
  }]);
