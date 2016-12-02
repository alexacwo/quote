(function() {

    'use strict';

    angular
        .module('mainCtrl', [])
        .controller('QuotesController', function($scope, $http, $window, Quotes){
            Quotes
                .getAll()
                .success(function(response) {
                   	$scope.quotes = response;
					console.log(response);

					$scope.prepareQuote = function() {
						Quotes
							.save()
							.success(function(response) {
								$window.location.href = 'edit_quote/' + response.guid;
							});
					}

					$scope.unpublishQuote = function(quoteId) {
						Quotes
							.unpublish(quoteId)
							.success(function(response) {
								console.log(response);
								//$window.location.href = 'quotes';
							});
					}

				});
        })
        .controller('QuoteController', function($scope, $http, $window, $location, $routeParams, Quote, Device, anchorSmoothScroll){
            Quote
                .get($routeParams.quote)
                .success(function(response) {

					Quote
						.getCapsuleUsers()
						.success(function(response) {
							$scope.capsuleUsers = response;
							//console.log($scope.capsuleUsers);

							jQuery('#clients_list').slimScroll({
								height: '280px'
							});

							$scope.selectCapsuleUser = function(capsuleUser) {
								$scope.selectedCapsuleUser = capsuleUser.id;

								$scope.quoteData[$scope.quote.id].user_type = 'capsule';

								$scope.quoteData[$scope.quote.id].client_username = typeof capsuleUser.firstName != 'undefined' ? capsuleUser.firstName + ' ' : '';
								$scope.quoteData[$scope.quote.id].client_username += typeof capsuleUser.lastName != 'undefined' ? capsuleUser.lastName : '';
								$scope.quoteData[$scope.quote.id].client_company = typeof capsuleUser.organisationName != 'undefined' ? capsuleUser.organisationName + ' ' : '';
								$scope.quoteData[$scope.quote.id].client_email = typeof capsuleUser.contacts.email.emailAddress != 'undefined' ? capsuleUser.contacts.email.emailAddress + ' ' : '';
							}

						});

					$scope.quote = response;

					console.log(response);
					
					$scope.addedDevices = {};
					angular.forEach($scope.quote.devices, function(device, index) {
						$scope.addedDevices[device.id] = device;
					});
					
					//console.log($scope.addedDevices);

					$scope.quoteData = {};
					if (typeof $scope.quoteData[$scope.quote.id] != 'undefined') $scope.quoteData[$scope.quote.id].user_type == quote.user.user_type;
					$scope.updateDevicePrices = function() {
						angular.forEach($scope.addedDevices, function(device, deviceId) {
							
                            if (typeof $scope.quoteData[$scope.quote.id].prices[deviceId] == 'undefined') $scope.quoteData[$scope.quote.id].prices[deviceId] = {};
							  
							if (typeof $scope.quote.prices != 'undefined' && $scope.quote.prices != null) {
								if (typeof $scope.quote.prices[deviceId] != 'undefined') {
									$scope.quoteData[$scope.quote.id].prices[deviceId] = $scope.quote.prices[deviceId];
								}
							} 
							else {
								$scope.quoteData[$scope.quote.id].prices[deviceId].base = device.base;
								$scope.quoteData[$scope.quote.id].prices[deviceId].cost_per_color_page = device.cost_per_color_page;
								$scope.quoteData[$scope.quote.id].prices[deviceId].cost_per_mono_page = device.cost_per_mono_page;
							}				
						});
						console.log($scope.quoteData[$scope.quote.id].prices);
					}
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
						$scope.updateDevicePrices();
					}
					 
					$scope.quoteData = {};
					$scope.quoteData[$scope.quote.id] = [];
					$scope.quoteData[$scope.quote.id].user_type = $scope.quote.user != null ? $scope.quote.user.user_type : 'new';
					$scope.quoteData[$scope.quote.id].client_username = $scope.quote.user != null ? $scope.quote.user.name : '';
					$scope.quoteData[$scope.quote.id].client_company = $scope.quote.user != null ? $scope.quote.user.company : '';
					$scope.quoteData[$scope.quote.id].client_email = $scope.quote.user != null ? $scope.quote.user.email : '';
					
					$scope.quoteData[$scope.quote.id].devices_desc = $scope.quote.devices_desc != null ? $scope.quote.devices_desc : {};
					$scope.quoteData[$scope.quote.id].added_accessories = $scope.quote.added_accessories != null ? $scope.quote.added_accessories : {};
					
					// If there is user-corrected price for this device, get the price from the device parameters
					$scope.quoteData[$scope.quote.id].prices = {};
					$scope.updateDevicePrices();
					//$scope.quoteData[$scope.quote.id].prices = $scope.quote.prices != null ? $scope.quote.prices : {};
					
					$scope.changedUserType = function(user_type) {
						
						$scope.selectedCapsuleUser = null;
						$scope.quoteData[$scope.quote.id].client_username = '';
						$scope.quoteData[$scope.quote.id].client_company = '';
						$scope.quoteData[$scope.quote.id].client_email = '';	
					}
					//$scope.quoteData[$scope.quote.id].prices = {};
                });
			
			$scope.userInputError = false;
			$scope.checkForEmptyInput = function(value) {
				if (value == '') {
					$scope.userInputError = true;					
				}
			}
			
			$scope.saveQuote = function() {
				
				if (($scope.quoteData[$scope.quote.id].client_username != '') &&
					($scope.quoteData[$scope.quote.id].client_company != '') &&
					($scope.quoteData[$scope.quote.id].client_email != ''))
				{
					var data = {
						publish_status: $scope.quote.publish_status,
						user_type: $scope.quoteData[$scope.quote.id].user_type,
						client_username: $scope.quoteData[$scope.quote.id].client_username,
						client_company: $scope.quoteData[$scope.quote.id].client_company,
						client_email: $scope.quoteData[$scope.quote.id].client_email,
						added_devices: Object.keys($scope.addedDevices),
						devices_desc: $scope.quoteData[$scope.quote.id].devices_desc,
						added_accessories: $scope.quoteData[$scope.quote.id].added_accessories,
						prices: $scope.quoteData[$scope.quote.id].prices
					};
					Quote
						.update($scope.quote.id, data)
						.success(function(response) { 
						});
				} else {
					//$window.scrollTo(0, 0);
					anchorSmoothScroll.scrollTo('top');
					$scope.userInputError = true;
				}
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
			
			$scope.deviceUpdated = {};

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
                        $scope.deviceUpdated[deviceId] = true;
						$timeout( function(){
							$scope.deviceUpdated[deviceId] = false;
						}, 4000);
                    });
            }

            $scope.deviceAccordionIsOpen = {};
            $scope.deviceAccordionIsOpen[0] = true;
        });

})();