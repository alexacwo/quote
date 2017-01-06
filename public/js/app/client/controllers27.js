(function() {

    'use strict';

    angular
        .module('clientCtrl', [])
        .controller('ClientController', function($scope, $http, $window, $timeout, $routeParams, ClientQuote, anchorSmoothScroll){
			
			$scope.clientPhoneNumber = '';

            ClientQuote
                .get($routeParams.quote)
                .success(function(response) {
					
                    //console.log(response);                    
					
					if(Object.keys(response).length > 0) {
					
						$scope.seeAllRates = {}; 
						
						var offset = -7;
						var currentDenverDateTime = new Date( new Date().getTime() + offset * 3600 * 1000);				
						var formattedCurrentDenverDateTime =
							currentDenverDateTime.getUTCFullYear()
							+ "-"
							+ ("0" + (currentDenverDateTime.getUTCMonth()+1)).slice(-2)
							+ "-"
							+ ("0" + currentDenverDateTime.getUTCDate()).slice(-2)
							+ " "
							+ ("0" + currentDenverDateTime.getUTCHours()).slice(-2)
							+ ":"
							+ ("0" + currentDenverDateTime.getUTCMinutes()).slice(-2)
							+ ":"
							+  ("0" + currentDenverDateTime.getUTCSeconds()).slice(-2);							
						var incrementedNumberOfViews = parseInt(response.no_of_views) + 1;
						
						ClientQuote
							.updateNumberOfViews($routeParams.quote, incrementedNumberOfViews, formattedCurrentDenverDateTime)
							.success(function(response) {
								//console.log(response);
							});						
					
						// If there is just 1 device quoted, then go straight to the device specifications
						// If there is more than 1 device, show the main page first
						/*if (response.devices.length > 1) {*/
							$scope.showQuoteMainPage = true;
							$scope.showQuotedDeviceBlock = false;
							$scope.deviceToShow = [];
						/*} else {
							$scope.showQuoteMainPage = false;
							$scope.showQuotedDeviceBlock = true;
							$scope.deviceToShow = [];
							$scope.deviceToShow[response.devices[0].id] = true;
						}*/

						$scope.quote = response; 
						$scope.lowerCreditRating = {};
						angular.forEach($scope.quote.rates_options, function(option, deviceId) {
							switch (option) { 
								case 'marlin':
									$scope.lowerCreditRating[deviceId] = 'marlin';
									break;
								case 'basic':
								case 'either':
								case '':
									$scope.lowerCreditRating[deviceId] = 'basic';
									break;
							}							 
						}); 
			
						console.log($scope.quote.rates_options);
						console.log($scope.lowerCreditRating);
						
						angular.forEach($scope.quote.devices, function(device, deviceIndex) {
							 
							
							if (typeof $scope.lowerCreditRating == 'undefined' || $scope.lowerCreditRating == null ) $scope.lowerCreditRating = {};
							 if (typeof $scope.lowerCreditRating[device.id] == 'undefined') $scope.lowerCreditRating[device.id] = 'basic';
						}); 
						
						$scope.showQuotedDevice = function (quotedDeviceId) {
							$scope.showQuoteMainPage = false;
							anchorSmoothScroll.scrollTo('top');
							
							$timeout(function () {
								$scope.showQuotedDeviceBlock = true;
								$scope.deviceToShow[quotedDeviceId] = true;
							}, 500);
						}
						
						if ($scope.quote.selected_accessories != null) {
							if (typeof $scope.selectedAccessoriesWithPrices == 'undefined') $scope.selectedAccessoriesWithPrices = {};
							angular.forEach($scope.quote.selected_accessories, function (accessories, deviceId) {
								if (typeof $scope.selectedAccessoriesWithPrices[deviceId] == 'undefined') $scope.selectedAccessoriesWithPrices[deviceId] = {};
								
								angular.forEach(accessories, function (accessory, accessoryId) {
									if (typeof $scope.selectedAccessoriesWithPrices[deviceId][accessoryId] == 'undefined') $scope.selectedAccessoriesWithPrices[deviceId][accessoryId] = {};
									$scope.selectedAccessoriesWithPrices[deviceId][accessoryId].status = accessory.status;
									$scope.selectedAccessoriesWithPrices[deviceId][accessoryId].price = parseInt($scope.quote.added_accessories[deviceId][accessoryId].price);
								});
							});
						} else {
							$scope.selectedAccessoriesWithPrices = $scope.quote.added_accessories;
						}
												
						$scope.selectedCustomAccessoriesWithPrices = $scope.quote.selected_custom_accessories != null ? $scope.quote.selected_custom_accessories : {};

						$scope.outrightPrices = {};
						angular.forEach($scope.quote.prices, function (prices, deviceId) {
							$scope.outrightPrices[deviceId] = parseInt(prices.price);
							$scope.prevOutrightPrices = $scope.outrightPrices; 
						});

						angular.forEach($scope.selectedAccessoriesWithPrices, function(selectedAccessoriesWithPrices, deviceId) {
							angular.forEach(selectedAccessoriesWithPrices, function(accessoryPrice, accessoryId) {
								if (accessoryPrice.price == 0) {
									//delete $scope.selectedAccessoriesWithPrices[deviceId][accessoryId];
								}
								if (accessoryPrice.price > 0 && accessoryPrice.status == 2) {
									$scope.outrightPrices[deviceId] += parseInt(accessoryPrice.price);
								}
							});
						});

						angular.forEach($scope.selectedCustomAccessoriesWithPrices, function(selectedCustomAccessoriesWithPrices, deviceId) {
							angular.forEach(selectedCustomAccessoriesWithPrices, function(accessoryPrice, accessoryId) { 
								if (accessoryPrice == 0 || accessoryPrice == null) {
									delete $scope.selectedCustomAccessoriesWithPrices[deviceId][accessoryId];
								} 
								if (accessoryPrice > 0) {
									$scope.outrightPrices[deviceId] += parseInt(accessoryPrice);
								}
							});
						});
						
						$scope.priceTerms = {};
						$scope.outrightPricesWithRates = {};
						$scope.totalRates = {}; 
						$scope.rates = {
							fmv: {
								3000: {
									1: 0.0901, 2: 0.0471, 3: 0.0312, 4: 0.0284, 5: 0.0219
								},
								10000: {
									1: 0.0891, 2: 0.0452, 3: 0.0283, 4: 0.0239, 5: 0.0192
								},
								250000: {
									1: 0.0888, 2: 0.0444, 3: 0.0281, 4: 0.0236, 5: 0.0190
								},
							},
							oneOut: {
								3000: {
									1: 0.0968, 2: 0.0509, 3: 0.0352, 4: 0.0293, 5: 0.0253
								},
								10000: {
									1: 0.0919, 2: 0.0495, 3: 0.0333, 4: 0.0262, 5: 0.0221
								},
								250000: {
									1: 0.0917, 2: 0.0487, 3: 0.0325, 4: 0.0257, 5: 0.0216
								},
							}
						};						
						$scope.lowerRates = {
							fmv: {
								3000: {
									1: 0.0833, 2: 0.0444, 3: 0.0302, 4: 0.0253, 5: 0.0215
								},
								10000: {
									1: 0.0820, 2: 0.0424, 3: 0.0275, 4: 0.0223, 5: 0.0187
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

						$scope.countRates = function(deviceId) {
							$scope.totalRates = {
								fmv: {
									1: 0, 2: 0, 3: 0, 4: 0, 5: 0
								},
								oneOut: {
									1: 0, 2: 0, 3: 0, 4: 0, 5: 0
								}							
							};
							
							switch ($scope.lowerCreditRating[deviceId]) { 
								case 'marlin':
										//Higher rates
										//if (isNaN($scope.outrightPrices[deviceId])) $scope.outrightPrices[deviceId] = 0;
										if ($scope.outrightPrices[deviceId] < 3000) {
											$scope.priceTerms[deviceId] = 3000;
										} else if ($scope.outrightPrices[deviceId] < 10000) {
											$scope.priceTerms[deviceId] = 10000;
										} else {
											$scope.priceTerms[deviceId] = 250000;
										} 
										angular.forEach($scope.rates.fmv[$scope.priceTerms[deviceId]], function (rate, numberOfYears) {
										 
											$scope.outrightPricesWithRates[deviceId].fmv[numberOfYears] = Math.ceil($scope.outrightPrices[deviceId] * rate);
										 
											// $scope.totalRates.fmv[numberOfYears] += $scope.outrightPricesWithRates[deviceId].fmv[numberOfYears];
										});
										angular.forEach($scope.rates.oneOut[$scope.priceTerms[deviceId]], function (rate, numberOfYears) {
											$scope.outrightPricesWithRates[deviceId].oneOut[numberOfYears] = Math.ceil($scope.outrightPrices[deviceId] * rate);
											// $scope.totalRates.oneOut[numberOfYears] += $scope.outrightPricesWithRates[deviceId].oneOut[numberOfYears];
										});
									break;
								case  'basic':
								case  'either':
									//Lower rates
									if (isNaN($scope.outrightPrices[deviceId])) $scope.outrightPrices[deviceId] = 0;
									if ($scope.outrightPrices[deviceId] < 3000) {
										$scope.priceTerms[deviceId] = 3000;
									} else if ($scope.outrightPrices[deviceId] < 10000) {
										$scope.priceTerms[deviceId] = 10000;
									} else if ($scope.outrightPrices[deviceId] < 250000) {
										$scope.priceTerms[deviceId] = 250000;
									}
									angular.forEach($scope.lowerRates.fmv[$scope.priceTerms[deviceId]], function (rate, numberOfYears) {
										$scope.outrightPricesWithRates[deviceId].fmv[numberOfYears] = Math.ceil($scope.outrightPrices[deviceId] * rate);
										// $scope.totalRates.fmv[numberOfYears] += $scope.outrightPricesWithRates[deviceId].fmv[numberOfYears];
									});
									angular.forEach($scope.lowerRates.oneOut[$scope.priceTerms[deviceId]], function (rate, numberOfYears) {
										$scope.outrightPricesWithRates[deviceId].oneOut[numberOfYears] = Math.ceil($scope.outrightPrices[deviceId] * rate);
										// $scope.totalRates.oneOut[numberOfYears] += $scope.outrightPricesWithRates[deviceId].oneOut[numberOfYears];
									});
									break;
							}
						}
						
						
						angular.forEach($scope.outrightPrices, function (prices, deviceId) { 
							if (typeof $scope.outrightPricesWithRates[deviceId] == 'undefined') {
								$scope.outrightPricesWithRates[deviceId] = {
									fmv: {},
									oneOut: {}
								};
							}
							$scope.countRates(deviceId);
						}); 
						
						$scope.findMinimumValue = function(object){
							var pricesArray = Object.values(object);
							var min = pricesArray[0];

							for(var i=1;i<= pricesArray.length-1;i++){

								if(parseInt(pricesArray[i]) < min){
									min = pricesArray[i];
								}
							}
							return min;
						}
						
						$scope.$watch('outrightPricesWithRates', function() {
							$scope.totalRates = {
								fmv: {
								1: 0, 2: 0, 3: 0, 4: 0, 5: 0
								},
								oneOut: {
								1: 0, 2: 0, 3: 0, 4: 0, 5: 0
								}							
							};
							
							angular.forEach($scope.outrightPricesWithRates, function (rates, deviceId) {							  
								var outrightPricesWithRatesArray = Object.values($scope.outrightPricesWithRates);
							});
							
							$scope.allValues = {									
								fmv: {
									1: [], 2: [], 3: [], 4: [], 5: []
								},
								oneOut: {
									1: [], 2: [], 3: [], 4: [], 5: []
								}	
							};
							
							$scope.minFmvPricesWithRates = {
								1: 1111111111111111111111,
								2: 1111111111111111111111,
								3: 1111111111111111111111,
								4: 1111111111111111111111,
								5: 1111111111111111111111	
							};
							
							$scope.minOneoutPricesWithRates = {
								1: 1111111111111111111111,
								2: 1111111111111111111111,
								3: 1111111111111111111111,
								4: 1111111111111111111111,
								5: 1111111111111111111111	
							};
								
							angular.forEach($scope.outrightPricesWithRates, function (rates, deviceId) {
								angular.forEach(rates.fmv, function (rate, numberOfYears) {
									$scope.totalRates.fmv[numberOfYears] += rate;
									$scope.allValues.fmv[numberOfYears].push(rate);
								});
								angular.forEach(rates.oneOut, function (rate, numberOfYears) {
									$scope.totalRates.oneOut[numberOfYears] += rate;
									$scope.allValues.oneOut[numberOfYears].push(rate);
								}); 
							});   
								 
							angular.forEach($scope.allValues.fmv, function (rates, numberOfYears) {
								for(var i=0;i<= rates.length-1;i++){
									if (rates[i] < $scope.minFmvPricesWithRates[numberOfYears]) {
										$scope.minFmvPricesWithRates[numberOfYears] = rates[i];
									}
								}
							});
							angular.forEach($scope.allValues.oneOut, function (rates, numberOfYears) {
								for(var i=0;i<= rates.length-1;i++){
									if (rates[i] < $scope.minOneoutPricesWithRates[numberOfYears]) {
										$scope.minOneoutPricesWithRates[numberOfYears] = rates[i];
									}
								}
							});
							
							$scope.minOutrightPurchasePrice = $scope.findMinimumValue($scope.outrightPrices); 
						}, true);
						

						$scope.recalculatePrice = function(deviceId) {
							if (typeof $scope.selectedAccessoriesWithPrices[deviceId] == 'undefined' && (!($scope.selectedAccessoriesWithPrices[deviceId] instanceof Array))) $scope.selectedAccessoriesWithPrices[deviceId] = {};
							if (typeof $scope.selectedCustomAccessoriesWithPrices[deviceId] == 'undefined' && (!($scope.selectedCustomAccessoriesWithPrices[deviceId] instanceof Array)))  $scope.selectedCustomAccessoriesWithPrices[deviceId] = {};
							
							//console.log($scope.selectedCustomAccessoriesWithPrices[deviceId]);
							 
							$scope.outrightPrices[deviceId] = parseInt($scope.quote.prices[deviceId].price);
	 
							angular.forEach($scope.selectedAccessoriesWithPrices[deviceId], function(accessoryPrice, accessoryId) {
								if (accessoryPrice.price == 0) {
									//delete $scope.selectedAccessoriesWithPrices[deviceId][accessoryId];
								}
								if (accessoryPrice.price > 0 && accessoryPrice.status == 2) {
									$scope.outrightPrices[deviceId] += accessoryPrice.price;
								}

								$scope.countRates(deviceId);
							});
							angular.forEach($scope.selectedCustomAccessoriesWithPrices[deviceId], function(accessoryPrice, accessoryId) {
								if (accessoryPrice == 0) {
									delete $scope.selectedCustomAccessoriesWithPrices[deviceId][accessoryId];
								}
								$scope.outrightPrices[deviceId] += accessoryPrice;

								$scope.countRates(deviceId);
							});
							 
						}
						
						/* Count the total values BEGIN */						
							
						$scope.countMaintenancePrice = function() {	
							$scope.totalMaintenancePrice = 0;	
							
							var maintenancePrices = Object.values($scope.quote.prices);
							
							$scope.minMaintenancePrice = maintenancePrices[0].maintenance_price;							
							angular.forEach($scope.quote.prices, function(prices, deviceId) {
								if (prices.maintenance_price > 0) {
									$scope.totalMaintenancePrice += parseInt(prices.maintenance_price);
								}
								if (prices.maintenance_price < $scope.minMaintenancePrice) {
									$scope.minMaintenancePrice = prices.maintenance_price;
								}
								
							});					
						}
						$scope.countOutrightPrice = function() {
							$scope.totalOutrightPrice = 0;							
							angular.forEach($scope.outrightPrices, function(outrightPrice, deviceId) {
								if (outrightPrice > 0) {
									$scope.totalOutrightPrice += parseInt(outrightPrice);
								}
							});					
						}
						
						$scope.countMaintenancePrice();
					 
						$scope.$watch('outrightPrices', function() {
							$scope.countOutrightPrice();
						}, true);
						/* Count the total values END */
						
						/* How Did We Do? BEGIN */
						$scope.howDidWeDo = ((typeof $scope.quote.how_did_we_do !== 'undefined') && ($scope.quote.how_did_we_do !== null)) ? $scope.quote.how_did_we_do : {};						
						console.log($scope.howDidWeDo);
						$scope.clearHowDidWeDoOptions = function(deviceId) {
							$scope.howDidWeDo[deviceId] = {
								"improvement" : "perfect"
							}
						}
						/* How Did We Do? END */
						
						$scope.showPopupAfterSavingQuote = false;
						$scope.closePopup = function (event) {
							
							if (clickedElement.id == 'popup_wrapper') {
								$scope.showPopupAfterSavingQuote = false;
							}
								$scope.showPopupAfterSavingQuote = false;
								$scope.apply;
						}
						$scope.saveCalculation = function (quoteGuid, deviceId) {

							//console.log(quoteGuid);
							ClientQuote
								.update(quoteGuid, $scope.selectedAccessoriesWithPrices, $scope.selectedCustomAccessoriesWithPrices, $scope.howDidWeDo)
								.success(function(response) {
									var devicesAmount = $scope.quote.devices.length;
									
									if (devicesAmount > 1) {
										$scope.showQuotedDeviceBlock = false;
										$scope.deviceToShow[deviceId] = false;
										anchorSmoothScroll.scrollTo('top');

										$timeout(function () {
											$scope.showQuoteMainPage = true;
										}, 500);
									} else {
										$scope.showPopupAfterSavingQuote = true; 
										$scope.hidePopup = function () { 
											$scope.showPopupAfterSavingQuote = false;	
										}; 
									}
								});
						}
						
						$scope.showPhoneCallbackSuccessMessage = false;
						$scope.sendMail = function(recipientEditor) {							
							ClientQuote
								.sendMail($scope.clientPhoneNumber, recipientEditor)
								.success(function(response) {
									console.log(response);
									$scope.clientPhoneNumber = '';									
									
									$scope.showPhoneCallbackSuccessMessage = true;
									$timeout(function () {
										$scope.showPhoneCallbackSuccessMessage = false;
									}, 4000);
								});
						} 
						
					} else {						
						$window.location.href = '';
					}
			
                });
				
        });

})();