(function() {

    'use strict';

    angular
        .module('mainCtrl', [])
        .controller('QuotesController', function($scope, $http, $window, Quotes){
            Quotes
                .getAll()
                .success(function(response) {
                    $scope.quotes = response;
                });
			$scope.prepareQuote = function() {				
				Quotes
					.save()
					.success(function(response) {
						$window.location.href = 'edit_quote/' + response.guid;
					});
			}
        })
        .controller('QuoteController', function($scope, $http, $routeParams, Quote, Device){
            Quote
                .get($routeParams.quote)
                .success(function(response) {
                    $scope.quote = response; 
					//console.log($scope.quote);
                    /*if ($scope.quote.user.user_type == null) {
                        $scope.templateName = 'edit_user/create_user.html';
                    } else {
                        $scope.templateName = 'edit_user/existing_user.html';
                    }*/
					
					$scope.addedDevices = {};
					angular.forEach($scope.quote.devices, function(device, index) {
						$scope.addedDevices[device.id] = device;
					});
					
					//console.log($scope.addedDevices);
					
					$scope.quotedDevicesIds = Object.keys($scope.addedDevices);
					$scope.addDeviceToQuote = function () {
						if (	$scope.selectedDevice != null
								&& typeof $scope.addedDevices[$scope.selectedDevice] === 'undefined'
								&& Object.keys($scope.addedDevices).length < 4 // max allowed devices for a quote
						) {
							$scope.addedDevices[$scope.selectedDevice] = $scope.devices[$scope.selectedDevice - 1];
						}
						$scope.selectedDevice = null;
						
						/*$scope.quotedDevicesIds = Object.keys($scope.addedDevices);
						jQuery('#quoted_devices_hidden').val($scope.quotedDevicesIds);
						jQuery('#quoted_devices_hidden').triggerHandler('change');*/
						
					}
					 
					$scope.quoteData = {};
					$scope.quoteData[$scope.quote.id] = [];
					$scope.quoteData[$scope.quote.id].user_type = $scope.quote.user != null ? $scope.quote.user.user_type : '';
					$scope.quoteData[$scope.quote.id].client_username = $scope.quote.user != null ? $scope.quote.user.name : '';
					$scope.quoteData[$scope.quote.id].client_company = $scope.quote.user != null ? $scope.quote.user.company : '';
					$scope.quoteData[$scope.quote.id].client_email = $scope.quote.user != null ? $scope.quote.user.email : '';
					
					//$scope.quoteData[$scope.quote.id].devices_desc = $scope.quote.prices;
					$scope.quoteData[$scope.quote.id].devices_desc = $scope.quote.devices_desc != null ? $scope.quote.devices_desc : {};
					$scope.quoteData[$scope.quote.id].added_accessories = $scope.quote.added_accessories != null ? $scope.quote.added_accessories : {};
					
					$scope.quoteData[$scope.quote.id].prices = $scope.quote.prices != null ? $scope.quote.prices : {};
					console.log( $scope.quote );
					console.log( $scope.quote.id );
					console.log($scope.quoteData[$scope.quote.id]);
					//$scope.quoteData[$scope.quote.id].prices = {};
                });
			
			
			$scope.saveQuote = function(quote) {
				var data = {
					status: quote.status,
					user_type: $scope.quoteData[$scope.quote.id].user_type,
					client_username: $scope.quoteData[$scope.quote.id].client_username,
					client_company: $scope.quoteData[$scope.quote.id].client_company,
					client_email: $scope.quoteData[$scope.quote.id].client_email,
					client_email: $scope.quoteData[$scope.quote.id].client_email,
					added_devices: Object.keys($scope.addedDevices),
					devices_desc: $scope.quoteData[$scope.quote.id].devices_desc,
					added_accessories: $scope.quoteData[$scope.quote.id].added_accessories,
					prices: $scope.quoteData[$scope.quote.id].prices
				};
                Quote
                    .update(quote.id, data)
                    .success(function(response) { 
                    });
			}
			
            Device
                .get()
                .success(function(response) {
                    $scope.devices = response;
                });
				
            Device
                .getMostQuoted()
                .success(function(response) {
                    $scope.mostQuotedDevicesIds = response;
                        console.log(response);
                });
				
			$scope.selectDevice = function(index) {
				$scope.selectedDevice = index;
			}
			
			
            $scope.deviceAccordionIsOpen = {};
            $scope.deviceAccordionIsOpen[0] = true;;
        })
        .controller('UsersController', function($scope, $http, User){
            User
                .get()
                .success(function(response) {
                    $scope.users = response;
                });
        })
        .controller('DevicesController', function($scope, $http, $timeout, Device, Accessory){
			
			$scope.deviceUpdated = false;

            $scope.chosenAccessoriesList = {};
            $scope.selectedAccessories = {};
            Device
                .get()
                .success(function(response) {
                    $scope.devices = response;

                    angular.forEach($scope.devices, function(device, deviceIndex) {
                        if ( device.accessories.length > 0) {
                            if (typeof $scope.chosenAccessoriesList[device.id] == 'undefined') $scope.chosenAccessoriesList[device.id] = {};
                            angular.forEach(device.accessories, function(accessoryParams, accessoryId) {
                              $scope.chosenAccessoriesList[device.id][accessoryParams.id] = accessoryParams;
                            });
                        }
                    });

                    angular.forEach($scope.chosenAccessoriesList, function(accessories, deviceId) {
                        if (typeof $scope.selectedAccessories[deviceId] == 'undefined') $scope.selectedAccessories[deviceId] = {};
                        angular.forEach(accessories, function(accessoryParams, accessoryId) {
                            $scope.selectedAccessories[deviceId][accessoryParams.id] = true;
                        });
                    });
                });
            Accessory
                .get()
                .success(function(response) {
                    $scope.accessories = response;
                });
            
            $scope.moveAccessories = function (deviceId, accessoryId, isChecked){
                if (typeof $scope.chosenAccessoriesList[deviceId] == 'undefined') $scope.chosenAccessoriesList[deviceId] = {};
                if(isChecked) {
                    $scope.chosenAccessoriesList[deviceId][accessoryId] = $scope.accessories[accessoryId - 1];
                } else {
                    delete $scope.chosenAccessoriesList[deviceId][accessoryId];
                }
            }            

            $scope.acessoryStateChanged = function (deviceId, accessoryId) {

                if (typeof $scope.selectedAccessories[deviceId] == 'undefined') $scope.selectedAccessories[deviceId] = {};
                $scope.moveAccessories(deviceId, accessoryId, $scope.selectedAccessories[deviceId][accessoryId]);

            };

            $scope.addAccessories= function(deviceId) {
                Device
                    .update(deviceId, $scope.chosenAccessoriesList[deviceId])
                    .success(function(response) {
                        $scope.deviceUpdated = true;
						$timeout( function(){
							$scope.deviceUpdated = false;
						}, 4000);
                    });
            }

            $scope.deviceAccordionIsOpen = {};
            $scope.deviceAccordionIsOpen[0] = true;
        });

})();