angular.module('myApp').controller('productsCtrl', ['$scope', 'httpSvc', '$state', 'cfmWinSvc', '$timeout', function ($scope, httpSvc, $state, cfmWinSvc, $timeout) {

    // Go to next section
    var gotToNextSection = function () {
        var el = $('.fh5co-learn-more'),
            w = el.width(),
            divide = -w / 2;
        el.css('margin-left', divide);
    };

    var fullHeight = function () {
            $('.js-fullheight').css('height', $(window).height() - 49);
            $(window).resize(function () {
                $('.js-fullheight').css('height', $(window).height() - 49);
            })
    };

 /*   var toggleBtnColor = function () {
        if ($('#fh5co-hero').length > 0) {
            $('#fh5co-hero').waypoint(function (direction) {
                if (direction === 'down') {
                    $('.fh5co-nav-toggle').addClass('dark');
                }
            }, {offset: -$('#fh5co-hero').height()});

            $('#fh5co-hero').waypoint(function (direction) {
                if (direction === 'up') {
                    $('.fh5co-nav-toggle').removeClass('dark');
                }
            }, {
                offset: function () {
                    return -$(this.element).height() + 0;
                }
            });
        }



    };*/

    var colour = function () {
        $('#colour-variations ul').styleSwitcher({
            defaultThemeId: 'theme-switch',
            hasPreview: false,
            cookie: {
                expires: 30,
                isManagingLoad: true
            }
        });
        $('.option-toggle').click(function () {
            $('#colour-variations').toggleClass('sleep');
        });
    }
    // Scroll Next
    /*var ScrollNext = function () {
        $('body').on('click', '.scroll-btn', function (e) {
            e.preventDefault();

            $('html, body').animate({
                scrollTop: $($(this).closest('[data-next="yes"]').next()).offset().top
            }, 1000, 'easeInOutExpo');
            return false;
        });
    };
*/
    // Click outside of offcanvass
    var mobileMenuOutsideClick = function () {

        $(document).click(function (e) {
            var container = $("#fh5co-offcanvas, .js-fh5co-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {

                if ($('body').hasClass('offcanvas-visible')) {

                    $('body').removeClass('offcanvas-visible');
                    $('.js-fh5co-nav-toggle').removeClass('active');

                }


            }
        });

    };


    // Offcanvas
    var offcanvasMenu = function () {
        $('body').prepend('<div id="fh5co-offcanvas" />');
        $('#fh5co-offcanvas').prepend('<ul id="fh5co-side-links">');
        $('body').prepend('<a href="#" class="js-fh5co-nav-toggle fh5co-nav-toggle"><i></i></a>');

        $('.left-menu li, .right-menu li').each(function () {

            var $this = $(this);

            $('#fh5co-offcanvas ul').append($this.clone());

        });
    };

    // Burger Menu
    var burgerMenu = function () {

        $('body').on('click', '.js-fh5co-nav-toggle', function (event) {
            var $this = $(this);

            $('body').toggleClass('fh5co-overflow offcanvas-visible');
            $this.toggleClass('active');
            event.preventDefault();

        });
    };


    var testimonialFlexslider = function () {
        var $flexslider = $('.flexslider');
        $flexslider.flexslider({
            animation: "fade",
            manualControls: ".flex-control-nav li",
            directionNav: false,
            smoothHeight: true,
            useCSS: false /* Chrome fix*/
        });
    }


    var goToTop = function () {

        $('.js-gotop').on('click', function (event) {

            event.preventDefault();

            $('html, body').animate({
                scrollTop: $('html').offset().top
            }, 500);

            return false;
        });

    };


    // Animations

    $scope.contentWayPoint = function () {
        $('.animate-box').waypoint(function (direction) {

            if (direction == 'down' && !$(this.element).hasClass('animated')) {
                $(this.element).addClass('item-animate');
                setTimeout(function () {
                    $('body .animate-box.item-animate').each(function (k) {
                        var el = $(this);
                        setTimeout(function () {
                            el.addClass('fadeInUp animated');
                            el.removeClass('item-animate');
                        }, k * 200, 'easeInOutExpo');
                    });

                }, 100);
            }
        }, {offset: '95%'});
    };


    $(function () {

        if ($.cookie('layoutCookie') != '') {
            $('body').addClass($.cookie('layoutCookie'));
        }

        $('a[data-layout="boxed"]').click(function (event) {
            event.preventDefault();
            $.cookie('layoutCookie', 'boxed', {expires: 7, path: '/'});
            $('body').addClass($.cookie('layoutCookie')); // the value is boxed.
        });

        $('a[data-layout="wide"]').click(function (event) {
            event.preventDefault();
            $('body').removeClass($.cookie('layoutCookie')); // the value is boxed.
            $.removeCookie('layoutCookie', {path: '/'}); // remove the value of our cookie 'layoutCookie'
        });
    });

    // Document on load.
    $(function () {
        gotToNextSection();
        fullHeight();
        mobileMenuOutsideClick();
        offcanvasMenu();
        burgerMenu();
        testimonialFlexslider();
        goToTop();
    });
    $scope.contentWayPoint();
}]);
