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
				
                getCapsuleUsers : function() {
                    return $http.get('api/quotes/get-capsule-users');
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
