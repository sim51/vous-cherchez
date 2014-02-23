'use strict';

/* App Module */
var app = angular.module('odd2014', ['ngRoute', 'overpass', 'leaflet-directive', 'jmSelectSearchable']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/:name', {templateUrl: 'partials/map.html', controller: IndexCtrl})
        .when('/error', {templateUrl: 'partials/error.html', controller: ErrorCtrl})
        .otherwise({redirectTo: '/recycling'});
});