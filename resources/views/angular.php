

<!DOCTYPE html>
<html lang="en">
<head>

</head>
<body>
 

<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js"></script>
<script src="http://code.angularjs.org/1.2.3/angular-route.js"></script>
<script>
	var app = angular.module('app', [ 'ngRoute' ]);
	app.config(function($routeProvider) {
	$routeProvider
	.when('/', {
	templateUrl : 'templates/home.html',
	controller  : 'mainController'
	})
	.when('/about', {
	templateUrl : 'templates/about.html',
	controller  : 'aboutController'
	})

	.when('/contact', {
	templateUrl : 'templates/contact.html',
	controller  : 'contactController'
	});
	});
</script>
</body>
</html>
