/* -----------------------------------------------------------------------------

    Mackbeth
    v 1.0
    by ShakespeareThemes
    shakespearethemes@gmail.com

----------------------------------------------------------------------------- */


/* -----------------------------------------------------------------------------

    TABLE OF CONTENT

    1.) General Variables
    2.) Typography
    3.) Components
    4.) Various Scripts
    5.) Header
    6.) Main Slider
    7.) Homepage
    8.) Page Types
    9.) Widgets
    10.) Window Resize
    11.) Initialize Page

----------------------------------------------------------------------------- */

(function($){
    "use strict";
    var ThePage = function(){

/* ------------------------------------------------------------------

        1.) GENERAL VARIABLES

------------------------------------------------------------------ */

        /* ----------------------------------
            PAGE VAR
        ---------------------------------- */

        var thepage = this;

        /* ----------------------------------
            OLD IE
        ---------------------------------- */

        var oldIE = ($.support.leadingWhitespace) ? false : true;

        /* ----------------------------------
            SCREEN WIDTH
        ---------------------------------- */

        thepage.get_window_width = function() {
            var width;
            // fix for IE
            if(oldIE) {
                width = 1199;
            }
            else {
                width = $('#screen-width').css('content');
                width = width.replace("\"","").replace("\"","").replace("\'","").replace("\'","");
                if(isNaN(parseInt(width,10))){
                    $('#screen-width span').each(function(){
                        width = window.getComputedStyle(this,':before').content;
                    });
                    width = width.replace("\"","").replace("\"","").replace("\'","").replace("\'","");
                }
            }
            return width;
        };
        var screen_width = thepage.get_window_width();


/* -----------------------------------------------------------------------------

        2.) TYPOGRAPHY

----------------------------------------------------------------------------- */

        /* ----------------------------------
            CREATE DEFAULT LISTS
        ---------------------------------- */

        thepage.create_default_lists = function(){
            $('.various-content ul:not(.accordion,.tabs,.tab-content,.check-list,.default-list)').each(function() {
                $(this).addClass('default-list');
                $(this).find('> li').prepend('<i class="ico icon-chevron-right"></i>');
            });
        };
        thepage.create_default_lists();


/* -----------------------------------------------------------------------------

        3.) COMPONENTS

----------------------------------------------------------------------------- */

        /* ----------------------------------
            ACCORDION
        ---------------------------------- */

        thepage.create_accordions = function(){
            $('.accordion .accordion-item.opened').each(function(){
                $(this).removeClass('active');
                $(this).addClass('opened');
                $(this).find('.accordion-content').show();
            });

            $('.accordion .accordion-toggle').click(function(){
                var item = $(this).parents('.accordion-item');
                var item_content = item.find('.accordion-content');
                item.toggleClass('opened');
                item_content.slideToggle(300);
            });

        };
        thepage.create_accordions();

        /* ----------------------------------
            AUDIO PLAYER
        ---------------------------------- */

        thepage.create_audio_players = function(){
            $('.audio-player').each(function(){

                var player = $(this);
                var control = player.find('button.control');
                var audio = player.find('audio').first();
                var progressbar = player.find('.progressbar');

                /* CONTROL BUTTON */

                control.click(function(){

                    // play

                    if(player.hasClass('paused')){
                        player.removeClass('paused');
                        audio.trigger('play');
                        audio.bind('timeupdate', function(){
                            var track_length = $(this)[0].duration;
                            var secs = $(this)[0].currentTime;
                            var progress = (secs/track_length) * 100;
                            progressbar.find('div').css('width', progress + "%");
                        });
                    }

                    // pause

                    else {
                        player.addClass('paused');
                        audio.trigger('pause');
                    }

                });

                /* SET POSITION */

                progressbar.click(function(e){
                    var posX = e.pageX - $(this).offset().left;
                    var width = progressbar.width();
                    var progress_percentage = (posX / (width / 100));
                    var duration = audio[0].duration;
                    var time = Math.floor((duration / 100) * progress_percentage);

                    // set progress
                    progressbar.find('div').css('width', progress_percentage + "%");

                    // set time

                    audio[0].currentTime = time;

                });

                /* RESET ON AUDIO END */

                audio.bind('ended', function(){
                    player.addClass('paused');
                    audio.trigger('pause');
                    audio.currentTime = 0;
                    progressbar.find('div').css('width', 0);
                });

            });
        };
        thepage.create_audio_players();

        /* ----------------------------------
            LIST SLIDER
        ---------------------------------- */

        var ListSlider = function(element){

            var elem = $(element);

            /* VARIABLES */

            var slider = elem.find('.list-slider-items').first();
            var container = slider.find('> ul').first();
            var prev_btn = elem.find('.list-slider-nav .prev');
            var next_btn = elem.find('.list-slider-nav .next');
            var active_item;
            var number_of_items = container.find('> li').length;
            var item_width;
            var visible_items;

            /* SET HEIGHT */

            var set_height = function() {

                // get height of highest visible item
                var max_height = 0;
                var i;
                for(i = active_item; i < active_item + visible_items; i++){
                    var height = container.find('> li:eq(' + i + ')').height();
                    max_height = height > max_height ? height : max_height;
                }
                slider.css('height', max_height);

            };

            /* RESET */

            var reset = function() {

                active_item = 0;
                prev_btn.addClass('disabled');
                next_btn.removeClass('disabled');
                item_width = container.find('> li').first().width();
                visible_items = Math.ceil(slider.width() / item_width);
                container.css({
                    'width' : number_of_items * item_width,
                    'left' : 0
                });
                slider.css('overflow', 'hidden');
                set_height();

            };
            reset();

            /* REFRESH */

            this.refresh = function(){
                reset();
            };

            /* NEXT */

            var next = function(){
                active_item += 1;
                container.css('left', -(active_item * item_width));
                set_height();
            };
            next_btn.click(function(){
                if(!$(this).hasClass('disabled')){

                    // slide next
                    next();

                    // enable prev button
                    if(prev_btn.hasClass('disabled')){
                        prev_btn.removeClass('disabled');
                    }

                    // check for disabling next button
                    if(active_item+visible_items >= number_of_items){
                        $(this).addClass('disabled');
                    }
                }
            });

            /* PREV */

            var prev = function(){
                active_item -= 1;
                container.css('left', -(active_item * item_width));
                set_height();
            };
            prev_btn.click(function(){
                if(!$(this).hasClass('disabled')){

                    // slide prev
                    prev();

                    // enable next button
                    if(next_btn.hasClass('disabled')){
                        next_btn.removeClass('disabled');
                    }

                    // check for disabling prev button
                    if(active_item <= 0){
                        $(this).addClass('disabled');
                    }
                }
            });

        };

        $.fn.listslider = function(options){
            return this.each(function(){
                var element = $(this);
                // Return early if this element already has a plugin instance
                if(element.data('listslider')) { return; }
                // pass options to plugin constructor
                var listslider = new ListSlider(this,options);
                // Store plugin object in this element's data
                element.data('listslider',listslider);
            });

        };

        /* INITIALIZE */

        $('.list-slider').each(function(){
            $('.list-slider').listslider().data('listslider');
        });

        /* ----------------------------------
            PROGRESS BARS
        ---------------------------------- */

        thepage.create_progressbars = function(){
            $('.progressbar').each(function(){
                var inner = $(this).find('.inner');
                inner.append('<span class="percentage">' + $(this).data('percentage') + '</span>');
                $(this).delay(100).fadeIn(100, function(){
                    inner.css('width',$(this).data('percentage'));
                });
            });
        };
        thepage.create_progressbars();

        /* ----------------------------------
            PROJECT PREVIEW
        ---------------------------------- */

        thepage.create_project_previews = function(){

            $('.project-preview .thumb').hover(function(){
                var self = $(this);
                self.find('.overlay').stop(true,true);
                self.addClass('hover');
            }, function(){
                var self = $(this);
                self.removeClass('hover');
            });

        };
        thepage.create_project_previews();

        /* ----------------------------------
            TABS
        ---------------------------------- */

        thepage.create_tabs = function(){
            $('.tabs .tab').click(function(){

                /* SET ACTIVE TAB */

                $(this).parent().find('.active').removeClass('active');
                $(this).addClass('active');
                var index = $(this).index();

                /* TOGGLE CONTENT */

                if($(this).parent().next('.tab-content').length > 0){

                    var content = $(this).parent().next('.tab-content').first();
                    content.find('.item:visible').hide();
                    content.find('.item:eq(' + index + ')').show();

                }

            });
        };
        thepage.create_tabs();


/* -----------------------------------------------------------------------------

        4.) VARIOUS SCRIPTS

----------------------------------------------------------------------------- */

        /* ----------------------------------
            GET EXTERNAL VIDEO THUMB
        ---------------------------------- */

        thepage.get_external_video_thumb = function(source,thumb){

            var video_url = source;
            var video_id;
            var regExp;

            // YOUTUBE
            if(video_url.indexOf('youtube') !== -1){

                regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
                var match = video_url.match(regExp);
                if (match&&match[7].length===11){
                    video_id = match[7];

                    // GET THUMBNAIL
                    $.getJSON('http://gdata.youtube.com/feeds/api/videos/' + video_id + '?v=2&alt=jsonc&callback=?', function(json){
                        thumb.css({
                            'background-image' : 'url(' + json.data.thumbnail.hqDefault + ')'
                        });
                    });
                }

            }
            // VIMEO
            else if(video_url.indexOf('vimeo') !== -1){

                regExp = /video\/(\d+)/;
                video_id = video_url.match(regExp)[1];
                if(video_id){

                    // GET THUMBNAIL
                    $.getJSON('http://www.vimeo.com/api/v2/video/' + video_id + '.json?callback=?', {format: "json"}, function(data) {
                        thumb.css({
                            'background-image' : 'url(' + data[0].thumbnail_large + ')'
                        });
                    });
                }

            }

        };

        $('.recent-articles .article.video .thumb, .blog-page article.video .article-image .thumb').each(function(){
            if($(this).attr('data-videosrc')){
                thepage.get_external_video_thumb($(this).data('videosrc'),$(this));
            }
        });

        /* ----------------------------------
            LIGHTBOX
            Initialize Magnific Popup with "lightbox" class
        ---------------------------------- */

        thepage.create_lightboxes = function(){
            if($.fn.magnificPopup) {

                // just one image on page
                if($('a.lightbox').length > 1){
                    $('a.lightbox').magnificPopup({
                        type: 'image',
                        gallery: {
                            enabled: true
                        },
                        callbacks: {
                            /* FIREFOX GLITCH FIX */
                            beforeOpen: function() {
                                $('.project-preview .thumb .overlay').hide();
                            },
                            close: function() {
                                setTimeout(function(){
                                    $('.project-preview .thumb .overlay').removeAttr('style');
                                },100);
                            }
                        }
                    });
                }

                // more than one image on page
                else if($('a.lightbox').length === 1){
                    $('a.lightbox').magnificPopup({
                        type: 'image'
                    });
                }

            }
        };
        thepage.create_lightboxes();

/* -----------------------------------------------------------------------------

        5.) HEADER

----------------------------------------------------------------------------- */

        /* ----------------------------------
            TOPBAR
        ---------------------------------- */

        /* SEARCH */

        // show input

        $('#topbar .search-form button.submit').click(function(){

            if(screen_width > 767){
                if($(this).is(':not(.active)')){
                    $(this).addClass('active');
                    $('#topbar .search-form').addClass('active');
                    // show input
                    $('#topbar .search-form .input').fadeIn(300);
                    // hide social icons
                    $('#topbar .social-icons').fadeOut(300);
                    return false;
                }
            }

        });

        // close input

        $('#topbar .search-form button.close').click(function(){
            // hide input
            $('#topbar .search-form .input').fadeOut(300, function(){
                $('#topbar .search-form input').val($('#topbar .search-form input').data('placeholder'));
            });
            // show social icons
            $('#topbar .social-icons').fadeIn(300, function(){
                $('#topbar .search-form, #topbar .search-form button.submit').removeClass('active');
            });
            return false;
        });

        // input placeholder

        $('#topbar .search-form input').focus(function(){
            if($(this).val() === $(this).data('placeholder')){
                $(this).val('');
            }
        });
        $('#topbar .search-form input').blur(function(){
            if($(this).val() === ''){
                $(this).val($(this).data('placeholder'));
            }
        });

        /* RESPONSIVE CONTROLS */

        // social icons

        $('#topbar .responsive-controls .social').click(function(){
            $(this).toggleClass('active');
            $('#topbar .social-icons').slideToggle(300);
            if($('#topbar .search-form').is(':visible')){
                $('#topbar .search-form').slideUp(300);
                $('#topbar .responsive-controls .search').removeClass('active');
            }
        });

        // search

        $('#topbar .responsive-controls .search').click(function(){
            $(this).toggleClass('active');
            $('#topbar .search-form').slideToggle(300);
            if($('#topbar .social-icons').is(':visible')){
                $('#topbar .social-icons').slideUp(300);
                $('#topbar .responsive-controls .social').removeClass('active');
            }
        });

        /* ----------------------------------
            NAVBAR
        ---------------------------------- */

        /* SET INDICATOR */

        var set_mainnav_indicator = function(active_item){
            var indicator = $('nav.main .indicator');
            var offset = Math.floor(active_item.position().left) + 27;
            var width = Math.floor(active_item.find('> a').width());
            indicator.css({
                'left' : offset,
                'width' : width
            });
        };
        set_mainnav_indicator($('nav.main > ul > li.active').first());

        /* HOVER ACTION */

        $('nav.main > ul > li').hover(function(){
            if(screen_width > 979){

                // set indicator

                set_mainnav_indicator($(this));

                // show submenu

                $(this).find('ul').stop(true,true).slideDown(300);

            }
        }, function(){
            if(screen_width > 979){

                // reset indicator

                set_mainnav_indicator($('nav.main > ul > li.active'));

                // hide submenu

                $(this).find('ul').slideUp(300);

            }
        });

        /* RESPONSIVE NAV */

        // toggle nav

        $('nav.main > button').click(function(){
            $(this).toggleClass('active');
            $('nav.main > ul').slideToggle(300);
        });

        // toggle submenu

        $('nav.main .arrow').click(function(){
            if(screen_width <= 979){
                $(this).toggleClass('active');
                $(this).parent().find('ul').slideToggle(300);
            }
        });


/* -----------------------------------------------------------------------------

        6.) MAIN SLIDER
        Default slider for homepage

----------------------------------------------------------------------------- */

        $('#slider').each(function(){

            var slider = $(this);
            var carousel = $(this).find('.carousel');
            var indicator = slider.find('.indicator .progressbar').length > 0 ? slider.find('.indicator .progressbar') : false;
            var interval = (slider.data('interval') && !isNaN(slider.data('interval'))) ? slider.data('interval') : false;

            /* ----------------------------------
                LOAD IMAGES
            ---------------------------------- */

            var number_of_images = slider.find('img').length;
            var loaded_images = 0;

            if(number_of_images > 0 && !oldIE){

                slider.find('img').one('load', function() {
                    loaded_images++;
                    if(number_of_images === loaded_images){
                        slider.find('.loading-anim').fadeOut(300);
                    }
                }).each(function() {
                    if(this.complete) { $(this).load(); }
                });
            }
            else {
                slider.find('.loading-anim').fadeOut(300);
            }

            /* ----------------------------------
                ANIMATE INDICATOR
            ---------------------------------- */

            var slider_indicator_animate = function(progress,time){

                indicator.stop();

                // set default progress value

                indicator.css('width',progress + '%');

                // animate progressbar

                if(!slider.find('button.pause').hasClass('paused')){
                    indicator.animate({
                        'width' : '100%'
                    },time, function(){

                        // slide next
                        carousel.carousel('next');

                    });
                }

            };

            /* ----------------------------------
                WITH INTERVAL
            ---------------------------------- */

            if(interval !== false){

                /* INDICATOR */

                if(indicator !== false){
                    slider_indicator_animate(0,interval);
                }

                /* INIT */

                carousel.carousel({
                    interval: false,
                    pause: false
                });

                /* SLID EVENT */

                carousel.bind('slid',function(){
                    indicator.attr('data-percentage',0);
                    indicator.attr('data-time',0);
                    slider_indicator_animate(0,interval);
                });

            }

            /* ----------------------------------
                WITHOUT INTERVAL
            ---------------------------------- */

            else {

                carousel.carousel({
                    interval: false
                });

            }

            /* ----------------------------------
                PREV SLIDE
            ---------------------------------- */

            $('#slider .nav.prev button').click(function(){
                if(indicator !== false){
                    indicator.stop();
                }
                carousel.carousel('prev');
            });

            /* ----------------------------------
                NEXT SLIDE
            ---------------------------------- */

            $('#slider .nav.next button').click(function(){
                if(indicator !== false){
                    indicator.stop();
                }
                carousel.carousel('next');
            });

            /* ----------------------------------
                PAUSE
            ---------------------------------- */

            if(interval !== false){
            $('#slider button.pause').click(function(){

                /* UNPAUSE */

                if($(this).hasClass('paused')){

                    $(this).removeClass('paused');

                    // unpause indicator

                    if(indicator !== false){
                        slider_indicator_animate(parseInt(indicator.attr('data-percentage'),10) + 1,interval - indicator.attr('data-time'));
                    }

                }

                /* PAUSE */

                else {

                    $(this).addClass('paused');

                    // pause indicator

                    if(indicator !== false){
                        indicator.stop();
                        indicator.attr('data-percentage',Math.floor(indicator.width() / (indicator.parent().width() / 100)));
                        indicator.attr('data-time',(interval / 100) * indicator.attr('data-percentage'));
                    }

                }

            });
            }

        });

/* -----------------------------------------------------------------------------

        7.) HOMEPAGE

----------------------------------------------------------------------------- */

        /* ----------------------------------
            SERVICES
        ---------------------------------- */

        $('#home-services .service').hover(function(){
            $(this).toggleClass('hover');
        });


/* -----------------------------------------------------------------------------

        8.) PAGE TYPES

----------------------------------------------------------------------------- */

        /* ----------------------------------
            ABOUT PAGE
        ---------------------------------- */

        /* TEAM MEMBER THUMBNAIL */

        thepage.about_member_hover = function(){

            $('.about-team .team-member .thumb').hover(function(){
                var self = $(this);
                self.find('.overlay').stop(true,true);
                self.addClass('hover');
                self.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
                    self.addClass('hovered');
                });
            }, function(){
                var self = $(this);
                self.removeClass('hover');
                self.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
                    self.removeClass('hovered');
                });
            });

        };
        thepage.about_member_hover();

        /* ----------------------------------
            PORTFOLIO PAGE AJAXED PAGINATION
        ---------------------------------- */

        /* SHOW NEW PROJECTS */

        var portfolio_show_projects = function (element) {

            $('.loading-area ul.row').hide();
            $('.loading-area ul.row').appendTo(element.find('.projects-inner'));
            element.find('ul.row:hidden').fadeIn(300);

            // REPLACE PAGINATION

            element.find('.button-pagination').remove();
            if($('.loading-area .button-pagination').length > 0){
                $('.loading-area .button-pagination').appendTo(element);
                element.find('.button-pagination a').click(function(){
                    portfolio_pagination_click($(this),element);
                    return false;
                });
            }

            // SET THUMB HOVER ACTION

            thepage.create_project_previews();

            // SET LIGHTBOX

            thepage.create_lightboxes();

            // REMOVE TEMP DATA

            $('.loading-area').remove();

            // IE8 FIX

            if (typeof(css3pie_initialize) === 'function') {
                css3pie_initialize();
            }

        };

        /* LOAD NEW PROJECTS */

        var portfolio_load_projects = function (link,element) {

            $('body').append('<div class="loading-area" style="display: none;"></div>');
            $('.loading-area').load(link + ' .projects',function(){

                // WAIT FOR LOAD OF IMAGES

                var number_of_images = $('.loading-area img').length;
                var loaded_images = 0;

                if(number_of_images > 0 && !oldIE){
                    $('.loading-area img').one('load', function() {
                        loaded_images++;
                        if(number_of_images === loaded_images){

                            // IMAGES ARE LOADED

                            portfolio_show_projects(element);

                        }
                    }).each(function() {
                        if(this.complete) { $(this).load(); }
                    });
                }
                // NO IMAGES OR OLD IE
                else {
                    portfolio_show_projects(element);
                }

            });

        };

        /* CLICK ON BUTTON ACTION */

        var portfolio_pagination_click = function(button,parent){
            if(!button.hasClass('loading')){

                var label = button.find('.label');

                /* ADD LOADING LABEL AND CLASS */

                button.addClass('loading');
                label.text(button.data('loadinglabel'));

                /* TRIGGER LOAD */

                portfolio_load_projects(button.attr('href'),parent);

            }
        };

        /* CLICK ON BUTTON */

        $('.portfolio-page .projects').each(function(){

            var self = $(this);
            self.find('.button-pagination a').click(function(){
                portfolio_pagination_click($(this),self);
                return false;
            });

        });


/* -----------------------------------------------------------------------------

        9.) WIDGETS

----------------------------------------------------------------------------- */

        /* ----------------------------------
            WIDGET LOADED
        ---------------------------------- */

        var widget_loaded = function(widget){

            widget.find('.loading-anim').fadeOut(300);
            widget.find('.feed').fadeIn(300, function(){
                widget.removeClass('loading');
            });

        };

        /* ----------------------------------
            FLICKR WIDGET
            Based on this tutorial:
            http://www.leonamarant.com/2009/06/16/adding-a-flickr-feed-to-your-site-with-jquery/
        ---------------------------------- */

        // load images to feed
        $('.flickr.widget.loading').each(function(){
            var self = $(this);
            var feed = $(this).find('.feed');

            var feed_id = $(this).data('id');
            var feed_limit = $(this).data('limit');

            if(isNaN(feed_limit) || feed_limit < 1) {
                feed_limit = 1;
            }

            // create blank image list inside feed
            feed.html('<ul class="image-list clearfix"></ul>');

            // get the feed
            $.getJSON('http://api.flickr.com/services/feeds/photos_public.gne?id=' + feed_id + '&lang=en-us&format=json&jsoncallback=?', function(data){
                // get number of images to be shown,
                // check for posibility that number of all images in feed is smaller than number of images that we want to show
                var number_of_images = feed_limit;
                if(data.items.length < feed_limit){
                    number_of_images = data.items.length;
                }
                // main feed loop
                var i;
                for(i = 0; i < number_of_images; i++){
                    feed.find('ul').append('<li><a href="' + data.items[i].link + '" style="background-image: url(' + data.items[i].media.m + ');" target="_blank" rel="external"><img src="' + data.items[i].media.m + '" alt="' + data.items[i].title + '"></a></li>');
                }
                feed.find('li:nth-child(2n)').addClass('second');
                feed.find('li:nth-child(3n)').addClass('third');
                feed.find('li:nth-child(4n)').addClass('fourth');

                // load images
                number_of_images = feed.find('img').length;
                var loaded_images = 0;

                if(number_of_images > 0 && !oldIE){
                    feed.find('img').one('load', function() {
                        loaded_images++;
                        if(number_of_images === loaded_images){

                            // images are loaded
                            widget_loaded(self);

                        }
                    }).each(function() {
                        if(this.complete) { $(this).load(); }
                    });
                }
                else {
                    widget_loaded(self);
                }

            });

        });

        /* ----------------------------------
            INSTAGRAM WIDGET
        ---------------------------------- */
        
        if($.fn.embedagram) {

            $('.instagram.widget.loading').each(function(){
                var self = $(this);
                var feed = $(this).find('.feed');

                var feed_id = $(this).data('id');
                var feed_limit = $(this).data('limit');

                if(isNaN(feed_limit) || feed_limit < 1) {
                    feed_limit = 1;
                }

                // create blank image list inside feed
                feed.html('<ul class="image-list clearfix"></ul>');

                /* launch embedegram */
                feed.find('ul.image-list').embedagram({
                    instagram_id: feed_id,
                    limit: feed_limit,
                    success: function(){
                        // add external rel to each link
                        feed.find('a').each(function(){
                            $(this).css('background-image','url(' + $(this).find('img').attr('src') + ')');

                            $(this).attr('target','_blank');
                            $(this).attr('rel','external');
                            if($(this).find('img').attr('title')){
                                $(this).find('img').removeAttr('title');
                            }
                        });
                        feed.find('li:nth-child(2n)').addClass('second');
                        feed.find('li:nth-child(3n)').addClass('third');
                        feed.find('li:nth-child(4n)').addClass('fourth');

                        // load images
                        var number_of_images = feed.find('img').size();
                        var loaded_images = 0;

                        if(number_of_images > 0 && !oldIE){
                            feed.find('img').one('load', function() {
                                loaded_images++;
                                if(number_of_images === loaded_images){

                                    // images are loaded
                                    widget_loaded(self);

                                }
                            }).each(function() {
                                if(this.complete) { $(this).load(); }
                            });
                        }
                        else {
                            widget_loaded(self);
                        }
                    }
                });

            });

        }

        /* ----------------------------------
            DRIBBBLE WIDGET
        ---------------------------------- */

        if($.jribbble) {
            $('.dribbble.widget.loading').each(function(){
                var self = $(this);
                var feed = $(this).find('.feed');

                var feed_id = $(this).data('id');
                var feed_limit = $(this).data('limit');

                if(isNaN(feed_limit) || feed_limit < 1) {
                    feed_limit = 1;
                }

                // launch jribbble
                $.jribbble.getShotsByPlayerId(feed_id, function (playerShots) {
                    // check for posibility that number of all images in feed is smaller than number of images that we want to show
                    var number_of_images = feed_limit;
                    if(playerShots.shots.length < feed_limit){
                        number_of_images = playerShots.shots.length;
                    }

                    // create blank image list inside feed
                    feed.html('<ul class="image-list clearfix"></ul>');

                    // insert items
                    var i;
                    for(i = 0; i < number_of_images; i++){
                        feed.find('ul').append('<li><a href="' + playerShots.shots[i].url + '" style="background-image: url(' + playerShots.shots[i].image_teaser_url + ');" title="' + playerShots.shots[i].title + '" target="_blank" rel="external"><img src="' + playerShots.shots[i].image_teaser_url + '" alt="' + playerShots.shots[i].title + '"></a></li>');
                    }
                    feed.find('li:nth-child(2n)').addClass('second');
                    feed.find('li:nth-child(3n)').addClass('third');
                    feed.find('li:nth-child(4n)').addClass('fourth');

                    // load images
                    number_of_images = self.find('img').size();
                    var loaded_images = 0;

                    if(number_of_images > 0 && !oldIE){
                        feed.find('img').one('load', function() {
                            loaded_images++;
                            if(number_of_images === loaded_images){

                                // images are loaded
                                widget_loaded(self);

                            }
                        }).each(function() {
                            if(this.complete) { $(this).load(); }
                        });
                    }
                    else {
                        widget_loaded(self);
                    }

                }, {page: 1, per_page: feed_limit});

            });
        }


/* -----------------------------------------------------------------------------

        10.) WINDOW RESIZE

----------------------------------------------------------------------------- */

        var screen_transition = false;
        var actual_screen_width = screen_width;

        $(window).resize(function(){

            screen_width = thepage.get_window_width();

            /* CHECK FOR SCREEN TRANSITION */

            if(screen_width !== actual_screen_width){
                screen_transition = true;
                actual_screen_width = screen_width;
            }
            else {
                screen_transition = false;
            }

            /* IF TRANSITION */

            if(screen_transition){

                // topbar

                if(screen_width > 979){
                    $('#topbar .social-icons, #topbar .search-form, #topbar .input').removeAttr('style');
                    $('#topbar .active').removeClass('active');
                }

                // main nav

                if(screen_width > 979){
                    $('nav.main ul').removeAttr('style');
                    $('nav.main .arrow.active, nav.main > button.active').removeClass('active');
                }

                // list slider

                $('.list-slider').each(function(){
                    $(this).data('listslider').refresh();
                });

            }

        });


/* -----------------------------------------------------------------------------

        END.

----------------------------------------------------------------------------- */

    };

    $.fn.initpage = function(options){
        return this.each(function(){
            var element = $(this);
            // Return early if this element already has a plugin instance
            if(element.data('initpage')) { return; }
            // pass options to plugin constructor
            var initpage = new ThePage(this,options);
            // Store plugin object in this element's data
            element.data('initpage',initpage);
        });
    };


})(jQuery);


/* -----------------------------------------------------------------------------

        10.) INITIALIZE PAGE

----------------------------------------------------------------------------- */

$(document).ready(function(){

    "use strict";
    $('body').initpage().data('initpage');

});