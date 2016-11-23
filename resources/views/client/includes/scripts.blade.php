<!-- Scripts -->

<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.6/angular-animate.min.js"></script>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
<script src="{{asset('js/slimscroll.min.js')}}"></script>
<script> 
	jQuery(function(){
		jQuery('#devices_list').slimScroll({
			height: '500px'
		});
	});
</script> 


<script>
	var app = angular.module('myApp', ['ngAnimate'], function($interpolateProvider) {
        $interpolateProvider.startSymbol('<<');
        $interpolateProvider.endSymbol('>>');
    });
	
	app.controller('myCtrl', function($scope) {
		$scope.showQuoteMainPage = true;
		$scope.showQuotedDeviceBlock = false;
		$scope.deviceToShow = [];
		
		$scope.showQuotedDevice = function(quotedDevice) {
			$scope.showQuoteMainPage = false;
			$scope.showQuotedDeviceBlock = true;
			$scope.deviceToShow[quotedDevice] = true;
			console.log(quotedDevice);
		}
	});
</script>