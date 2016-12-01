(function() {

    'use strict';

    var app = angular.module('quotesDashboard', ['ngRoute', 'ngAnimate', 'ngTouch', 'ui.bootstrap', 'ui.slimscroll', 'mainCtrl', 'QuoteService']);
	 	
    app.config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '../public/templates/admin/index.html'
            })
            .when('/devices', {
                templateUrl: '../public/templates/admin/devices2.html'
            })
            .when('/users', {
                templateUrl: '../public/templates/admin/users.html'
            })
            .when('/quotes', {
                templateUrl: '../public/templates/admin/quotes.html'
            })
            .when('/edit_quote/:quote', {
                templateUrl: '../public/templates/admin/quote2.html'
            })
            .otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode(true);
    });

})();