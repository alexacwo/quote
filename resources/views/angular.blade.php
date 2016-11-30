<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<title>111</title>

	<!-- Styles -->
	<link href="{{asset('css/custom.css')}}" rel="stylesheet">
	<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">

</head>

<body ng-app="myApp">

	<p><a href="#/">Main</a></p>

	<a href="#red">Red</a>
	<a href="#green">Green</a>
	<a href="#blue">Blue</a>

	<div ng-view></div>

	<script src="{{asset('js/angular.min.js')}}"></script>
	<script src="{{asset('js/angular-route.js')}}"></script>
	<script>
	var app = angular.module("myApp", ["ngRoute"]);
	app.config(function($routeProvider) {
		$routeProvider
		.when("/red", {
			templateUrl : "templates/red.htm"
		})
		.when("/green", {
			templateUrl : "green.htm"
		})
		.when("/blue", {
			templateUrl : "blue.htm"
		});
	});
	</script>
</body>
</html>
