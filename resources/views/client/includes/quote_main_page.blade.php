
				<div class="header">
					<div class="col-md-6 pahoda_header left" style="display: none;">
						<div class="pahoda_logo">
						</div>				
						<div class="official_quote">
							Official Quote
						</div>
					</div>
					
					<div class="col-md-6 pahoda_header right" style="display: none;">				
						<div class="quote_editor">
							<i class="fa fa-user" aria-hidden="true"></i>
							<strong>Jesse Harwell</strong>
						</div>				
						<div class="quote_contact_email">
							<i class="fa fa-envelope" aria-hidden="true"></i>
							<strong>
								<a href="mailto:jesse@pahoda.com">jesse@pahoda.com</a>
							</strong>
						</div>				
						<div class="quote_contact_phone">
							<i class="fa fa-phone" aria-hidden="true"></i>
							<strong>720-356-0248</strong>
						</div>
						<div class="quote_photo">
						</div>				
					</div>
				</div>
				<div style="width:100%;">
					<h2 style="text-align: center; font-weight:bold;">
						SUMMARY OF COPIER QUOTE
					</h2>
					<div id="quoted_devices_list">
						@if (1==1)
							@foreach ($quoted_devices as $quoted_device)
								<div class="device_info_block">
									<div class="header" style="width:100%; float:left; margin-bottom:30px;">
										<div class="col-md-6 device_title">
											<div style="padding-bottom:5px; font-size: 24px;">
												{{ $quoted_device->model }}
												<br>
												<div style="height:2px; width:90px; background:#51b2df;"></div>
											</div>
										</div>
										<div class="col-md-6">
										</div>
									</div>
									<div class="description" style="min-height:300px;">
										<div class="col-md-6 device_parameters" style="background:#e6e6e6; height:300px; margin-bottom: 40px; padding:60px 30px; font-size: 20px; line-height:30px;">
											{{ $quoted_device->model }}
											@if (array_key_exists ($quoted_device->id, $quote->devices_desc))
												@foreach ($quote->devices_desc[$quoted_device->id] as $device_param_name => $device_param_value)
													@if ($device_param_name != 'pdf')
														<br>{{ $device_param_name }} => {{ $device_param_value }}
													@endif
												@endforeach
											@endif
										</div>
										<div class="col-md-6 device_photo" style="background:#51b2df; height:300px; margin-bottom: 40px;">
											<img src="{{ url('/adm/img/devices', $quoted_device->image) }}" style="
			display: block;
			width: 200px;
			height: 200px;
			margin-top: -100px;
			margin-left: -100px;
			position: absolute;
			left: 50%;
			top: 50%;"/>
										</div>
									</div>
								</div>
							@endforeach
						@endif
					</div>
				</div>
				
				<div style="width:100%; margin-top:50px;">
					<h4 style="font-weight:bold; text-align:center; margin-bottom:30px;">
						Total Monthly Amounts And/Or Lease Amounts
					</h4>	
					<div class="quoted_devices_menu">
						@if (1==1)
							@foreach ($quoted_devices as $quoted_device)
								<div class="col-md-2 menu_item" ng-click="showQuotedDevice({{ $quoted_device->id }})">
									{{ $quoted_device->model }}
								</div>
							@endforeach
						@endif
					</div>
				</div>