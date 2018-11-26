$(document).ready(function() {
    // Initialize Popover
    $('[data-toggle="popover"]').popover();
    // Add smooth scrolling on all links inside the nav-bar
    $('body').scrollspy({
        target: ".navbar"
    })
    // This functions modify the carousel elements on home page
    var backgrounds = new Array(
        "url('/static/images/home-slider-01.jpg')",
        "url('/static/images/home-slider-02.jpg')",
        "url('/static/images/home-slider-03.jpg')",
        "url('/static/images/home-slider-04.jpg')",
        "url('/static/images/home-slider-05.jpg')",
        "url('/static/images/home-slider-06.jpg')",
    );
    var tags = new Array(
        "Providing necessary support to the homeless and less previleged",
        "Connect with assistance centres and facilities near your locality",
        "Raise support to your cause or volunteer providing support",
        "Donating your used items directly or through assitance centres",
    );
    var current = 0;

    function nextBackground() {
        current++;
        current = current % backgrounds.length;
        $(".image-slider").removeClass("hover").css({
            '-webkit-animation': 'bg 30s linear infinite',
        })
        $(".image-slider h2").text(tags[current]);
        setTimeout(function() {
            $(".image-slider").addClass("hover");
        }, 9500);
    }
    setInterval(nextBackground, 10000);
    
    //This is used for carousels to move items to the left
    $(".scroll-left").click(function(){
    	var scrollWrapper = $(this).next(),
		scrollElements = $(".scroll-item", scrollWrapper),
		scrollWidth = scrollElements.width() + 6,
		currentScrollPosition = parseInt(scrollWrapper.attr("scroll-position")),
		scrollNumber = Math.floor(scrollWrapper.width()/scrollWidth),
		finalScrollPosition = currentScrollPosition+scrollNumber; 
    	
		if(finalScrollPosition<=0){
	    	$.each(scrollElements, function(index, item) {
	    		$(item).css({left: finalScrollPosition*scrollWidth, transistion:'2s'});
			})
			scrollWrapper.attr("scroll-position", finalScrollPosition);
		}else if(finalScrollPosition>0 && finalScrollPosition<scrollNumber) {
			$.each(scrollElements, function(index, item) {
	    		$(item).css({left: 0, transistion:'2s'});
			})
			scrollWrapper.attr("scroll-position", 0);
		}
    })
    
    //This is used for carousels to move items to the right
    $(".scroll-right").click(function(){
    	var scrollWrapper = $(this).prev(),
		scrollElements = $(".scroll-item", scrollWrapper),
		scrollWidth = scrollElements.width() + 6,
		currentScrollPosition = parseInt(scrollWrapper.attr("scroll-position")),
		scrollNumber = Math.floor(scrollWrapper.width()/scrollWidth),
		finalScrollPosition = currentScrollPosition-scrollNumber; 
    	
		if(finalScrollPosition>-scrollElements.length){
			$.each(scrollElements, function(index, item) {
	    		$(item).css({left: finalScrollPosition*scrollWidth, transistion:'2s'});
			})
			scrollWrapper.attr("scroll-position", finalScrollPosition);
		}
    })
    
    // This is used to read browser cookie information
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    // This functions are used to submit contact us form
    $("#contact-form-submit").click(function(e) {
        e.preventDefault();
        if ($(this).hasClass("disabled")) {
            return;
        }
        var validator = $("#contact-form").validate();
        if ($("#contact-form").valid()) {
            var formData = {
                "user_name": $("#user_name").val(),
                "user_email": $("#user_email").val(),
                "user_phone": $("#user_phone").val(),
                "user_subject": $("#user_subject").val(),
                "user_message": $("#user_message").val(),
                "csrfmiddlewaretoken": getCookie("csrftoken")
            }
            $.ajax({
                type: "POST",
                url: "/contact/submit/",
                data: formData,
                beforeSend: function() {
                    $(".fa-spinner", $("#contact-form-submit")).css('display', 'inline-block');
                    $("#contact-form-submit").addClass("disabled");
                },
                success: function() {
                    $("#contact-form .valid-feedback").show();
                    validator.resetForm();
                    $("#contact-form")[0].reset();
                    setTimeout(function() {
                        $(".valid-feedback").hide();
                    }, 2000);
                },
                error: function(xhr) {
                    json_data = JSON.parse(xhr.responseText)
                    $("#contact-form .invalid-feedback").show();
                    $("#contact-form .invalid-feedback").html(json_data["error_reason"]);
                    setTimeout(function() {
                        $(".invalid-feedback").hide();
                    }, 3000);
                },
                complete: function() {
                    $(".fa-spinner", $("#contact-form-submit")).css('display', 'none');
                    $("#contact-form-submit").removeClass("disabled");
                }
            });
        }
    });
    
    // This functions are used to submit sign up form
    $("#sign-up-form-submit").click(function(e) {
        e.preventDefault();
        if ($(this).hasClass("disabled")) {
            return;
        }
        var validator = $("#sign-up-form").validate();
        if ($("#sign-up-form").valid()) {
            var formData = {
                "user_first_name": $("#user_first_name").val(),
                "user_last_name": $("#user_last_name").val(),
                "user_type": $("#user_type").val(),
                "user_email": $("#user_email").val(),
                "user_password": $("#user_password").val(),
                "user_phone": $("#user_phone").val(),
                "csrfmiddlewaretoken": getCookie("csrftoken")
            }
            $.ajax({
                type: "POST",
                url: "/signup/",
                data: formData,
                beforeSend: function() {
                    $(".fa-spinner", $("#sign-up-form-submit")).css('display', 'inline-block');
                    $("#sign-up-form-submit").addClass("disabled");
                },
                success: function() {
                    $("#sign-up-form .valid-feedback").show();
                    window.location.href = "/login/";
                },
                error: function(xhr) {
                    json_data = JSON.parse(xhr.responseText)
                    $("#sign-up-form .invalid-feedback").show();
                    $("#sign-up-form .invalid-feedback").text(json_data["error_reason"]);
                    setTimeout(function() {
                        $(".invalid-feedback").hide();
                    }, 3000);
                },
                complete: function() {
                    $(".fa-spinner", $("#sign-up-form-submit")).css('display', 'none');
                    $("#sign-up-form-submit").removeClass("disabled");
                }
            });
        }
    });
    
    // This function is used to submit login form
    $("#login-form-submit").click(function(e) {
        e.preventDefault();
        if ($(this).hasClass("disabled")) {
            return;
        }
        var validator = $("#login-form").validate();
        if ($("#login-form").valid()) {
            var formData = {
                "user_login_email": $("#user_login_email").val(),
                "user_login_password": $("#user_login_password").val(),
                "csrfmiddlewaretoken": getCookie("csrftoken")
            }
            $.ajax({
                type: "POST",
                url: "/login/",
                data: formData,
                beforeSend: function() {
                    $(".fa-spinner", $("#login-form-submit")).css('display', 'inline-block');
                    $("#login-form-submit").addClass("disabled");
                },
                success: function() {
                    window.location.href = "/";
                },
                error: function(xhr) {
                    json_data = JSON.parse(xhr.responseText)
                    $("#login-form .invalid-feedback").show();
                    $("#login-form .invalid-feedback").html(json_data["error_reason"]);
                    setTimeout(function() {
                        $(".invalid-feedback").hide();
                    }, 3000);
                },
                complete: function() {
                    $(".fa-spinner", $("#login-form-submit")).css('display', 'none');
                    $("#login-form-submit").removeClass("disabled");
                }
            });
        }
    });
});