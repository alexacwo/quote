(function() {

    'use strict';

    angular
        .module('clientCtrl', [])
        .controller('ClientController', function($scope, $http, $window, $timeout, $routeParams, ClientQuote){

            $scope.showQuoteMainPage = true;
            $scope.showQuotedDeviceBlock = false;
            $scope.deviceToShow = [];

            $scope.saveCalculation = function (quoteGuid, deviceId) {

                console.log(quoteGuid);
                ClientQuote
                    .update(quoteGuid, $scope.selectedAccessoriesWithPrices)
                    .success(function(response) {
                        console.log(response);
                        $scope.showQuotedDeviceBlock = false;
                        $scope.deviceToShow[deviceId] = false;

                        $timeout(function () {
                            $scope.showQuoteMainPage = true;
                        }, 500);
                    });
            }

            $scope.showQuotedDevice = function (quotedDeviceId) {
                $scope.showQuoteMainPage = false;

                $timeout(function () {
                    $scope.showQuotedDeviceBlock = true;
                    $scope.deviceToShow[quotedDeviceId] = true;
                }, 500);
            }

            ClientQuote
                .get($routeParams.quote)
                .success(function(response) {
                    console.log(response);
                    $scope.quote = response;

                    $scope.selectedAccessoriesWithPrices = $scope.quote.selected_accessories != null ? $scope.quote.selected_accessories : {};

                    $scope.outrightPrices = {};
                    angular.forEach($scope.quote.prices, function (prices, deviceId) {
                        $scope.outrightPrices[deviceId] = parseInt(prices.base);
                        $scope.prevOutrightPrices = $scope.outrightPrices;
                    });

                    angular.forEach($scope.selectedAccessoriesWithPrices, function(selectedAccessoriesWithPrices, deviceId) {
                        angular.forEach(selectedAccessoriesWithPrices, function(accessoryPrice, accessoryId) {
                            if (accessoryPrice == 0) {
                                delete $scope.selectedAccessoriesWithPrices[deviceId][accessoryId];
                            }
                            $scope.outrightPrices[deviceId] += parseInt(accessoryPrice);
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
                    $scope.priceTerms = {};
                    $scope.outrightPricesWithRates = {};

                    $scope.countRates = function(deviceId) {
                         if ($scope.outrightPrices[deviceId] < 3000) {
                            $scope.priceTerms[deviceId] = 3000;
                        } else if ($scope.outrightPrices[deviceId] < 10000) {
                            $scope.priceTerms[deviceId] = 10000;
                        } else if ($scope.outrightPrices[deviceId] < 250000) {
                            $scope.priceTerms[deviceId] = 250000;
                        }
                        angular.forEach($scope.rates.fmv[$scope.priceTerms[deviceId]], function (rate, numberOfYears) {
                            $scope.outrightPricesWithRates[deviceId].fmv[numberOfYears] = Math.ceil($scope.outrightPrices[deviceId] * rate);
                        });
                        angular.forEach($scope.rates.oneOut[$scope.priceTerms[deviceId]], function (rate, numberOfYears) {
                            $scope.outrightPricesWithRates[deviceId].oneOut[numberOfYears] = Math.ceil($scope.outrightPrices[deviceId] * rate);
                        });
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

                    $scope.recalculatePrice = function(deviceId) { 
                        if (typeof $scope.selectedAccessoriesWithPrices[deviceId] == 'undefined') $scope.selectedAccessoriesWithPrices[deviceId] = {};
						 
                        $scope.outrightPrices[deviceId] = parseInt($scope.quote.prices[deviceId].base);

                        angular.forEach($scope.selectedAccessoriesWithPrices[deviceId], function(accessoryPrice, accessoryId) {
                            if (accessoryPrice == 0) {
                                delete $scope.selectedAccessoriesWithPrices[deviceId][accessoryId];
                            }
                            $scope.outrightPrices[deviceId] += accessoryPrice;

                            $scope.countRates(deviceId);
                        }); 
                    }

                });
        });

})();