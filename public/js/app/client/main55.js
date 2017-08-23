(function() {

    'use strict';

    var clientApp = angular.module('clientSide',
		[
			'ui.mask',
			'ngRoute',
			'ngAnimate',
			'countTo',
			'ngTouch',
			'ui.bootstrap',
			'ui.slimscroll',
			'clientCtrl',
			'ClientQuoteService'
		]
	);

	clientApp.filter('trim', function () {
		return function(value) {
			if(!angular.isString(value)) {
				return value;
			}  
			return value.replace(/^\s+|\s+$/g, '');
		};
	});
	
	clientApp.filter('objLength', function () {
		return function(object) {
			var count = 0;

			for(var i in object){
				count++;
			}
			
			return count;
		}
	});
	
	clientApp.filter('filterOnlyAddedAccessories', function () {
		return function(input, addedAccessoriesArray) {
			var output = [];
			angular.forEach(input, function (accessory, accessoryIndex) {
				if (typeof addedAccessoriesArray[accessory.id] != 'undefined' && addedAccessoriesArray[accessory.id].status != 0 ) {
					output.push(accessory);
				}
			});
			return output;
		};
	});

    clientApp.config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'public/templates/client/index.html'
            })
            .when('/quote/:quote', {
                templateUrl: 'public/templates/client/view_quote55.html'
            })
            .when('/404', {
                templateUrl: 'public/templates/client/404.html'
            })
            .otherwise({ redirectTo: '/404' });

        $locationProvider.html5Mode(true);
    });

	clientApp
	.directive('vertilizeContainer', [
		function(){
			return {
				restrict: 'EA',
				controller: [
					'$scope', '$window' ,
					function($scope, $window ){ 
						var _this = this;

						_this.childrenHeights = [];

						_this.allocateMe = function(){
						_this.childrenHeights.push(0);
						return (_this.childrenHeights.length - 1);
						};

						_this.updateMyHeight = function(index, height){
						_this.childrenHeights[index] = height;
						};

						_this.getTallestHeight = function(){
							var height = 0;
							for (var i=0; i < _this.childrenHeights.length; i=i+1){
								height = Math.max(height, _this.childrenHeights[i]);
							}
							return height;
						};
						
						angular.element($window).bind('resize', function(){
						return $scope.$apply();
						}); 

					}
				]
			};
		}
	]);

	clientApp
	.directive('vertilize', [
		function(){
			return {
				restrict: 'EA',
				require: '^vertilizeContainer',
				link: function(scope,  element, attrs, parent){

					var myIndex = parent.allocateMe();

					var getMyRealHeight = function(){
						var clone = element.clone()
						.removeAttr('vertilize')
						.css({
							height: '',
							width: element.outerWidth(),
							position: 'fixed',
							top: 0,
							left: 0,
							visibility: 'hidden'
						});
						element.after(clone);
						var realHeight = clone.height();
						clone['remove']();
						return realHeight;
					};

					scope.$watch(getMyRealHeight, function(myNewHeight){
						if (myNewHeight){
							parent.updateMyHeight(myIndex, myNewHeight);
						}
					});

					scope.$watch(parent.getTallestHeight, function(tallestHeight){
						if (tallestHeight){
							element.css('height', tallestHeight);
						}
					});
				}
			};
		}
	]);

	clientApp
	.directive('slideToggle', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				attrs.expanded = false;
				element.bind('click', function() {
					var target = document.querySelector(attrs.slideToggle);
					var content = target.querySelector('.slideable_content');
					if(!attrs.expanded) {
						var y = content.clientHeight;
						content.style.border = 0;
						target.style.height = y + 'px';
					} else {
						target.style.height = '0px';
					}
					attrs.expanded = !attrs.expanded;
				});
			}
		}
	});
  
})();