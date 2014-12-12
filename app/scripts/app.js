'use strict';

angular.module('twitChatApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'angularjs.media.directives',
  'bardo.directives',
  'ui.bootstrap',
  'angular-underscore',
  'luegg.directives'

])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
