<div class="detailed_device_block animate-show" ng-show="showQuotedDeviceBlock && deviceToShow[{{ $quoted_device->id }}]" style="margin-bottom:500px;">
	<div id="device_{{ $quoted_device->id }}">		
		<h2 style="text-align: center; font-weight:bold; text-transform: uppercase;">
			YOUR QUOTE OF {{ $quoted_device->model }}
		</h2>
		
		<div class="detailed_device_header_block">
			<div class="header" style="width:100%; float:left; margin-bottom:20px;">
				<div class="col-md-6 device_title">
					<div style="padding-bottom:5px; font-size: 18px; color: #51b2df; font-weight: bold;
					 ">
						Basic Copier Specs
					</div>
				</div>
				<div class="col-md-6">
				</div>
			</div>
			<div class="description" style="min-height:300px;">
				<div class="col-md-6 device_parameters">
					<div class="parameters_block">
						@if (array_key_exists($quoted_device->id, $quote->devices_desc))
							@foreach ($quote->devices_desc[$quoted_device->id] as $device_param_name => $device_param_value)
								@if ($device_param_name != 'pdf')
									<div class="parameter">
										<div class="col-md-4 device_param_name">
											{{ $device_param_name }}&nbsp;
										</div>
										<div class="col-md-8 device_param_value">
											{{ $device_param_value }}&nbsp;
										</div>
									</div>
								@endif
							@endforeach
						@endif
					</div>
					<div class="parameters_block">				
						<div class="parameter">
							<div class="col-md-6 device_param_name">
								Service Base Cost:
							</div>
							<div class="col-md-6 device_param_value">
							@if (array_key_exists($quoted_device->id, $quote->prices))
								@if (array_key_exists('base', $quote->prices[$quoted_device->id]))
									{{ $quote->prices[$quoted_device->id]['base'] }}&nbsp;
								@endif
							@endif
							</div>
						</div>				
						@if ( $quoted_device->color_or_mono == 'color')
							<div class="parameter">
								<div class="col-md-6 device_param_name">
									Includes {} Color Pages
								</div>
								<div class="col-md-6 device_param_value">
									1&nbsp;
								</div>
							</div>
						@endif								
						<div class="parameter">
							<div class="col-md-6 device_param_name">								
								Includes {} B&W Pages
							</div>
							<div class="col-md-6 device_param_value">
								2&nbsp;
							</div>
						</div>
					</div>	
					<div class="parameters_block">	
						@if ( $quoted_device->color_or_mono == 'color')				
							<div class="parameter">
								<div class="col-md-4 device_param_name">
									Additional Color Prints
								</div>
								<div class="col-md-8 device_param_value">
									@if (array_key_exists($quoted_device->id, $quote->prices))
										@if (array_key_exists('cost_per_color_page', $quote->prices[$quoted_device->id]))
											{{ $quote->prices[$quoted_device->id]['cost_per_color_page']*100 }} cents/page
										@endif
									@endif
								</div>
							</div>	
						@endif
						<div class="parameter">
							<div class="col-md-4 device_param_name">
								Additional Color Prints
							</div>
							<div class="col-md-8 device_param_value">
									@if (array_key_exists($quoted_device->id, $quote->prices))
										@if (array_key_exists('cost_per_mono_page', $quote->prices[$quoted_device->id]))
											{{ $quote->prices[$quoted_device->id]['cost_per_mono_page']*100 }} cents/page
										@endif
									@endif
							</div>
						</div>	
					</div>	
				</div>
				<div class="col-md-6 device_photo">
					<div class="image_block">
						<img src="{{ url('/adm/img/devices', $quoted_device->image) }}" />
					</div>
					<div class="price_and_pdf">
						<div class="outright_price">
							<span ng-if="outrightPrice > 0">
								Outright Purchase Price: $
								<span count-to="<% outrightPrice %>" value="<% prevOutrightPrice %>" duration="1"></span>
							</span>
						</div>
						@if (array_key_exists($quoted_device->id, $quote->devices_desc))
							@if (array_key_exists('pdf', $quote->devices_desc[$quoted_device->id]))
								<a href="#" class="view_pdf">
									<i class="fa fa-arrow-circle-o-down" aria-hidden="true"></i>
									View PDF
								</a>
							@endif
						@endif
						<div class="clearfix">
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<div class="detailed_device_calc_block">
			<form>
				<div class="col-md-6 detailed_device_options">
					<h4>
						Purchase and Lease Options for {{ $quoted_device->model }}
					</h4>
					
					<strong ng-if="outrightPrice > 0">
						Outright Purchase Price: $
						<span count-to="<% outrightPrice %>" value="<% prevOutrightPrice %>" duration="1"></span>
					</strong>
					<br>
					<br>  
					@if (array_key_exists($quoted_device->id, $accessories_for_devices))
						@foreach ($accessories_for_devices[$quoted_device->id] as $accessory)
							<div class="accessories_for_devices_block">
								<input type="checkbox"
										class="accessories_for_devices checkbox"
										id="{{ $accessory->id }}"
										value="{{ $accessory->id }}"
										@if ($quote->selected_accessories)
										@if (array_key_exists($quoted_device->id, $quote->selected_accessories))
											ng-checked="{{ array_key_exists($accessory->id, $quote->selected_accessories[$quoted_device->id]) }}"
										@endif
										@endif
										ng-model="selectedAccessoriesWithPrices[{{ $quoted_device->id }}][{{ $accessory->id }}]"
										ng-true-value="{{ $accessory->price }}" ng-false-value="0"
									   ng-click="recalculatePrice({{ $quoted_device->id }})">
								<label for="{{ $accessory->id }}">{{ $accessory->description }} | Price: {{ $accessory->price }}</label>
							</div>
						@endforeach
					@endif
				</div>
				<div class="col-md-6 detailed_device_calculation">
					<h4>
						FMV (Lease to Return Rates)
					</h4>
					Using Outright Purchase + Accessories
					<div class="fmv_table calc_table">
						<div class="table_header">
							<div class="fmv_cell">1 Year</div>
							<div class="fmv_cell">2 Years</div>
							<div class="fmv_cell">3 Years</div>
							<div class="fmv_cell">4 Years</div>
							<div class="fmv_cell">5 Years</div>
						</div>
						<div class="table_body">
							<div class="fmv_cell"
								 ng-repeat="fmvPriceWithRate in outrightPricesWithRates.fmv">
								$<% fmvPriceWithRate %>
							</div>
						</div>
					</div>
					<h4>
						$1 Out Lease (Lease to Own)
					</h4>
					<div class="dollar_out_table calc_table">
						<div class="table_header">
							<div class="fmv_cell">1 Year</div>
							<div class="fmv_cell">2 Years</div>
							<div class="fmv_cell">3 Years</div>
							<div class="fmv_cell">4 Years</div>
							<div class="fmv_cell">5 Years</div>
						</div>
						<div class="table_body">
							<div class="fmv_cell"
								 ng-repeat="oneOutPriceWithRate in outrightPricesWithRates.oneOut">
								$<% oneOutPriceWithRate %>
							</div>
						</div>
					</div>
					
					<div class="submit_buttons">
						<div class="button" ng-if="1==0">
							Re-Calculate
						</div>
						{{ csrf_field() }}
						<div class="button" ng-click="saveCalculation({{ $quoted_device->id }})">
							Accept Proposal
						</div>
					</div>
				</div>
			</form>
		</div>
		
	</div>
</div>