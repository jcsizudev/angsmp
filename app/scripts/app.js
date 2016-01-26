'use strict';

/**
 * @ngdoc overview
 * @name angsmpApp
 * @description
 * # angsmpApp
 *
 * Main module of the application.
 */
angular
  .module('angsmpApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'uiGmapgoogle-maps'
  ])
  .config(['$routeProvider', 'uiGmapGoogleMapApiProvider', function ($routeProvider, GoogleMapApi) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
    GoogleMapApi.configure({
      // key: 'your api key',
      // v: '3.20',
      libraries: 'weather,geometry,visualization'
    });
  }]);
