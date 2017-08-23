$(window).load(function() {
    $(".preload").addClass('active');
});

$(function () {
    var isMobile = fc.mobilecheck();
    var startScroll = $(document).scrollTop();

    /* STICKY HEADER */
    var header = $(".headroom_div")[0];
    // construct an instance of Headroom, passing the element
    var headroom = new Headroom(header, {
        "offset": 100,
        "tolerance": 10,
        "classes": {
          "initial": "headroom",
          "pinned": "headroom--pinned",
          "unpinned": "headroom--unpinned"
        }
    });
    headroom.init();

    /* RESPONSIVE MENU */
    $(".account-menu .account-menu-item").hide();
    $(".account-menu").click(function(){
        $(".login-btn").removeClass("expanded");
        $("#login-screen").removeClass("animatedSpecial").addClass("animatedSpecialOut");
        $(this).find(".account-menu-item").toggle();
    });
    $("#work ul.applications").on("click", "li", function (e) {
        e.preventDefault();
        $(this).toggleClass("selected");
    });
    $("body").on("click", ".register-jump, .start_being_productive_btn", function (e) {
        e.preventDefault();
        if (!$(".register.container").is(':visible')) {
            $(".register.container").show();
        }
        var startScroll = $(document).scrollTop();
        var scrollTo = $("#email").offset().top - 85;
        if (startScroll > scrollTo || ((scrollTo - startScroll) < $(".headroom_div").height())) {
            scrollTo = scrollTo - $(".headroom_div").height();
        }
        $('html, body').animate({
            scrollTop: scrollTo
        }, 800);
        $("#email").focus();
    });

    // HOW FREE MODAL ANIMATION
    $(".center-piece").on("click", ".how-free", function (e) {
        e.preventDefault();
        $(".how-free-overlay").removeClass("animated zoomOut");
        $(".how-free-overlay").show().addClass("animated zoomIn");
        fc.logEvent("front", "how_free");
    });

    $(".how-free-overlay").on("click", ".how-free-close", function (e) {
        e.preventDefault();
        closeFreeOverlay();
    });

    function closeFreeOverlay() {
        $(".how-free-overlay").removeClass("animated zoomIn");
        $(".how-free-overlay").addClass("animated zoomOut");
        setTimeout(function () {
            $(".how-free-overlay").hide();
        }, 1500);
    }

    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            closeFreeOverlay();   // esc
        }
    });
    // END HOW FREE MODAL ANIMATION

    $("body").on("click", ".login-btn", function (e) {
        e.preventDefault();
        $th = $(this);
        if ($th.hasClass("expanded")) {
            $th.removeClass("expanded");
            $("#login-screen").removeClass("animatedSpecial");
            $("#login-screen").addClass("animatedSpecialOut");
        } else {
            $th.addClass("expanded");
            $("#login-screen").removeClass("animatedSpecialOut");
            $("#login-screen").show().addClass("animatedSpecial");
            $("#login_username").focus();
        }
    });

    /* HERO ANIMATIONS */

    $("#you .world-dot").addClass("animated zoomIn");
    $("#jennifer .world-dot").addClass("animated zoomIn");
    $("#sam .world-dot").addClass("animated zoomIn");


    $("#you .aLine").addClass("animated fadeInLeft");
    $("#jennifer .aLine").addClass("animated fadeInRight");
    $("#sam .aLine").addClass("animated fadeInLeft");

    $("#you .avatar").addClass("animated flipInY");
    $("#jennifer .avatar").addClass("animated flipInY");
    $("#sam .avatar").addClass("animated flipInY");

    $("#you .name").addClass("animated bounceIn");
    $("#jennifer .name").addClass("animated bounceIn");
    $("#sam .name").addClass("animated bounceIn");

    // ZOOM IN ORGANIZATION METHOD LIST/KANBAN

    $(".task-lists").on("click", ".image", function (e) {
        e.preventDefault();
        $(".listViewPopup").show().addClass("animated zoomIn");
        $(".whiteout").show().addClass("animated fadeIn");
    });

    $(".sticky-notes").on("click", ".image", function (e) {
        e.preventDefault();
        $(".kanbanViewPopup").show().addClass("animated zoomIn");
        $(".whiteout").show().addClass("animated fadeIn");
    });

    function closeZoomInMethod() {
        $(".listViewPopup, .kanbanViewPopup").hide().removeClass("animated zoomIn");
        $(".whiteout").hide().removeClass("animated fadeIn");
    }

    $(".whiteout, .animatedPopup").on("click", function (e) {
        closeZoomInMethod();
    });

    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            closeZoomInMethod();   // esc
        }
    });

    // Calendar switcher
    $(".view-switcher").on("click", "li a", function (e) {
        e.preventDefault();
        var $thL = $(this).parents("li");
        $(".browser").removeClass("day week month");
        $(".browser").addClass($(this).data("type"));
        $(".view-switcher li").removeClass("active");
        $thL.addClass("active");
    });
    
    $(".page-view").click(function (e) {
        var current = $(".view-switcher li.active");
        if (current.next("li").length) {
            current.next("li").find("a").click();
        } else {
            $(".view-switcher li a").first().click();
        }
    });

    if (is_frontpage) {
        fc.carouselInit();
    }
    
    /* from old page */
    $("#remember_me").kalypto({hideInputs: true});

    // Show contact form
    $("a.contact, .contact_support_now").on("click",function(e){
        e.preventDefault();
        showContact($(this));
    });
    // Hide contact form
    $(document).on("click", "a.close_popup", function(e) {
        e.preventDefault();
        hideContact();
    });

    if (f_show_login_popup) {
        $("#login-link").trigger('click');
    }

    $("#password").pwdMeter();

    $("#login_form").submit(function(e){
        e.preventDefault();
        doLogin();
    });

    $("#registration").submit(function(){
        doSignup();
        return false;
    });

    $("#forgot_password").click(function(){
        var url = $(this).attr("href");
        url += "?email=" +  encodeURIComponent($("#login_username").val());
        window.location = url;
        return false;
    });

    $('#email').on('blur', function() {
        $(this).mailcheck({
            suggested: function(element, suggestion) {
              fc.bubbleError($('#email'), 'Did you mean <span id="correct_email" style="cursor: pointer;">' + suggestion.full + '</span>?');
              correct_email = suggestion.full;
            },
            empty: function(element) {
                // callback code
            }
        });
    });

    $('#registration').on('click', '#correct_email', function(){
        $('#email').val(correct_email);
        $('.error_bubble').slideUp();
    });

    $('#add_st').hover(
        function() {
            $('#storage_extra').fadeIn();
        }, function() {
            setTimeout( function() { $('#storage_extra').fadeOut(); }, 2000);
        }
    );

    $('.cancel-sub').click(function(){
        var plan_id = $(this).data('planid');
        var popup_height = $(".md-content").height();
        $(".md-content").css("margin-top", -popup_height/2);
        $("#subscriptions_popup").addClass(" md-show");
        $(".lighten").show();

        $("#subscriptions_popup").on('click', '#agree', function(){
            if($(this).hasClass('disabled')) {
                return;
            }
            $(this).addClass('disabled');

            fc.ajax(true);
            var url = base_url + "/marketplace/subscriptions/migrate_new_pricing";
            ajaxRequest(url, {plan_id : plan_id}, function(response){ window.location = response.data.dest_url; }, { onError: function(response){
                  $('#subs_cncl_err').html(response.message).show();
                  $('#subscriptions_popup').find('#agree, #notAgree, #pls_cancel_msg').remove();
                  $('#subscriptions_popup').find('#close_cntr').show();
            } });
        });
        $("#subscriptions_popup").on('click', '#notAgree, #close', function(){
            $(".lighten").hide();
            $("#subscriptions_popup").removeClass(" md-show");
        });

    });
    $('.fc_for_people_link').click(function(e){
        e.preventDefault();
        var scrollTo = $("#for_the_people").parent().offset().top - $(".headroom_div").height();
        $('html, body').animate({
            scrollTop: scrollTo
        }, 800);
    });

    $('.toggle').on('click', function(e) {
        $(this).toggleClass('is-active');
        $('.pricing-plans').find('.plan-monthly-value, .plan-yearly-value').toggleClass('hide');

        var is_annual = $(this).hasClass('is-active');
        $('.pricing-plans').find('.button-cta.checkout').each(function(){
            $(this).attr('href', $(this).data('href') + '/' + (is_annual ? 'annual' : 'monthly'));
        });
    });
});

// Initiate Carousel
fc.carouselInit = function () {
    $("#usecases").touchCarousel({
        itemsPerMove: 1, // The number of items to move per arrow click.

        snapToItems: false, // Snap to items, based on itemsPerMove.
        pagingNav: false, // Enable paging nav. Overrides snapToItems.
        // Snap to first item of every group, based on itemsPerMove.

        pagingNavControls: true, // Paging controls (bullets).

        autoplay: false, // Autoplay enabled.
        autoplayDelay: 3000, // Delay between transitions.
        autoplayStopAtAction: true, // Stop autoplay forever when user clicks arrow or does any other action.

        scrollbar: false, // Scrollbar enabled.
        scrollbarAutoHide: false, // Scrollbar autohide.
        scrollbarTheme: "dark", // Scrollbar color. Can be "light" or "dark".

        transitionSpeed: 600, // Carousel transition speed (next/prev arrows, slideshow).

        directionNav: true, // Direction (arrow) navigation (true or false).
        directionNavAutoHide: false, // Direction (arrow) navigation auto hide on hover.
        // On touch devices arrows are always displayed.

        loopItems: true, // Loop items (don't disable arrows on last slide and allow autoplay to loop).

        keyboardNav: true, // Keyboard arrows navigation.
        dragUsingMouse: true, // Enable drag using mouse.

        scrollToLast: false, // Last item ends at start of carousel wrapper.

        itemMinWidth: 50,
        itemFallbackWidth: 454, // Default width of the item in pixels. (used if impossible to get item width).
        itemMargin: 20,

        baseMouseFriction: 0.0012, // Container friction on desktop (higher friction - slower speed).
        baseTouchFriction: 0.0008, // Container friction on mobile.
        lockAxis: true, // Allow dragging only on one direction.
        useWebkit3d: true, // Enable WebKit 3d transform on desktop devices.
        // (on touch devices this option is turned on).
        // Use it if you have only images, 3d transform makes text blurry.

        onAnimStart: null, // Callback, triggers before deceleration or transition animation.
        onAnimComplete: null, // Callback, triggers after deceleration or transition animation.

        onDragStart: null, // Callback, triggers on drag start.
        onDragRelease: null           // Callback, triggers on drag complete.
    });
};

fc.mobilecheck = function () {
    var check = false;
    (function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

function doLogin() {
    var data = {};
    data.username = $('#login_username').val();
    data.password = $('#login_password').val();
    data.remember = $('#remember_me').is(':checked') ? 1 : 0;

    data.f_ajax_login = 1;
    var location = getURLParameter('location');
    if (location) {
        data.location = location;
    }

    var url = base_url + "login";

    $("#login_err_message").hide().html("");
    $("#login_loader").show();

    var extra_params = {onError : function(response){
        $("#login_loader").hide();
        // todo use bubbles - bad to show error on both fields
        $('#login_username, #login_password').addClass('error');
        $("#login_err_message").html(response.message).show();
    }};

    ajaxRequest(url, data, function(response){
        $("#login_loader").hide();
        window.location = response.data.redirect_to;
    }, extra_params);
};

function doSignup() {
    var url = base_url + "register";
    $("#signup_loader").show();
    $("#sign_up_btn").prop("disabled", true);

    ajaxRequest(url, $("#registration").serializeFormJSON(), function(response) {
        $(".submitBtn").prop('disabled', false);
        $("#signup_loader").hide();
        if (response.data.f_error) {
            fc.processBubbleErrors(response.data.errors);
            if (response.message) {
                alert(response.message);
            }
            return;
        }

        window.location = response.data.redirect_to;
    });
};

var contact_popup_orig_top = 0;
function showContact(elem) {
    var url = base_url + "get_contact";
    var location = elem.hasClass('contact') ? 'footer' : 'header';

    if($('.contact_dialog').length) {//already loaded
        $('.contact_lighten, .contact_darken').fadeIn(400);
        $('#contact').show();
        $('#contact_success').hide();
        setContactPopupStyles(location, elem);
        $('.contact_dialog').fadeIn(400);
        return true;
    }

    ajaxRequest(url, {}, function(response) {
        $('body').prepend(response.data.html);
        $('.contact_lighten, .contact_darken').fadeIn(200);
        contact_popup_orig_top = parseInt($('.contact_dialog').css('top'), 10);

        setContactPopupStyles(location, elem);
        $('.contact_dialog').fadeIn(200);
        $("#contact").submit(function(){
            doContact();
            return false;
        });
    });
};

function doContact() {
    var url = base_url + "contact";

    var extra_params = {onError : function(response){
        fc.processBubbleErrors(response.data.errors);
    }};
    ajaxRequest(url, $("#contact").serializeFormJSON(), function() {
        $('#contact')[0].reset();
        $('#contact').hide();
        $('#contact_success').show();
        setTimeout(function(){ hideContact(); }, 6000);
    }, extra_params);
};

function hideContact() {
    $('.contact_lighten, .contact_darken').removeClass('footer');
    $('.contact_dialog').removeClass('header footer');
    $('.contact_dialog, .contact_lighten, .contact_darken').fadeOut(1000);
};

function setContactPopupStyles(location, elem) {
    var left = ($(window).width() - $('.contact_dialog').outerWidth())/2;
    $('.contact_dialog').css({"top":contact_popup_orig_top, "bottom":'auto', "left": left});
}

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}


/* REVEAL LIST VS KANBAN */

jQuery(document).ready(function($){
	//check if the .cd-image-container is in the viewport
	//if yes, animate it
	checkPosition($('.cd-image-container'));
	$(window).on('scroll', function(){
		checkPosition($('.cd-image-container'));
	});

	//make the .cd-handle element draggable and modify .cd-resize-img width according to its position
	$('.cd-image-container').each(function(){
		var actual = $(this);
		drags(actual.find('.cd-handle'), actual.find('.cd-resize-img'), actual, actual.find('.cd-image-label[data-type="original"]'), actual.find('.cd-image-label[data-type="modified"]'));
	});

	//upadate images label visibility
	$(window).on('resize', function(){
		$('.cd-image-container').each(function(){
			var actual = $(this);
			updateLabel(actual.find('.cd-image-label[data-type="modified"]'), actual.find('.cd-resize-img'), 'left');
			updateLabel(actual.find('.cd-image-label[data-type="original"]'), actual.find('.cd-resize-img'), 'right');
		});
	});
});

function checkPosition(container) {
	container.each(function(){
		var actualContainer = $(this);
		if( $(window).scrollTop() + $(window).height()*0.5 > actualContainer.offset().top) {
			actualContainer.addClass('is-visible');
		}
	});
}

//draggable funtionality - credits to http://css-tricks.com/snippets/jquery/draggable-without-jquery-ui/
function drags(dragElement, resizeElement, container, labelContainer, labelResizeElement) {
	dragElement.on("mousedown vmousedown", function(e) {
		dragElement.addClass('draggable');
		resizeElement.addClass('resizable');

		var dragWidth = dragElement.outerWidth(),
				xPosition = dragElement.offset().left + dragWidth - e.pageX,
				containerOffset = container.offset().left,
				containerWidth = container.outerWidth(),
				minLeft = containerOffset + 10,
				maxLeft = containerOffset + containerWidth - dragWidth - 10;

		dragElement.parents().on("mousemove vmousemove", function(e) {
			leftValue = e.pageX + xPosition - dragWidth;

			//constrain the draggable element to move inside his container
			if(leftValue < minLeft ) {
				leftValue = minLeft;
			} else if ( leftValue > maxLeft) {
				leftValue = maxLeft;
			}

			widthValue = (leftValue + dragWidth/2 - containerOffset)*100/containerWidth+'%';

			$('.draggable').css('left', widthValue).on("mouseup vmouseup", function() {
				$(this).removeClass('draggable');
				resizeElement.removeClass('resizable');
			});

			$('.resizable').css('width', widthValue);

			updateLabel(labelResizeElement, resizeElement, 'left');
			updateLabel(labelContainer, resizeElement, 'right');

		}).on("mouseup vmouseup", function(e){
			dragElement.removeClass('draggable');
			resizeElement.removeClass('resizable');
		});
		e.preventDefault();
	}).on("mouseup vmouseup", function(e) {
		dragElement.removeClass('draggable');
		resizeElement.removeClass('resizable');
	});
}

function updateLabel(label, resizeElement, position) {
	if(position == 'left') {
		( label.offset().left + label.outerWidth() < resizeElement.offset().left + resizeElement.outerWidth() ) ? label.removeClass('is-hidden') : label.addClass('is-hidden') ;
	} else {
		( label.offset().left > resizeElement.offset().left + resizeElement.outerWidth() ) ? label.removeClass('is-hidden') : label.addClass('is-hidden') ;
	}
}