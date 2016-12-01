(function() {

    'use strict';

    angular
        .module('QuoteService', [])
        .factory('Quotes', function($http) {

            return {
                getAll : function() {
                    return $http.get('api/quotes');
                },

                save : function() {
                    return $http({
                        method: 'POST',
                        url: 'api/quotes'
                    });
                },

            }
        })
        .factory('Quote', function($http) {

            return {
                get : function(quid) {
                    return $http.get('api/quotes/' + quid);
                },

                update : function(quoteId, quoteData) {
					console.log(quoteId);
					console.log(quoteData);
                    return $http({
                        method: 'PUT',
                        url: 'api/quotes/' + quoteId,
                        data:  quoteData
                    }); 
                },

           /*     destroy : function(id) {
                    return $http.delete('api/quotes/' + id);
                }*/
            }
        })
        .factory('User', function($http) {

            return {
                get : function() {
                    return $http.get('api/users');
                },

                save : function(commentData) {
                    return $http({
                        method: 'POST',
                        url: 'api/users',
                        headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                        data: $.param(commentData)
                    });
                },

                destroy : function(id) {
                    return $http.delete('api/users/' + id);
                }
            }
        })
        .factory('Device', function($http) {

            return {
                get : function() {					
                    return $http.get('api/devices');
                },
				
                getMostQuoted : function() {					
                    return $http.get('api/devices/qet-most-quoted');
                },

                save : function(commentData) {
                    return $http({
                        method: 'POST',
                        url: 'api/devices',
                        headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                        data: $.param(commentData)
                    });
                },

                update : function(deviceId, deviceAccessories) {
                    return $http({
                        method: 'PUT',
                        url: 'api/devices/' + deviceId,
                        data:  {
                            accessories: deviceAccessories
                        }

                    });
                },

                destroy : function(id) {
                    return $http.delete('api/devices/' + id);
                }
            }
        })
        .factory('Accessory', function($http) {

            return {
                get : function() {
                    return $http.get('api/accessories');
                },

                save : function(commentData) {
                    return $http({
                        method: 'POST',
                        url: 'api/accessories', 
                        data: $.param(commentData)
                    });
                },

                update : function(deviceAccessories) {
                    return $http({
                        method: 'PUT',
                        url: 'api/accessories' + deviceId,
                        headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                        data:  {
                            accessories: deviceAccessories
                        }

                    });
                },

                destroy : function(id) {
                    return $http.delete('api/accessories/' + id);
                }
            }
        })
})();
