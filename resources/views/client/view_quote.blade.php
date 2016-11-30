@extends('layouts.client.index')

@section('content')
    <div class="container">
        <div class="row">
			<div class="quote_main_page animate-show" ng-show="showQuoteMainPage">
				@include('client.includes.quote_main_page')			
			</div>
			@foreach ($quoted_devices as $quoted_device)
				@include('client.includes.quoted_device')
			@endforeach
        </div>
    </div>
@endsection

@section('scripts')
<script>
	var app = angular.module('myApp', ['ngAnimate', 'countTo'], function($interpolateProvider) {
        $interpolateProvider.startSymbol('<%');
        $interpolateProvider.endSymbol('%>');
    });
	
	app.controller('myCtrl', function($scope, $http, $timeout) {
		$scope.showQuoteMainPage = true;
		$scope.showQuotedDeviceBlock = false;
		$scope.deviceToShow = [];
		
		$scope.showQuotedDevice = function (quotedDevice) {
			$scope.showQuoteMainPage = false;
			
			$timeout(function () {
				$scope.showQuotedDeviceBlock = true;
				$scope.deviceToShow[quotedDevice] = true;
			}, 500);
		}
		
		$scope.saveCalculation = function (deviceId) {
			$scope.showQuotedDeviceBlock = false;
			$scope.deviceToShow[deviceId] = false;
			
			$timeout(function () {
				$scope.showQuoteMainPage = true;
			}, 500);
			
			$http.post(
					'{{ url('/save-calculation', $quote->id) }}',
					 {
						 selected_accessories: $scope.selectedAccessoriesWithPrices 
					 }
				 )
				.then(
					function(response) {
						console.log(response.data);
					},					
					function(response) {
						console.log(response);
					}
				);
		}
		
		/* Calculating prices */
		
		@if (array_key_exists($quoted_device->id, $quote->prices))
			@if (array_key_exists('base', $quote->prices[$quoted_device->id]))
				$scope.basePrice = {{ $quote->prices[$quoted_device->id]['base'] }} 
			@else				
				$scope.basePrice = {};
			@endif				
		@else
			$scope.basePrice = {};
		@endif
		
		
		@if ($quote->selected_accessories != null)
			$scope.selectedAccessoriesWithPrices = {
				@foreach ($quote->selected_accessories as $device_id => $selected_accessories)
					 
						'{{ $device_id }}' : {
							@foreach ($selected_accessories as $accessory_id => $accessory_price)
								'{{ $accessory_id }}':{{ $accessory_price }},
							@endforeach
							},
					 
				@endforeach
			}; 
		@else			
			$scope.selectedAccessoriesWithPrices = {};
		@endif		
	 
		
		$scope.outrightPrice = $scope.basePrice;
		$scope.prevOutrightPrice = $scope.outrightPrice; 
		
		angular.forEach($scope.selectedAccessoriesWithPrices, function(selectedAccessoriesWithPrices, deviceId) {
			angular.forEach(selectedAccessoriesWithPrices, function(accessoryPrice, accessoryId) {
				if (accessoryPrice == 0) {
					delete $scope.selectedAccessoriesWithPrices[deviceId][accessoryId];
				}
				$scope.outrightPrice += accessoryPrice;
			});
		});
		
		$scope.rates = {
			fmv: {
				3000: {
					1: 0.0833, 2: 0.0444, 3: 0.0302, 4: 0.0253, 5: 0.0215
				},
				10000: {
					1: 0.820, 2: 0.0424, 3: 0.0275, 4: 0.0223, 5: 0.0187
				},
				250000: {
					1: 0.0813, 2: 0.0419, 3: 0.0272, 4: 0.0221, 5: 0.0185
				},
			},
			oneOut: {
				3000: {
					1: 0.0931, 2: 0.0502, 3: 0.0355, 4: 0.0289, 5: 0.0243
				},
				10000: {
					1: 0.0907, 2: 0.0479, 3: 0.0325, 4: 0.0256, 5: 0.0212
				},
				250000: {
					1: 0.0891, 2: 0.0469, 3: 0.0318, 4: 0.0249, 5: 0.0208
				},
			}
		};
		
		
		$scope.outrightPricesWithRates = {
			fmv: {},
			oneOut: {}
		};
		
		$scope.countRates = function () {
			if ($scope.outrightPrice < 3000) {
				$scope.priceTerm = 3000;
			} else if ($scope.outrightPrice < 10000) {
				$scope.priceTerm = 10000;
			} else if ($scope.outrightPrice < 250000) {
				$scope.priceTerm = 250000;
			}
			angular.forEach($scope.rates.fmv[$scope.priceTerm], function (rate, numberOfYears) {
				$scope.outrightPricesWithRates.fmv[numberOfYears] = Math.ceil($scope.outrightPrice * rate);
			});
			angular.forEach($scope.rates.oneOut[$scope.priceTerm], function (rate, numberOfYears) {
				$scope.outrightPricesWithRates.oneOut[numberOfYears] = Math.ceil($scope.outrightPrice * rate);
			});
		}
		
		$scope.countRates();
		
		$scope.recalculatePrice = function(deviceId) {
			$scope.outrightPrice = $scope.basePrice;
			angular.forEach($scope.selectedAccessoriesWithPrices[deviceId], function(accessoryPrice, accessoryId) {
				if (accessoryPrice == 0) {
					delete $scope.selectedAccessoriesWithPrices[deviceId][accessoryId];
				}
				$scope.outrightPrice += accessoryPrice;
			});
			$scope.countRates();
			$timeout(function() {
				$scope.prevOutrightPrice = $scope.outrightPrice;
			}, 700);
		}
		
	});
</script>
@endsection