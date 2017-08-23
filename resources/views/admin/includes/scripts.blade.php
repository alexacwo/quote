<!-- Scripts -->

<script src="{{asset('public/js/assets/jquery/jquery.min.js')}}"></script>
<script src="{{asset('public/js/assets/jquery/jquery-ui.min.js')}}"></script>
<script src="{{asset('public/js/assets/jquery/jquery.validate.min.js')}}"></script>
<script src="{{asset('public/js/assets/slimscroll.min.js')}}"></script>
<script src="{{asset('public/js/assets/bootstrap.min.js')}}"></script>

<script> 
	jQuery(function(){
		/* Validate */
		
		var validator = jQuery("#editQuote").validate({
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
		});
		/* Edit quote form -- user list */
		jQuery( "#clients_list .capsule_client_block" ).click(function() {
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
		});
		
			
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
		
		/* Edit quote form -- device list */
		jQuery( ".quoted_device_block" ).click(function() {
			jQuery ( ".quoted_device_block" ).not(this).removeClass( "ui-selected" );
			jQuery( this ).toggleClass( "ui-selected" );
		});
		
		jQuery("#add_device" ).click(function() {
			jQuery('.accessories_list').slimScroll({
				height: '250px'
			});
			jQuery('.chosen_accessories_list').slimScroll({
				height: '250px'
			});
		});
		
	
	});/*
	 function moveAccessories(deviceId, accessoryId, isChecked) {
		 console.log(deviceId + ',' + accessoryId);
		 
				//console.log('#accessory_' + deviceId + '_' + accessoryId);
				el = jQuery('#accessory_' + deviceId + '_' + accessoryId).parent('.accessory_block');
				  
				if(isChecked){ //If it is checked
					el.hide();
					el.appendTo(el.parents('.accessories_block').find('.chosen_accessories_list')).show('slow');;
				} else {
					 
					el.hide();
					el.appendTo(el.parents('.accessories_block').find('.accessories_list')).show('slow');;
				}
			}*/
</script>