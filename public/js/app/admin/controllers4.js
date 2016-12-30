(function() {

    'use strict';

    angular
        .module('mainCtrl', [])
        .controller('quotesController', function($scope, $http, $window, Quotes, Quote){
			
			$scope.loadingError = false;
			$scope.showQuotesList = false;
			
            Quotes
                .getAll()
                .success(function(response) {
					
					$scope.showQuotesList = true;			
					
					$scope.quotes = response;
					console.log(response);

					/* Pagination START */
					$scope.filteredQuotes = []
					,$scope.quotesCurrentPage = 1
					,$scope.quotesNumPerPage = 6
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
								$window.location.href = 'edit-quote/' + response.guid;
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
									$window.location.href = 'edit-quote/' + response.guid;
								});
						} else {
							alert('Please select a quote to duplicate!');
						}
					}
				})
                .error(function(response) {
					$scope.loadingError = true;					
				});
        })
        .controller('editQuoteController', function($scope, $filter, $http, $window, $timeout, $location, $routeParams, Quote, Device, anchorSmoothScroll){
			
			$scope.loadingError = false;
			$scope.showQuoteForm = false;
			
			$scope.loadingCapsuleUsers = true;
            Quote
                .get($routeParams.quote)
                .success(function(response) {
					
					$scope.showQuoteForm = true;
					
					Quote
						.getCapsuleUsers()
						.success(function(response) {
							$scope.capsuleUsers = response;
							
							$scope.loadingCapsuleUsers = false;
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
					
					$scope.addedDevices = {};
					var customAccessoriesIndex = {};
					var customDescriptionsIndex = {};
					
					angular.forEach($scope.quote.devices, function(device, index) {
						$scope.addedDevices[device.id] = device;
					});
									
					$scope.quoteData = {};
					$scope.quoteData[$scope.quote.id] = {};
					
					if ($scope.quote.user == null) {
						$scope.quoteData[$scope.quote.id].user_type = 'new';
					} else {
						$scope.quoteData[$scope.quote.id].user_type = $scope.quote.user.user_type;
					}
					
					$scope.quoteData[$scope.quote.id].sum_up = $scope.quote.sum_up;
					$scope.quoteData[$scope.quote.id].rates_options = $scope.quote.rates_options;
				 
					console.log($scope.quoteData); 
					console.log($scope.quoteData[$scope.quote.id].rates_options);
					angular.forEach($scope.addedDevices, function(device, deviceId) {
						if (typeof $scope.quoteData[$scope.quote.id].rates_options == 'undefined' || $scope.quoteData[$scope.quote.id].rates_options == null) $scope.quoteData[$scope.quote.id].rates_options = {};
						
						if (typeof $scope.quoteData[$scope.quote.id].rates_options[deviceId] == 'undefined') $scope.quoteData[$scope.quote.id].rates_options[deviceId] = 'basic';
					});
							
					
					$scope.updateDevicePrices = function() {
						angular.forEach($scope.addedDevices, function(device, deviceId) {
							
                            if (typeof $scope.quoteData[$scope.quote.id].prices[deviceId] == 'undefined') $scope.quoteData[$scope.quote.id].prices[deviceId] = {};
							  
							if (typeof $scope.quote.prices != 'undefined' && $scope.quote.prices != null) { 
								
								if (typeof $scope.quote.prices[deviceId] != 'undefined') { 
									if (typeof $scope.quote.prices[deviceId].price != 'undefined') {				 
										$scope.quoteData[$scope.quote.id].prices[deviceId].price = $scope.quote.prices[deviceId].price;
									} else { 
										$scope.quoteData[$scope.quote.id].prices[deviceId].price = device.price;										
									}
									if (typeof $scope.quote.prices[deviceId].maintenance_cost != 'undefined') {				 
										$scope.quoteData[$scope.quote.id].prices[deviceId].maintenance_cost = $scope.quote.prices[deviceId].maintenance_cost;
									} else { 
										$scope.quoteData[$scope.quote.id].prices[deviceId].maintenance_cost = device.maintenance_cost;										
									}
									if (typeof $scope.quote.prices[deviceId].maintenance_price != 'undefined') {				 
										$scope.quoteData[$scope.quote.id].prices[deviceId].maintenance_price = $scope.quote.prices[deviceId].maintenance_price;
									} else { 
										$scope.quoteData[$scope.quote.id].prices[deviceId].maintenance_price = device.maintenance_price;										
									}
									if (typeof $scope.quote.prices[deviceId].cost_per_color_page != 'undefined') {				 
										$scope.quoteData[$scope.quote.id].prices[deviceId].cost_per_color_page = $scope.quote.prices[deviceId].cost_per_color_page;
									} else { 
										$scope.quoteData[$scope.quote.id].prices[deviceId].cost_per_color_page = device.cost_per_color_page;										
									}
									if (typeof $scope.quote.prices[deviceId].cost_per_mono_page != 'undefined') {				 
										$scope.quoteData[$scope.quote.id].prices[deviceId].cost_per_mono_page = $scope.quote.prices[deviceId].cost_per_mono_page;
									} else { 
										$scope.quoteData[$scope.quote.id].prices[deviceId].cost_per_mono_page = device.cost_per_mono_page;										
									}
								} else {
									$scope.quoteData[$scope.quote.id].prices[deviceId].price = device.price;
									$scope.quoteData[$scope.quote.id].prices[deviceId].maintenance_cost = device.maintenance_cost;
									$scope.quoteData[$scope.quote.id].prices[deviceId].maintenance_price = device.maintenance_price;
									$scope.quoteData[$scope.quote.id].prices[deviceId].cost_per_color_page = device.cost_per_color_page;
									$scope.quoteData[$scope.quote.id].prices[deviceId].cost_per_mono_page = device.cost_per_mono_page;
									
								}
							} 
							else {
								$scope.quoteData[$scope.quote.id].prices[deviceId].price = device.price;
								$scope.quoteData[$scope.quote.id].prices[deviceId].maintenance_cost = device.maintenance_cost;
								$scope.quoteData[$scope.quote.id].prices[deviceId].maintenance_price = device.maintenance_price;
								$scope.quoteData[$scope.quote.id].prices[deviceId].cost_per_color_page = device.cost_per_color_page;
								$scope.quoteData[$scope.quote.id].prices[deviceId].cost_per_mono_page = device.cost_per_mono_page;
							}	
						});
						//console.log($scope.quoteData[$scope.quote.id].prices); 
					}
					
					/* Add device to a quote BEGIN */
					$scope.quotedDevicesIds = Object.keys($scope.addedDevices);
					$scope.showDeviceIsAlreadyAddedMessage = false;
					$scope.addDeviceToQuote = function () {
						if (	$scope.selectedDevice != null
								&& typeof $scope.addedDevices[$scope.selectedDevice] === 'undefined'
								&& Object.keys($scope.addedDevices).length < 4 // max allowed devices for a quote
						) {
							$scope.addedDevices[$scope.selectedDevice] = $filter('getById')($scope.devices, $scope.selectedDevice);
						} else {
							$scope.showDeviceIsAlreadyAddedMessage = true;
							$timeout( function(){
								$scope.showDeviceIsAlreadyAddedMessage = false;
							}, 3000);							
						}
						$scope.selectedDevice = null;
						
						$scope.updateDevicePrices();						
					}
					/* Add device to a quote END */
					
					if (typeof $scope.quote.devices_desc == 'undefined' || $scope.quote.devices_desc == null) $scope.quote.devices_desc = {};					
					if (typeof $scope.quote.included_pages == 'undefined' || $scope.quote.included_pages == null) $scope.quote.included_pages = {};
					
					
					
					$scope.quoteData[$scope.quote.id].editor = $scope.quote.editor != null ? $scope.quote.editor : 'jesse';
					$scope.quoteData[$scope.quote.id].user_type = $scope.quote.user != null ? $scope.quote.user.user_type : 'new';
					$scope.quoteData[$scope.quote.id].client_username = $scope.quote.user != null ? $scope.quote.user.name : '';
					$scope.quoteData[$scope.quote.id].client_company = $scope.quote.user != null ? $scope.quote.user.company : '';
					$scope.quoteData[$scope.quote.id].client_email = $scope.quote.user != null ? $scope.quote.user.email : '';
					
					$scope.quoteData[$scope.quote.id].added_accessories = $scope.quote.added_accessories != null ? $scope.quote.added_accessories : {};
					
					// If these cells are empty in the database, the fetched instances are of type Array, not of Object. So second check is for that
					$scope.quoteData[$scope.quote.id].devices_desc = ( ($scope.quote.devices_desc != null) && (!($scope.quote.devices_desc instanceof Array)) ) ? $scope.quote.devices_desc : {};
					$scope.quoteData[$scope.quote.id].included_pages = ( ($scope.quote.included_pages != null) && (!($scope.quote.included_pages instanceof Array) || Object.keys($scope.quote.included_pages).length > 0) ) ? $scope.quote.included_pages : {};
					 
					
					$scope.quoteData[$scope.quote.id].custom_accessories = ( ($scope.quote.custom_accessories != null) && (!($scope.quote.custom_accessories instanceof Array))) ? $scope.quote.custom_accessories : {};
					
					$scope.quoteData[$scope.quote.id].custom_descriptions = ( ($scope.quote.custom_descriptions != null) && (!($scope.quote.custom_descriptions instanceof Array)) ) ? $scope.quote.custom_descriptions : {};	
					
					// If there is user-corrected price for this device, get the price from the device parameters
					$scope.quoteData[$scope.quote.id].prices = {};
					$scope.updateDevicePrices();
					
					$scope.changedUserType = function(user_type) {
						$scope.selectedCapsuleUser = null;
						$scope.quoteData[$scope.quote.id].client_username = '';
						$scope.quoteData[$scope.quote.id].client_company = '';
						$scope.quoteData[$scope.quote.id].client_email = '';	
					}
					
					
					$scope.removeDeviceFromQuote = function (deviceId) {	
						if (window.confirm("Are you sure?")) {
							delete $scope.addedDevices[deviceId];
						}
					}
					
					$scope.userInputError = false;
					$scope.checkForEmptyInput = function(value) {
						if (value == '') {
							$scope.userInputError = true;					
						}
					}
					
					
					/* Custom descriptions and Custom accessories BEGIN */
					if (typeof $scope.quote.custom_accessories == 'undefined' || $scope.quote.custom_accessories == null) $scope.quote.custom_accessories = {};
					if (typeof $scope.quote.custom_descriptions == 'undefined' || $scope.quote.custom_descriptions == null) $scope.quote.custom_descriptions = {};
					 
					angular.forEach($scope.addedDevices, function(deviceParams, index) {
						customAccessoriesIndex[index] = ($scope.quote.custom_accessories && $scope.quote.custom_accessories[index]) ? Object.keys($scope.quote.custom_accessories[index]).length : 0;
						$scope.addedDevices[index].custom_accessories = ($scope.quote.custom_accessories && $scope.quote.custom_accessories[index]) ? $scope.quote.custom_accessories[index] : {};						
						
						customDescriptionsIndex[index] = ($scope.quote.custom_descriptions && $scope.quote.custom_descriptions[index]) ? Object.keys($scope.quote.custom_descriptions[index]).length : 0;
						$scope.addedDevices[index].custom_descriptions = ($scope.quote.custom_descriptions && $scope.quote.custom_descriptions[index]) ? $scope.quote.custom_descriptions[index] : {};
					});
					
					$scope.addCustomAccessories = function(deviceId) {
						console.log(1);
						if (typeof $scope.addedDevices[deviceId].custom_accessories == 'undefined'
							|| $scope.addedDevices[deviceId].custom_accessories == null
						) $scope.addedDevices[deviceId].custom_accessories = {};
						if (typeof customAccessoriesIndex[deviceId] == 'undefined') customAccessoriesIndex[deviceId] = 0;
						 
						if(customAccessoriesIndex[deviceId] < 4) {
							$scope.addedDevices[deviceId].custom_accessories[customAccessoriesIndex[deviceId] + 1] = {
										id: customAccessoriesIndex[deviceId] + 1,
										part_number: '',
										price: '',
										description: ''
							};
							
							
						if (typeof $scope.quoteData[$scope.quote.id].custom_accessories[deviceId] == 'undefined') $scope.quoteData[$scope.quote.id].custom_accessories[deviceId] = {};
						if (typeof $scope.quoteData[$scope.quote.id].custom_accessories[deviceId][customAccessoriesIndex[deviceId] + 1] == 'undefined') $scope.quoteData[$scope.quote.id].custom_accessories[deviceId][customAccessoriesIndex[deviceId] + 1] = {};
						$scope.quoteData[$scope.quote.id].custom_accessories[deviceId][customAccessoriesIndex[deviceId] + 1].id 
								= customAccessoriesIndex[deviceId] + 1;
								
							customAccessoriesIndex[deviceId]++;
						} 
					}	
					
					$scope.addCustomDescriptions = function(deviceId) {
						
						if (typeof $scope.addedDevices[deviceId].custom_descriptions == 'undefined') $scope.addedDevices[deviceId].custom_descriptions = {};
						if (typeof customDescriptionsIndex[deviceId] == 'undefined') customDescriptionsIndex[deviceId] = 0;
						
						if(customDescriptionsIndex[deviceId] < 4) {
							
							$scope.addedDevices[deviceId].custom_descriptions[customDescriptionsIndex[deviceId] + 1] = {
										id: customDescriptionsIndex[deviceId] + 1,
										name: '',
										value: ''
							};
							
						if (typeof $scope.quoteData[$scope.quote.id].custom_descriptions[deviceId] == 'undefined') $scope.quoteData[$scope.quote.id].custom_descriptions[deviceId] = {};
						if (typeof $scope.quoteData[$scope.quote.id].custom_descriptions[deviceId][customDescriptionsIndex[deviceId] + 1] == 'undefined') $scope.quoteData[$scope.quote.id].custom_descriptions[deviceId][customDescriptionsIndex[deviceId] + 1] = {};
						$scope.quoteData[$scope.quote.id].custom_descriptions[deviceId][customDescriptionsIndex[deviceId] + 1].id 
								= customDescriptionsIndex[deviceId] + 1;
							
							
							customDescriptionsIndex[deviceId]++;
						}
					}	
					/* Custom descriptions and Custom accessories END */
					
					
					$scope.showQuoteSaveSuccessMessage = false;
					$scope.saveQuote = function(action) {
						
						if (($scope.quoteData[$scope.quote.id].client_username != '') &&
							($scope.quoteData[$scope.quote.id].client_company != '') &&
							($scope.quoteData[$scope.quote.id].client_email != ''))
						{
							angular.forEach($scope.quoteData[$scope.quote.id].devices_desc, function(deviceParams, index) {
								if (!(index in $scope.addedDevices)) {
									delete $scope.quoteData[$scope.quote.id].devices_desc[index];
								}
							});
							angular.forEach($scope.quoteData[$scope.quote.id].added_accessories, function(deviceParams, index) {
								if (!(index in $scope.addedDevices)) {
									delete $scope.quoteData[$scope.quote.id].added_accessories[index];
								}
							});
							angular.forEach($scope.quoteData[$scope.quote.id].custom_accessories, function(deviceParams, index) {
								if (!(index in $scope.addedDevices)) {
									delete $scope.quoteData[$scope.quote.id].custom_accessories[index];
								}
							});
							angular.forEach($scope.quoteData[$scope.quote.id].custom_descriptions, function(deviceParams, index) {
								if (!(index in $scope.addedDevices)) {
									delete $scope.quoteData[$scope.quote.id].custom_descriptions[index];
								}
							});
							angular.forEach($scope.quoteData[$scope.quote.id].included_pages, function(deviceParams, index) {
								if (!(index in $scope.addedDevices)) {
									delete $scope.quoteData[$scope.quote.id].included_pages[index];
								}
							});
							angular.forEach($scope.quoteData[$scope.quote.id].prices, function(deviceParams, index) {
								if (!(index in $scope.addedDevices)) {
									delete $scope.quoteData[$scope.quote.id].prices[index];
								}
							});
							
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
								prices: $scope.quoteData[$scope.quote.id].prices,
								sum_up: $scope.quoteData[$scope.quote.id].sum_up,
								rates_options: $scope.quoteData[$scope.quote.id].rates_options
							};
							console.log($scope.quoteData[$scope.quote.id].custom_accessories);
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
							anchorSmoothScroll.scrollTo('user');
							$scope.userInputError = true;
						}
					}
					
					Device
						.getAll()
						.success(function(response) {
							$scope.devices = response;
							//console.log(response);
						});
						
					Device
						.getMostQuoted()
						.success(function(response) {
							$scope.mostQuotedDevices = response;
								
						});
						
					$scope.selectDevice = function(index) {
						$scope.selectedDevice = index;
					}
					
					$scope.deviceAccordionIsOpen = {};
					$scope.deviceAccordionIsOpen[0] = true;;
					
                })
                .error(function(response) {		
					$scope.loadingError = true;
				});
			
			
        })
        .controller('usersController', function($scope, $http, User){
			
			$scope.loadingError = false;
			$scope.showUsersList = false;
			
            User
                .get()
                .success(function(response) {
					
					$scope.showUsersList = true;
					
                    $scope.users = response;
					console.log(response);
					
					/* Pagination START */
					$scope.filteredUsers = []
					,$scope.usersCurrentPage = 1
					,$scope.usersNumPerPage = 10
					,$scope.usersMaxSize = 5;

					$scope.$watch('usersCurrentPage + usersNumPerPage', function() {
						var begin = (($scope.usersCurrentPage - 1) * $scope.usersNumPerPage)
						, end = begin + $scope.usersNumPerPage;

						$scope.filteredUsers = $scope.users.slice(begin, end);
					});	
					/* Pagination END */
                })
                .error(function(response) {					
					$scope.loadingError = true;
				});
        })
        .controller('devicesController', function($scope, $http, $timeout, $window, Device, Accessory){			
		
			$scope.loadingError = false;
			$scope.showDevicesList = false;
					
			/* Upload CSV file BEGIN */		
			$scope.disableCsvUploadButton = true;
			$scope.$watch('uploadedCsvFile', function() {
				$scope.disableCsvUploadButton = !$scope.uploadedCsvFile;
			});
			
			$scope.showCsvUploadSuccessMessage = false;
			$scope.uploadCsv = function(type, uploadedFile) {
				if (typeof uploadedFile != 'undefined') { 
					
					var formData = new FormData();
					formData.append('file', uploadedFile);

					Device
						.uploadCsv(type, formData)
						.success(function(response) {
							console.log(response);
							$scope.disableCsvUploadButton = true;						
						})						
						.error(function(response) {
							$scope.disableCsvUploadButton = true;	
							
							$scope.showCsvUploadSuccessMessage = true;
							$timeout( function(){
								$scope.showCsvUploadSuccessMessage = false;
							}, 4000);	
						});
				}
			}			
			/* Upload CSV file END */
					
			$scope.addDevice = function() {
				Device
					.save()
					.success(function(response) {
						$window.location.href = 'edit-device/' + response.id;
					});
			}
			
            Device
                .getAll()
                .success(function(response) {
					
					$scope.showDevicesList = true;
					
                    $scope.devices = response;
					console.log(response);
					
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
					
					$scope.deviceAccordionIsOpen = {};
					$scope.deviceAccordionIsOpen[0] = true;			
					
					
					$scope.removeDevice = function(device) {
						if (window.confirm("Are you sure?")) {
							Device
								.destroy(device.id)
								.success(function(response) {								 
									$window.location.href = 'devices';
								})
								.error(function(response) {					
									$scope.showCsvUploadSuccessMessage = true;
									$timeout( function(){
										$scope.showCsvUploadSuccessMessage = false;
									}, 4000);
								});;
						}
					}
												
			
				})		
				.error(function(response) {					
					$scope.loadingError = true;
				});
        })		
        .controller('editDeviceController', function($scope, $http, $timeout, $routeParams, $window, Device, Accessory, anchorSmoothScroll){			 
						
			$scope.loadingError = false;
			$scope.showDeviceForm = false;
            Device
                .get($routeParams.device)
                .success(function(response) {
					
					$scope.showDeviceForm = true;
			
					$scope.device = response;
					console.log(response);
					
					Accessory
						.get()
						.success(function(response) {
							$scope.accessories = response;
						});
					
					/* Upload file (PDF or image) BEGIN */	
					$scope.disableUploadButton = {};
					$scope.disableUploadButton['pdf'] = true;
					$scope.disableUploadButton['image'] = true;
					
					$scope.$watch('uploadedDevicePdf', function() {
						$scope.disableUploadButton['pdf'] = !$scope.uploadedDevicePdf;
					});
					
					$scope.$watch('uploadedDeviceImage', function() {
						$scope.disableUploadButton['image'] = !$scope.uploadedDeviceImage;
					});
					
					$scope.uploadFile = function(type, uploadedFile) {
						if (typeof uploadedFile != 'undefined') { 
							
							var formData = new FormData();
							formData.append('file', uploadedFile);

							Device
								.uploadFile(type, formData)
								.success(function(response) {
									if (response.status == 'success') {
										$scope.device[type] = response.path;
									}
									$scope.disableUploadButton[type] = true;
								});
						} 
					}								
					/* Upload file (PDF or image) END */
																		
					/* Save device BEGIN */
					$scope.modelFieldRequired = false;
					$scope.saveDevice = function(device, action) {
						if (device.model != '') {
						Device
							.update(device, $scope.deviceAccessories)
							.success(function(response) {								
								switch (action) {
									case 'save':								
										anchorSmoothScroll.scrollTo('top');
										$scope.showDeviceSaveSuccessMessage = true;
										$timeout( function(){
											$scope.showDeviceSaveSuccessMessage = false;
										}, 4000);
										break;
									case 'save-exit':
										$window.location.href = 'devices';
										break;						
								}
								
								$scope.modelFieldRequired = false;
							})								
							.error(function(response) {			
								anchorSmoothScroll.scrollTo('top');				
								$scope.showDeviceSaveErrorMessage = true;
								$timeout( function(){
									$scope.showDeviceSaveErrorMessage = false;
								}, 4000);
							});
						} else {
							$scope.modelFieldRequired = true;
						}
					}																		
					/* Save device END */
					
					$scope.deviceAccessories = $scope.device.accessories;
					
					var filterTextTimeout;					
					var j = 0;
					var constantOldValue;
					$scope.searchResultText	 = {};
					
					$scope.partNumberChanged = function(accessory, oldValue) {
						if (j == 0) {
							constantOldValue = oldValue;
							j++;
						}
						
						if (accessory.part_number != constantOldValue) {
							if (filterTextTimeout) $timeout.cancel(filterTextTimeout);	
							
							filterTextTimeout = $timeout(function() {
								length = $scope.accessories.length;
								for(var i = 0; i < length; i++) { 
									if ($scope.accessories[i].part_number == accessory.part_number) {
										$scope.searchResultText[accessory.id]  = 'found';
										$scope.foundAccessory = $scope.accessories[i];
										break;
									} else {
										$scope.searchResultText[accessory.id]  = 'notFound';						
									}
								}
							}, 1000);
						} else {
							$scope.searchResultText[accessory.id]  = false;							
						}
					}					
								
					$scope.loadAccessoryData = function(accessory, foundAccessory) {
						
						var index = $scope.deviceAccessories.indexOf(accessory);
						
						$scope.deviceAccessories[index].description  = foundAccessory.description;
						$scope.deviceAccessories[index].cost  = foundAccessory.cost;
						$scope.deviceAccessories[index].price  = foundAccessory.price;
						
						$scope.searchResultText[accessory.id] = false;
					}
					
					$scope.deviceCustomAccessories = [];
					
					$scope.addAccessory = function() {
						$scope.deviceAccessories.push(
							{
								id: null, //initially it's set to some default integer, id changes when the accessory is saved to database
								description: '',
								part_number: '',
								cost: '',
								price: '',
								device_id: $scope.device.id,
								saved_to_db: false // indication whether the accessory is already saved to database
							}
						);
					}
					
					$scope.removeAccessory = function(item) {
						var index = $scope.deviceAccessories.indexOf(item)
						$scope.deviceAccessories.splice(index,1);
					}
					
					$scope.addCustomAccessory = function() {
						$scope.deviceCustomAccessories.push(
							{
								id: null,
								description: '',
								part_number: '',
								cost: '',
								price: '',
								device_id: $scope.device.id,
								saved_to_db: false
							}
						);
					}
					
					$scope.removeCustomAccessory = function(item) {
						var index = $scope.deviceCustomAccessories.indexOf(item)
						$scope.deviceCustomAccessories.splice(index,1);
					}
					
					$scope.saveAccessory = function(accessory) {
						if (accessory.id === null) {
							Accessory
								.save(accessory)
								.success(function(response) {
									accessory.id = response.id;
									accessory.save_to_db = true;
								});
						} else {
							Accessory
								.update(accessory)
								.success(function(response) {
									console.log(response);
								});
						}
					}
			
				})
                .error(function(response) {
					$scope.loadingError = true;					
				});
					
			 
        });

})();