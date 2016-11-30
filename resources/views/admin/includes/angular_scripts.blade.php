<script src="{{asset('js/angular.min.js')}}"></script>
<script src="{{asset('js/angular-route.js')}}"></script>

<script>
	var app = angular.module('myApp', ['ngRoute']);
	app.config(function($routeProvider) {
		$routeProvider
			.
            when('/', {
                templateUrl: 'templates/home.html',
                controller: 'myCtrl'
            });
	});
	app.controller('myCtrl', function($scope,$http){
		$scope.firstName = 'John';
	});
</script>