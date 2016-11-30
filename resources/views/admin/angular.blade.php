<!DOCTYPE html>
<html lang="en">
<head>
	<base href="/step/pahoda/quote/adm/" />
    @include('admin.includes.head')
</head>

<body ng-app="quotesDashboard">

    <div id="app">
        @include('admin.includes.menu')
        @yield('content')
		
		<ng-view></ng-view>	
    </div>

    <script>
        window.Laravel = <?php echo json_encode([
                'csrfToken' => csrf_token(),
        ]); ?>
    </script>

	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
	<script src="{{asset('public/js/assets/jquery-ui.min.js')}}"></script>
	<script src="{{asset('public/js/assets/bootstrap.min.js')}}"></script>
	<script src="{{asset('public/js/assets/angular.min.js')}}"></script>
	<script src="{{asset('public/js/assets/angular-route.js')}}"></script>
	<script src="{{asset('public/js/assets/angular-touch.min.js')}}"></script>
	<script src="{{asset('public/js/assets/angular-animate.min.js')}}"></script>
	<script src="{{asset('public/js/assets/angular-animate.min.js')}}"></script>
	<script src="{{asset('public/js/assets/ui-bootstrap.js')}}"></script>
	<script src="{{asset('public/js/assets/slimscroll.min.js')}}"></script>

	<script>
		jQuery(function(){
			/* Validate */
			
			/*var validator = jQuery("#editQuote").validate({
				ignore: [],
				rules: {
					quoted_devices_hidden: "required",
					client_username: "required",
					client_company_name: "required",
					client_email: "required",
				},
				messages: {
					quoted_devices_hidden: "At lease one device should be added to the quote",
					client_username: "Please enter user name",
					client_company_name: "Please enter company name",
					client_email: "Please enter a valid email address"
				},
				submitHandler: function (form) {
					form.submit();
				}
			});
			
			jQuery('#quoted_devices_hidden').on("change", function(){
				val = jQuery(this).val();
				if (val != '' && val != '[]') {
					validator.resetForm();
				}
			});*/
			
			/* Edit quote form -- user list */
			/*jQuery( "#clients_list .capsule_client_block" ).click(function() {
				if (jQuery( this ).hasClass( "ui-selected" )) {
					jQuery('#user_type').val('new');
					jQuery('#client_username').val('');
					jQuery('#client_company_name').val('');
					jQuery('#client_email').val('');
				} else {
					username = jQuery( this ).find('#capsule_username').text().trim();
					company_name = jQuery( this ).find('#capsule_company_name').text().trim();
					email = jQuery( this ).find('#capsule_email').text().trim();
					
					jQuery('#user_type').val('capsule');
					jQuery('#client_username').val(username);
					jQuery('#client_company_name').val(company_name);
					jQuery('#client_email').val(email);
					validator.resetForm();
				}
				
				jQuery ( "#clients_list .capsule_client_block" ).not(this).removeClass( "ui-selected" );
				jQuery( this ).toggleClass( "ui-selected" );
			});
			jQuery( "#editQuote #user_type" ).change(function() {
				if (jQuery( this ).val() == 'new') {
					jQuery( '#editQuote #client_username').val('');
					jQuery( '#editQuote #client_company_name').val('');
					jQuery( '#editQuote #client_email').val('');
				}
			});*/
			
				
			/* SlimScroll */
			jQuery('#clients_list').slimScroll({
				height: '280px'
			});
			jQuery('#devices_list').slimScroll({
				height: '280px'
			});
			jQuery('.accessories_list').slimScroll({
				height: '250px'
			});
			jQuery('.chosen_accessories_list').slimScroll({
				height: '250px'
			});
			 
			jQuery("#add_device" ).click(function() {
				jQuery('.accessories_list').slimScroll({
					height: '250px'
				});
				jQuery('.chosen_accessories_list').slimScroll({
					height: '250px'
				});
			});
		});
	</script>
	<script src="{{asset('public/js/app/services.js')}}"></script>
	<script src="{{asset('public/js/app/controllers.js')}}"></script>
	<script src="{{asset('public/js/app/main.js')}}"></script>

</body>
</html>
