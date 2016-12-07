(function() {

    'use strict';

    angular
        .module('mainCtrl', [])
        .controller('QuotesController', function($scope, $http, $window, Quotes, Quote){
			
            Quotes
                .getAll()
                .success(function(response) {
					
					$scope.quotes = response;
					//console.log(response);

					/* Pagination START */
					$scope.filteredQuotes = []
					,$scope.quotesCurrentPage = 1
					,$scope.quotesNumPerPage = 4
					,$scope.quotesMaxSize = 5;
 
					/*$scope.numPages = function () {
						return Math.ceil($scope.filteredQuotes.length / $scope.quotesNumPerPage);
					};*/

					$scope.$watch('quotesCurrentPage + quotesNumPerPage', function() {
						var begin = (($scope.quotesCurrentPage - 1) * $scope.quotesNumPerPage)
						, end = begin + $scope.quotesNumPerPage;

						$scope.filteredQuotes = $scope.quotes.slice(begin, end);
					});	
					/* Pagination END */
					  
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
								$window.location.href = 'quotes';
							});
					}
					
					$scope.duplicateQuote = function(quoteToDuplicateId) {
						if (quoteToDuplicateId != null) {
						console.log('dup');
							Quote
								.duplicate(quoteToDuplicateId)
								.success(function(response) {
									console.log(response);
									$window.location.href = 'edit_quote/' + response.guid;
								});
						} else {
							alert('Please select a quote to duplicate!');
						}
					}
				});
        })
        .controller('QuoteController', function($scope, $http, $window, $timeout, $location, $routeParams, Quote, Device, anchorSmoothScroll){
			
			$scope.showEditQuoteForm = false;
            Quote
                .get($routeParams.quote)
                .success(function(response) {
					
					$scope.showEditQuoteForm = true;
					/*Quote
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

						});*/

					$scope.quote = response;

					
					$scope.addedDevices = {};
					var customAccessoriesIndex = {};
					var customDescriptionsIndex = {};
					console.log($scope.addedDevices);
					angular.forEach($scope.quote.devices, function(device, index) {
						$scope.addedDevices[device.id] = device;
					});
					
					if (typeof $scope.quote.custom_accessories == 'undefined') $scope.quote.custom_accessories = [];
					if (typeof $scope.quote.custom_descriptions == 'undefined') $scope.quote.custom_descriptions = [];
					
					angular.forEach($scope.quote.custom_accessories, function(custom_accessories, index) {
						customAccessoriesIndex[index] = $scope.quote.custom_accessories[index] ? Object.keys($scope.quote.custom_accessories[index]).length : 0;
						$scope.addedDevices[index].custom_accessories = custom_accessories;
					});
					angular.forEach($scope.quote.custom_descriptions, function(custom_descriptions, index) {
						customDescriptionsIndex[index] = $scope.quote.custom_descriptions[index] ? Object.keys($scope.quote.custom_descriptions[index]).length : 0;
						$scope.addedDevices[index].custom_descriptions = custom_descriptions;
						
					});
					
					//console.log($scope.addedDevices);
					//console.log($scope.addedDevices);
					$scope.addCustomAccessories = function(deviceId) {
						if (typeof $scope.addedDevices[deviceId].custom_accessories == 'undefined') $scope.addedDevices[deviceId].custom_accessories = {};
						if (typeof customAccessoriesIndex[deviceId] == 'undefined') customAccessoriesIndex[deviceId] = 0;
						 
						if(customAccessoriesIndex[deviceId] < 4) {
							$scope.addedDevices[deviceId].custom_accessories[customAccessoriesIndex[deviceId] + 1] = {
										id: customAccessoriesIndex[deviceId] + 1,
										part_number: '',
										price: '',
										description: ''
							};
							customAccessoriesIndex[deviceId]++;
						}
					}	
					//console.log($scope.addedDevices);
					$scope.addCustomDescriptions = function(deviceId) {
						 
						
						if (typeof $scope.addedDevices[deviceId].custom_descriptions == 'undefined') $scope.addedDevices[deviceId].custom_descriptions = {};
						if (typeof customDescriptionsIndex[deviceId] == 'undefined') customDescriptionsIndex[deviceId] = 0;
						
						if(customDescriptionsIndex[deviceId] < 4) {
							
							$scope.addedDevices[deviceId].custom_descriptions[customDescriptionsIndex[deviceId] + 1] = {
										id: customDescriptionsIndex[deviceId] + 1,
										name: '',
										value: ''
							};
							customDescriptionsIndex[deviceId]++;
						}
						 
					}	
					
					//console.log($scope.addedDevices);

					$scope.quoteData = {};
					//if (typeof $scope.quoteData[$scope.quote.id] != 'undefined') $scope.quoteData[$scope.quote.id].user_type == quote.user.user_type;
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
						//console.log($scope.quoteData[$scope.quote.id].prices);
					}
					$scope.quotedDevicesIds = Object.keys($scope.addedDevices);
					$scope.showDeviceIsAlreadyAddedMessage = false;
					$scope.addDeviceToQuote = function () {
						if (	$scope.selectedDevice != null
								&& typeof $scope.addedDevices[$scope.selectedDevice] === 'undefined'
								&& Object.keys($scope.addedDevices).length < 4 // max allowed devices for a quote
						) {
							$scope.addedDevices[$scope.selectedDevice] = $scope.devices[$scope.selectedDevice - 1];
						} else {
							$scope.showDeviceIsAlreadyAddedMessage = true;
							$timeout( function(){
								$scope.showDeviceIsAlreadyAddedMessage = false;
							}, 3000);
							
						}
						$scope.selectedDevice = null;
						
						/*$scope.quotedDevicesIds = Object.keys($scope.addedDevices);
						jQuery('#quoted_devices_hidden').val($scope.quotedDevicesIds);
						jQuery('#quoted_devices_hidden').triggerHandler('change');*/
						$scope.updateDevicePrices();
					}
					 
					$scope.quoteData = {};
					$scope.quoteData[$scope.quote.id] = [];
					$scope.quoteData[$scope.quote.id].editor = $scope.quote.editor != null ? $scope.quote.editor : 'jesse';
					$scope.quoteData[$scope.quote.id].user_type = $scope.quote.user != null ? $scope.quote.user.user_type : 'new';
					$scope.quoteData[$scope.quote.id].client_username = $scope.quote.user != null ? $scope.quote.user.name : '';
					$scope.quoteData[$scope.quote.id].client_company = $scope.quote.user != null ? $scope.quote.user.company : '';
					$scope.quoteData[$scope.quote.id].client_email = $scope.quote.user != null ? $scope.quote.user.email : '';
					
					$scope.quoteData[$scope.quote.id].devices_desc = $scope.quote.devices_desc != null ? $scope.quote.devices_desc : {};
					$scope.quoteData[$scope.quote.id].added_accessories = $scope.quote.added_accessories != null ? $scope.quote.added_accessories : {};
					$scope.quoteData[$scope.quote.id].included_pages = $scope.quote.included_pages != null ? $scope.quote.included_pages : {};					
					
					$scope.quoteData[$scope.quote.id].custom_accessories = $scope.quote.custom_accessories != null ? $scope.quote.custom_accessories : {};
					$scope.quoteData[$scope.quote.id].custom_descriptions = $scope.quote.custom_descriptions != null ? $scope.quote.custom_descriptions : {};
					
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
			
			$scope.showQuoteSaveSuccessMessage = false;
			$scope.saveQuote = function(action) {
				
				if (($scope.quoteData[$scope.quote.id].client_username != '') &&
					($scope.quoteData[$scope.quote.id].client_company != '') &&
					($scope.quoteData[$scope.quote.id].client_email != ''))
				{
					var data = {
						editor: $scope.quoteData[$scope.quote.id].editor,
						status: $scope.quote.status,
						user_type: $scope.quoteData[$scope.quote.id].user_type,
						client_username: $scope.quoteData[$scope.quote.id].client_username,
						client_company: $scope.quoteData[$scope.quote.id].client_company,
						client_email: $scope.quoteData[$scope.quote.id].client_email,
						added_devices: Object.keys($scope.addedDevices),
						devices_desc: $scope.quoteData[$scope.quote.id].devices_desc,
						added_accessories: $scope.quoteData[$scope.quote.id].added_accessories,
						custom_accessories: $scope.quoteData[$scope.quote.id].custom_accessories,
						custom_descriptions: $scope.quoteData[$scope.quote.id].custom_descriptions,
						included_pages: $scope.quoteData[$scope.quote.id].included_pages,
						prices: $scope.quoteData[$scope.quote.id].prices
					};
					console.log(data);
					Quote
						.update($scope.quote.id, data)
						.success(function(response) { 
				
							if (action == 'save') {
								anchorSmoothScroll.scrollTo('top');
								$scope.showQuoteSaveSuccessMessage = true;
								$timeout( function(){
									$scope.showQuoteSaveSuccessMessage = false;
								}, 4000);
							} else {
								$window.location.href = 'quotes';
							}
									
						
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
					console.log(response);
					
					/* Pagination START */
					$scope.filteredUsers = []
					,$scope.usersCurrentPage = 1
					,$scope.usersNumPerPage = 4
					,$scope.usersMaxSize = 5;

					$scope.$watch('usersCurrentPage + usersNumPerPage', function() {
						var begin = (($scope.usersCurrentPage - 1) * $scope.usersNumPerPage)
						, end = begin + $scope.usersNumPerPage;

						$scope.filteredUsers = $scope.users.slice(begin, end);
					});	
					/* Pagination END */
                });
        })
        .controller('DevicesController', function($scope, $http, $timeout, $window, Device, Accessory){
			
			$scope.disableDevicesUploadButton = true;
			
			$scope.$watch('uploadedDevicesFile', function() {
				$scope.disableDevicesUploadButton = !$scope.uploadedDevicesFile;
			});	
			
			$scope.disableAccessoriesUploadButton = true;
			
			$scope.$watch('uploadedAccessoriesFile', function() {
				$scope.disableAccessoriesUploadButton = !$scope.uploadedAccessoriesFile;
			});	
			
			$scope.uploadCsv = function(type, uploadedFile) {
				if (typeof uploadedFile != 'undefined') { 
					
					var formData = new FormData();
					formData.append('file', uploadedFile);

					Device
						.uploadCsv(type, formData)
						.success(function(response) {
							console.log(response);
							$scope.disableDevicesUploadButton = true;
							$scope.disableAccessoriesUploadButton = true;
							$window.location.href = 'devices';
						});
				}
				
			}
			
			$scope.deviceUpdated = {};
			
            $scope.chosenAccessoriesList = {};
            $scope.selectedAccessories = {};
            Device
                .get()
                .success(function(response) {
					
					Accessory
						.get()
						.success(function(response) {
							$scope.accessories = response;
							console.log($scope.accessories);
						});
						
                    $scope.devices = response;
					
					/* Pagination START */
					$scope.filteredDevices = []
					,$scope.devicesCurrentPage = 1
					,$scope.devicesNumPerPage = 15
					,$scope.devicesMaxSize = 5;
 
					$scope.numPages = function () {
						return Math.ceil($scope.devices.length / $scope.devicesNumPerPage);
					};

					$scope.$watch('devicesCurrentPage + devicesNumPerPage', function() {
						var begin = (($scope.devicesCurrentPage - 1) * $scope.devicesNumPerPage)
						, end = begin + $scope.devicesNumPerPage;

						$scope.filteredDevices = $scope.devices.slice(begin, end);
					});	
					/* Pagination END */

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
					
					$scope.moveAccessories = function (deviceId, accessoryIndex, isChecked){
						console.log(accessoryIndex);
						if (typeof $scope.chosenAccessoriesList[deviceId] == 'undefined') $scope.chosenAccessoriesList[deviceId] = {};
						if(isChecked) {
							$scope.chosenAccessoriesList[deviceId][accessoryIndex] = $scope.accessories[accessoryIndex];
						} else {
							delete $scope.chosenAccessoriesList[deviceId][accessoryIndex];
						}
					}     
					

					$scope.acessoryStateChanged = function (deviceId, accessoryIndex, accessoryId) {
						if (typeof $scope.selectedAccessories[deviceId] == 'undefined') $scope.selectedAccessories[deviceId] = {};
						$scope.moveAccessories(deviceId, accessoryIndex, $scope.selectedAccessories[deviceId][accessoryId]);
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
        });

})();