(function() {

    'use strict';

    angular
        .module('ClientQuoteService', [])
        .factory('ClientQuote', function($http) {

            return {
                get : function(quid) {
                    return $http.get('api/quotes/' + quid);
                },
                update : function(quoteGuid, selectedAccessories, selectedCustomAccessories, howDidWeDo) {
                    return $http({
                        method: 'PUT',
                        url: 'api/quotes/' + quoteGuid,
                        data:  {
                            selected_accessories: selectedAccessories,
							selected_custom_accessories: selectedCustomAccessories,
							how_did_we_do: howDidWeDo
                        }
                    });
                },
                updateNumberOfViews : function(quoteGuid, incrementedNumberOfViews, currentDenverDateTime) {
                    return $http({
                        method: 'POST',
                        url: 'api/quotes/update_views_counter/' + quoteGuid,
                        data:  {
                            no_of_views: incrementedNumberOfViews,
							last_view: currentDenverDateTime
                        }
                    });
                },
                sendMail : function(clientPhoneNumber, recipientEditor) {
                    return $http({
                        method: 'POST',
                        url: 'api/send_mail',
                        data: {
							phone_number: clientPhoneNumber,
							recipient: recipientEditor
						}
                    });
                },
                sendNotification : function
				( 	
					clientPhoneNumber,
					recipientEditor,
					quoteReview,
					clientSheetData,
					howDidWeDo,
					quoteGuid,
					company
				)
				{
					return $http({
						method: 'POST',
						url: 'api/send_notification',
						data: {
							quote_review : quoteReview,
							phone_number: clientPhoneNumber,
							recipient: recipientEditor,
							pdf_base64_data: clientSheetData,
							quote_annotations: howDidWeDo,
							quote_guid: quoteGuid,
							company: company
						}
					});
                },
                sendLeaseNotification : function
				( 	
					offerStatus,
					recipientEditor,
					leaseForm,
					company
				)
				{
					return $http({
						method: 'POST',
						url: 'api/send_lease_notification',
						data: {
							offer_status : offerStatus,
							recipient: recipientEditor,
							lease_form: leaseForm,
							company: company
						}
					});
                },
                generatePDF : function(quoteGuid, clientSheetData, pdfArray) {
                    return $http({
                        method: 'POST',
                        url: 'api/generate_pdf',
                        data: {
							guid: quoteGuid,
							client_sheet_data: clientSheetData,
							pdfs_array: pdfArray
						}
                    });
                },
                confirmSaving : function(guId) {
                    return $http({
                        method: 'POST',
                        url: 'api/confirm_saving',
                        data: {
							guid: guId
						}
                    });
                },

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
