<!DOCTYPE html>
<html lang="en">
<head>
	<base href="/step/tasks/pahoda/quote/" />
	@include('client.includes.head')
</head>

<body ng-app="clientSide">

	<div id="app">
		@include('client.includes.menu')

		<ng-view></ng-view>
	</div>


	<script>
		window.Laravel = <?php echo json_encode([
				'csrfToken' => csrf_token(),
		]); ?>

	</script>


	<script src="{{asset('public/js/assets/angular.min.js')}}"></script>
	<script src="{{asset('public/js/assets/angular-route.js')}}"></script>
	<script src="{{asset('public/js/assets/angular-touch.min.js')}}"></script>
	<script src="{{asset('public/js/assets/angular-animate.min.js')}}"></script>
	<script src="{{asset('public/js/assets/angular.count-to.js')}}"></script>
	<script src="{{asset('public/js/assets/ui-bootstrap.js')}}"></script>

	<!-- <script src="{{asset('public/js/assets/jquery.min.js')}}"></script>
	<script src="{{asset('public/js/assets/jquery-ui.min.js')}}"></script>
	<script src="{{asset('public/js/assets/bootstrap.min.js')}}"></script>
	<script src="{{asset('public/js/assets/slimscroll.min.js')}}"></script>-->

	<script src="{{asset('public/js/app/client/services.js')}}"></script>
	<script src="{{asset('public/js/app/client/controllers.js')}}"></script>
	<script src="{{asset('public/js/app/client/main.js')}}"></script>

</body>
</html>
