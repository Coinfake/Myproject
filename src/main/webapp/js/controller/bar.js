angular.module('myApp').controller('barCtrl',function ($scope){



    var isiPad = function(){
        return (navigator.platform.indexOf("iPad") != -1);
    };

    var isiPhone = function(){
        return (
            (navigator.platform.indexOf("iPhone") != -1) ||
            (navigator.platform.indexOf("iPod") != -1)
        );
    };
    var fullHeight = function () {
        if (!isiPad() && !isiPhone()) {
            $('.js-fullheight').css('height', $(window).height() - 49);
            $(window).resize(function () {
                $('.js-fullheight').css('height', $(window).height() - 49);
            })
        }
    };


    // Animations

    var contentWayPoint = function() {
        var i = 0;
        $('.animate-box').waypoint( function( direction ) {

            if( direction === 'down' && !$(this.element).hasClass('animated') ) {

                i++;

                $(this.element).addClass('item-animate');
                setTimeout(function(){

                    $('body .animate-box.item-animate').each(function(k){
                        var el = $(this);
                        setTimeout( function () {
                            var effect = el.data('animate-effect');
                            if ( effect === 'fadeIn') {
                                el.addClass('fadeIn animated');
                            } else if ( effect === 'fadeInLeft') {
                                el.addClass('fadeInLeft animated');
                            } else if ( effect === 'fadeInRight') {
                                el.addClass('fadeInRight animated');
                            } else {
                                el.addClass('fadeInUp animated');
                            }

                            el.removeClass('item-animate');
                        },  k * 200, 'easeInOutExpo' );
                    });

                }, 100);

            }

        } , { offset: '85%' } );
    };

    var counter = function() {
        $('.js-counter').countTo({
            formatter: function (value, options) {
                return value.toFixed(options.decimals);
            },
        });
    };

    var counterWayPoint = function() {
        if ($('#counter-animate').length > 0 ) {
            $('#counter-animate').waypoint( function( direction ) {

                if( direction === 'down' && !$(this.element).hasClass('animated') ) {
                    setTimeout( counter , 400);
                    $(this.element).addClass('animated');

                }
            } , { offset: '90%' } );
        }
    };

    var burgerMenu = function() {

        $('.js-fh5co-nav-toggle').on('click', function(event){
            event.preventDefault();
            var $this = $(this);

            if ($('body').hasClass('offcanvas')) {
                $this.removeClass('active');
                $('body').removeClass('offcanvas');
            } else {
                $this.addClass('active');
                $('body').addClass('offcanvas');
            }
        });



    };

    // Click outside of offcanvass
    var mobileMenuOutsideClick = function() {

        $(document).click(function (e) {
            var container = $("#fh5co-aside, .js-fh5co-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {

                if ( $('body').hasClass('offcanvas') ) {

                    $('body').removeClass('offcanvas');
                    $('.js-fh5co-nav-toggle').removeClass('active');

                }

            }
        });

        $(window).scroll(function(){
            if ( $('body').hasClass('offcanvas') ) {

                $('body').removeClass('offcanvas');
                $('.js-fh5co-nav-toggle').removeClass('active');

            }
        });

    };

    // Document on load.
    $(function(){
        fullHeight();
        contentWayPoint();
        counterWayPoint();
        burgerMenu();
        mobileMenuOutsideClick();
    });


}());