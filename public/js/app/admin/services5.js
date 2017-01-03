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

                unpublish : function(quoteId) {
                    return $http({
                        method: 'POST',
                        url: 'api/quotes/unpublish-quote',
                        data:  {
                            quote_id : quoteId
                        }
                    });
                },

            }
        })
        .factory('Quote', function($http) {

            return {
                get : function(quid) {
                    return $http.get('api/quotes/' + quid);
                },
				
				duplicate : function(quoteToDuplicateId) {
                    return $http({
                        method: 'POST',
                        url: 'api/quotes/duplicate',
                        data:  {
                            quote_to_duplicate_id : quoteToDuplicateId
                        }  
                    });
                },
				
                getCapsuleUsers : function() {
                    return $http.get('api/quotes/get-capsule-users');
                },

                update : function(quoteId, quoteData) {
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

               /* save : function(commentData) {
                    return $http({
                        method: 'POST',
                        url: 'api/users',
                        headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                        data: $.param(commentData)
                    });
                },

                destroy : function(id) {
                    return $http.delete('api/users/' + id);
                }*/
            }
        })
        .factory('Device', function($http) {

            return {
                getAll : function() {					
                    return $http.get('api/devices');
                },
				
                get : function(id) {
                    return $http.get('api/devices/' + id);
                },
				
                getMostQuoted : function() {					
                    return $http.get('api/devices/qet-most-quoted');
                },

                save : function() {
                    return $http({
                        method: 'POST',
                        url: 'api/devices'
                    });
                },

                update : function(device, deviceAccessories) {
					return $http({
                        method: 'PUT',
                        url: 'api/devices/' + device.id,
                        data:  {
							device_data: device,
                            accessories: deviceAccessories
                        }
                    });
                },
				
				uploadFile : function(formData) {
                    return $http({
						method: "POST",
						url: 'api/devices/upload-file',
						dataType: 'json',
						data: formData,
						headers: {'Content-Type': undefined}
					});
                },
				
				uploadCsv : function(type, formData) {
                    return $http({
						method: "POST",
						url: 'api/' + type + '/upload-csv',
						dataType: 'json',
						data: formData,
						headers: {'Content-Type': undefined}
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
				
                searchByPartNumber : function(valueToSearch) {
					console.log(valueToSearch);
                    return $http.get('api/accessories/search-by-part-number/' + valueToSearch);
                },

				save : function(accessory) {
                    return $http({
                        method: 'POST',
                        url: 'api/accessories', 
                        data: accessory
                    });
                },	

                update : function(accessory) {
                    return $http({
                        method: 'PUT',
                        url: 'api/accessories/' + accessory.id,
                        data:  accessory
                    });
                },		

                /*update : function(accessory) {
                    return $http({
                        method: 'PUT',
                        url: 'api/accessories/' + accessory.id,
                        data:  quoteData
                    }); 
                },*/

              /*  update : function(deviceAccessories) {
                    return $http({
                        method: 'PUT',
                        url: 'api/accessories' + deviceId,
                        headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                        data:  {
                            accessories: deviceAccessories
                        }

                    });
                },*/

                destroy : function(id) {
                    return $http.delete('api/accessories/' + id);
                }
            }
        })
        .factory('anchorSmoothScroll', function(){
            return {
                scrollTo : function(eID) {

					var startY = currentYPosition();
					var stopY = elmYPosition(eID);
					var distance = stopY > startY ? stopY - startY : startY - stopY;
					if (distance < 100) {
						scrollTo(0, stopY); return;
					}
					var speed = Math.round(distance / 100);
					if (speed >= 20) speed = 20;
					var step = Math.round(distance / 25);
					var leapY = stopY > startY ? startY + step : startY - step;
					var timer = 0;
					if (stopY > startY) {
						for ( var i=startY; i<stopY; i+=step ) {
							setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
							leapY += step; if (leapY > stopY) leapY = stopY; timer++;
						} return;
					}
					for ( var i=startY; i>stopY; i-=step ) {
						setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
						leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
					}
					
					function currentYPosition() {
						// Firefox, Chrome, Opera, Safari
						if (self.pageYOffset) return self.pageYOffset;
						// Internet Explorer 6 - standards mode
						if (document.documentElement && document.documentElement.scrollTop)
							return document.documentElement.scrollTop;
						// Internet Explorer 6, 7 and 8
						if (document.body.scrollTop) return document.body.scrollTop;
						return 0;
					}
					
					function elmYPosition(eID) {
						var elm = document.getElementById(eID);
						var y = elm.offsetTop;
						var node = elm;
						while (node.offsetParent && node.offsetParent != document.body) {
							node = node.offsetParent;
							y += node.offsetTop;
						} return y;
					}
				}
            }
		});
})();
