@extends('admin.main')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="panel panel-default dashboard_edit_quote" ng-app="myApp" ng-controller="myCtrl">
					<div class="panel-heading">
						Edit quote #{{ $quote->id }}
					</div>
					
					<div class="panel-body">
						<form action="{{url('/admin/save-quote')}}" method="POST" id="editQuote">
							 
							@include('admin.includes.edit_quote.edit_user.add_user')
							 
							@include('admin.includes.edit_quote.add_device')
							
							<div class="panel-group" id="accordion">
								@include('admin.includes.edit_quote.device_template')
							</div>
							
							<input id="quoted_devices_hidden" type="hidden" name="quoted_devices_hidden" value="<% quotedDevicesIds %>" />
							{{ Form::hidden('quote_id', $quote->id)  }}
							{{ Form::hidden('quote_status', $quote->status)  }}
							{{ csrf_field() }}
							<br>
							<button type="submit" class="btn btn-primary">
							Save
							</button>
						</form>
					</div>
				</div>
            </div>
        </div>
    </div>
@endsection

@section('scripts')
	<script>
		var app = angular.module('myApp', [], function($interpolateProvider) {
			$interpolateProvider.startSymbol('<%');
			$interpolateProvider.endSymbol('%>');
		});
		app.controller('myCtrl', function($scope, $window, $http) {
			
				 
			@if (count($accessories) > 0)			
				$scope.accessoriesList = {
					@foreach ($accessories as $accessory)
						'{{ $accessory->id }}' : {!! $accessory !!},
					@endforeach
				};
			@else
				$scope.accessoriesList = {};
			@endif
			
			$scope.chosenAccessoriesList = {};
			
			$scope.moveAccessories = function (deviceId, accessoryId, isChecked){
				if (typeof $scope.chosenAccessoriesList[deviceId] == 'undefined') $scope.chosenAccessoriesList[deviceId] = {};
				if(isChecked) {
					$scope.chosenAccessoriesList[deviceId][accessoryId] = $scope.accessoriesList[accessoryId];
				} else {
					delete $scope.chosenAccessoriesList[deviceId][accessoryId];
				}
			}
			
			@if ($quote->added_accessories != null)
				$scope.selectedAccessories = {
					@foreach ($quote->added_accessories as $device_id => $accessories)
						'{{ $device_id }}' : {
							@foreach ($accessories as $accessory)
							'{{ $accessory }}': true,
							@endforeach
						},
					@endforeach
				};
			@else
				$scope.selectedAccessories = {};
			@endif
			
			angular.forEach($scope.selectedAccessories, function(accessories, deviceId) {
				angular.forEach(accessories, function(value, accessoryId) {					
					$scope.moveAccessories(deviceId, accessoryId, $scope.selectedAccessories[deviceId][accessoryId]);			
				});
			});
			
			$scope.acessoryStateChanged = function (deviceId, accessoryId) {
				
				$scope.moveAccessories(deviceId, accessoryId, $scope.selectedAccessories[deviceId][accessoryId]);
			
			};
			
			$http.get("{{ url ('/admin/get-devices') }}")
					.then(function(response) {
						$scope.devicesList = response.data.devices_to_quote;
						//console.log($scope.devicesList);
						$scope.mostQuotedDevicesIds = response.data.most_quoted_devices_ids;
						
						$scope.prices = $scope.devicesList;
		

					});
					
			@if ($quote->prices != null)
				$scope.prices = {
					@foreach ($quote->prices as $device_id => $prices)
						'{{ $device_id }}' : {
							@foreach ($prices as $price_name => $price_value)
							'{{ $price_name }}': '{{ $price_value }}',
							@endforeach
						},
					@endforeach
				}; 
			@endif
			
			console.log($scope.prices)		;
			$scope.selectDevice = function($index) {
				$scope.selectedDevice = $index;
			}
			
			
			
			/* Injecting options from Blade */
			$scope.addedDevices = {
				@if ($quote->devices != null)
					@foreach ($quote->devices as $device)
						"{{ $device->id }}" : {!!json_encode($device)!!},
					@endforeach
				@endif
			};
			$scope.quotedDevicesIds = Object.keys($scope.addedDevices);
			
			@if ($quote->devices_desc != null)
				$scope.devicesDescriptions = {
					@foreach ($quote->devices_desc as $device_id => $devices_desc)
						'{{ $device_id }}' : {
							@foreach ($devices_desc as $name => $value)
							'{{ $name }}': true,
							@endforeach
						},
					@endforeach
				};
			@else
				$scope.devicesDescriptions = {};
			@endif
			
			
			$scope.addDeviceToQuote = function () {
				if (	$scope.selectedDevice != null
						&& typeof $scope.addedDevices[$scope.selectedDevice] === 'undefined'
						&& Object.keys($scope.addedDevices).length < 4 // max allowed devices for a quote
				) {
					$scope.addedDevices[$scope.selectedDevice] = $scope.devicesList[$scope.selectedDevice - 1];
				}
				$scope.selectedDevice = null;
				
				$scope.quotedDevicesIds = Object.keys($scope.addedDevices);
				jQuery('#quoted_devices_hidden').val($scope.quotedDevicesIds);
				jQuery('#quoted_devices_hidden').triggerHandler('change');
				
			}
			
			
			$scope.removeDevice = function ($index) {
				/*console.log($index);
				 console.log($scope.addedDevices);
				 console.log($scope.addedDevices[$index]);*/
				delete $scope.addedDevices[$index];
				$scope.quotedDevicesIds = Object.keys($scope.addedDevices);
			}
			 
		});
	</script>
@endsection