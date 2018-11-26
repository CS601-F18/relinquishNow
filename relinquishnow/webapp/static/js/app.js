$(document).ready(function() {
    $.ajaxSetup({
        cache: true
    });
    // Facebook Application Settings
    $.getScript('https://connect.facebook.net/en_US/sdk.js', function() {
        FB.init({
            appId: '141844126669466',
            version: 'v3.0' // or v2.1, v2.2, v2.3, ...
        });
    });
    // get user facebook details and login
    var fbUserLogin = function(user_type) {
        FB.api('/me', {
            fields: 'id, first_name, last_name, email'
        }, function(response) {
            if (response.email) {
                var user_gender = undefined,
                    user_location = undefined,
                    user_hometown = undefined,
                    user_likes = undefined;
                var getGenderBoolean = function(response) {
                    if (response.hasOwnProperty("gender")) {
                        if (response.gender == "male") {
                            user_gender = 1;
                        } else if (response.gender == "female") {
                            user_gender = 0;
                        }
                    }
                    return user_gender;
                };
                var getLocation = function(response) {
                    if (response.hasOwnProperty("location")) {
                        user_location = response.location.name;
                    }
                    return user_location;
                };
                var getHomeTown = function(response) {
                    if (response.hasOwnProperty("hometown")) {
                        user_hometown = response.hometown.name;
                    }
                    return user_hometown;
                };
                var getPageLikes = function(response) {
                    if (response.hasOwnProperty("likes") && response.likes.data.length > 0) {
                        user_likes = response.likes.data[0].id;
                        $.each(response.likes.data, function(index, value) {
                            if (index > 0) {
                                user_likes = user_likes + ',' + value.id
                            }
                        });
                    }
                    return user_likes;
                };
                var formData = {
                    "user_first_name": response.first_name,
                    "user_last_name": response.last_name,
                    "user_type": user_type,
                    "user_email": response.email,
                    "user_gender": getGenderBoolean(response),
                    "user_location": getLocation(response),
                    "user_hometown": getHomeTown(response),
                    "user_likes": getPageLikes(response),
                    "csrfmiddlewaretoken": getCookie("csrftoken")
                };
                $.ajax({
                    type: "POST",
                    url: "/fb/authenticate/",
                    data: formData,
                    beforeSend: function() {
                        $(".fa-spinner", $("#sign-up-form-submit")).css('display', 'inline-block');
                        $("#sign-up-form-submit").addClass("disabled");
                    },
                    success: function() {
                        window.location.href = "/";
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
            } else {
                $("#login-form .invalid-feedback").show();
                $("#login-form .invalid-feedback").html('User has not shared his email. Login using username and password');
            }
        });
    }
    // This is used for FB Login
    $(".fb-login").click(function(event) {
        event.preventDefault();
        var user_type = $(this).attr('type');
        $(".fa-spinner", $(".fb-login")).css('display', 'inline-block');
        $(".fb-login").addClass("disabled");
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                console.log('User Already Authenticated.... ');
                fbUserLogin(user_type);
            } else {
                //user is not authorized
                FB.login(function(response) {
                    if (response.authResponse) {
                        console.log('Welcome!  Fetching your information.... ');
                        fbUserLogin(user_type);
                    } else {
                        $("#login-form .invalid-feedback").show();
                        $("#login-form .invalid-feedback").html('User cancelled login or did not fully authorize.');
                    }
                });
            }
        });
        $(".fa-spinner", $(".fb-login")).css('display', 'none');
        $(".fb-login").removeClass("disabled");
    });
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
        "Listen to all the tailored recommendations at one stop music shop for free",
        "Connect with your favorite artists and discover the raw and enormous music talent",
        "Be socially active about music with your friends",
        "Let people explore your artistic endeavors and make money out of it",
        "Connect with your listeners and also, be socially updated by joining other artists",
        "Find your right audience and build a career by making them go awe!!!",
    );
    var current = 0;

    function nextBackground() {
        current++;
        current = current % backgrounds.length;
        $(".image-slider").removeClass("hover").css({
            'background-image': backgrounds[current],
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
    // This is used to get the current player songs from localStorage
    function getInitialPlaylist() {
        var initial_playlist;
        if (localStorage.getItem("current_playing") === null) {
            initial_playlist = []
        } else {
            initial_playlist = JSON.parse(localStorage.getItem("current_playing"))
        }
        return initial_playlist;
    }
    // This function initializes JPlayer
    musicPlayer = new jPlayerPlaylist({
        jPlayer: "#jquery_jplayer_1",
        cssSelectorAncestor: "#jp_container_1"
    }, getInitialPlaylist(), {
        playlistOptions: {
            enableRemoveControls: false,
            autoPlay: false,
            shuffleOnLoop: true,
            shuffleTime: 0
        },
        swfPath: "static/js/jquery.jplayer.swf",
        solution: 'html, flash',
        supplied: "m4a, oga, mp3",
        preload: 'metadata',
        volume: 0.8,
        muted: false,
        errorAlerts: false,
        warningAlerts: false,
        backgroundColor: '#000000',
        cssSelectorAncestor: '#jp_container_1',
        cssSelector: {
            videoPlay: '.jp-video-play',
            play: '.jp-play',
            pause: '.jp-pause',
            stop: '.jp-stop',
            seekBar: '.jp-seek-bar',
            playBar: '.jp-play-bar',
            mute: '.jp-mute',
            unmute: '.jp-unmute',
            volumeBar: '.jp-volume-bar',
            volumeBarValue: '.jp-volume-bar-value',
            volumeMax: '.jp-volume-max',
            playbackRateBar: '.jp-playback-rate-bar',
            playbackRateBarValue: '.jp-playback-rate-bar-value',
            currentTime: '.jp-current-time',
            duration: '.jp-duration',
            title: '.jp-title',
            artist: '.jp-artist',
            fullScreen: '.jp-full-screen',
            restoreScreen: '.jp-restore-screen',
            repeat: '.jp-repeat',
            repeatOff: '.jp-repeat-off',
            gui: '.jp-gui',
            noSolution: '.jp-no-solution'
        },
    });
    // Wrapper function for playing a track
    function tracksPlay(track_object_list, play_now) {
        var newTrackIdList = [],
            prependTrackList = [],
            appendTrackList = [],
            currentPlayingIndex = musicPlayer.current,
            currentPlayingTrack = musicPlayer.playlist[currentPlayingIndex],
            currentPausedStatus = $("#jquery_jplayer_1").data().jPlayer.status.paused;
        $.each(track_object_list, function(track_index, track_object) {
            newTrackIdList.push(track_object["id"]);
        });
        // Handle already played songs in queue
        $.each(musicPlayer.playlist, function(player_index, player_object) {
            if (player_index > currentPlayingIndex) {
                if (!newTrackIdList.includes(player_object["id"])) {
                    appendTrackList.push(player_object);
                }
            } else {
                if (!newTrackIdList.includes(player_object["id"])) {
                    prependTrackList.push(player_object);
                }
            }
        });
        if (currentPausedStatus) {
            play_now = true;
        }
        var newPlaylist = prependTrackList.concat(track_object_list, appendTrackList);
        musicPlayer.playlist = newPlaylist;
        musicPlayer._refresh();
        // This will play the song immediately
        if (play_now) {
            setTimeout(function() {
                musicPlayer.play(prependTrackList.length);
            }, 1000);
        }
        localStorage.setItem('current_playing', JSON.stringify(musicPlayer.playlist));
        //TODO: Highlight newly added songs
    }
    // Wrapper function for queuing a track
    function tracksQueue(track_object_list) {
        var newTrackIdList = [],
            prependTrackList = [],
            appendTrackList = [],
            currentIndex = musicPlayer.current,
            currentPlayingSong = musicPlayer.playlist[currentIndex],
            currentPausedStatus = $("#jquery_jplayer_1").data().jPlayer.status.paused,
            play_now = false;
        if (currentPlayingSong) {
            currentPlayingSongId = currentPlayingSong["id"];
        } else {
            currentPlayingSongId = null;
        }
        $.each(track_object_list, function(track_index, track_object) {
            newTrackIdList.push(track_object["id"]);
        });
        $.each(musicPlayer.playlist, function(player_index, player_object) {
            // Remove the existing songs in new track list from queue
            if (!newTrackIdList.includes(player_object["id"])) {
                // Should not remove current playing song
                if (player_index < currentIndex) {
                    prependTrackList.push(player_object);
                } else if (player_index > currentIndex) {
                    appendTrackList.push(player_object);
                }
            }
        });
        var newPlaylist = prependTrackList.concat(appendTrackList, track_object_list);
        if (currentPausedStatus) {
            play_now = true;
        }
        musicPlayer.playlist = newPlaylist;
        musicPlayer._refresh();
        // This will play the song immediately
        if (play_now) {
            setTimeout(function() {
                musicPlayer.play(prependTrackList.length);
            }, 1000);
        }
        localStorage.setItem('current_playing', JSON.stringify(musicPlayer.playlist));
        //TODO: Highlight newly added songs
    }
    // Play all album songs on album page
    $(".album-play-now-all-tracks").click(function(e) {
        track_object_list = [];
        $.each($(".track-table-row"), function(track_index, track_row) {
            var track_object = {};
            track_object["id"] = $(".play", track_row).attr("track_id");
            track_object["mp3"] = $(".play", track_row).attr("track_url");
            track_object["title"] = $(".track-name", track_row).text();
            track_object["artist"] = $(".track-artists", track_row).text();
            track_object_list.push(track_object);
        });
        tracksPlay(track_object_list, true);
    })
    // Play next all album songs on album page
    $(".album-queue-all-tracks").click(function(e) {
        track_object_list = [];
        $.each($(".track-table-row"), function(track_index, track_row) {
            var track_object = {};
            track_object["id"] = $(".play", track_row).attr("track_id");
            track_object["mp3"] = $(".play", track_row).attr("track_url");
            track_object["title"] = $(".track-name", track_row).text();
            track_object["artist"] = $(".track-artists", track_row).text();
            track_object_list.push(track_object);
        });
        tracksQueue(track_object_list);
    })
    // Queue all album songs on album page
    $(".album-play-next-all-tracks").click(function(e) {
        track_object_list = [];
        $.each($(".track-table-row"), function(track_index, track_row) {
            var track_object = {};
            track_object["id"] = $(".play", track_row).attr("track_id");
            track_object["mp3"] = $(".play", track_row).attr("track_url");
            track_object["title"] = $(".track-name", track_row).text();
            track_object["artist"] = $(".track-artists", track_row).text();
            track_object_list.push(track_object);
        });
        tracksPlay(track_object_list, false);
    })
    // This will toggle the playlist showing
    $(".jp-slide").click(function() {
        $(".jp-playlist-wrapper").toggle();
        $(".jp-playlist").toggleClass("show");
    })
    // This will toggle player loop options
    $("#jp_container_1 .jp-repeat-all").click(function() {
        if ($(this).hasClass("on")) {
            $(this).removeClass("on").addClass("repeat-one");
            musicPlayer.loop = false;
        } else if ($(this).hasClass("repeat-one")) {
            $(this).removeClass("repeat-one");
            musicPlayer.loop = false;
        } else {
            $(this).addClass("on");
            musicPlayer.loop = true;
        }
    })
    // This will enable the loop
    $("#jp_container_1 .jp-shuffle-all").click(function() {
        if ($(this).hasClass("on")) {
            $(this).removeClass("on");
            musicPlayer.shuffle(false);
        } else {
            $(this).addClass("on");
            musicPlayer.shuffle(true);
        }
    })
    // Plays currently selected song on album page
    $(".track-table-row").click(function() {
        var track_object = {
            id: $(".play", this).attr("track_id"),
            title: $(".track-name", this).text(),
            artist: $(".track-artists", this).text(),
            mp3: $(".play", this).attr("track_url")
        }
        tracksPlay([track_object], true);
    });
    // This functions are used to subscribe to posts
    $("#user-subscribe-btn").click(function() {
        var user_email = $("#user-subscribe").val();
        var formData = {
            "user_email": user_email
        }
        if ($("#user-subscribe-form")[0].checkValidity()) {
            $('#userTypeModal').modal('show');
            $("#user-subscribe-form")[0].reset();
        } else {
            $("#user-subscribe-form .form-control:invalid").siblings(".invalid-feedback").show();
            setTimeout(function() {
                $(".invalid-feedback").hide()
            }, 3000);
        }
    });
    // This function is used to smooth scroll to contact form from carousel
    $(".contact-us-intro a").on('click', function(e) {
        if (this.hash !== "") {
            e.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function() {
                window.location.hash = hash;
            });
        }
    });
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
                url: "/register/submit/",
                data: formData,
                beforeSend: function() {
                    $(".fa-spinner", $("#sign-up-form-submit")).css('display', 'inline-block');
                    $("#sign-up-form-submit").addClass("disabled");
                },
                success: function() {
                    $("#sign-up-form .valid-feedback").show();
                    window.location.href = "/register/confirm/";
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
                url: "/authenticate/",
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
    // This will initiate password reset functionality for given email
    $("#password-reset-btn").click(function(e) {
        e.preventDefault();
        if ($(this).hasClass("disabled")) {
            return;
        }
        var validator = $("#password-reset-form").validate();
        if ($("#password-reset-form").valid()) {
            var formData = {
                "password-reset": $("#password-reset").val(),
                "csrfmiddlewaretoken": getCookie("csrftoken")
            }
            $.ajax({
                type: "POST",
                url: "/forgot-password/submit/",
                data: formData,
                beforeSend: function() {
                    $(".fa-spinner", $("#password-reset-btn")).css('display', 'inline-block');
                    $("#password-reset-btn").addClass("disabled");
                },
                success: function() {
                    $("#password-reset-form .valid-feedback").show();
                    setTimeout(function() {
                        $('#forgotPasswordModal').modal('hide');
                    }, 2000);
                },
                error: function(xhr) {
                    json_data = JSON.parse(xhr.responseText)
                    $("#password-reset-form .invalid-feedback").show();
                    $("#password-reset-form .invalid-feedback").html(json_data["error_reason"]);
                    setTimeout(function() {
                        $(".invalid-feedback").hide();
                    }, 2000);
                },
                complete: function() {
                    $(".fa-spinner", $("#password-reset-btn")).css('display', 'none');
                    $("#password-reset-btn").removeClass("disabled");
                }
            });
        }
    });
    // This will update password of email provided
    $("#reset-password-btn").click(function(e) {
        e.preventDefault();
        if ($(this).hasClass("disabled")) {
            return;
        }
        var validator = $("#reset-password-form").validate();
        if ($("#reset-password-form").valid()) {
            var formData = {
                "user_email": $("#reset_user_name").val(),
                "user_password": $("#reset_user_password").val(),
                "csrfmiddlewaretoken": getCookie("csrftoken")
            }
            $.ajax({
                type: "POST",
                url: "/forgot-password/reset/",
                data: formData,
                beforeSend: function() {
                    $(".fa-spinner", $("#reset-password-btn")).css('display', 'inline-block');
                    $("#reset-password-btn").addClass("disabled");
                },
                success: function() {
                    $("#reset-password-form .valid-feedback").show();
                    window.location.href = "/";
                },
                error: function(xhr) {
                    json_data = JSON.parse(xhr.responseText)
                    $("#reset-password-form .invalid-feedback").show();
                    $("#reset-password-form .invalid-feedback").html(json_data["error_reason"]);
                    setTimeout(function() {
                        $(".invalid-feedback").hide();
                    }, 2000);
                },
                complete: function() {
                    $(".fa-spinner", $("#reset-password-btn")).css('display', 'none');
                    $("#reset-password-btn").removeClass("disabled");
                }
            });
        }
    });
    $(".user-follow").click(function(e) {
        var formData = {
            "logged_user": $(this).attr("logged_user"),
            "current_user": $(this).attr("current_user"),
            "csrfmiddlewaretoken": getCookie("csrftoken")
        };
        $.post("/user/" + $(this).attr("logged_user") + "/follow/submit/", formData, function(data) {
            location.reload();
        });
    });
    $(".forgot-password").click(function() {
        $('#forgotPasswordModal').modal('show');
    });
    $(".user-register").click(function(e) {
        $('#userTypeModal').modal('show');
    });
    $(".artist-register").click(function() {
        window.location.href = "/signup/artist/";
    });
    $(".patron-register").click(function() {
        window.location.href = "/signup/patron/";
    });
    $(".card-wrapper .rotate-btn").click(function() {
        $(this).closest(".card").toggleClass("flipped");
    });
    // This function is used to submit application form
    $("#jobapplication-form-submit").click(function(e) {
        e.preventDefault();
        var formData = {
            "appl_name": $("#appl_name").val(),
            "appl_email": $("#appl_email").val(),
            "appl_phone": $("#appl_phone").val(),
            "appl_role_id1": $("#appl_role_id1").val(),
            "appl_role_id2": $("#appl_role_id2").val(),
            "appl_role_id3": $("#appl_role_id3").val(),
            "appl_exp_months": $("#appl_exp_months").val(),
            "appl_highest_degree": $("#appl_highest_degree").val(),
            "appl_notice_period": $("#appl_notice_period").val(),
            "appl_cover_letter": $("#appl_cover_letter").val(),
            "appl_resume_link": $("#appl_resume_link").val(),
            "appl_resume_file": $("#appl_resume_file").val(),
            "appl_linkedin": $("#appl_linkedin").val(),
            "appl_github": $("#appl_github").val(),
            "appl_links": $("#appl_links").val(),
            "csrfmiddlewaretoken": getCookie("csrftoken")
        }
        if ($("#job_application_form")[0].checkValidity()) {
            $.post("/careers/" + $("#appl_role_id1") + "/submit/", formData, function(data) {
                $("#job_application_form")[0].reset();
                $("#job_application_form .valid-feedback").show();
                setTimeout(function() {
                    $(".valid-feedback").hide();
                }, 3000);
            });
        } else {
            $("#job_application_form .form-control:invalid").closest(".md-form").next(".invalid-feedback").show();
            setTimeout(function() {
                $(".invalid-feedback").hide();
            }, 3000);
        }
    });
    $(".blog-like").click(function() {
        $('#loginModal').modal('show');
    });
    $(".blog-like-submit").click(function() {
        var formData = {
            "blog_id": $(this).attr("value"),
            "csrfmiddlewaretoken": getCookie("csrftoken")
        };
        $.post("/blog/like/submit/", formData, function(data) {
            $(this).removeClass("bg-orange").addClass("bg-red");
        });
    });
    $(".blog-comment-submit").click(function(e) {
        e.preventDefault();
        var validator = $("#blog-comment-form").validate();
        if ($("#user-comment").valid()) {
            var formData = {
                "blog_id": $(this).attr("value"),
                "user_comment": $("#user-comment").val(),
                "csrfmiddlewaretoken": getCookie("csrftoken")
            };
            $.post("/blog/comment/submit/", formData, function(data) {
                location.reload();
            });
        }
    });
    // This will mimic the image change functionality
    $(".profile-img").click(function(e) {
        e.preventDefault();
        $("#imageUpload").click();
    });
    $('.file-field input[type="file"]').change(function(e) {
        var fileName = e.target.files[0].name;
        $(this).closest(".file-field").find(".file-path").val(fileName);
    });
    $("#imageUpload").change(function() {
        var profileImage = $("#imageUpload")[0].files[0],
            user_id = $(this).attr("logged_in_user");
        if (profileImage) {
            var formData = new FormData();
            formData.append("user_id", user_id);
            formData.append("profile_image", profileImage);
            formData.append("image_type", 0);
            formData.append("csrfmiddlewaretoken", getCookie("csrftoken"));
            $.ajax({
                url: "/user/" + user_id + "/image/submit/",
                data: formData,
                type: 'POST',
                contentType: false,
                processData: false,
                success: function(data) {
                    $(".profile-img div").css("background-image", 'url(' + window.URL.createObjectURL($("#imageUpload")[0].files[0]) + ')');
                }
            });
        }
    });
    $(".user_followers").click(function() {
        $('#followersModal').modal('show');
    });
    $(".user_following").click(function() {
        $('#followingModal').modal('show');
    });
    $("#event-form-submit").click(function(e) {
        e.preventDefault();
        if ($(this).hasClass("disabled")) {
            return;
        }
        var validator = $("#event-form").validate(),
            user_id = $("#event_user").val();
        if ($("#event-form").valid()) {
            var formData = new FormData();
            formData.append("event_name", $("#event_name").val());
            formData.append("event_desc", $("#event_desc").val());
            formData.append("event_location", $("#event_location").val());
            formData.append("event_datetime", $("#event_datetime").val());
            formData.append("event_url", $("#event_url").val());
            formData.append("event_image", $("#event_image")[0].files[0]);
            formData.append("csrfmiddlewaretoken", getCookie("csrftoken"));
            $.ajax({
                url: "/user/" + user_id + "/event/submit/",
                data: formData,
                type: 'POST',
                contentType: false,
                processData: false,
                beforeSend: function() {
                    $(".fa-spinner", $("#event-form-submit")).css('display', 'inline-block');
                    $("#event-form-submit").addClass("disabled");
                },
                success: function(data) {
                    $("#event-form .valid-feedback").show();
                    location.reload();
                },
                error: function(response) {
                    json_data = JSON.parse(response.responseText)
                    $("#event-form .invalid-feedback").show();
                    $("#event-form .invalid-feedback").html(json_data["error_reason"]);
                    setTimeout(function() {
                        $(".invalid-feedback").hide();
                    }, 3000);
                },
                complete: function() {
                    $(".fa-spinner", $("#event-form-submit")).css('display', 'none');
                    $("#event-form-submit").removeClass("disabled");
                }
            });
        }
    });
    $("#news_updates-form-submit").click(function(e) {
        e.preventDefault();
        var validator = $("#news_updates-form").validate(),
            user_id = $("#news_user").val();
        if ($("#news_updates-form").valid()) {
            var formData = new FormData();
            formData.append("news_title", $("#news_title").val());
            formData.append("news_url", $("#news_url").val());
            formData.append("news_content", $("#news_content").val());
            formData.append("news_img", $("#news_img")[0].files[0]);
            formData.append("csrfmiddlewaretoken", getCookie("csrftoken"));
            $.ajax({
                url: "/user/" + user_id + "/news_updates/submit/",
                data: formData,
                type: 'POST',
                contentType: false,
                processData: false,
                beforeSend: function() {
                    $(".fa-spinner", $("#news_updates-form")).css('display', 'inline-block');
                    $("#news_updates-form").addClass("disabled");
                },
                success: function(data) {
                    $("#news_updates-form .valid-feedback").show();
                    location.reload();
                },
                error: function(response) {
                    json_data = JSON.parse(response.responseText)
                    $("#news_updates-form.invalid-feedback").show();
                    $("#news_updates-form .invalid-feedback").html(json_data["error_reason"]);
                    setTimeout(function() {
                        $(".invalid-feedback").hide();
                    }, 3000);
                },
                complete: function() {
                    $(".fa-spinner", $("#news_updates-form")).css('display', 'none');
                    $("#news_updates-form").removeClass("disabled");
                }
            });
        }
    });
    
    $(".album-add").click(function(){
    	$("#albumModal").modal('show');
    	$("#album-form")[0].reset();
    	$("#album-form-back").click();
    })
    
    $(".edit-album").click(function(e){
    	e.preventDefault();
    	e.stopPropagation();
    	
    	var scroll_element = $(this).closest(".scroll-item"),
    		alb_public_status = $(".album-public-status", scroll_element).text();
    	
    	$("#albumModal").modal('show');
    	$("#album-form")[0].reset();
    	$("#album-form-back").click();
    	
    	$("#alb_id").val($(".album-item-wrapper", scroll_element).attr("album_id"));
    	$("#alb_name").val($(".album-title", scroll_element).text());
    	$("#alb_desc").val($(".album-desc", scroll_element).text());
    	$("#alb_release_date").val($(".album-release-date", scroll_element).text());
    	var url = $(".album-item", scroll_element).css('background-image'),
    		array = url.split('/'),
    		filename = array[array.length - 1].replace('\")', '');
    	if(filename!='music.png'){
    		$("#album_image_name").val(filename);
    	}
    	if(alb_public_status=="True"){
    		$('#alb_public_status').prop("checked", true);
    	}else{
    		$('#alb_public_status').prop("checked", false);
    	}
    	
    	$("#album-form-next").addClass("d-none");
    	$("#album-edit-form-submit").removeClass("d-none");
    	
    });
    
    $("#album-form-next").click(function(e) {
        e.preventDefault();
        var validator = $("#album-form").validate();
        if ($("#album-form").valid()) {
        	if($("#album_image")[0].files.length>0){
        		$(".album-form-next .album-item").css("background", 'url(' + window.URL.createObjectURL($("#album_image")[0].files[0]) + ')');
        	}
        	$(".album-form-next .album-title").text($("#alb_name").val());
        	$(".album-form-next .album_description").text($("#alb_desc").val());
        	$(".album-form-wrapper").addClass("d-none");
        	$(".album-form-next").removeClass("d-none");
        }
    });
    
    $("#album-form-back").click(function(e) {
        e.preventDefault();
    	$(".album-form-wrapper").removeClass("d-none");
    	$(".album-form-next").addClass("d-none");
    });
    
    $("#album-form-submit").click(function(e) {
        e.preventDefault();
        var validator = $("#album-form").validate();
        if ($("#album-form").valid()) {
            var formData = new FormData();
            formData.append("alb_name", $("#alb_name").val());
            formData.append("alb_desc", $("#alb_desc").val());
            formData.append("alb_release_date", $("#alb_release_date").val());
            formData.append("alb_image", $("#album_image")[0].files[0]);
            formData.append("alb_public_status", $('#alb_public_status').is(':checked'));
            formData.append("alb_post_text", $('#alb_post_text').val());
            formData.append("csrfmiddlewaretoken", getCookie("csrftoken"));
            $.ajax({
                url: "/album/submit/",
                data: formData,
                type: 'POST',
                contentType: false,
                processData: false,
                beforeSend: function() {
                    $(".fa-spinner", $("#album-form-submit")).css('display', 'inline-block');
                    $("#album-form-submit").addClass("disabled");
                },
                success: function(data) {
                    $("#album-form .valid-feedback").show();
                    json_data = JSON.parse(data);
                    alb_id = json_data["alb_id"];
                    window.location.href = "/album/" + alb_id + "/";
                },
                error: function(response) {
                    json_data = JSON.parse(response.responseText)
                    $("#album-form .invalid-feedback").show();
                    $("#album-form .invalid-feedback").html(json_data["error_reason"]);
                    setTimeout(function() {
                        $(".invalid-feedback").hide();
                    }, 3000);
                },
                complete: function() {
                    $(".fa-spinner", $("#album-form-submit")).css('display', 'none');
                    $("#album-form-submit").removeClass("disabled");
                }
            });
        }
    });
    
    $("#album-edit-form-submit").click(function(e) {
        e.preventDefault();
        var validator = $("#album-form").validate();
        if ($("#album-form").valid()) {
            var formData = new FormData();
            formData.append("alb_name", $("#alb_name").val());
            formData.append("alb_desc", $("#alb_desc").val());
            formData.append("alb_release_date", $("#alb_release_date").val());
            formData.append("alb_image", $("#album_image")[0].files[0]);
            formData.append("alb_public_status", $('#alb_public_status').is(':checked'));
            formData.append("csrfmiddlewaretoken", getCookie("csrftoken"));
            $.ajax({
                url: "/album/" + $("#alb_id").val() + "/edit/",
                data: formData,
                type: 'POST',
                contentType: false,
                processData: false,
                beforeSend: function() {
                    $(".fa-spinner", $("#album-edit-form-submit")).css('display', 'inline-block');
                    $("#album-edit-form-submit").addClass("disabled");
                },
                success: function(data) {
                    $("#album-form .valid-feedback").show();
                    json_data = JSON.parse(data);
                    window.location.reload();
                },
                error: function(response) {
                    json_data = JSON.parse(response.responseText)
                    $("#album-form .invalid-feedback").show();
                    $("#album-form .invalid-feedback").html(json_data["error_reason"]);
                    setTimeout(function() {
                        $(".invalid-feedback").hide();
                    }, 3000);
                },
                complete: function() {
                    $(".fa-spinner", $("#album-edit-form-submit")).css('display', 'none');
                    $("#album-edit-form-submit").removeClass("disabled");
                }
            });
        }
    });

    $("#song-info-submit").click(function(e) {
        e.preventDefault();
        if ($(this).hasClass("disabled")) {
            return;
        }
        var validator = $("#song-info-form").validate();
        if ($("#song-info-form").valid()){
        	var formData = new FormData();
            formData.append("album_id", $("#album_id").val());
            formData.append("track_name", $("#track_name").val());
            formData.append("track_languages", $("#track_languages").val().join(", "));
            formData.append("track_genres", $("#track_genres").val().join(", "));
            formData.append("track_release_date", $("#track_release_date").val());
            formData.append("track_file", $("#track_file")[0].files[0]);
            formData.append("track_image", $("#track_image")[0].files[0]);
            formData.append("track_public_status", $('#track_public_status').is(':checked'));
            formData.append("csrfmiddlewaretoken", getCookie("csrftoken"));
            $.ajax({
                url: "/album/" + $("#album_id").val() + "/track/submit/",
                data: formData,
                type: 'POST',
                contentType: false,
                processData: false,
                beforeSend: function() {
                    $(".fa-spinner", $("#song-info-submit")).css('display', 'inline-block');
                    $("#song-info-submit").addClass("disabled");
                },
                success: function(data) {
                    $("#song-info-form .valid-feedback").show();
                    response = JSON.parse(data);
                    $("#album_track_id").val(response["track_id"]);
                    $(".song-info-form-wrapper").addClass("d-none");
                    $(".song-artists-info-form-wrapper").removeClass("d-none");
                },
                error: function(response) {
                    json_data = JSON.parse(response.responseText)
                    $("#song-info-form .invalid-feedback").show().html(json_data["error_reason"]);
                    setTimeout(function() {
                        $(".invalid-feedback").hide();
                    }, 3000);
                },
                complete: function() {
                    $(".fa-spinner", $("#song-info-submit")).css('display', 'none');
                    $("#song-info-submit").removeClass("disabled");
                }
            });
        }
    });
    
    // This is used to add artist contribution to track information
    $("#song-artists-info-submit").click(function(e) {
        e.preventDefault();
        if ($(this).hasClass("disabled")) {
            return;
        }
        var validator = $("#song-artists-info-form").validate();
        if ($("#song-artists-info-form").valid()){
        	var formData = new FormData();
            formData.append("track_artist_name", $("#track_artist_name").val());
            formData.append("track_artistic_production", $("#track_artistic_production").val().join(", "));
            formData.append("track_non_artistic_production", $("#track_non_artistic_production").val().join(", "));
            formData.append("track_vocals", $("#track_genres").val().join(", "));
            formData.append("track_instruments", $("#track_instruments").val().join(", "));
            formData.append("csrfmiddlewaretoken", getCookie("csrftoken"));
            $.ajax({
                url: "/track/" + $("#album_track_id").val() + "/artist/submit/",
                data: formData,
                type: 'POST',
                contentType: false,
                processData: false,
                beforeSend: function() {
                    $(".fa-spinner", $("#song-artists-info-submit")).css('display', 'inline-block');
                    $("#song-artists-info-submit").addClass("disabled");
                },
                success: function(data) {
                    $("#song-artists-info-form .valid-feedback").show();
                    response = JSON.parse(data);
                    $(".song-artists-wrapper").html(response["track_artists_html"]);
                },
                error: function(response) {
                    json_data = JSON.parse(response.responseText)
                    $("#song-artists-info-form .invalid-feedback").show().html(json_data["error_reason"]);
                    setTimeout(function() {
                        $(".invalid-feedback").hide();
                    }, 3000);
                },
                complete: function() {
                    $(".fa-spinner", $("#song-artists-info-submit")).css('display', 'none');
                    $("#song-artists-info-submit").removeClass("disabled");
                }
            });
        }
    });
    
    $("#song-artists-info-next").click(function(e) {
        e.preventDefault();
        $(".song-info-form-wrapper, .song-artists-info-form-wrapper").addClass("d-none");
        $(".song-terms").removeClass("d-none");
    });

    $('#song_form_main_content_next').click(function(e) {
        var isValid = true;
        $('input[type="text"].required').each(function() {
            if ($.trim($(this).val()) == '') {
                isValid = false;
                $('#msg-error').show();
                  $('#msg-error').removeClass("d-none");
            }
            else {
                $('#msg-error').hide();
                $(".song-form-declaration").removeClass("d-none");
            	$(".song-form-next").addClass("d-none");
    	        $(".song-form-wrapper").addClass("d-none");
            }
        });
    });

    $("#song_declaration_back").click(function(e) {
        e.preventDefault();
    	$(".song-form-wrapper").addClass("d-none");
    	$(".song-form-next").removeClass("d-none");
    	$(".song-form-declaration").addClass("d-none");
    });

    var itemTemplate = $('.child_div'),
      editArea = $('.edit-area'),
      itemNumber = 1;

    $(document).on('click', '.edit-area .add', function(event) {
        var item = itemTemplate.clone();
        item.find('[name]').attr('name', function() {
            return $(this).attr('name') + '_' + itemNumber;
        });
        ++itemNumber;
        item.appendTo(editArea);
    });

    $(document).on('click', '.edit-area .rem', function(event) {
        editArea.children('.child_div').last().remove();
    });

    $(document).on('click', '.edit-area .del', function(event) {
        var target = $(event.target),
        row = target.closest('.child_div');
        row.remove();
    });

    $("#song-form-submit").click(function(e) {
        e.preventDefault();
        var validator = $("#song-form").validate();
        if ($("#song-form").valid()) {
            var formData = new FormData();
            formData.append("track_declarations", $('#track_declarations').is(':checked'));
            formData.append("track_public_status", $('#track_public_status').is(':checked'));
            formData.append("csrfmiddlewaretoken", getCookie("csrftoken"));
            $.ajax({
                url: "/album/" + $("#album_id").val() + "/track/submit/",
                data: formData,
                type: 'POST',
                contentType: false,
                processData: false,
                beforeSend: function() {
                    $(".fa-spinner", $("#song-form-submit")).css('display', 'inline-block');
                    $("#song-form-submit").addClass("disabled");
                },
                success: function(data) {
                    $("#song-form .valid-feedback").show();
                    location.reload();
                },
                error: function(response) {
                    json_data = JSON.parse(response.responseText)
                    $("#song-form.invalid-feedback").show();
                    $("#song-form.invalid-feedback").html(json_data["error_reason"]);
                    setTimeout(function() {
                        $(".invalid-feedback").hide();
                    }, 3000);
                },
                complete: function() {
                    $(".fa-spinner", $("#song-form-submit")).css('display', 'none');
                    $("#song-form-submit").removeClass("disabled");
                }
            });
        }
    });

    $(".track_check_input").on("click", function() {
        if ($(".track_check_input:checked").length > 1) {
            $('#song-form-submit').prop('disabled', false);
        } else {
            $('#song-form-submit').prop('disabled', true);
        }
    });

    $(".track-table-row input[name='approvalChkbox'], .track-table-row .track-like").click(function(e) {
        // This would prevent playing on the music player
        e.stopImmediatePropagation();
    });
    $("input[name='approvalChkbox']").on("change", function(e) {
        var numberOfChecked = $("input[name='approvalChkbox']:checked").length;
        if (numberOfChecked == 3) {
            $("#approval-form-submit").removeClass("disabled");
        } else {
            $('#approval-form-submit').addClass("disabled");
        }
    });
    $("#approval-form-submit").click(function(e) {
        e.preventDefault();
        if ($(this).hasClass("disabled")) {
            return;
        }
        $('#trackTermsModal').modal('show');
    });
    $("#track-approval-agree").on("change", function() {
        if (this.checked) {
            $("#trackTermsModal #track-approval-submit").removeClass("disabled");
        } else {
            $("#trackTermsModal #track-approval-submit").addClass("disabled");
        }
    });
    $("#track-approval-submit").click(function(e) {
        e.preventDefault();
        if ($(this).hasClass("inactive")) {
            return;
        }
        if ($(this).hasClass("disabled")) {
            $("#trackTermsModal .invalid-feedback").show();
            setTimeout(function() {
                $(".invalid-feedback").hide();
            }, 3000);
        } else {
            var trackids = [];
            var user_id = $(this).attr("value");
            $("input[name='approvalChkbox']:checked").each(function() {
                trackids.push($(this).attr("value"));
            });
            var formData = {
                'trackids': JSON.stringify(trackids),
                "csrfmiddlewaretoken": getCookie("csrftoken")
            }
            $.ajax({
                type: "POST",
                url: "/user/" + user_id + "/all_tracks/track_approval/submit/",
                data: formData,
                beforeSend: function() {
                    $(".fa-spinner", $("#track-approval-submit")).css('display', 'inline-block');
                    $("#track-approval-submit").addClass("disabled inactive");
                },
                success: function() {
                    location.reload();
                },
                error: function(xhr) {
                    json_data = JSON.parse(xhr.responseText)
                },
                complete: function() {
                    $(".fa-spinner", $("#track-approval-submit")).css('display', 'none');
                    $("#track-approval-submit").removeClass("disabled inactive");
                }
            });
        }
    });
    // User Review
    $("input[name='reviewChkbox']").on("change", function(e) {
        var numberOfChecked = $("input[name='reviewChkbox']:checked").length;
        if (numberOfChecked >= 1 && numberOfChecked <= 5) {
            $("#review-invite-submit").removeClass("disabled");
        } else {
            $('#review-invite-submit').addClass("disabled");
        }
    });
    $("#review-invite-submit").click(function(e) {
        e.preventDefault();
        if ($(this).hasClass("disabled")) {
            return;
        } else {
            var reviewerids = [];
            var album_id = $(this).attr("value");
            $("input[name='reviewChkbox']:checked").each(function() {
                reviewerids.push($(this).attr("value"));
            });
            var formData = {
                'reviewerids': JSON.stringify(reviewerids),
                "csrfmiddlewaretoken": getCookie("csrftoken")
            }
            $.ajax({
                type: "POST",
                url: "/album/" + album_id + "/reviewers/track_review/submit/",
                data: formData,
                beforeSend: function() {
                    $("#review-invite-submit").css('display', 'inline-block');
                    $("#review-invite-submit").addClass("disabled");
                },
                success: function() {
                    location.reload();
                },
                error: function(xhr) {
                    json_data = JSON.parse(xhr.responseText)
                },
                complete: function() {
                    $("#track-approval-submit").css('display', 'none');
                    $("#track-approval-submit").removeClass("disabled");
                }
            });
        }
    });
    $("#user-about-edit-form-submit").click(function(e) {
        e.preventDefault();
        var validator = $("#user-about-edit-form").validate();
        if ($("#user-about-edit-form").valid()) {
            var formData = {
                "user_desc": $("#user_desc").val(),
                "csrfmiddlewaretoken": getCookie("csrftoken")
            }
            $.post("edit/1/submit/", formData, function(data) {
                location.reload();
            }).fail(function(response) {
                json_data = JSON.parse(response.responseText)
                $("#user-about-edit-form .invalid-feedback").show();
                $("#user-about-edit-form .invalid-feedback").html(json_data["error_reason"]);
                setTimeout(function() {
                    $(".invalid-feedback").hide();
                }, 3000);
            });
        }
    });
    $("#user-general-edit-form-submit").click(function(e) {
        e.preventDefault();
        var validator = $("#user-general-edit-form").validate();
        if ($("#user-general-edit-form").valid()) {
            var formData = {
                "user_first_name": $("#user_first_name").val(),
                "user_last_name": $("#user_last_name").val(),
                "user_name": $("#user_name").val(),
                "user_type": $("#user_type").val(),
                "user_dob": $("#user_dob").val(),
                "csrfmiddlewaretoken": getCookie("csrftoken")
            }
            $.post("edit/2/submit/", formData, function(data) {
                location.reload();
            }).fail(function(response) {
                json_data = JSON.parse(response.responseText)
                $("#user-general-edit-form .invalid-feedback").show();
                $("#user-general-edit-form .invalid-feedback").html(json_data["error_reason"]);
                setTimeout(function() {
                    $(".invalid-feedback").hide();
                }, 3000);
            });
        }
    });
    $("#user-contact-edit-form-submit").click(function(e) {
        e.preventDefault();
        var validator = $("#user-contact-edit-form").validate();
        if ($("#user-contact-edit-form").valid()) {
            var formData = {
                "user_email": $("#user_email").val(),
                "user_email_alt": $("#user_email_alt").val(),
                "user_phone": $("#user_phone").val(),
                "user_phone_alt": $("#user_phone_alt").val(),
                "user_fb_url": $("#user_fb_url").val(),
                "user_tw_url": $("#user_tw_url").val(),
                "user_insta_url": $("#user_insta_url").val(),
                "user_youtube_url": $("#user_youtube_url").val(),
                "user_other_url": $("#user_other_url").val(),
                "csrfmiddlewaretoken": getCookie("csrftoken")
            }
            $.post("edit/3/submit/", formData, function(data) {
                location.reload();
            }).fail(function(response) {
                json_data = JSON.parse(response.responseText)
                $("#user-contact-edit-form .invalid-feedback").show();
                $("#user-contact-edit-form .invalid-feedback").html(json_data["error_reason"]);
                setTimeout(function() {
                    $(".invalid-feedback").hide();
                }, 3000);
            });
        }
    });
    $(".album-like-submit").click(function() {
        var formData = {
            "alb_id": $(this).attr("value"),
            "csrfmiddlewaretoken": getCookie("csrftoken")
        };
        $.post("/album/like/submit/", formData, function(data) {
            location.reload();
        });
    });
    $(".image-like-submit").click(function() {
        var formData = {
            "image_id": $(this).attr("value"),
            "csrfmiddlewaretoken": getCookie("csrftoken")
        };
        $.post("/image/like/submit/", formData, function(data) {
            $(this).removeClass("bg-orange").addClass("bg-red");
        });
    });
    $(".image-comment-submit").click(function(e) {
        e.preventDefault();
        var validator = $("#image-comment-form").validate();
        if ($("#latest_comment").valid()) {
            var formData = {
                "image_id": $(this).attr("value"),
                "latest_comment": $("#latest_comment").val(),
                "csrfmiddlewaretoken": getCookie("csrftoken")
            };
            $.post("/image/comment/submit/", formData, function(data) {
                location.reload();
            });
        }
    });
    $(".posts-btn").click(function() {
        window.location.href = "/";
    });
    $(".album-item-wrapper").click(function(e) {
        e.preventDefault();
        var alb_id = $(this).attr("album_id");
        window.location.href = "/album/" + alb_id;
    })
    $("#album-comment-submit").click(function(e) {
        e.preventDefault();
        var validator = $("#album-comment-form").validate();
        if ($("#album-comment-form").valid()) {
            var formData = {
                "user-album-comment": $("#user-album-comment").val(),
                "csrfmiddlewaretoken": getCookie("csrftoken")
            };
            $.ajax({
                type: "POST",
                url: "comment/submit/",
                data: formData,
                beforeSend: function() {
                    $(".fa-spinner", $("#album-comment-submit")).css('display', 'inline-block');
                    $("#album-comment-submit").addClass("disabled");
                },
                success: function(data) {
                    $("#album-comment-form .valid-feedback").show();
                    location.reload();
                },
                error: function(response) {
                    json_data = JSON.parse(response.responseText)
                    $("#album-comment-form .invalid-feedback").show();
                    $("#album-comment-form .invalid-feedback").html(json_data["error_reason"]);
                    setTimeout(function() {
                        $(".invalid-feedback").hide();
                    }, 3000);
                },
                complete: function() {
                    $(".fa-spinner", $("#album-comment-submit")).css('display', 'none');
                    $("#album-comment-submit").removeClass("disabled");
                }
            });
        }
    });
    $("#user-about-add-btn").click(function() {
        $("#user_desc_empty").hide();
        $("#user-about-form").addClass("d-inline").removeClass("d-none");
    });
    $("#user-about-edit-btn").click(function() {
        $("#user-about-form").addClass("d-inline").removeClass("d-none");
        $('.user-info-class').hide();
    });
    $("#user-about-cancel-btn").click(function() {
        $("#user-about-form").removeClass("d-inline").addClass("d-none");
        $("#user_desc_empty").show();
        $('.user-info-class').show();
    });
    $("#user-about-change-form-submit").click(function(e) {
        e.preventDefault();
        var validator = $("#user-about-form").validate();
        if ($("#user-about-form").valid()) {
            var formData = {
                "user_desc": $("#user_desc").val(),
                "csrfmiddlewaretoken": getCookie("csrftoken")
            };
            $.ajax({
                type: "POST",
                url: "edit/1/submit/",
                data: formData,
                beforeSend: function() {
                    $(".fa-spinner", $("#user-about-change-form-submit")).css('display', 'inline-block');
                    $("#user-about-change-form-submit").addClass("disabled");
                },
                success: function(data) {
                    $("#user-about-form .valid-feedback").show();
                    location.reload();
                },
                error: function(response) {
                    json_data = JSON.parse(response.responseText)
                    $("#user-about-form .invalid-feedback").show();
                    $("#user-about-form .invalid-feedback").html(json_data["error_reason"]);
                    setTimeout(function() {
                        $(".invalid-feedback").hide();
                    }, 3000);
                },
                complete: function() {
                    $(".fa-spinner", $("#user-about-change-form-submit")).css('display', 'none');
                    $("#user-about-change-form-submit").removeClass("disabled");
                }
            });
        }
    });
    $('#alb_release_date_picker, #event_datetime_picker, #track_release_date_picker, #user_dob_picker').datetimepicker({
        locale: 'ru',
        format: 'YYYY-MM-DD HH:mm',
        useCurrent: false
    });
    // This changes the public status of album depending on release date
    $('#alb_release_date_picker').on("change.datetimepicker", function(e) {
        if(e.date > Date.now()){
            $('#alb_public_status').prop("checked", false);
        }else{
            $('#alb_public_status').prop("checked", true);
        }
    });
    // This changes the public status of track depending on release date
    $('#track_release_date_picker').on("change.datetimepicker", function(e) {
        if(e.date > Date.now()) {
            $("#track_public_status").prop("checked", false);
        }else{
            $('#track_public_status').prop("checked", true);
        }
    });
    $("#playlist_add_btn").click(function() {
        $(".playlist_wrapper").removeClass("d-none");
        $('.no_playlist').hide();
    });
    $("#playlist_cancel_btn").click(function() {
        $(".playlist_wrapper").addClass("d-none");
        $('.no_playlist').show();
    });
    $("#create-new-playlist-btn").click(function() {
        $("#playlist_add_div").addClass("d-inline").removeClass("d-none");
    });
    $("#new-playlist-cancel-btn").click(function() {
        $("#playlist_add_div").removeClass("d-inline").addClass("d-none");
    });
    // profile page add playlist
    $("#playlist-add-submit").click(function(e) {
        e.preventDefault();
        if ($(this).hasClass("disabled")) {
            return;
        }
        var validator = $("#playlist_add_form").validate();
        if ($("#playlist_add_form").valid()) {
            var formData = new FormData();
            formData.append("playlist_add", $("#playlist_add").val());
            formData.append("pl_desc", $("#pl_desc").val());
            formData.append("pl_image", $("#pl_image")[0].files[0]);
            formData.append("csrfmiddlewaretoken", getCookie("csrftoken"));
            $.ajax({
                url: "/playlist/submit/",
                data: formData,
                type: 'POST',
                contentType: false,
                processData: false,
                beforeSend: function() {
                    $(".fa-spinner", $("#playlist-add-submit")).css('display', 'inline-block');
                    $("#playlist-add-submit").addClass("disabled");
                },
                success: function(data) {
                    $("#playlist_add_form.valid-feedback").show();
                    location.reload();
                },
                error: function(response) {
                    json_data = JSON.parse(response.responseText)
                    $("#playlist_add_form.invalid-feedback").show();
                    $("#playlist_add_form .invalid-feedback").html(json_data["error_reason"]);
                    setTimeout(function() {
                        $(".invalid-feedback").hide();
                    }, 3000);
                },
                complete: function() {
                    $(".fa-spinner", $("#playlist-add-submit")).css('display', 'none');
                    $("#playlist-add-submit").removeClass("disabled");
                }
            });
        }
    });
    //user_name edit
    $("#user_name_edit").click(function() {
        $('#user_name').hide();
        $("#user_name_wrapper").addClass("d-inline").removeClass("d-none");
    });
    $("#user_name_cancel_btn").click(function() {
        $("#user_name_wrapper").removeClass("d-inline").addClass("d-none");
        $('#user_name').show();
    });
    $('#modal-hover').click(function () {
        $('#addChangeModal').modal('show');
        $('[data-toggle=popover]').popover('hide'); //EDIT: added this line to hide popover on button click.
    });
});