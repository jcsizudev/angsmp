'use strict';

/**
 * @ngdoc function
 * @name angsmpApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angsmpApp
 */
angular.module('angsmpApp')
  .controller('MainCtrl', [ '$scope', 'uiGmapLogger', 'RouteMarker', 'uiGmapGoogleMapApi', function ($scope, $log, RouteMarker, GoogleMapApi) {
    $log.currentLevel = $log.LEVELS.debug;
    $scope.test = "set";

    GoogleMapApi.then(function(maps) {
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
        markers: {
          models: RouteMarker.getModel(),
          options: {
            draggable: true
          },
          events: {
            dragstart: function (marker, eventName, args) {
              $log.debug('marker:' + eventName);
            },
            drag: function (marker, eventName, args) {
              $log.debug('marker:' + eventName);
              var curMarker = RouteMarker.getMarker(marker.key);
              curMarker.latitude = marker.getPosition().lat();
              curMarker.longitude = marker.getPosition().lng()
            },
            dragend: function (marker, eventName, args) {
              $log.debug('marker:' + eventName);
            },
            click: function (marker, eventName, args) {
              $log.debug('marker:' + eventName);
              $log.debug(marker);

              $scope.markers.dialogTarget = marker;
              marker.setAnimation(google.maps.Animation.BOUNCE);

              $("#dlgLatitude").text(marker.getPosition().lat());
              $("#dlgLongitude").text(marker.getPosition().lng());
              $("#markerModal").modal();
            }
          },
          dialogTarget: undefined
        },
        polyline: {
          path: RouteMarker.getModel(),
          stroke: {
            color: '#6060FB',
            weight: 3
          },
          editable: false,
          draggable: false,
          geodesic: true,
          visible: true,
          icons: [
            {
              icon: {
                path: google.maps.CIRCLE
              }
            }
          ]
        }
      });

      $("#dlgDelBtn").on('click', function (e) {
        console.log('dlgDelBtn-click!');
        if ($scope.markers.dialogTarget !== undefined) {
          RouteMarker.deleteMarker($scope.markers.dialogTarget.key);
          $scope.markers.dialogTarget = undefined;
          $scope.$evalAsync();
          $("#markerModal").modal('hide');
        }
      });

      $("#markerModal").on('hide.bs.modal', function (e) {
        console.log( "Hide dialog." );
        if ($scope.markers.dialogTarget !== undefined) {
          $scope.markers.dialogTarget.setAnimation(null);
          $scope.markers.dialogTarget = undefined;
        }
      });

    });
  }]);
