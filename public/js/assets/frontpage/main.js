/* global fc_datepicker_format, week_first_day */

/**
 * ajaxRequest
 * 
 * This function is used for almost all ajax requests to the server
 * 
 * @param url – is string with address on which function will make request.
 * @param params - is array of data that will be sent to server like “post” data.
 * @param onSuccess – is function that will be executed if server return green light
 * @param extra_params – is object with extra params that can change default behavior of the function
 * for now this can be only {type:'GET'} to change default action method from POST to GET.
 *
 */
if(typeof fc === "undefined") {
    var fc = {};
}
if(typeof CKEDITOR_BASEPATH === "undefined") {
    var CKEDITOR_BASEPATH = '';
}
if(typeof cdn_url === "undefined") {
    var cdn_url = '';
}

fc.started_ts = new Date();

var ckeditor_min_toolbar = [['Bold', 'Italic', 'Underline', 'Strike', '-','Outdent','Indent','Blockquote', '-', 'Link','-','Maximize','-','Source', 'RemoveFormat']];
var ckeditor_std_toolbar = [['Bold', 'Italic', 'Underline', 'Strike', '-', 'NumberedList', 'BulletedList','Outdent','Indent','Blockquote', '-', 'Link', 'Unlink','-','Format','JustifyLeft','JustifyCenter','JustifyRight','-','Maximize','-','Source', 'RemoveFormat', 'Mentions']];
var ckeditor_ext_toolbar = [
                            { name: 'clipboard', groups: [ 'clipboard', 'undo' ], items: [ 'PasteText', 'PasteFromWord' ] },
                            { name: 'editing', groups: [ 'find', 'selection', 'spellchecker' ], items: [ 'Find', 'Replace', '-', 'SelectAll', '-' ] },
                            { name: 'insert', items: [ 'Image', 'Syntaxhighlight', 'Table', 'HorizontalRule', 'SpecialChar', 'Iframe' ] },
                            { name: 'document', groups: [ 'mode', 'document', 'doctools' ], items: [ 'Source', '-', 'Preview' ] },
                            '/',
                            { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [   ] },
                            { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
                            { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ] },
                            '/',
                            { name: 'styles', items: [ 'Format', 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat', 'Styles' ] },
                            { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
                            { name: 'tools', items: [ 'Maximize', 'ShowBlocks', ] },
                            { name: 'action', items: ['Undo', 'Redo'] }
                        ];

var ckeditor_remove_plugins = "pastefromword, pastetext";
var ckeditor_remove_plugins_advanced = "";
var ckeditor_extraPlugins = "autosave,mentions";
var ckeditor_extra_allowed_content = 'table {border-collapse, border}; tr; a [id, name];'
                                     + 'th td [colspan]{font-size, font-weight, color, text-align, border, padding};'
                                     + ' table iframe img[src, alt, height, width]{height, width}; pre (brush*); span(fc_mention)[data-mtype][data-id]';

var autosave_saveDetectionSelectors = "input[type='submit'], a.cancel, a.cancel_edit";

var ckeditor_standard_options = {
    toolbar: ckeditor_std_toolbar,
    uiColor: '#F0F0F0',
    autoGrow_bottomSpace: '10',
    autoGrow_maxHeight: 300,
    height: '100px',
    width: '95%',
    fillEmptyBlocks: false,
    IgnoreEmptyParagraphValue: true,
    AutoParagraph: false,
    indentClasses: ['ck_indent1', 'ck_indent2', 'ck_indent3'],
    contentsCss: [CKEDITOR_BASEPATH + 'contents.css?ver=2', cdn_url + 'platform/css/editor.css', CKEDITOR_BASEPATH+'plugins/mentions/contents.css'],
    disableNativeSpellChecker: false,
    removePlugins: ckeditor_remove_plugins,
    extraAllowedContent: ckeditor_extra_allowed_content,
    extraPlugins: ckeditor_extraPlugins,
    autosave_saveDetectionSelectors: autosave_saveDetectionSelectors,
    autosave_messageType: "statusbar",
    autosave_delay: 10
};
var ckeditor_advanced_options = {
    toolbar: ckeditor_ext_toolbar,
    uiColor: '#F0F0F0',
    autoGrow_bottomSpace: '10',
    autoGrow_maxHeight: 300,
    height: '400px',
    width: '95%',
    fillEmptyBlocks: false,
    IgnoreEmptyParagraphValue: true,
    AutoParagraph: false,
    contentsCss: [CKEDITOR_BASEPATH + 'contents.css?ver=2', cdn_url + 'platform/css/editor.css', CKEDITOR_BASEPATH+'plugins/mentions/contents.css', cdn_url + 'platform/css/editor_wiki.css'],
    disableNativeSpellChecker: false,
    removePlugins: ckeditor_remove_plugins_advanced,
    extraAllowedContent: ckeditor_extra_allowed_content,
    extraPlugins: ckeditor_extraPlugins,
    autosave_saveDetectionSelectors: autosave_saveDetectionSelectors,
    autosave_messageType: "statusbar",
    autosave_delay: 10
};

function ajaxRequest(url, params, onSuccess, extra_params) {
    var extra_params = extra_params || {};
    var f_form_data = extra_params.f_form_data;
    var type = 'POST';
    if (!empty(extra_params.type)) {
        type = extra_params.type;
    }

    if (typeof params == 'function') {
        onSuccess = params;
        params = {};
    }

    var aRequestData = {};
    aRequestData['is_ajax'] = true;
    aRequestData['time_on_page'] = Math.round((new Date() - fc.started_ts) / 1000);

    if (f_form_data) {
        aRequestData = params;
    } else {
        for (i in params) {
            if (!params.hasOwnProperty(i)) continue;
            aRequestData[i] = params[i];
        }
    }

    var ajax_params = {
        url:url,
        dataType:'json',
        data:aRequestData,
        type:type,
        cache:false,
        success:function (response_data) {
            if (response_data.additional_params) {
                var add_params = response_data.additional_params;
                if (add_params.reload_page) {
                    window.location.reload();
                    return;
                }
                if (add_params.redirect) {
                    location.href = add_params.redirect;
                    return;
                }
                if (add_params.step_link) {
                    load_step(add_params.step_link);
                }
            }

            if (response_data.status == 'success') {

                if (!empty(onSuccess)) {
                    onSuccess(response_data);
                }
            } else if (response_data.status == 'error') {
                fc.ajax(false);
                if (response_data.data.errors) {
                    $.each(response_data.data.errors, function (key, value) {
                        fc.showValidationMessage(value.field, value.error_message);
                    });

                    if (!empty(response_data.data.success)) {
                        $.each(response_data.data.success, function (key, value) {
                            fc.clearValidationMessage(value.field);
                        });
                    }
                }

                if (extra_params.onError && typeof extra_params.onError == 'function') {
                    extra_params.onError(response_data);
                } else {
                    if (!empty(response_data.message)) {
                        if(!empty(response_data.data)) {
                            if(!empty(response_data.data.error_source) && response_data.data.error_source == 'marketplace') {
                                fc.displayError({"title": "", "content": response_data.message, "error_id": ''}, 8000);
                            } else {
                                fc.displayError({"title": smth_wrong_detailed_str, "content": smth_wrong_sorry_str, "error": response_data.message, "error_id": response_data.data.error_id}, 8000);
                            }
                        } else {
                            fc.displayError({"title": smth_wrong_str, "content": response_data.message, "error": "", "error_id": ""}, 8000);
                        }
                    }
                }
            } else {
                fc.registerError('Unsupported ajax response status"' + response_data.status + '"',url);
            }
            fc.enableForm();
        },
        error:function (jqXHR, textStatus, errorThrown) {
            fc.enableForm();
            if(jqXHR.status != 399) { // if status is different from not logged in register a error
                var err_data = {};
                err_data['type'] = "ajax() error";
                err_data['text_status'] = textStatus;
                err_data['error_thrown'] = errorThrown;
                err_data['err_status'] = jqXHR.status;
                err_data['response'] = jqXHR.responseText;
                if (aRequestData.password) {
                    aRequestData.password = 'cleared';
                }
                err_data['request_params'] = aRequestData;
                if (jqXHR.responseText.indexOf("Fatal error: Allowed")+1) {
                    err_data['url'] = url;
                    fc.registerError(err_data, url, 0, 'fatal');
                } else {
                    fc.registerError(err_data, url);
                }
            }
        }
    };

    if (f_form_data) {
        ajax_params.contentType = false;
        ajax_params.processData = false;
    }

    $.ajax(ajax_params);
}

fc.disableForm = function(form) {
    if (fc.forbidFormSubmit(form)) {
        form.find("input[type=submit]").prop("disabled", true);
        return true;
    }
    return false;
};

fc.enableForm = function() {
    if (!$("input[type=submit], .submitBtn").length) {
        return;
    }
    $("input[type=submit], .submitBtn").prop("disabled", false);
    $("input[type=submit], .submitBtn").removeClass("disabled");
    $("#temp_cover_ajax").remove();
    $(".loader_img").hide();
    fc.allowFormSubmit("form");
};

fc.forbidFormSubmit = function(form) {
    if ($(form).data("f_no_submit")) {
        return false;
    }

    $(form).data("f_no_submit", true);
    return true;
};

fc.allowFormSubmit = function(form) {
    $(form).data("f_no_submit", false);
};

fc.showRestoreSession = function () {
    try {
        $(".lighten").hide();
        var $message = $(".flash_message");
        var html = session_expired_str;
        html += '<br><br><form action="' + base_url + 'login?just_login" method="POST">';
        html += "\n"+'<input type="text" name="username" placeholder="' + email_word_str + '" required="required" id="username_input" class="text">';
        html += "\n"+'<input type="password" name="password" placeholder="' + password_word_str + '" required="required" id="password_input" class="text">';
        html += "\n"+'<input value="' + login_word_str + '" type="submit" tabindex="7" class="submitBtn">';
        html += "\n"+'<br><br><input type="checkbox" id="remember_me" name="remember" checked="checked">';
        html += "\n"+'<label for="remember_me">Remember Me</label></form>';
        html = "<div class='restore_session_form'>" + html + "</div>";
        $message.html(html);
        $message.slideDown();
    } catch (e) {
        return;
    }
};

fc.showValidationMessage = function (el_name, message) {
    var error_message_jel = $('[name="' + el_name + '"]').parent().find('span.error_message');
    if(!empty(error_message_jel.length)) {
        error_message_jel.html(message);
    } else {
        $('[name="' + el_name + '"]').addClass("error").parent().append('<span class="error_message">' + message + '</span>');
    }
};

fc.clearValidationMessage = function (el_name) {
    $('[name="' + el_name + '"]').removeClass("error").parent().find('span.error_message').html('');
};

fc.showInfoEmailInPopup = function (elem) {
    var url = $(elem).data("href");
    ajaxRequest(url,
        {},
        function(return_data) {
            var popup = return_data.data.html;
            if(!$("#email_in_dialog_wrapper").length) {
                $('body').append('<div id="email_in_dialog_wrapper"></div>');
            }
            $("#email_in_dialog_wrapper").html('');
            $("#email_in_dialog_wrapper").append(popup);
            $(".lighten, #email_in_dialog").fadeIn();
        },
        {"type": "GET"}
    );
};
fc.makeEmailInAddress = function (elem) {
    var p_name = elem.attr('data-project_name'),
        p_hash = elem.attr('data-hash'),
        p_email_domain = elem.attr('data-incoming_emails_domain'),
        p_application = elem.attr('data-application');
    if(!p_application) {
        p_application = '[tasks|discussions|files|issues]';
    }
    var email_address = '\"' + p_name + '\" \<' + p_hash + '+' + p_application + '@' + p_email_domain+'\>';
    elem.attr('value', email_address);
};
fc.copyEmailInAddressToClipboard = function (elem) {
    elem.select();
    try {
        document.execCommand("copy");
        if(typeof toastr !== "undefined") {
            toastr.info("Email is copied to the clipboard!");
        } else {
            $(".flash_message").html("Email is copied to the clipboard!")
                .slideDown().delay(2000).slideUp();
        }
        if($('#email_in_dialog').length){
            close_email_in_dialog();
        }
    } catch (e) {
        if(typeof toastr !== "undefined") {
            toastr.info("Please copy email now");
        } else {
            $(".flash_message").html("Please copy email now")
                .slideDown().delay(2000).slideUp();
        }
        return false;
    }
    elem.removeAttr('value');
};

function empty(p) {
    return p == 0 || !p || (typeof(p) == 'object' && $.isEmptyObject(p));
}

function intval(val) {
    val = parseInt(val, 10);
    return val ? val : 0;
}
function floatVal(val) {
    val = parseFloat(val);
    return val ? val : 0;
}

$(window).on("beforeunload", function(e){
    if (typeof unsaved_page_str === "undefined") {
        return;
    }
    var leave_msg = unsaved_page_str;

    if (!fc.needUnsavedAlert()) {
        return;
    }

    (e || window.event).returnValue = leave_msg; //Gecko + IE
    return leave_msg;                            //Webkit, Safari, Chrome
});

fc.needUnsavedAlert = function() {
    if (fc.invite_changes_count) {
        fc.logEvent("invites", "unsaved");
        return true;
    }

    var comment_textarea = $(".add_comments_content");
    if (!comment_textarea.length) {
        return false;
    }

    var ckeditor_id = comment_textarea.attr("id");
    if(!ckeditor_id) {
        return false;
    }

    var editor_text = CKEDITOR.instances[ckeditor_id].document.getBody().getText();
    if (!$.trim(editor_text).length) {
        return false;
    }

    return true;
};

(function ($) {
    $.fn.serializeFormJSON = function () {

        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {                
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

})(jQuery);

function load_step(link_url) {
    ajaxRequest(link_url,
        {},
        function (response) {
            $(".modal .form").html("").append(response.data.html);
        },
        {type:'GET'}
    );
}

fc.logged_errors_count = 0;
fc.registerError = function (error_info, request_uri, hide_error, level) {
    var ERRORS_LIMIT = 15;
    if (fc.logged_errors_count > ERRORS_LIMIT) {
        return;
    } else if (fc.logged_errors_count === ERRORS_LIMIT) {
        error_info = "Blocking repeatedly sent errors by JS";
    }

    fc.logged_errors_count++;
    
    request_uri = request_uri || location.href;
    hide_error = hide_error || 0;
    level = level || 'info';

    if (fc.alert_js_errors && !error_info.log_event && !JSON.stringify(error_info).indexOf("not compatible with Quirks Mode")) {
        alert(JSON.stringify(error_info));
    }

    var aRequestData = {};
    aRequestData['error_info'] = error_info;
    aRequestData['request_uri'] = request_uri;
    aRequestData['level'] = level;

    var url = base_url + 'register_error';
    $.ajax({
        url:url,
        dataType:'json',
        data:aRequestData,
        type:'POST',
        success:function (response) {
            if(!hide_error) {
                var error_id = intval(response.data.error_id);
                fc.displayError({"title": smth_wrong_detailed_str, "content": response.message, "error": error_info, "error_id": error_id}, 8000);
            }
        },
        error:function () {
            // this is for a case when CI does not accept error report due to the "Disallowed Key Characters" error
            if(!hide_error) {
                fc.displayError({"title": smth_wrong_str, "content": smth_wrong_sorry_str, "error": '', "error_id":0}, 8000);
            }
        }
    });
};

/**
 * displayError function displays errors handled by the ajaxRequest function
 * @param msg - msg is an object containing the following values: {"title":"There has been an error: ","content":"The error is being fixed.","error":"Some backend descirption","error_id":"213"}
 * @param time - integer in milliseconds: how long should the error stay up for.
 */
fc.displayError = function(msg, time) {

    if(empty(time)) time = 8000;

    var $container = $("#alert_container");
    var template = '<a id="close_alert_container" class="close_alert">&#x2715;</a>';
    template +=    '<h2 style="color:#fff; font-size:16px; font-weight:300; margin-bottom:0px; line-height:1.2em; text-shadow:0px 1px 0px #000;">'+ msg.title;
    if(!empty(msg.error_id)) {
        template += ' <a style="color:#fff;" title="'+ msg.error +'">#'+msg.error_id+'</a>';
    } else if (!empty(msg.error)) {
        template += ' <a style="color:#fff;" title="'+ msg.error +'">'+msg.error+'</a>';
    }
    template += '</h2>' +
                '<p style="padding:10px 0; color:#fff; font-family:Arial; text-shadow:0px 1px 0px #000;">' +
                msg.content.replace(/\n/g, "<br />").replace("\n", "<br />").replace("\n", "<br />") +
                '</p>';
    $container.html(template);
    $container.slideDown().delay(time).slideUp(700);
};

$(function(){

    $(document).on("click", "#close_alert_container", function(e){
        $("#alert_container").stop().slideUp();
    });

    $(document).on("click", ".delete", function(e){
        e.preventDefault();
        e.stopPropagation();
        $th = $(this);
        if(!$(this).hasClass('disabled')) {
            fc.confirmDialog($th,($th.data("callback"))?$th.data("callback"):$th.attr("href"));
        }
    });

    $(document).on("click", ".delete_item", function(e){
        e.preventDefault();
        $th = $(this);
        fc.confirmDeleteDialog($th,($th.data("callback"))?$th.data("callback"):$th.attr("href"));
    });

    $(document).on("click", "a.view, a.back_to_app, a.action_edit, ul.col_r_menu li > a", function(e){
        if(!$(this).hasClass('clear-filters')) {
            e.preventDefault();
            window.location = $(this).attr('href') + window.location.hash;
        }
    });

    $(document).on("click", "#email_in_dialog_generator", function(e){
        e.preventDefault();
        var link_elem = $(this);
        fc.showInfoEmailInPopup(link_elem);
    });

    $(document).on("click", ".email_in_copy_email", function (e) {
        e.preventDefault();
        var proj_id = $(this).data('project_id');
        var input_elem = $("#project_id_" + proj_id + "_email");
        fc.makeEmailInAddress(input_elem);
        fc.copyEmailInAddressToClipboard(input_elem);
    });

    $(document).on("click", ".activate_picker", function(){
        window.scrollTo(0, 0);
        $(".color").focus();
    });

    if (typeof log_vz !== 'undefined') {
        setTimeout(function(){fc.log_vz(log_vz);}, 2000);
    }
});

fc.confirmDialog = function($elem,callback) {
	$dialog = $("#confirm_dialog");
    $dialog.removeClass('right');
    var left = $elem.offset().left - 18;
    var element_height = $elem.height(); // todo should be outer height, left for compatibility

    if ((left + $dialog.width()) >= $(window).width() ) {
        $dialog.addClass('right');
        left = $elem.offset().left - 100;
    } else if ($elem.data('confcenter')) {
        left = $elem.offset().left + ( ($elem.outerWidth() - $dialog.outerWidth())/2 ) + 20 ;
        element_height = $elem.outerHeight();
    }
    
    var $forced_visible = $();
    if ($elem.data('forcevisible')) {
        var target = $elem.data('forcevisible');
        if (target==='self') {
            $forced_visible = $elem;
        } else {
            $forced_visible = $($elem.data('forcevisible'));
        }
        $(".forced_visible").removeClass("forced_visible");
        $forced_visible.addClass("forced_visible");
    }

	$dialog.css({"left":left,"top":$elem.offset().top + element_height}).fadeIn();
	$("#confirm_dialog .yes").bind("click",function(e){e.preventDefault();
		$("#confirm_dialog .yes, #confirm_dialog .no").unbind("click");
		if(typeof window[callback] == 'function') {
			window[callback]($elem);
		} else if(typeof callback == 'function') {
			callback($elem);
		} else {
			window.location = callback;
		}
		$dialog.fadeOut();
        $forced_visible.removeClass("forced_visible");
	});
	$("#confirm_dialog .no").bind("click",function(e){e.preventDefault();
		$("#confirm_dialog .yes, #confirm_dialog .no").unbind("click");
		$dialog.fadeOut();
        $forced_visible.removeClass("forced_visible");
	});
    $("#confirm_dialog .yes").focus();
};

fc.confirm_dialog_loading = false;
fc.confirmDeleteDialog = function($elem, callback) {
    var data = {};
    var url = '';
    $('.are_sure_dialog').remove(); // remove all other dialogs if any

    if ($elem.hasClass("action_small")) {
        $elem.addClass("opened");
    }

    if ($elem.data("confirmtype")) {
        url = url_to_current_unique + '/notifications/common_confirmation/' + $elem.data("confirmtype");
    } else {
        url = url_to_current_unique + '/notifications/delete_item_confirmation/';
        data = {item_id: $elem.data('item_id'), 'application_id': $elem.data('app_id'),
                'project_id': $elem.data('proj_id'), 'sub_app_name': $elem.data('subapp_name')};
    }

    /* request new popup */
    fc.confirm_dialog_loading = true;
    ajaxRequest(url, data, function(response){
        fc.confirm_dialog_loading = false;
        if(response.status == 'success') {
            var $dialog = $(response.data.html);
            $('body').prepend($dialog);

            var left = $elem.offset().left + $elem.outerWidth()/2 - 25;
            if($(window).width() - $elem.offset().left < 240) { //dialog width
                left = left - 240 + 60; //to align borders
                $dialog.addClass('right');
            }
            $dialog.css({"left":left, "top":$elem.offset().top + $elem.height() + 8}).fadeIn();

            $dialog.find("#confirm_btn_yes").bind("click",function(e){
                e.preventDefault();
                if ($(this).prop("disabled")) {
                    return;
                }
                $(this).prop("disabled", true);
                $(this).css("cursor", "default");

                if(typeof callback == 'function') {
                    callback($elem);
                } else if(typeof window[callback] == 'function') {
                    window[callback]($elem);
                } else {
                    window.location = callback;
                }
            });

            $dialog.find('#confirm_btn_no').bind("click",function(e){
                e.preventDefault();
                $(this).parents('.are_sure_dialog').fadeOut(function(){
                    $elem.removeClass('opened');
                    $(this).remove();
                });
            });
        }
    });
};

fc.getBrowser = function() {
    if (!!window.chrome) {
        return 'chrome';
    }
    if (typeof InstallTrigger !== 'undefined') {
        return 'firefox';
    }
    var ua = window.navigator.userAgent;
    if (ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0 || ua.indexOf('Edge/') > 0) { // SO#19999388
        return 'msie';
    }
    return 'unknown';
}

window.onerror = function(message,url,line_number, column, err_obj) {
    column = column || '';
    var err_obj_string = '';
    if (err_obj) {
        try {
            err_obj_string = JSON.stringify(err_obj);
        } catch (err) {
            err_obj_string = 'Exception when stringifying error object .';
        }
    }

    var error_info = {
        'error': message,
        'file_url': url,
        'line': line_number,
        'column' : column,
        'err_obj' : err_obj_string,
        'javascript_error': true
    };

    var url = location.href;

    fc.registerError(error_info,url,true);
};

fc.show_and_reset_popover_position = function(parent_el, popover) {
    var position = parent_el.offset();
    var top_position = (position.top - popover.outerHeight()) - 10;
    var left_position = (position.left - (popover.outerWidth() / 2) + (parent_el.outerWidth() / 2));

    popover.css({
        top: top_position + "px",
        left: left_position + "px"
    });

    popover.fadeIn(150);
    fc.outer_click_type = 'user_popover';

    return true;
};

fc.showMentionsPopover = function(user_id, target) {
    $('.mention_popover').fadeOut(150).promise().always(function() {
        if(!$('#popover_user'+user_id).length) {
            ajaxRequest("/profiles/get_user_popover/"+user_id, "", function(response) {
                $('body').append(response.data);
                fc.show_and_reset_popover_position(target, $('#popover_user'+user_id));
            });
        } else {
            fc.show_and_reset_popover_position(target, $('#popover_user'+user_id));
        }
    });
};

$(function(){

    fc.process_url_hash();

	/**
	 * Scroll pretty to selected item that is permalinked
	 */
	$(document).on("click", ".click-to-scroll", function(e){
		$elem = $($.attr(this, 'href'));
		if ($elem.length > 0) {
            fc.highlight_elements($elem);
			$('html, body').animate({
				scrollTop: $elem.offset().top - 20
			}, 1000);
		}
	});

	$(document).on("click",".scroll_top",function(e){
		e.preventDefault();
		if($(".scroll-top-bottom-nav").length && !$(".item-header-group.sticky").length) {
                var _commentId = $(".scroll-top-bottom-nav").data('comment-id');
                if (_commentId == 0) {
                    $("html, body").animate({ scrollTop: $(document).height() }, "slow");
                } else {
                    fc.scroll_to_element($('#comment-' + _commentId), false);
                }
        } else {
            $("html, body").animate({ scrollTop: 0 }, "slow");
        }
		return false;
	});

	/**
	 * On Scroll Past page Item Bar make it sticky so you can edit it from anywhere scrolled down.
	 * It makes it sticky after you scroll past it
	 */
	if ($(".item-title-group").length) {
            var two_up_orig_height = $(".two-up").height();
            var item_header_orig_height = $(".item-header-group").height();

		function updateTableHeaders() {
                    var el             = $(".item-wrap"),
                    offset         = el.offset(),
                    scrollTop      = $(window).scrollTop(),
                    floatingHeader = $(".item-header-group"),
                    $tip        = $(".scroll-top-bottom-nav .tip"),
                    bubble        = $(".scroll-top-bottom-nav .bubble");

                    if (scrollTop > offset.top) {
                        $tip.attr("data-tip",$tip.data("top"));
                        bubble.hide();
                        floatingHeader.width(el.width()).addClass("sticky");
                        var amendment = 5; // this is small amendment for case when '.two-up' element is missing on the page. But when it presents it doesn't have significant value.
                        $('.item-header-group-plholder').height(item_header_orig_height+amendment);
                        if(!two_up_orig_height) {
                            if($('.item-bar').length) {
                                $('.item-title-group').addClass('no_border');
                            }
                            return;
                        }
                        var offset_diff = scrollTop-offset.top;
                        if(offset_diff < two_up_orig_height) {
                            $('.two-up').stop().show();
                            $('.two-up').height(two_up_orig_height-offset_diff);
                            $('.item-title-group').removeClass('no_border');

                        } else {
                            $('.two-up').stop().hide().height(0);//slideUp('fast', function(){$(this).height(0)});
                            if($('.item-bar').length) {
                                $('.item-title-group').addClass('no_border');
                            }
                        }

                    } else {
                        $tip.attr("data-tip",$tip.data("bottom"));
                        bubble.show();
                        if($('.two-up').height() < two_up_orig_height) {
                            $('.two-up').show();
                            $('.two-up').stop().animate({ height: two_up_orig_height }, 100);
                        }
                            if($('.item-bar').length) {
                                $('.item-title-group').removeClass('no_border');
                            }
                        $('.item-header-group-plholder').height(0);
                        floatingHeader.removeClass("sticky");
                        floatingHeader.attr("style","");
                    }
                }

		$(window)
			.scroll(updateTableHeaders)
			.trigger("scroll");
	}

	/* show / hide slide down elements */
        $(document).on( "mouseenter", '.folding_header', function() {
            if($(this).hasClass('custom')) {
                return;
            }
            $(this).addClass('hover');
        });
        $(document).on( "mouseleave", '.folding_header', function() {
            $(this).removeClass('hover');
        });

	$(document).on("click", ".folding_header", function(e){
		if($(this).hasClass('custom')) {
			return;
		}
		var link_obj = $(this).find('a.slidedown');
		var url = link_obj.data('href');
		if(url && !link_obj.parents('.folding_header').siblings('.folding_body').length) {
			var postData = {};
			postData['item_id'] = link_obj.data('item-id');

			ajaxRequest(
				url,
				postData,
				function(response) {
					if(response.status == 'success') {
						$(response.data.html).insertAfter(link_obj.parents('.folding_header'));
						link_obj.addClass('opened');
						link_obj.parents('.folding_header').siblings('.folding_body').slideDown();//show inserted
					}
				}
			);


		} else {
			if(link_obj.parents('.folding_header').siblings('.folding_body').is(":visible")) {
				link_obj.parents('.folding_header').siblings('.folding_body').slideUp();
				link_obj.removeClass('opened');
			} else {
				link_obj.addClass('opened');
				link_obj.parents('.folding_header').siblings('.folding_body').slideDown();
			}
		}
	});

	/**
	 * Application Additional Actions List
	 */
	$(".app-actions-button .down_arr").click(function(){
            var parent = $(this).parent('.app-actions-button');
            if(!parent.hasClass("active")) {
                var link_offset = $(this).offset();
                var popup = parent.find('.app-actions-list');
                var popup_width = popup.outerWidth();
                if(link_offset.left < popup_width) {
                    var new_style = {left:0, right:'auto'};
                } else {
                    var new_style = {left:'auto', right:0};
                }
                popup.css(new_style);
            }
            parent.toggleClass("active");
	});

    $('.app-actions-button .action_link').click(function() {
        setTimeout(function(){ $(".app-actions-button.active").removeClass("active"); }, 500);
        return true;
    });

    $('body').on('click', '.fc_mention', function(e) {
        e.stopPropagation();
        var target = $(this);
        if('user' !== target.data('mtype')) {
            return;
        }
        var user_id = target.data('id');
        if(!user_id) {
            return;
        }
        fc.showMentionsPopover(user_id, target);
    });

    fc.user_popover_close = function(e) {
        var container = $('.mention_popover');
        if (container.length > 0 && !container.is(e.target) && container.has(e.target).length === 0) {
            container.fadeOut(150);
            fc.outer_click_type = null;
        }
    }

});

// Attachments inside text support functions

jQuery.fn.extend({
    insertAtCaret: function(myValue){
      return this.each(function(i) {
        if (document.selection) {
          //For browsers like Internet Explorer
          this.focus();
          var sel = document.selection.createRange();
          sel.text = myValue;
          this.focus();
        }
        else if (this.selectionStart || this.selectionStart == '0') {
          //For browsers like Firefox and Webkit based
          var startPos = this.selectionStart;
          var endPos = this.selectionEnd;
          var scrollTop = this.scrollTop;
          this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
          this.focus();
          this.selectionStart = startPos + myValue.length;
          this.selectionEnd = startPos + myValue.length;
          this.scrollTop = scrollTop;
        } else {
          this.value += myValue;
          this.focus();
        }
      });
    }
});

function addInsertImageBlock(file_id, editor_id) {
    var file_list_block = $("#uploaded_file_" + file_id);
    var controls_block = $("<div class='insert_image_block' data-fileID='"+file_id+"' data-editorID='"+editor_id+"'><div class='insert-text'>Insert Image</div> </div>");
    var insert_thumb_link = $("<a href='#' class='insert_image_link' data-size='thumb'>" + embed_thumb_str + "</a>");
    var insert_medium_link = $("<a href='#' class='insert_image_link' data-size='medium'>" + embed_medium_str + "</a>");
    var insert_full_link = $("<a href='#' class='insert_image_link' data-size='full'>" + embed_full_str + "</a>");
    controls_block.append(insert_thumb_link, insert_medium_link, insert_full_link);
    file_list_block.append(controls_block);
}

function getFCAttachHtml(file_id, size) {
    return " [fcattach="+file_id+" type=img size="+size+"]";
}

function insertAttachmentTag(link) {
    var div = link.parents('.insert_image_block');
    var file_id = div.attr('data-fileID');
    var editor_id = div.attr('data-editorID');
    var size = link.attr('data-size');

    var attach_html = getFCAttachHtml(file_id, size);
    CKEDITOR.instances[editor_id].insertHtml(attach_html);
    CKEDITOR.instances[editor_id].execCommand('enter');
    if ($(".file_dialog_list_wrap").length) {
        fc.hideFileDialog();
    }
}

function removeAttachmentFromText(file_id, editor_id) {
    var editor = CKEDITOR.instances[editor_id];
    var editor_text = editor.getData();
    var re = new RegExp("\\[fcattach="+file_id+".*?\\]", "g");
    editor_text = editor_text.replace(re,"");
    editor.setData(editor_text);
    editor.updateElement();
}

function initAttachmentsInText() {
    $(document).off("click", ".insert_image_link");
    $(document).on("click", ".insert_image_link", function(e){
        insertAttachmentTag($(this));
        return false;
    });
}

// End of Attachments inside text support functions

function confirmGroupDelete(e, item_name, element) {
    e.preventDefault();
    var group_name = element.parents(".view_group").find(".group_name").text();
    $("#group_name").text(group_name);
    $("#entity_name").text(item_name);
    $(".delete_link_clicked").removeClass('delete_link_clicked');
    element.addClass('delete_link_clicked');

    var data_top = $('#del_c_dialog').data('init-css-top');
    if(typeof data_top == 'undefined') {
        data_top = parseInt($('#del_c_dialog').css('top'));
        $('#del_c_dialog').data('init-css-top', data_top);
    }

    var new_top = data_top;
    if(!element.parents('div.modal').scrollTop()) {//not scrolled yet
        var modal_height = parseInt(element.parents('div.modal').outerHeight());
        var del_div_height = parseInt($('#del_c_dialog').outerHeight());
        var del_div_bot_edge = parseInt(data_top) + del_div_height;
        if(del_div_bot_edge > modal_height) {
            new_top = parseInt((modal_height - del_div_height)/2);
        }

    } else {
        new_top += element.parents('div.modal').scrollTop();
    }
    $('#del_c_dialog').css('top', new_top);

    show_del_c_dialog();
}

/*
 Tipr 1.0.1
 Copyright (c) 2013 Tipue
 Tipr is released under the MIT License
 http://www.tipue.com/tipr
 */


(function($){$.fn.tipr=function(options){var set=$.extend({'speed':200,'mode':'bottom'},options);return this.each(function(){var tipr_cont='.tipr_container_'+set.mode;$(this).hover(function()
{var d_m=set.mode;if($(this).attr('data-mode'))
{d_m=$(this).attr('data-mode')
    tipr_cont='.tipr_container_'+d_m;}
    var out='<div class="tipr_container_'+d_m+'"><div class="tipr_point_'+d_m+'"><div class="tipr_content">'+$(this).attr('data-tip')+'</div></div></div>';$(this).append(out);var w_t=$(tipr_cont).outerWidth();var w_e=$(this).width();var m_l=(w_e / 2)-(w_t / 2);$(tipr_cont).css('margin-left',m_l+'px');$(this).removeAttr('title alt');$(tipr_cont).fadeIn(set.speed);},function()
{$(tipr_cont).remove();});});};})(jQuery);

// End of Attachments inside text support functions


// Private User Stuff - for Wall and Discussions
fc.handlePrivateStuff = function() {
    $(document).on("mouseenter", ".private_users_link", function(){
        $(this).parents(".private_users").find(".users_list").stop().fadeTo('10',0.8);;
    });
    $(document).on("mouseleave", ".private_users_link", function(){
        $(this).parents(".private_users").find(".users_list").stop().fadeOut(400);
    });
};

fc.hashToArray = function() {
    var hash = window.location.hash.slice(1);
    if( typeof atob == 'function') {
        hash = atob(hash);
    }
    var array = hash.split("&");

    var values, form_data = {};

    for (var i = 0; i < array.length; i += 1) {
        values = array[i].split("=");
        if(!empty(values[0])) {
            form_data[values[0]] = values[1];
        }
    }

    return form_data;
}

fc.arrayToHash = function(array) {

    var hash_string;
    var hash_array = [];

    for(var i in array) {
        if(array[i] !== undefined) {
            hash_array.push(i + "=" + array[i]);
        } else {
            hash_array.push(i);
        }
    }

    hash_string = hash_array.join("&");
    if( typeof btoa == 'function') {
        hash_string = btoa(hash_string);
    }
    window.location.hash = hash_string;
}

fc.addToHash = function(key,value) {
    hash_array = fc.hashToArray();
    hash_array[key] = value;
    fc.arrayToHash(hash_array);
}

fc.callWhenReady = function(probe, doIt, name) {
    if (probe()) {
        doIt();
        return;
    }

    var unique_name = name + "_callWhenReady";
    if (typeof window[unique_name] === 'undefined') {
        window[unique_name] = 0;
    }
    window[unique_name]++;

    if(window[unique_name] < 20){
        setTimeout(function(){fc.callWhenReady(probe, doIt, name);}, 200);
        return;
    } else {
        var msg = name + ' cannot be called - not ready.';
        if (fc.debug_info) {
            msg += " Debug info: " + fc.debug_info;
        }
        window[unique_name] = 0;
        fc.debug_info = '';
        fc.registerError(msg, false, true);
    }
};

fc.selectText = function(element) {
    if (element.is('input:text')) {
        element[0].select();
        return;
    }

    var text = element[0];
	if (document.body.createTextRange){ //ms
		var range = document.body.createTextRange();
		range.moveToElementText(text);
		range.select();
	} else if (window.getSelection) {
		var selection = window.getSelection();
		var range = document.createRange();
		range.selectNodeContents(text);
		selection.removeAllRanges();
		selection.addRange(range);
	}
};

fc.removeHighlightAfterFinish = function(element) {
    if (!element.hasClass('highlighted')) {
        return;
    }
    if (element.css('background-color') === "rgb(255, 255, 255)") {
        element.removeClass('highlighted');
        return;
    }
    
    setTimeout(function(){fc.removeHighlightAfterFinish(element);}, 10);
}

fc.highlight_elements = function(elements) {
    fc.triggerAnimation(elements, "highlighted");
};

fc.triggerAnimation = function(elements, style) {
    $("." + style).removeClass(style);
    elements.filter(":visible").each(function(){
        var me = this;
        me.style.webkitAnimationName = '';
        me.style.nimationName = '';
        setTimeout(function(){
            $(me).addClass(style);
            if (style === "highlighted") {
                setTimeout(function(){fc.removeHighlightAfterFinish($(me));}, 50);
            }
        }, 20);
    });
};

fc.processBubbleErrors = function(errors){
    $(".error_bubble").each(function(){
        var id = $(this).data('id');
        if (typeof errors[id] === 'undefined') {
            // to hide bubbles w/o errors in response
            errors[id] = '';
        }
    });

    for (var key in errors) {
        fc.bubbleError($("#"+key), errors[key]);
    }
};

var bubble_timeouts = {};
fc.bubbleError = function(input, message, timeout){
    timeout = timeout || 10000;
    var bubble = input.siblings(".error_bubble");
    if (!bubble.length) {
        bubble = $("<div></div>");
        bubble.data('id', input.attr('id'));
        bubble.addClass("error_bubble hide");
        if (input.hasClass("bubble_block")) {
            input.append(bubble);
        } else {
            input.parents('.bubble_block').append(bubble);
        }
        bubble_timeouts[input.attr('id')] = 0;
    } else {
        clearTimeout(bubble_timeouts[input.attr('id')]);
    }

    if (!message) {
        if (bubble.is(":visible")) {
            bubble.fadeOut("fast");
        }
        return;
    }

    bubble.html(message);

    if (message && !bubble.is(":visible")) {
        bubble.fadeIn();
    }

    bubble_timeouts[input.attr('id')] = setTimeout(function(){
        bubble.fadeOut("slow", function(){bubble.remove();});
        delete bubble_timeouts[input.attr('id')];
    }, timeout + Math.random()*1000);

    return;
};

fc.app_srch_orig_left = null;
fc.app_srch_orig_width = null;
var srch_hide_started = false;
fc.hideSearch = function(){
    $("#fc_project_search").data("phrase", '');
    $('.srch_res_cntr .searching').removeClass('searching').data("phrase", "");
    if($('.srch_res_cntr').is(':visible') && !srch_hide_started) {
        srch_hide_started = true;
        $('#fc_project_searchText').val("");
        $("#fc_search_results").slideUp('fast', function(){
			if(fc.isTabletScreen()) {
				$('ul.app li.search-form').fadeOut('fast', function(){
					srch_hide_started = false;
				});
			} else {
				$('.srch_res_cntr').fadeOut('fast', function(){
                    $('ul.app li.search-form').fadeOut(); // to be compatible with tablet mode
					srch_hide_started = false;
					$(this).parents('ul.app').animate({left: fc.app_srch_orig_left+'px', width: fc.app_srch_orig_width+'px'});
				});
			}
        });
        fc.outer_click_type = null;
    }
};

fc.showSearch = function(element){
    var srch_container = $('.srch_res_cntr');
    if (fc.isTabletScreen()) {
        srch_container.show();
        $("ul.app li.search-form").fadeIn();
        $("#fc_project_searchText").focus();
    } else {
        var new_left = parseInt(element.parents('ul.app').css('left')) - srch_container.outerWidth();
        var new_width = parseInt(element.parents('li.search').outerWidth()) + srch_container.outerWidth();
        element.parents('ul.app').animate({left: new_left + 'px', width: new_width + 'px'}, function () {
            $("ul.app li.search-form").fadeIn();  // to be compatible with tablet mode
            srch_container.fadeIn();
            $("#fc_project_searchText").focus();
        });
    }
    fc.outer_click_type = 'project_search';
};

fc.hideFileDialog = function(){
    $(".file_dialog_list_wrap").remove();
    $(".file_dialog.clicked").removeClass("clicked");
    fc.outer_click_type = null;
};

fc.pd_expanded_on_tablet = false;
fc.toggleProjectsDD = function(){
	var container = $(".fc-current");
    if (container.hasClass("active")) {
        if (fc.isTabletScreen() || fc.pd_expanded_on_tablet) {
			$(".fc-header-wrap").removeClass("frozen");
            $(".content, #dashboard_header, .action_bar").show();
        }
		fc.outer_click_type = null;
        $(".once_clicked_group").removeClass("once_clicked_group");
        $(".fc-project-list").fadeOut(300, function(){
            container.removeClass("active");
        });
        fc.pd_expanded_on_tablet = false;
    } else {
        if (fc.isTabletScreen()) {
            $(".content, #dashboard_header, .action_bar").hide();
			$(".fc-header-wrap").addClass("frozen");
            fc.pd_expanded_on_tablet = true;
        }
        container.addClass("active");
        fc.outer_click_type = 'project_nav';
        $(".fc-project-list").fadeIn();
    }
};

fc.toggleShortcuts = function() {
    var container = $(".fc_shortcuts_block");
    if (container.hasClass("active")) {
		fc.outer_click_type = null;
        $(".once_clicked_group").removeClass("once_clicked_group");
        $(".fc_shortcuts_dropdown").fadeOut(300, function(){
            container.removeClass("active");
        });
    } else {
        container.addClass("active");
        fc.outer_click_type = 'fc_shortcuts';
        $(".fc_shortcuts_dropdown").fadeIn('fast');
    }
};

fc.toggleUserMenu = function(force_hide){
    force_hide = force_hide || false;
    var container = $(".fc-user-actions .user");
    if (container.hasClass("active") || force_hide) {
        fc.outer_click_type = null;
        container.find('.account').fadeOut(300, function(){
            container.removeClass("active");
        });
    } else {
        container.addClass("active");
        fc.outer_click_type = 'user_menu';
        container.find('.account').fadeIn();
    }
};

fc.outer_click_type = null;
fc.handleOuterClick = function(e){
    switch (fc.outer_click_type) {
        case 'project_search':
            if (!$(e.target).parents("#fc_project_search").length) {
                $('#fc_project_searchText').val("");
                $("#fc_search_results").slideUp('fast');
            }
            break;
        case 'file_dialog':
            if (!$(e.target).parents(".file_dialog_list_wrap").length) {
                fc.hideFileDialog();
            }
            break;
        case 'project_nav':
            if (!$(e.target).parents(".fc-project-nav").length) {
                fc.toggleProjectsDD();
            }
            break;
        case 'fc_shortcuts':
            if (!$(e.target).parents(".fc_shortcuts_menu").length) {
                fc.toggleShortcuts();
            }
            break;
        case 'user_menu':
            if (!$(e.target).parents(".user").length) {
                fc.toggleUserMenu();
            }
            break;
        case 'share_popup':
            if (!$(e.target).is("#share_popup") && !$(e.target).parents("#share_popup").length) {
                fc.hideSharePopup();
            }
            break;
        case 'project_actions':
            if (!$(e.target).is(".cog_container.active") && !$(e.target).parents(".cog_container.active").length) {
                $(".cog_container.active").removeClass("active");
                fc.outer_click_type = null;
            }
            break;
        case 'tasky_datepicker':
            if (!$(e.target).is(".new_date") && !$(e.target).parents(".new_date").length) {
                $(".new_date.hasDatepicker div").hide();
                fc.outer_click_type = null;
            }
            break;
        case 'dashboard_show_more':
            if (!$(e.target).is(".hidden_container.opened") && !$(e.target).parents(".hidden_container.opened").length) {
                $(".hidden_container.opened").removeClass("opened");
                fc.outer_click_type = null;
            }
            break;
        case 'dashboard_show_group_actoions':
            if (!$(e.target).is(".group_actions.opened") && !$(e.target).parents(".group_actions.opened").length) {
                $(".group_actions.opened").removeClass("opened");
                fc.outer_click_type = null;
            }
            break;
        case 'spaces_menu':
            if(!$(e.target).parents(".fc-spaces-nav").length) {
                var scope = angular.element($('[ng-controller=TagsTree]')).scope();
                scope.spacesmenu = false;
                scope.$apply();
            }
            break;
        case 'user_popover':
            fc.user_popover_close(e); 
            break;
        case 'email_in_action_dropdown':
            $('.action_dropdown').hide();
            fc.outer_click_type = null;
            break;
        default:
            fc.outer_click_type = null;
    }
};

/* AJAX LOADING NOTIFICATION */
fc.show_ajax = true;
fc.ajax = function(bool) {
    if (bool) {
    	if(this.show_ajax) {
    		$(".ajax_loading").slideDown();
    	}
    }
    else {
        $(".ajax_loading").slideUp();
    }
};

fc.last_migrate_warnings_count = 0;
fc.jqueryMigrationCheck = function() {
    if (fc.f_account_page) {
        $.migrateWarnings = $.migrateWarnings.filter(function(el) {
            return el.indexOf("jQuery.fn.attr('selected')") < 0;
        });
    }
    if ($.migrateWarnings.length > fc.last_migrate_warnings_count) {
        fc.last_migrate_warnings_count = $.migrateWarnings.length;
        fc.registerError({'jquery_migration_errors' : $.migrateWarnings}, null, true, 'info');
    }
    setTimeout(fc.jqueryMigrationCheck, 2000);
};

fc.logEvent = function(category, action, label, google_only) {
    label = label || "";
    google_only = google_only || false;
    var time_on_page = new Date() - fc.started_ts;
    var event = ['_trackEvent', category, action, label, time_on_page];
    if (!google_only) {
        fc.registerError({'log_event' : event}, null, true, 'info');
    }
    if (typeof _gaq !== "undefined") {
        _gaq.push(event);
    }
};

fc.addTimeSpentToForm = function(form) {
    form.append($("<input type='hidden' name='time_on_page'>").val(new Date() - fc.started_ts));
}

function initUploadsBlock(selector) {
    initAttachmentsInText();
    fc.callWhenReady(function(){return typeof window['plupload'] !== 'undefined';}, function(){$(selector).fcUpload();}, "plupload");
}

function resetUploadsBlock(selector) {
    $(selector).fcUpload('reset');
}

(function($) {
    var DS_STORE_FILE_CODE = -144;
    var uploaders = {};
    $.fn.fcUpload = function(action, options) {
        action = action || false;
        options = options || {};
        
        if ('destroy' === action || 'reset' === action) {
            destroy(this.first().attr('id'));
            if ('destroy' === action) {
                return;
            }
        } else if ('external_file' === action) {
            if (options.start) {
                addFileToList(options, this.first().attr('id'), true);
            } else {
                onOneFileComplete(options, options, this.first().attr('id'), true);
            }
            return;
        } else if ('get_folders' === action) {
            return uploaders[options.up_id].folders;
        } else if ('update_folders' === action) {
            hideFolderIfEmpty(options.up_id, options.folder_id)
        }

        addDsStoreFilter();

        this.each(function() {
            initPlUpload($(this));
            initFilepicker($(this));
        });
        return this;
    };

    function initPlUpload(container) {
        var up, up_id;
        up_id = container.attr('id');
        if (!up_id) {
            up_id = plupload.guid();
            container.attr('id', up_id);
        } else if (uploaders[up_id]) {
            return true;
        }

        var template_selector = ".fc_upload_block_template:first";
        if (container.parents("#import_xls_dialog").length) {
            template_selector = "#import_xls_dialog .fc_upload_block_template:first";
        }

        container.append($(template_selector).clone().removeClass("fc_upload_block_template hide"));

        var options = container.data();
        var url = url_to_current_unique + '/'+ options.urlsuffix;
        var drop_element = container.find(".fc_upload_drop");
        var ids_element = container.find(".fc_upload_ids").attr('name', 'attached_ids');
        var upload_batch_id = new Date().getTime();
        container.data('upload_batch_id', upload_batch_id);
        
        var multipart_params = {application_id: options.appid, item_id: options.itemid, user_id: userid,
                                comment_id: options.commentid, temporary: options.temp,
                                first_version_id: options.firstversion || 0, is_ajax: 1,
                                group_unique_name: options.groupname || '',
                                upload_batch_id: upload_batch_id};

        var filters = {};
        if (options.max_size) {
            filters.max_file_size = options.max_size;
            filters.ds_store = '';
        }

        options.use_folders = options.use_folders || false;
        if (options.use_folders) {
            if ("chrome" !== fc.getBrowser() || !fc.isInputDirSupported()) {
                options.use_folders = false;
                container.find(".folders, .fc_upload_folder").remove();
            }
        }
        
        var settings = { browse_button: container.find(".fc_upload_button").toArray(), drop_element: drop_element[0],
                         url: url + '/upload', multipart_params: multipart_params,
                         directory: options.use_folders,
                         multi_selection: options.no_multi ? false : true,
                         filters: filters,
                         flash_swf_url: cdn_url + "thirdparty/plupload/Moxie.swf",
                         silverlight_xap_url: cdn_url + "thirdparty/plupload/Moxie.xap"};

        up = new plupload.Uploader(settings);
        up.init();
        bindHandlers(up, up_id);

        uploaders[up_id] = {uploader: up, fc_ids: [], url: url, ids_input: ids_element,
                            list: container.find(".fc_upload_list"), use_folders: options.use_folders,
                            callback: options.callback, max_size: options.max_size || 0,
                            upgrade_url: options.upgrade_url, upload_batch_id: upload_batch_id, folders: []};

        drop_element.on('dragenter', function(){$(this).addClass('dragenter');});
        drop_element.on('dragleave drop', function(){$(this).removeClass('dragenter');});
    }

    function initFilepicker(container) {
        if (typeof filepicker_api_key !== 'undefined') {
            fc.callWhenReady(function(){return typeof FilePicker === 'function' && typeof gapi === 'object'
                                                && typeof gapi.client === 'object' && typeof google === "object";},
                             function(){new FilePicker(container);}, "picker");
        }
    }

    function updateUploadedIDs(up_id, action, fc_file_id) {
        if ('add' === action) {
            uploaders[up_id]['fc_ids'][uploaders[up_id]['fc_ids'].length] = fc_file_id;
        } else {
            uploaders[up_id]['fc_ids'].splice(uploaders[up_id]['fc_ids'].indexOf(fc_file_id), 1);
        }
        uploaders[up_id]['ids_input'].val(uploaders[up_id]['fc_ids'].join());
    }

    function bindHandlers(uploader, up_id) {
        uploader.bind('FilesAdded', function(up, files) {
            plupload.each(files, function(file) {
                addFileToList(file, up_id);
            });
            up.start();
        });

        uploader.bind('UploadProgress', function(up, file) {
            updateFileUploadProgress(file);
        });
        uploader.bind('Error', function(up, err) {
            if (DS_STORE_FILE_CODE === err.code) {
                return;
            }
            if (plupload.FILE_SIZE_ERROR === err.code) {
                var max_size =  Math.round(uploaders[up_id].max_size/1024/1024*100)/100;
                err.message = max_filesize_str.replace("%d", max_size) + "<br>";
                if(uploaders[up_id].upgrade_url.length) {
                    err.message += upgrade_storage_1_str + " <a class='upload_err_link' href='" + uploaders[up_id].upgrade_url + "'>" + upgrade_storage_2_str + "</a>";
                }
            }
            fc.displayError({"title": upload_error_str, "content": err.message, "error_id": ''}, 5000);
        });
        uploader.bind('UploadComplete', function(up, files) {
            onUploadComplete(up_id);
        });
        uploader.bind('FileUploaded', function(up, file, info) {
            onOneFileComplete(file, info, up_id);
        });
    }

    function addFileToList(pl_file, up_id, f_external) {
        f_external = f_external || false;
        var pl_file_id = pl_file.id;
        var f_google = 'google' === pl_file.ext_type;

        var item = $('.fc_upload_item.template:first').clone().removeClass('template');
        item.attr('id', 'uploaded_file_' + pl_file_id);
        item.data('f_google', f_google);
        item.data('f_external', f_external);
        item.data("up_id", up_id);
        item.find('.filename').text(pl_file.name).attr('title', pl_file.name);
        if (!f_google) {
            var file_size = 0;
            if (typeof pl_file.size !== "undefined") {
                file_size = pl_file.size;
            }
            item.find('.filesize').text("(" + fc.humanizeFileSize(file_size) + ")");
        }
        item.data("pl_file_id", pl_file_id);

        var folder_id = getFolderByPlFile(up_id, pl_file);
        // file always has the property, false if folders are not available, integer otherwise
        item.data("folderid", folder_id);

        if (false === folder_id) {
            uploaders[up_id]['list'].append(item);
        } else {
            var folder = uploaders[up_id]['list'].find('#folder_' + up_id + '_' + folder_id).show();
            folder.find('.folder_files').append(item);
            updateRootPathVisibility(up_id);
        }

        if (f_external) {
            var INITIAL_EXTERNAL_PROGRESS = 20;
            item.data('f_server_progress', INITIAL_EXTERNAL_PROGRESS);
            increaseServerProgress(item);
            if (pl_file.cke_placeholder) {
                item.data("cke_placeholder", pl_file.cke_placeholder);
            }
        }

        item.find(".file_upload_cancel").click(function(){onUploadCancel(item);});
        $('#'+up_id).parents("form").find("input:submit").prop("disabled", true);
    }

    function getFolderByPlFile(up_id, pl_file) {
        if (!uploaders[up_id].use_folders) {
            return false;
        }

        var path = "/";
        if (typeof pl_file.getSource !== "undefined") {
            var source_file = pl_file.getSource();
            if (source_file && source_file.relativePath) {
                path = fc.getDirPath(source_file.relativePath);
            }
        }

        var folder_id = uploaders[up_id].folders.indexOf(path);
        if (folder_id >= 0) {
            return folder_id;
        }
        
        return addFolder(up_id, path);
    }

    function updateRootPathVisibility(up_id) {
        var f_alone = (uploaders[up_id]["list"].find(".fc_upload_folder:visible").length < 2);
        uploaders[up_id]["list"].find(".root_folder").toggleClass("alone", f_alone);
    }

    function addFolder(up_id, path) {
        var folder_id = uploaders[up_id].folders.length;
        uploaders[up_id].folders[folder_id] = path;

        var folder = $('.fc_upload_folder.template:first').clone().removeClass('template');
        folder.attr('id', 'folder_' + up_id + '_' + folder_id).find('.folder_path').text(path);
        if (fc.isRootPath(path)) {
            folder.addClass("root_folder");
        }
        uploaders[up_id]["list"].append(folder);
        updateRootPathVisibility(up_id);
        
        return folder_id;
    }

    function hideFolderIfEmpty(up_id, folder_id) {
        if (false === folder_id) {
            return;
        }

        var folder = $('#folder_' + up_id + '_' + folder_id);
        if (!folder.find('.fc_upload_item').length) {
            folder.hide();
        }
        updateRootPathVisibility(up_id);
    }

    function removeFileBlock(file_div) {
        var folder_id = file_div.data("folderid");
        var up_id = file_div.data("up_id");
        file_div.remove();
        hideFolderIfEmpty(up_id, folder_id);
    }

    function onOneFileComplete(pl_file, info, up_id, f_external) {
        f_external = f_external || false;
        var pl_file_id = pl_file.id;
        if (f_external) {
            file_info = info;
            pl_file_id = pl_file.temp_id;
        } else {
            var response_obj = $.parseJSON(info.response);
            var file_info = response_obj.data;
        }
        var item = $("#uploaded_file_" + pl_file_id);

        if (399 === info.status) {
            removeFileBlock(item);
            fc.showRestoreSession();
            return false;
        }
        
        var upload_batch_id = uploaders[up_id].upload_batch_id;
        file_info.upload_batch_id = upload_batch_id;

        if (!f_external && response_obj.status === 'error') {
            removeFileBlock(item);
            fc.displayError({"title": upload_error_str, "content": response_obj.message, "error_id": ''}, 5000);
            return false;
        }

        if (item.data("cke_placeholder")) {
            item.data("cke_placeholder", false);
        }

        // changing plupload id to freedcamp
        item.attr('id', 'uploaded_file_' + file_info.id);
        item.data('fc_file_id', file_info.id);
        item.data('f_server_progress', 100);
        item.find('.fc_progress_bar').css('width', '100%');

        setTimeout(function(){
            // delaying to let user see a 100% filled bar
            item.find('.fc_progress').hide();
            if (file_info.is_image) {
                callInsertImageBlock(file_info.id, item);
            }
            if (uploaders[up_id].callback) {
                file_info.up_id = up_id;
                file_info.folder_id = item.data("folderid");
                window[uploaders[up_id].callback](file_info);
                return;
            }
        }, 200);
        updateUploadedIDs(up_id, 'add', file_info.id);
    }

    function onUploadComplete(up_id) {
        $('#'+up_id).parents("form").find("input:submit").prop("disabled", false);
    }

    function callInsertImageBlock(file_id, item) {
        var app_editor_id = item.parents('form').find('.attach_target').attr('id');
        if (app_editor_id) {
            addInsertImageBlock(file_id, app_editor_id);
        }
    }

    function increaseServerProgress(item){
        var MAX_PERCENT = 95;
        var curr_percent = item.data('f_server_progress');
        if (!curr_percent || curr_percent >= MAX_PERCENT) {
            return;
        }
        
        var new_percent = curr_percent + (MAX_PERCENT-curr_percent+1)/10;
        new_percent = Math.round(new_percent*100)/100;
        item.data('f_server_progress', new_percent);
        item.find('.fc_progress_bar').css('width', new_percent + '%');
        setTimeout(function(){increaseServerProgress(item);}, 200);
    }

    function updateFileUploadProgress(file){
        var SERVER_SIDE_PERCENT = 85;
        var item = $("#uploaded_file_" + file.id);

        if (item.data('f_server_progress')) {
            return;
        }

        var percent = (100 - SERVER_SIDE_PERCENT)* file.percent / 100;
        item.find('.fc_progress_bar').css('width', percent + '%');

        if (file.percent === 100) {
            item.data('f_server_progress', percent);
            increaseServerProgress(item);
        }
    }

    function onUploadCancel(item) {
        var pl_file_id = item.data("pl_file_id");
        var fc_file_id = item.data('fc_file_id');
        var up_id = item.data("up_id");
        var up = uploaders[up_id]['uploader'];
        var f_external = item.data('f_external');
        var upload_batch_id = uploaders[up_id].upload_batch_id;
        
        if (!f_external) {
            /* handling plupload queue first */
            var file = up.getFile(pl_file_id);
            var status_before = file.status;
            up.removeFile(file);
            if(up.state === plupload.STARTED && status_before === plupload.UPLOADING) {
                up.stop();
                up.start();
            }
        }

        /* handling our things */
        if (fc_file_id) {
            var app_editor_id = item.parents('form').find('.attach_target').attr('id');
            if (app_editor_id) {
                removeAttachmentFromText(fc_file_id, app_editor_id);
            }

            ajaxRequest(uploaders[up_id]['url'] + '/delete_file/' + fc_file_id, 
                        {upload_batch_id: upload_batch_id},
                        function() {
                            updateUploadedIDs(up_id, 'remove', fc_file_id);
                        }
                    );
        } else if (item.data("cke_placeholder")) {
            item.data("cke_placeholder").text("").data("cancelled", true);
        }

        removeFileBlock(item);
    }

    function destroy(up_id) {
        var up = uploaders[up_id].uploader;
        delete uploaders[up_id];
        up.destroy();
        $("#"+up_id).html('');
    }

    var dsStoreFilterAdded = false;
    function addDsStoreFilter() {
        if (dsStoreFilterAdded) {
            return;
        }
        dsStoreFilterAdded = true;
        plupload.addFileFilter('ds_store', function(unused, file, cb) {
            if (".DS_Store" === file.name) {
                this.trigger('Error', {
                    code: DS_STORE_FILE_CODE,
                    message: '.DS_Store file is skipped.',
                    file: file
                });
                cb(false);
            } else {
                cb(true);
            }
        });
    }
    
}($));

fc.humanizeFileSize = function(bytes) {
    if (typeof bytes === "undefined" || !parseInt(bytes)) {
        bytes = 0;
    }
    var thresh = 1024;
    if(bytes < thresh) return bytes + ' B';
    var units = ['KB','MB','GB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(bytes >= thresh);
    return bytes.toFixed(1)+' '+units[u];
};

fc.isInputDirSupported = function() {
    var tmpInput = document.createElement('input');
    return ('webkitdirectory' in tmpInput);
}

fc.set_view_type = function (view_name, view_value) {
    view_value = view_value || store.get(view_name) || 'compact';
    $(".view_togglers .action_btn").removeClass("active");
    $('.view_togglers .' + view_value).addClass("active");
    $('#content').removeClass("minimal compact full").addClass(view_value);
    store.set(view_name, view_value);
};

/**
 * Highlight selected item from URL and move page a little lower
 * so its easier to see it
 */
fc.process_url_hash = function() {
    if (window.location.hash) {
        var hash = window.location.hash;
        if ('#_=_'===hash) {
            // hash added by facebook
            history.pushState("", document.title, window.location.pathname+window.location.search);
            return;
        }
        // case when hash is sorting in the Invoices+
        if (typeof fc.no_scroll_to_hash !== 'undefined') {
            return;
        }
        fc.scroll_to_hash(hash);
    }
}


fc.scroll_to_hash = function(hash_string, tries_left) {
    if (typeof tries_left === "undefined") {
        tries_left = 10;
    }

    var hash_element = $(hash_string);
    if (!hash_element.length) {
        return;
    }

    if (!hash_element.is(":visible") && tries_left) {
        // app may hide content while it's preparing (like collapsing groups)
        setTimeout(function(){fc.scroll_to_hash(hash_string, --tries_left);}, 100);
        return;
    }

    var comments = $('.comments_list');

    if (comments.length) {
        fc.scroll_when_images_loaded(hash_element);
    } else {
        fc.scroll_to_element(hash_element);
    }
};

fc.scroll_when_images_loaded = function(element) {
    var comment_imgs = $('.comment_content img');
    var comment_imgs_count = comment_imgs.length;
    if (!comment_imgs_count) {
        fc.scroll_to_element(element);
        return;
    }

    var FALLBACK_TIMEOUT = 5000;
    var fallback_timer = setTimeout(
            function() {
                clearTimeout(fallback_timer);
                fc.scroll_to_element(element);
                fallback_timer = null;
            },
            FALLBACK_TIMEOUT
        );

    comment_imgs.each(function() {
        $(this).load(function () {
            comment_imgs_count--;

            if (!fallback_timer) {
                return;
            }

            if (!comment_imgs_count) {
                fc.scroll_to_element(element);
                clearTimeout(fallback_timer);
                fallback_timer = null;
            }
        });
    });
};

fc.scroll_to_element = function(element, f_no_highlight) {
    $('html, body').animate(
        {
            scrollTop: element.offset().top - 155
        },
        1000,
        function() {
            if (!f_no_highlight) {
                fc.highlight_elements(element);
            }
        }
    );
    history.pushState("", document.title, window.location.pathname+window.location.search);
};

fc.showSharePopup = function() {
    // as Chrome creates a stacking context for fixed elements - can't use standard fixed modal
    ajaxRequest(site_url("dashboard/share_popup"),
        {},
        function(response) {
            $("body").append(response.data.html);
            $(".lighten").fadeIn("slow");
            $("#share_popup").fadeIn("slow");
        });
}

fc.hideSharePopup = function() {
    $(".lighten").hide();
    $("#share_popup").fadeOut();
    fc.outer_click_type = null;
}

fc.nl2br = function(str) {
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
}

fc.isTabletScreen = function() {
    var size = window.getComputedStyle(document.body,':after').getPropertyValue('content');
    if (size.indexOf("tablet")+1) {
        return true;
    }
    return false;
}

fc.getCookie = function(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

fc.setCookie = function(cname, cvalue, exdays) {
    var d = new Date();
    if(!$.isNumeric(exdays)) {
    	exdays = 30;
    }
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

fc.log_vz = function(page) {
    if (fc.getCookie(vz_cookie_name)) {
        return;
    }
    ajaxRequest(base_url + "log_vz/" + page);
}

fc.blink = function(j_elem, stop, skip_wait) {
    if (!j_elem.length) {
        return;
    }

    if (stop) {
        j_elem.data("blinking", false);
        return;
    }

    if (skip_wait) {
        if (j_elem.data("blinking")) {
            j_elem.animate({"opacity": 0.2}, 500).animate({"opacity": 1}, 800, function(){fc.blink(j_elem, false, true);});
        } else {
            j_elem.attr("style", j_elem.data("blink_before_style"));
        }
        return;
    }

    if (j_elem.data("blinking")) {
        return;
    }
    j_elem.data("blinking", true).data("blink_before_style", j_elem.attr("style") || "");
    setTimeout(function(){fc.blink(j_elem, false, true);}, 400);
}

function clone_callback(response) {
    $('form.clone_form').find('#subm_btn, #prev_btn').fadeOut('slow', function() { $('form.clone_form').find('#ok_btn').fadeIn(); });
    var success_msg = $('form.clone_form').find('#success_msg').html();
    success_msg = success_msg.replace('%PROJ_NAME%', response.data.project_name);
    success_msg = success_msg.replace('%NEW_PROJ_NAME%', response.data.new_project_name);
    $('form.clone_form').find('#success_msg').html(success_msg);
    $('form.clone_form').find('#step_3').fadeOut('slow', function() {
        $('.modal > .form').find('#cl_wiz_ttl').fadeOut('fast');
        $('form.clone_form').find('.cancel').fadeOut('fast');
        $('form.clone_form').find('#step_4').fadeIn();
    });
    $("#temp_cover_ajax").remove();
    $(".loader_img").hide();
}

fc.isRootPath = function(path) {
    return (path === '/' || path === '\\');
}

fc.getDirPath = function(path, only_dir_name) {
    only_dir_name = only_dir_name || false;
    var r = /[^\/]*$/;
    path = path.replace(r, '');

    if (!fc.isRootPath(path[path.length-1])) {
        path = path + '/'; // just to be sure
    }

    if (!only_dir_name || fc.isRootPath(path)) {
        return path;
    }

    var splitted = path.split('/');
    var last_folder = '/' + splitted[splitted.length - 2] + '/';

    return last_folder;
}

fc.initDatePicker = function(altField_selector, showField_selector, datepicker_params) {
    datepicker_params = datepicker_params || {};
    showField_selector = showField_selector || '#due_date';
    datepicker_params.dateFormat = datepicker_params.dateFormat || fc_datepicker_format;
    datepicker_params.altField = altField_selector;
    datepicker_params.altFormat = datepicker_params.altFormat || 'yy-mm-dd';
    datepicker_params.firstDay = datepicker_params.firstDay || week_first_day;
    $(showField_selector).datepicker(datepicker_params);
    fc.initDatePickerClear($(showField_selector));
};

fc.initDatePickerClear = function(input){
    input.keydown(function(e) {
        if(e.keyCode === 8 || e.keyCode === 46) {
            // clearing on del or backspace entered
            $(this).datepicker('setDate', null).datepicker('hide');
            input.trigger("datepicker_cleared");
        }
    });
};

fc.improveCKEditor = function(editor_element, f_no_paste) {
    f_no_paste = f_no_paste || false;
    try {
        var editor = $(editor_element).ckeditorGet();
    } catch (e) {
        fc.registerError('improve_ckeditor() - catch', false, true, 'error');
        return;
    }
    fc.addCtrlEnterKeystroke(editor);

    if (!f_no_paste) {
        fc.addPasteImagesHandling(editor);
    }
};

fc.addCtrlEnterKeystroke = function(editor) {
    editor.addCommand("submitOnCrtlEnter", {
        exec: function(editor) {
            $("#" + editor.name).parents("form").submit();
        }
    });
    editor.keystrokeHandler.keystrokes[CKEDITOR.CTRL + 13] = "submitOnCrtlEnter";
};

/* Support for cntr+enter image paste in CKEditor */
fc.addPasteImagesHandling = function(editor) {
    editor.on('paste', function(event) {
        return fc.handleCKEPaste(event);
    });
};

fc.getPastedImageProperties = function(fc_upload_block){
    var options = fc_upload_block.data();
    var properties = {application_id: options.appid, item_id: options.itemid,
                      comment_id: options.commentid, temporary: options.temp,
                      first_version_id: 0, is_ajax: 1, f_cke_paste: 1,
                      upload_batch_id: options.upload_batch_id};
    return properties;
};

fc.getFileFromInlineImg = function(event) {
    if (!event.data.type || event.data.type !== 'html') {
        return false;
    }

    var html = event.data.dataValue;
    if (!html.match(/<img(.*?) src="data:image\/.{3,4};base64,.*?"(.*?)>/)) {
        return false;
    }

    match = html.match(/"(data:image\/(.{3,4});base64,.*?)"/);
    if (!match) {
        return false;
    }
    var base64_string = match[1];
    var img_type = match[2].toLowerCase();
    var byteCharacters = atob(base64_string.split(',')[1]);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var blob = new Blob([byteArray], {type: "image/" + img_type});
    return blob;
};

fc.handleCKEPaste = function(event) {
    if (event.data.dataValue.indexOf('fc_mention') !== -1) {
        return true;
    }
    if (event.data.dataValue.indexOf('<img src=\"webkit-fake-url:') !== -1) {
        return false;
    }
    var files = event.data.dataTransfer._.files;
    if (!files.length) {
        var file = fc.getFileFromInlineImg(event);
        if (!file) {
            return true;
        }
        files[0] = file;
    }

    var allowed_mimes = /image\/(jpeg|png|gif|bmp)/;
    for (var i=0; i<files.length; i++) {
        if (null === files[i].type.match(allowed_mimes)){
            continue;
        }
        fc.handlePastedImage(files[i], event);
    }
    return false;
};

fc.getUploadBlockByEditorElement = function(editor_element) {
    var el = $(editor_element);
    var parent = el.parents("fieldset");
    if (!parent.length) {
        parent = el.parents(".add_new_comment");
    }

    if (!parent.length) {
        return false;
    }

    var fc_upload_block = parent.find('.fc_upload_block');
    if (!fc_upload_block.length) {
        return false;
    }
    return fc_upload_block;
};

fc.handlePastedImage = function(file, event) {
    var editor = event.editor;
    var editor_element = editor.element.$;
    var fc_upload_block = fc.getUploadBlockByEditorElement(editor_element);
    if (!fc_upload_block) {
        fc.registerError("handlePastedImage() - no up block", false, true, "error");
        return false;
    }

    var options = fc.getPastedImageProperties(fc_upload_block);
    if (!options) {
        fc.registerError("handlePastedImage() - no options", false, true, "error");
        return false;
    }

    if (!fc.cke_pasted_number) {
        fc.cke_pasted_number = 0;
    }
    fc.cke_pasted_number++;

    var placeholder_suffix = "", filename_suffix = "";
    if (fc.cke_pasted_number > 1) {
        placeholder_suffix = " #" + fc.cke_pasted_number;
        filename_suffix = "_" + fc.cke_pasted_number;
    }

    var name = "pasted" + filename_suffix + "." + file.type.replace("image/", "");

    var data = new FormData();
    data.append('file', file, name);
    for (var key in options) {
        data.append(key, options[key]);
    }

    var temp_text = "[uploading pasted image" + placeholder_suffix + "...]";
    var temp_p = "<p>" + temp_text + "<p>";
    editor.insertHtml(temp_p);
    var p_el = $(editor.editable().$).find("p:contains('"+temp_text+"')");

    var temp_file_id = "p_" + Math.round((Math.random()*1000));
    var file_info = {'id': temp_file_id, 'name': name, ext_type: 'ckepaste', size: file.size,
                     cke_placeholder: p_el, start: true};
    fc_upload_block.fcUpload('external_file', file_info);
    
    ajaxRequest(url_to_current_unique + '/files_rest/upload',
                data,
                function(data){
                    if (p_el.data('cancelled')) {
                        p_el.remove();
                        editor.updateElement();
                        return;
                    }
                    data.data.temp_id = temp_file_id;
                    data.data.start = false;
                    fc_upload_block.fcUpload('external_file', data.data);
                    var attach_html = getFCAttachHtml(data.data.id, 'full');
                    p_el.text(attach_html);
                    editor.updateElement();
                }, {f_form_data: true});
};

//start of time zone popup functionality

fc.saveTimezoneChanges = function(userTimezoneChanges, update_profile) {
    var postData = {};
    postData["new_timezone"] = userTimezoneChanges.new_timezone;
    postData["update_profile"] = update_profile || '0';
    $('#agree, #notAgree').unbind( "click" );
    ajaxRequest(
            base_url + 'manage/account/set_timezone', 
            postData,
            function(){
                $("#timezone_popup").removeClass("md-show");
                $(".lighten").hide();
            });
};

fc.timezoneWork = function() {
    var storedDate = store.get('usersTimezonesChangeCheckDates');
    if(!storedDate || !storedDate[userid]) {
        fc.getUserActionDateAndSetLocalStorage();
    } else {
        fc.checkTimeToShow(storedDate);
    }
};

fc.getUserActionDateAndSetLocalStorage = function () {
    var storedDate = store.get('usersTimezonesChangeCheckDates');
    storedDate = !storedDate ? {} : storedDate;
    ajaxRequest(
            base_url + 'manage/account/get_time_action', 
            {},
            function(response){
                storedDate[userid] = response.data;
                store.set('usersTimezonesChangeCheckDates', storedDate);
                fc.checkTimeToShow(storedDate, true);
        });
};

fc.checkTimeToShow = function(storedDate, skipCheckFlg) {
    skipCheckFlg = skipCheckFlg || false;
    var now = new Date();
    var currentDate = now.format("dd-mm-yyyy");
    if(skipCheckFlg || storedDate[userid] != currentDate) {
        fc.checkTimezoneChange();
        storedDate[userid] = currentDate;
        store.set('usersTimezonesChangeCheckDates', storedDate);
    }
};

fc.checkTimezoneChange = function () {
    var postData = {};
    var currenOffset = new Date().getTimezoneOffset();
    var userTimezoneChanges = {};
    postData['current_offset'] = -currenOffset;
    ajaxRequest(
            base_url + 'manage/account/check_timezone', 
            postData,
            function(response) {
                userTimezoneChanges = {'new_timezone' : response.data.current_timezone};
                if(response.data.show_popup) {
                    var popup_height = $(".md-content").height();
                    $(".md-content").css("margin-top", -popup_height/2);
                    $("#timezone_popup").addClass(" md-show");
                    $(".lighten").show();
                    $("#userSystemTimezone").html($("#userSystemTimezone").text() + response.data.system_user_timezone_str);
                    $("#curTimeZone").html($("#curTimeZone").text() + response.data.current_timezone_str + ' ?');
                    $("#agree").click(function () {
                        fc.saveTimezoneChanges(userTimezoneChanges, 1);
                    });
                    $("#notAgree").click(function () {
                        fc.saveTimezoneChanges(userTimezoneChanges);
                    });
                }
        });
};
//End of time zone popup functionality

jQuery.fn.highlight = function(pat) {
    function innerHighlight(node, pat) {
        var skip = 0;
        if (node.nodeType == 3) {
            var pos = node.data.toUpperCase().indexOf(pat);
            pos -= (node.data.substr(0, pos).toUpperCase().length - node.data.substr(0, pos).length);
            if (pos >= 0) {
                var spannode = document.createElement('span');
                spannode.className = 'highlight';
                var middlebit = node.splitText(pos);
                var endbit = middlebit.splitText(pat.length);
                var middleclone = middlebit.cloneNode(true);
                spannode.appendChild(middleclone);
                middlebit.parentNode.replaceChild(spannode, middlebit);
                skip = 1;
            }
        }
        else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
            for (var i = 0; i < node.childNodes.length; ++i) {
                i += innerHighlight(node.childNodes[i], pat);
            }
        }
        return skip;
    }
    return this.length && pat && pat.length ? this.each(function() {
        innerHighlight(this, pat.toUpperCase());
    }) : this;
};

jQuery.fn.removeHighlight = function() {
    return this.find("span.highlight").each(function() {
        this.parentNode.firstChild.nodeName;
        with (this.parentNode) {
            replaceChild(this.firstChild, this);
            normalize();
        }
    }).end();
};

// custom css expression for a case-insensitive contains()
jQuery.expr[':'].Contains = function(a,i,m){
    return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
};

/**
 * filterByText allows you to filter a list of elements by finding the text inside of a certain element
 * @param field_parent_selector: some unique parent where the field is inside of for example a form. PLEASE add class hide to this element
 * @param field_selector: an input field selector
 * @param element_parent_selector: an element on the page you want to hide if not matched
 * @param element_selector: the element that contains the text
 * @param item_limit_threshold how many items should the list contain for the filter to be displayed. Set to 0 if you always want it displayed
 */
fc.filterByTextTimer = null;
fc.filterByText = function(field_parent_selector, field_selector,element_parent_selector, element_selector, item_limit_threshold) {
    item_limit_threshold = item_limit_threshold || 15;
    // If there aren't enough items it's not worth having a filter so hide it
    if($(element_parent_selector).length > item_limit_threshold) {
        $(field_parent_selector).removeClass("hide");
        $(field_parent_selector).on("keyup", field_selector, function(e) {
            var val = $(this).val();
            clearTimeout(fc.filterByTextTimer);
            fc.ajax(true);
            if (val) {
                fc.filterByTextTimer = setTimeout(function(){
                    $(element_parent_selector).find(element_selector+":not(:Contains(" + val + "))").parent().slideUp();
                    $(element_parent_selector).find(element_selector+":Contains(" + val + ")").parent().slideDown();
                    fc.ajax(false);
                }, 480);
            } else {
                $(element_parent_selector).slideDown();
                fc.ajax(false);
            }
        });
    } else {
        // in case person didn't add in markup to hide it by default
        $(field_parent_selector).hide();
    }
}
