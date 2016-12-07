(function() {

    'use strict';

    var app = angular.module('quotesDashboard',
		[
			'ngRoute',
			'ngAnimate',
			'ngSanitize',
			'ngTouch',
			'ui.bootstrap',
			'ui.slimscroll',
			'mainCtrl',
			'QuoteService'
		]
	);
	
	app.directive('file', function(Device){
		return {
			scope: {
				file: '='
				
			},
			link: function(scope, el, attrs){
				el.bind('change', function(event){
					var files = event.target.files;
					var file = files[0];
					scope.file = file ? file : {};					
					scope.$apply();
				});
			}
		};
	});
	 	
    app.config(function($routeProvider, $locationProvider, $httpProvider) {

        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.common['Pragma'] = 'no-cache';
        $routeProvider
            .when('/', {
                templateUrl: '../public/templates/admin/index.html'
            })
            .when('/devices', {
                templateUrl: '../public/templates/admin/devices4.html'
            })
            .when('/users', {
                templateUrl: '../public/templates/admin/users.html'
            })
            .when('/quotes', {
                templateUrl: '../public/templates/admin/quotes4.html'
            })
            .when('/edit_quote/:quote', {
                templateUrl: '../public/templates/admin/quote3.html'
            })
            .otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode(true);

    });

})();