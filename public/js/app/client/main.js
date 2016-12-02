(function() {

    'use strict';

    var clientApp = angular.module('clientSide', ['ngRoute', 'ngAnimate', 'countTo', 'ngTouch', 'ui.bootstrap', 'clientCtrl', 'ClientQuoteService']);

	clientApp.filter('trim', function () {
		return function(value) {
			if(!angular.isString(value)) {
				return value;
			}  
			return value.replace(/^\s+|\s+$/g, '');
		};
	});

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