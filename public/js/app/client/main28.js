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

    clientApp.config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'public/templates/client/index25.html'
            })
            .when('/quote/:quote', {
                templateUrl: 'public/templates/client/view_quote28.html'
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
												 // Alias this
								var _this = this;

								// Array of children heights
								_this.childrenHeights = [];

								// API: Allocate child, return index for tracking.
								_this.allocateMe = function(){
								  _this.childrenHeights.push(0);
								  return (_this.childrenHeights.length - 1);
								};

								// API: Update a child's height
								_this.updateMyHeight = function(index, height){
								  _this.childrenHeights[index] = height;
								};

								// API: Get tallest height
								_this.getTallestHeight = function(){
								  var height = 0;
								  for (var i=0; i < _this.childrenHeights.length; i=i+1){
									height = Math.max(height, _this.childrenHeights[i]);
								  }
								  return height;
								};

								// Add window resize to digest cycle
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
			
			
                        
                           	
          // My index allocation
          var myIndex = parent.allocateMe();

          // Get my real height by cloning so my height is not affected.
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

          // Watch my height
          scope.$watch(getMyRealHeight, function(myNewHeight){
            if (myNewHeight){
              parent.updateMyHeight(myIndex, myNewHeight);
            }
          });

          // Watch for tallest height change
          scope.$watch(parent.getTallestHeight, function(tallestHeight){
            if (tallestHeight){
              element.css('height', tallestHeight);
            }
          });
                      
						
					
        }
      };
    }
  ]);
  
  
  
})();