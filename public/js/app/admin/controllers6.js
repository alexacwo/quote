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
					 //console.log(response);

					/* Pagination START */
					$scope.filteredQuotes = []
					,$scope.quotesCurrentPage = 1
					,$scope.quotesNumPerPage = 10
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
								//console.log(response);
								$window.location.href = 'quotes';
							});
					}
					
					$scope.duplicateQuote = function(quoteToDuplicateId) {
						if (quoteToDuplicateId != null) {
							console.log(quoteToDuplicateId);
							Quote
								.duplicate(quoteToDuplicateId)
								.success(function(response) {
									//console.log(response);
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
					
					var capsuleSearchTimeout;
					
					$scope.getCapsuleUsers = function () {
						
							if (capsuleSearchTimeout) $timeout.cancel(capsuleSearchTimeout);
							
							capsuleSearchTimeout = $timeout( function(){								
								Quote
									.getCapsuleUsers(
										$scope.searchUserByFirstname,
										$scope.searchUserByLastname,
										$scope.searchUserByEmail
									)
									.success(function(response) {
										console.log(response);										
										if (response.contacts) {
											$scope.capsuleLoadingError = false;
											$scope.capsuleUsers = response;
											
											$scope.selectCapsuleUser = function(capsuleUser) {
												$scope.selectedCapsuleUser = capsuleUser.id;

												$scope.quoteData[$scope.quote.id].user_type = 'capsule';

												$scope.quoteData[$scope.quote.id].client_username = typeof capsuleUser.firstName != 'undefined' ? capsuleUser.firstName + ' ' : '';
												$scope.quoteData[$scope.quote.id].client_username += typeof capsuleUser.lastName != 'undefined' ? capsuleUser.lastName : '';
												$scope.quoteData[$scope.quote.id].client_company = typeof capsuleUser.organisationName != 'undefined' ? capsuleUser.organisationName + ' ' : '';
												$scope.quoteData[$scope.quote.id].client_email = typeof capsuleUser.contacts.email.emailAddress != 'undefined' ? capsuleUser.contacts.email.emailAddress + ' ' : '';
											}
										} else if(response.error) {
											$scope.capsuleUsers = false;
											$scope.capsuleLoadingError = response.error;
										}
											
									})
									.error(function(response) {
										console.log(response);										
									});
							}, 1000);
					}

					$scope.quote = response; 
					//console.log(response);
					$scope.addedDevices = {};
					var customAccessoriesIndex = {};
					var customDescriptionsIndex = {};
					
					if ($scope.quote.quoted_devices != null && typeof $scope.quote.quoted_devices != 'undefined') {
						
						$scope.addedDevices = $scope.quote.quoted_devices;
					}
					 
					/*angular.forEach($scope.quote.devices, function(device, index) {
						console.log(index);
						$scope.addedDevices[device.id] = {};
						$scope.addedDevices[device.id][index] = device;
					});*/ 			
					$scope.quoteData = {};
					$scope.quoteData[$scope.quote.id] = {};
					
					if ($scope.quote.user == null) {
						$scope.quoteData[$scope.quote.id].user_type = 'new';
					} else {
						$scope.quoteData[$scope.quote.id].user_type = $scope.quote.user.user_type;
					}
					
					$scope.quoteData[$scope.quote.id].sum_up = $scope.quote.sum_up;
					$scope.quoteData[$scope.quote.id].rates_options = $scope.quote.rates_options;
					$scope.quoteData[$scope.quote.id].displayed_price = $scope.quote.displayed_price;
				 
					angular.forEach($scope.addedDevices, function(variations, deviceId) {
						angular.forEach(variations, function(variationsRate, variationsId) {
							if (typeof $scope.quoteData[$scope.quote.id].rates_options == 'undefined' || $scope.quoteData[$scope.quote.id].rates_options == null) $scope.quoteData[$scope.quote.id].rates_options = 'basic';
						});
					});
					  					
					$scope.updateDevicePrices = function() {
						var i = 0;
						angular.forEach($scope.addedDevices, function(variations, deviceId) {
							
							if (typeof $scope.quoteData[$scope.quote.id].prices[deviceId] == 'undefined') $scope.quoteData[$scope.quote.id].prices[deviceId] = [];
							  	
							angular.forEach(variations, function(variationPrices, variationIndex) {
						
							
								if (typeof $scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex] == 'undefined') $scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex] = {};
								  
								if (typeof $scope.quote.prices != 'undefined' && $scope.quote.prices != null) {									
									
									if (typeof $scope.quote.prices[deviceId] != 'undefined' && typeof $scope.quote.prices[deviceId][variationIndex] != 'undefined') { 
										if (typeof $scope.quote.prices[deviceId][variationIndex].price != 'undefined') {				 
											$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].price = $scope.quote.prices[deviceId][variationIndex].price;
										} else { 
											$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].price = $scope.quote.devices[i].price;										
										}
										if (typeof $scope.quote.prices[deviceId][variationIndex].maintenance_cost != 'undefined') {				 
											$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].maintenance_cost = $scope.quote.prices[deviceId][variationIndex].maintenance_cost;
										} else { 
											$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].maintenance_cost = $scope.quote.devices[i].maintenance_cost;										
										}
										if (typeof $scope.quote.prices[deviceId][variationIndex].maintenance_price != 'undefined') {				 
											$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].maintenance_price = $scope.quote.prices[deviceId][variationIndex].maintenance_price;
										} else { 
											$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].maintenance_price = $scope.quote.devices[i].maintenance_price;										
										}
										if (typeof $scope.quote.prices[deviceId][variationIndex].cost_per_color_page != 'undefined') {				 
											$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].cost_per_color_page = $scope.quote.prices[deviceId][variationIndex].cost_per_color_page;
										} else { 
											$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].cost_per_color_page = $scope.quote.devices[i].cost_per_color_page;										
										}
										if (typeof $scope.quote.prices[deviceId][variationIndex].cost_per_mono_page != 'undefined') {				 
											$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].cost_per_mono_page = $scope.quote.prices[deviceId][variationIndex].cost_per_mono_page;
										} else { 
											$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].cost_per_mono_page = $scope.quote.devices[i].cost_per_mono_page;										
										}
										if (typeof $scope.quote.prices[deviceId][variationIndex].accessories_prices != 'undefined') {				 
											$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].accessories_prices = $scope.quote.prices[deviceId][variationIndex].accessories_prices;
										} else {
											if (typeof $scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].accessories_prices == 'undefined') $scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].accessories_prices = {};
											angular.forEach($scope.quote.devices[i].accessories, function(accessoryOptions, accessoryIndex) {	
											if (typeof $scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].accessories_prices[accessoryOptions.id] == 'undefined') $scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].accessories_prices[accessoryOptions.id] = {'cost': 0, 'price': 0}; 
												$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].accessories_prices[accessoryOptions.id].cost
												= accessoryOptions.cost;
												$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].accessories_prices[accessoryOptions.id].price
												= accessoryOptions.price;
											});	 						
										}
									} else { 
										var id = $filter('getById')($scope.devices, deviceId); 
										var device = $scope.devices[id];
										
										$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].price = device.price;
										$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].maintenance_cost = device.maintenance_cost;
										$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].maintenance_price = device.maintenance_price;
										$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].cost_per_color_page = device.cost_per_color_page;
										$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].cost_per_mono_page = device.cost_per_mono_page;								
										
										if (typeof $scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].accessories_prices == 'undefined') $scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].accessories_prices = {};
										
										angular.forEach(device.accessories, function(accessoryOptions, accessoryIndex) {	
										if (typeof $scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].accessories_prices[accessoryOptions.id] == 'undefined') $scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].accessories_prices[accessoryOptions.id] = {'cost': 0, 'price': 0}; 
											$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].accessories_prices[accessoryOptions.id].cost
											= accessoryOptions.cost;
											$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].accessories_prices[accessoryOptions.id].price
											= accessoryOptions.price;
										});	 
									}
								} else {
									$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].price = $scope.quote.devices[i].price;
									$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].maintenance_cost = $scope.quote.devices[i].maintenance_cost;
									$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].maintenance_price = $scope.quote.devices[i].maintenance_price;
									$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].cost_per_color_page = $scope.quote.devices[i].cost_per_color_page;
									$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].cost_per_mono_page = $scope.quote.devices[i].cost_per_mono_page;
									
									if (typeof $scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].accessories_prices == 'undefined') $scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].accessories_prices = {};
									
									angular.forEach($scope.quote.devices[i].accessories, function(accessoryOptions, accessoryIndex) {	
									if (typeof $scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].accessories_prices[accessoryOptions.id] == 'undefined') $scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].accessories_prices[accessoryOptions.id] = {'cost': 0, 'price': 0}; 
										$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].accessories_prices[accessoryOptions.id].cost
										= accessoryOptions.cost;
										$scope.quoteData[$scope.quote.id].prices[deviceId][variationIndex].accessories_prices[accessoryOptions.id].price
										= accessoryOptions.price;
									});	 
								}	
							});
							i += 1;
						});
											 
						 
						angular.forEach($scope.quoteData[$scope.quote.id].prices, function(variations, deviceId) {
							
							angular.forEach(variations, function(prices, variationIndex) {
							
								if (typeof $scope.quoteData[$scope.quote.id].added_accessories[deviceId] == 'undefined') $scope.quoteData[$scope.quote.id].added_accessories[deviceId] = [];
								if (typeof $scope.quoteData[$scope.quote.id].added_accessories[deviceId][variationIndex] == 'undefined')
									$scope.quoteData[$scope.quote.id].added_accessories[deviceId][variationIndex] = {};
										
								angular.forEach(prices.accessories_prices, function(accessory, accessoryId) {
									
									if (
										(typeof $scope.quote.added_accessories == 'undefined' || $scope.quote.added_accessories == null) ||
										typeof $scope.quote.added_accessories[deviceId] == 'undefined' ||
										typeof $scope.quote.added_accessories[deviceId][variationIndex] == 'undefined'
									) {
										// By default the status is 0
										$scope.quoteData[$scope.quote.id].added_accessories[deviceId][variationIndex][accessoryId] = {
											'status' : 0,
											'price' : accessory.price
										};
									} else {
										if (typeof $scope.quote.added_accessories[deviceId][variationIndex][accessoryId] == 'undefined') {
											$scope.quoteData[$scope.quote.id].added_accessories[deviceId][variationIndex][accessoryId] = {
												'status' : 0,
												'price' : accessory.price
											};									
										} else {
											$scope.quoteData[$scope.quote.id].added_accessories[deviceId][variationIndex][accessoryId] = {
												'status' : $scope.quote.added_accessories[deviceId][variationIndex][accessoryId].status,
												'price' : accessory.price
											};
										}
									}
								});
							});
						});
						
					};
										 
					$scope.findById = function(inputId, inputArray, parameter) {
						if (inputArray instanceof Object) {
							var len = Object.keys(inputArray).length;
						}
						else {
							var len = inputArray.length;
						}
						for (var i = 0; i < len; i++) {
							if (inputArray[i].id == inputId) return inputArray[i][parameter];
						}
					}
					
					$scope.checkForDescriptions = function() {
						 
						angular.forEach($scope.addedDevices, function(addedDevices, deviceId) { 
							angular.forEach(addedDevices, function(variation, variationIndex) {
								if (typeof $scope.quoteData[$scope.quote.id].devices_desc == 'undefined') $scope.quoteData[$scope.quote.id].devices_desc = {};		
								if (typeof $scope.quoteData[$scope.quote.id].devices_desc[deviceId] == 'undefined') $scope.quoteData[$scope.quote.id].devices_desc[deviceId] = {};					
								if (typeof $scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex] == 'undefined') $scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex] = {};	
								
								if (
									$scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].video == null
									||
									$scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].video == ''
								) $scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].video = $scope.findById(deviceId, $scope.quote.devices, 'video');
								
								if (
									$scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].pdf == null
									||									
									$scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].pdf == ''
								) $scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].pdf = $scope.findById(deviceId, $scope.quote.devices, 'pdf');
								 
								if (
									$scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].ced == null
									||
									$scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].ced == ''
								) $scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].ced = $scope.findById(deviceId, $scope.quote.devices, 'ced');
								
								if (
									$scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].color_or_mono == null
									||
									$scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].color_or_mono == ''
								) $scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].color_or_mono = $scope.findById(deviceId, $scope.quote.devices, 'color_or_mono');
								
								if (
									$scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].paper_size == null
									||
									$scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].paper_size == ''
								) $scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].paper_size = $scope.findById(deviceId, $scope.quote.devices, 'paper_size'); 
								
								if (
									$scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].speed == null
									||
									$scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].speed == ''
								) $scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].speed = $scope.findById(deviceId, $scope.quote.devices, 'speed'); 
								
								if (
									$scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].max_monthly_duty_cycle == null
									||
									$scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].max_monthly_duty_cycle == ''
								) $scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].max_monthly_duty_cycle = $scope.findById(deviceId, $scope.quote.devices, 'max_monthly_duty_cycle'); 
							
								if (
									$scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].monthly_volume == null
									||
									$scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].monthly_volume == ''
								) $scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].monthly_volume = $scope.findById(deviceId, $scope.quote.devices, 'monthly_volume'); 
								
								if (
									(
										$scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].best_choice == null
										||
										$scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].best_choice == ''
									)
									&&
									typeof $scope.quote.devices_desc[deviceId] != 'undefined'
									&&
									typeof $scope.quote.devices_desc[deviceId][variationIndex] != 'undefined'
									&&
									typeof $scope.quote.devices_desc[deviceId][variationIndex].best_choice != 'undefined'
								) $scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationIndex].best_choice = $scope.quote.devices_desc[deviceId][variationIndex].best_choice;
							
							});
						});
					}
					/* Add device to a quote BEGIN */
					$scope.quotedDevicesIds = Object.keys($scope.addedDevices);
					$scope.showDeviceIsAlreadyAddedMessage = false;
					$scope.showSelectDeviceMessage = false;
					$scope.showNoMoreAllowedMessage = false;
					$scope.addDeviceToQuote = function () { 
						if (($scope.quote.quoted_devices == null || typeof $scope.quote.quoted_devices == 'undefined')
								&&
							$scope.addedDevices != null
							) {					 
							$scope.addedDevices = {};
							$scope.quote.quoted_devices = $scope.addedDevices;
						}
						if ( $scope.selectedDevice != null
								/*&& typeof $scope.addedDevices[$scope.selectedDevice] === 'undefined'*/
						) {
							var totalLength = 0; 
							angular.forEach($scope.addedDevices, function(addedDevices, deviceId) {
								 
								totalLength += Object.keys(addedDevices).length;
							});
							
							if ( totalLength < 4 // max allowed devices for a quote
							) { 
								if (typeof $scope.addedDevices[$scope.selectedDevice] === 'undefined') { 
									 $scope.addedDevices[$scope.selectedDevice] = [];//{};
									$scope.addedDevices[$scope.selectedDevice][0] = [];//{};// $filter('getById')($scope.devices, $scope.selectedDevice);
									
									
									var devicesLength = $scope.quote.devices.length;
									
									var id = $filter('getById')($scope.devices, $scope.selectedDevice); 
									$scope.quote.devices[devicesLength] = $scope.devices[id];  
						
								} else { 
									var selectedDevicesLength = Object.keys($scope.addedDevices[$scope.selectedDevice]).length;
									 $scope.addedDevices[$scope.selectedDevice][selectedDevicesLength] = []; //$filter('getById')($scope.devices, $scope.selectedDevice);
								}
							} else {
								$scope.showNoMoreAllowedMessage = true;
								$timeout( function(){
									$scope.showNoMoreAllowedMessage = false;
								}, 3000);
							}								
						} else {
							$scope.showSelectDeviceMessage = true;
							$timeout( function(){
								$scope.showSelectDeviceMessage = false;
							}, 3000);
							/*
							$scope.showDeviceIsAlreadyAddedMessage = true;
							$timeout( function(){
								$scope.showDeviceIsAlreadyAddedMessage = false;
							}, 3000);
							*/						
						}
						$scope.selectedDevice = null; 
						$scope.updateDevicePrices();	
						
						$scope.checkForDescriptions();
   
						//console.log($scope.quote.devices);
						//console.log($scope.quoteData[$scope.quote.id]);
					}
					/* Add device to a quote END */

					
					$scope.checkForDescriptions();
					
					$scope.quoteData[$scope.quote.id].editor = $scope.quote.editor != null ? $scope.quote.editor : 'jesse';					
					$scope.quoteData[$scope.quote.id].cover_letter_position = $scope.quote.cover_letter_position != null ? $scope.quote.cover_letter_position : '';
					$scope.quoteData[$scope.quote.id].sales_rep_notes = $scope.quote.sales_rep_notes != null ? $scope.quote.sales_rep_notes : '';
					$scope.quoteData[$scope.quote.id].user_type = $scope.quote.user != null ? $scope.quote.user.user_type : 'new';
					$scope.quoteData[$scope.quote.id].client_username = $scope.quote.user != null ? $scope.quote.user.name : '';
					$scope.quoteData[$scope.quote.id].client_company = $scope.quote.user != null ? $scope.quote.user.company : '';
					$scope.quoteData[$scope.quote.id].client_email = $scope.quote.user != null ? $scope.quote.user.email : '';
						
					if (typeof $scope.quote.devices_desc == 'undefined' || $scope.quote.devices_desc == null) $scope.quote.devices_desc = {};					
					if (typeof $scope.quote.included_pages == 'undefined' || $scope.quote.included_pages == null) $scope.quote.included_pages = {};
					// If these cells are empty in the database, the fetched instances are of type Array, not of Object. So second check is for that
					/*$scope.quoteData[$scope.quote.id].devices_desc =
						( ($scope.quote.devices_desc != null) && (!($scope.quote.devices_desc instanceof Array)) ) ?
						$scope.quote.devices_desc : {};*/
					  					
					$scope.quoteData[$scope.quote.id].included_pages =
						( ($scope.quote.included_pages != null) && (!($scope.quote.included_pages instanceof Array) || Object.keys($scope.quote.included_pages).length > 0) )
						? $scope.quote.included_pages : {};		 
					angular.forEach($scope.addedDevices, function(addedDevices, deviceId) {
						if ( typeof $scope.quoteData[$scope.quote.id].included_pages[deviceId] == 'undefined' ) $scope.quoteData[$scope.quote.id].included_pages[deviceId] = [];
						angular.forEach(addedDevices, function(variation, variationIndex) {						
							if ( typeof $scope.quoteData[$scope.quote.id].included_pages[deviceId][variationIndex] == 'undefined' ) 
								$scope.quoteData[$scope.quote.id].included_pages[deviceId][variationIndex] = {
									'color' : '',
									'mono' : ''
								};
						}); 
					});  
					 					
					$scope.quoteData[$scope.quote.id].custom_accessories = ( ($scope.quote.custom_accessories != null) && (!($scope.quote.custom_accessories instanceof Array))) ? $scope.quote.custom_accessories : {};
					
					$scope.quoteData[$scope.quote.id].custom_descriptions = ( ($scope.quote.custom_descriptions != null) && (!($scope.quote.custom_descriptions instanceof Array)) ) ? $scope.quote.custom_descriptions : {};	
					
					$scope.quoteData[$scope.quote.id].allowed_prices = ( ($scope.quote.allowed_prices != null) && (!($scope.quote.allowed_prices instanceof Array)) ) ? $scope.quote.allowed_prices : {};	
					
					
					// If there is user-corrected price for this device, get the price from the device parameters
					$scope.quoteData[$scope.quote.id].prices = {};
					
					$scope.quoteData[$scope.quote.id].added_accessories = {};
					/* Added accessories are updated in this function */
					$scope.updateDevicePrices();
					
					$scope.changedUserType = function(user_type) {
						$scope.selectedCapsuleUser = null;
						$scope.quoteData[$scope.quote.id].client_username = '';
						$scope.quoteData[$scope.quote.id].client_company = '';
						$scope.quoteData[$scope.quote.id].client_email = '';	
					}
					
					 
					$scope.removeDeviceFromQuote = function (deviceId, variationId) {
						 
						 
						/*if (window.confirm("Are you sure?")) {*/ 
						//delete $scope.addedDevices[deviceId][variationId];
						
						 $scope.addedDevices[deviceId].splice(variationId, 1);
						
						// console.log($scope.quoteData[$scope.quote.id].devices_desc[deviceId]);
						if ($scope.quoteData[$scope.quote.id].devices_desc[deviceId] instanceof Object) {
							delete $scope.quoteData[$scope.quote.id].devices_desc[deviceId][variationId];
						} else {
							$scope.quoteData[$scope.quote.id].devices_desc[deviceId].splice(variationId, 1);
						}
						if ($scope.quoteData[$scope.quote.id].custom_accessories[deviceId]) $scope.quoteData[$scope.quote.id].custom_accessories[deviceId].splice(variationId, 1);
						if ($scope.quoteData[$scope.quote.id].custom_descriptions[deviceId]
						&& $scope.quoteData[$scope.quote.id].custom_descriptions[deviceId][variationId])
						delete $scope.quoteData[$scope.quote.id].custom_descriptions[deviceId][variationId];
						
						if ($scope.quoteData[$scope.quote.id].included_pages[deviceId]
						&& $scope.quoteData[$scope.quote.id].included_pages[deviceId][variationId])
						$scope.quoteData[$scope.quote.id].included_pages[deviceId].splice(variationId, 1);	
						//delete $scope.quoteData[$scope.quote.id].included_pages[deviceId][variationId];	
						  
						 
						
						$scope.quoteData[$scope.quote.id].added_accessories[deviceId].splice(variationId, 1);
						$scope.quoteData[$scope.quote.id].prices[deviceId].splice(variationId, 1);
						
						
						if ($scope.addedDevices[deviceId].length == 0) {
							delete $scope.addedDevices[deviceId];
							
							var idToBeDeleted = $filter('getById')($scope.quote.devices, deviceId); 
							$scope.quote.devices.splice(idToBeDeleted, 1);
							
							//delete $scope.quote.devices[idToBeDeleted];
						}
						//if (Object.keys($scope.quoted_devices[addedDeviceId]).length == 0) delete $scope.quoted_devices[addedDeviceId];*/
						
							
						/*}*/
						//console.log($scope.quoted_devices);
						
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
					 
					angular.forEach($scope.addedDevices, function(devices, deviceId) {
						angular.forEach(devices, function(device, index) {
							//customAccessoriesIndex[index] = ($scope.quote.custom_accessories && $scope.quote.custom_accessories[index]) ? Object.keys($scope.quote.custom_accessories[index]).length : 0;
							if (typeof $scope.addedDevices[deviceId] === 'undefined') { $scope.addedDevices[deviceId] = {}; }
						
						
							if (typeof $scope.addedDevices[deviceId][index] === 'undefined') { $scope.addedDevices[deviceId][index] = {}; }
							 
							$scope.addedDevices[deviceId][index].custom_accessories =
							($scope.quote.custom_accessories && $scope.quote.custom_accessories[deviceId] && $scope.quote.custom_accessories[deviceId][index]) ?
							$scope.quote.custom_accessories[deviceId][index] : {};						
							
							//customDescriptionsIndex[index] = ($scope.quote.custom_descriptions && $scope.quote.custom_descriptions[index]) ? Object.keys($scope.quote.custom_descriptions[index]).length : 0;
							$scope.addedDevices[deviceId][index].custom_descriptions =
							($scope.quote.custom_descriptions && $scope.quote.custom_descriptions[deviceId] && $scope.quote.custom_descriptions[deviceId][index]) ?
							$scope.quote.custom_descriptions[deviceId][index] : {};
						})
					}); 
						
					$scope.addCustomAccessory = function(deviceId, index) {
						
						if (typeof $scope.addedDevices[deviceId][index].custom_accessories == 'undefined'
							|| $scope.addedDevices[deviceId][index].custom_accessories.length < 1
						) {
							$scope.addedDevices[deviceId][index].custom_accessories = {};							
						}
						if (typeof $scope.quoteData[$scope.quote.id].custom_accessories[deviceId] == 'undefined' ) { 
							$scope.quoteData[$scope.quote.id].custom_accessories[deviceId] = [];								
						}
						if (typeof $scope.quoteData[$scope.quote.id].custom_accessories[deviceId][index] == 'undefined'
							||
							$scope.quoteData[$scope.quote.id].custom_accessories[deviceId][index] == null
							||
							Object.keys($scope.quoteData[$scope.quote.id].custom_accessories[deviceId][index]).length < 1
						) {							
							$scope.quoteData[$scope.quote.id].custom_accessories[deviceId][index] = [];								
						}
						var customAccessoriesLength = Object.keys($scope.quoteData[$scope.quote.id].custom_accessories[deviceId][index]).length;
						
						if( customAccessoriesLength < 4) {
							if (customAccessoriesLength > 0)
							{
								var lastAccIndex = customAccessoriesLength; 
							} else {
								var lastAccIndex = 0;
							
							}
							//console.log(lastAccIndex);
							$scope.quoteData[$scope.quote.id].custom_accessories[deviceId][index][lastAccIndex] = {
										id: lastAccIndex + 1,
										part_number: '',
										price: '',
										description: ''
							};
						}
						if (typeof $scope.quote.custom_accessories[deviceId] == 'undefined') {
							$scope.quote.custom_accessories[deviceId] = {};
						};
						$scope.quote.custom_accessories[deviceId][index] = $scope.quoteData[$scope.quote.id].custom_accessories[deviceId][index];
						
					}	 
					
					
					$scope.addCustomDescription = function(deviceId, variationIndex) {
						 
						/*if (typeof $scope.addedDevices[deviceId][variationIndex].custom_descriptions == 'undefined'
							//|| Object.keys($scope.addedDevices[deviceId][variationIndex].custom_descriptions).length < 1
						) {
							$scope.addedDevices[deviceId][variationIndex].custom_descriptions = {};							
						}*/
						
						if (typeof $scope.quoteData[$scope.quote.id].custom_descriptions == 'undefined') {
							$scope.quoteData[$scope.quote.id].custom_descriptions = {};								
						}
						if (typeof $scope.quoteData[$scope.quote.id].custom_descriptions[deviceId] == 'undefined') {
							$scope.quoteData[$scope.quote.id].custom_descriptions[deviceId] = {};								
						}
						if (typeof $scope.quoteData[$scope.quote.id].custom_descriptions[deviceId][variationIndex] == 'undefined'
							|| Object.keys($scope.quoteData[$scope.quote.id].custom_descriptions[deviceId][variationIndex]).length < 1
						) {
							$scope.quoteData[$scope.quote.id].custom_descriptions[deviceId][variationIndex] = {};								
						}
						if(Object.keys($scope.quoteData[$scope.quote.id].custom_descriptions[deviceId][variationIndex]).length < 4) {
							if (Object.keys($scope.quoteData[$scope.quote.id].custom_descriptions[deviceId][variationIndex]).length > 0)
							{
								var lastDescIndex = Object.values($scope.quoteData[$scope.quote.id].custom_descriptions[deviceId][variationIndex])
									[Object.keys($scope.quoteData[$scope.quote.id].custom_descriptions[deviceId][variationIndex]).length - 1].id;
							} else {
								var lastDescIndex = 0;							
							}
							
							$scope.quoteData[$scope.quote.id].custom_descriptions[deviceId][variationIndex][lastDescIndex + 1] = {
										id: lastDescIndex + 1,
										name: '',
										value: ''
							};
							$scope.quoteData[$scope.quote.id].custom_descriptions[deviceId][variationIndex][lastDescIndex + 1] = {
										id: lastDescIndex + 1,
										name: '',
										value: ''
							};
						}  
					} 
					
					$scope.deleteCustomAccessory = function (quoteId, deviceId, variationIndex, customAccessoryIndex) {	
						//delete $scope.addedDevices[deviceId][variationIndex].custom_accessories[customAccessoryId];			
						//delete $scope.quoteData[quoteId].custom_accessories[deviceId][variationIndex][customAccessoryId-1];	
						
						$scope.quoteData[quoteId].custom_accessories[deviceId][variationIndex].splice(customAccessoryIndex, 1)
						
					}
					
					$scope.deleteCustomDescription = function (quoteId, deviceId, variationIndex, customDescriptionId) {
						delete $scope.quoteData[quoteId].custom_descriptions[deviceId][variationIndex][customDescriptionId];			
						//delete $scope.quoteData[quoteId].custom_descriptions[deviceId][variationIndex];							
					}
					/* Custom descriptions and Custom accessories END */
					
					
					$scope.showQuoteSaveSuccessMessage = false;
					$scope.showQuoteSaveErrorMessage = false;
					$scope.saveQuote = function(action) {
						
						if (($scope.quoteData[$scope.quote.id].client_username != '') &&
							($scope.quoteData[$scope.quote.id].client_company != '') &&
							($scope.quoteData[$scope.quote.id].client_email != ''))
						{
							
							/* ???????? */
							/*angular.forEach($scope.quoteData[$scope.quote.id].devices_desc, function(deviceParams, index) {
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
							});*/
							/*angular.forEach($scope.quoteData[$scope.quote.id].custom_descriptions, function(deviceVariations, deviceId) {								
								angular.forEach(deviceVariations, function(variation, variationIndex) {
									if (!(variationIndex in $scope.addedDevices[deviceId])) {
										delete $scope.quoteData[$scope.quote.id].custom_descriptions[deviceId][variationIndex];
									}
								});
							});*/
							/*angular.forEach($scope.quoteData[$scope.quote.id].included_pages, function(deviceParams, index) {
								if (!(index in $scope.addedDevices)) {
									delete $scope.quoteData[$scope.quote.id].included_pages[index];
								}
							});
							angular.forEach($scope.quoteData[$scope.quote.id].prices, function(deviceParams, index) {
								if (!(index in $scope.addedDevices)) {
									delete $scope.quoteData[$scope.quote.id].prices[index];
								}
							});*/
							
							/* Variations */
							$scope.quoted_devices = {};
							 angular.forEach($scope.addedDevices, function(addedDevicesVariations, addedDeviceId) {
								angular.forEach(addedDevicesVariations, function(addedDevicesVariation, addedDevicesVariationsIndex) {
									if ( typeof $scope.quoted_devices[addedDeviceId] == 'undefined' ) {
										$scope.quoted_devices[addedDeviceId] = {};
									}
									$scope.quoted_devices[addedDeviceId][addedDevicesVariationsIndex] = {};
								});
							});		 				
							
							var data = {
								editor: $scope.quoteData[$scope.quote.id].editor,
								cover_letter_position: $scope.quoteData[$scope.quote.id].cover_letter_position,
								sales_rep_notes: $scope.quoteData[$scope.quote.id].sales_rep_notes,
								status: $scope.quote.status,
								user_type: $scope.quoteData[$scope.quote.id].user_type,
								client_username: $scope.quoteData[$scope.quote.id].client_username,
								client_company: $scope.quoteData[$scope.quote.id].client_company,
								client_email: $scope.quoteData[$scope.quote.id].client_email,
								
								added_devices: Object.keys($scope.addedDevices),
								quoted_devices: $scope.quoted_devices,
								
								devices_desc: $scope.quoteData[$scope.quote.id].devices_desc,
								added_accessories: $scope.quoteData[$scope.quote.id].added_accessories,
								custom_accessories: $scope.quoteData[$scope.quote.id].custom_accessories,
								custom_descriptions: $scope.quoteData[$scope.quote.id].custom_descriptions,
								included_pages: $scope.quoteData[$scope.quote.id].included_pages,
								prices: $scope.quoteData[$scope.quote.id].prices,
								
								sum_up: $scope.quoteData[$scope.quote.id].sum_up,
								rates_options: $scope.quoteData[$scope.quote.id].rates_options,
								allowed_prices: $scope.quoteData[$scope.quote.id].allowed_prices,
								displayed_price: $scope.quoteData[$scope.quote.id].displayed_price
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
								})
								.error(function(response) {					
									anchorSmoothScroll.scrollTo('top');
									$scope.showQuoteSaveErrorMessage = true;
									$timeout( function(){
										$scope.showQuoteSaveErrorMessage = false;
									}, 4000);
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
							//console.log(response);
								
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
			$scope.showCsvUploadErrorMessage = false;
			$scope.uploadCsv = function(type, uploadedFile) {
				if (typeof uploadedFile != 'undefined') { 
					
					var formData = new FormData();
					formData.append('file', uploadedFile);

					Device
						.uploadCsv(type, formData)
						.success(function(response) {
							console.log(response);
							$scope.disableCsvUploadButton = true;		
							
							$scope.showCsvUploadSuccessMessage = true;
							$timeout( function(){
								$scope.showCsvUploadSuccessMessage = false;
							}, 4000);						
						})						
						.error(function(response) {
							$scope.disableCsvUploadButton = true;	
							
							$scope.showCsvUploadErrorMessage = true;
							$timeout( function(){
								$scope.showCsvUploadErrorMessage = false;
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
					
					$scope.$watch('uploadedDeviceCed', function() {
						$scope.disableUploadButton['ced'] = !$scope.uploadedDeviceCed;
					});
					
					$scope.$watch('uploadedDeviceImage', function() {
						$scope.disableUploadButton['image'] = !$scope.uploadedDeviceImage;
					});
					
					$scope.uploadFile = function(type, uploadedFile) {
						if (typeof uploadedFile != 'undefined') { 
							
							var formData = new FormData();
							formData.append('file', uploadedFile);

							Device
								.uploadFile(formData)
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