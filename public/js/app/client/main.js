(function() {

    'use strict';

    var clientApp = angular.module('clientSide', ['ngRoute', 'ngAnimate', 'countTo', 'ngTouch', 'ui.bootstrap', 'clientCtrl', 'ClientQuoteService']);

    clientApp.config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'public/templates/client/index.html'
            })
            .when('/quote/:quote', {
                templateUrl: 'public/templates/client/view_quote.html'
            })
            .otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode(true);
    });

})();