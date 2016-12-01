(function() {

    'use strict';

    var app = angular.module('quotesDashboard', ['ngRoute', 'ngAnimate', 'ngTouch', 'ui.bootstrap', 'mainCtrl', 'QuoteService']);

    app.config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'templates/index.html'
            })
            .when('/devices', {
                templateUrl: 'templates/devices1.html'
            })
            .when('/users', {
                templateUrl: 'templates/users.html'
            })
            .when('/quotes', {
                templateUrl: 'templates/quotes.html'
            })
            .when('/edit_quote/:quote', {
                templateUrl: 'templates/quote.html'
            })
            .otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode(true);
    });

})();