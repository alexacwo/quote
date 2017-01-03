(function() {

    'use strict';

    var app = angular.module('quotesDashboard',
		[
			'ngRoute',
			'ngAnimate',
			'ngSanitize',
			'ngTouch',
			'ngAria',
			'ngMaterial',
			'ui.bootstrap',
			'ui.slimscroll',
			'mainCtrl',
			'QuoteService'
		]
	);	
	
	app.filter('removeUnderscores', function () {
		return function(value) {
			if(!angular.isString(value)) {
				return value;
			}  
			return value.replace('_', ' ');
		};
	});
	
	app.filter("showNothingIfQueryIsBlank", function(){ return function(object, query){
		if(!query)
			return {}
		else
			return object;
	}});
     
	app.filter('getById', function() {
		return function(input, id) {
			var i = 0, len = input.length;
			for (; i < len; i++) {
				if (input[i].id === id) {
					return input[i];
				}
			}
			return null;
		}
	}); 
	
	/*app.directive('partNumberLookup', ['Accessory', '$timeout', function(Accessory, $timeout) {
		return {
			restrict: 'A',	
			link: function(scope, el, attrs){
				var filterTextTimeout;
				
				 
				el.on('keyup', function () {
					 
					var valueToSearch = el.val();
					if (filterTextTimeout) $timeout.cancel(filterTextTimeout);					
					
					if (el.data('old-value') != el.val()) {
						console.log(scope.partNumberLookup);
						console.log(el.val());
						filterTextTimeout = $timeout(function() {
							length = scope.accessories.length;
							for(var i = 0; i < length; i++) { 
								if (scope.accessories[i].part_number == valueToSearch) {
									scope.searchResultText  = 'found';
									scope.foundAccessory = scope.accessories[i];
									
									scope.$apply();
									console.log(scope.foundAccessory);
									break;
								} else {
									scope.searchResultText  = 'notFound';						
								}
							}
						}, 1000);
					}
				});
									
				scope.loadAccessoryData = function(accessory, foundAccessory) {
					
					var index = scope.deviceAccessories.indexOf(accessory);
					
					scope.deviceAccessories[index].description  = foundAccessory.description;
					scope.deviceAccessories[index].cost  = foundAccessory.cost;
					scope.deviceAccessories[index].price  = foundAccessory.price;
					
					scope.searchResultText = false;
				}
			}
		}
	}]);*/

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
                templateUrl: '../public/templates/admin/index5.html'
            })
            .when('/devices', {
                templateUrl: '../public/templates/admin/devices5.html'
            })
            .when('/edit-device/:device', {
                templateUrl: '../public/templates/admin/edit_device5.html'
            })
            .when('/users', {
                templateUrl: '../public/templates/admin/users5.html'
            })
            .when('/quotes', {
                templateUrl: '../public/templates/admin/quotes5.html'
            })
            .when('/edit-quote/:quote', {
                templateUrl: '../public/templates/admin/edit_quote8.html'
            })
            .otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode(true);

    });

})();