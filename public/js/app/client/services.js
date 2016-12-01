(function() {

    'use strict';

    angular
        .module('ClientQuoteService', [])
        .factory('ClientQuote', function($http) {

            return {
                get : function(quid) {
                    return $http.get('api/quotes/' + quid);
                },

                /*save : function() {
                    return $http({
                        method: 'POST',
                        url: 'api/quotes'
                    });
                },*/

                update : function(quoteGuid, selectedAccessories) {
                    return $http({
                        method: 'PUT',
                        url: 'api/quotes/' + quoteGuid,
                        data:  {
                            selected_accessories: selectedAccessories
                        }

                    });
                },

            }
        })
})();
