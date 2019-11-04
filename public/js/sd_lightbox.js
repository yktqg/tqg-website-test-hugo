(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'hammerjs'], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'), require('hammerjs'));
    } else {
        factory(jQuery, Hammer);
    };
}(function($, Hammer) {
    function hammerify(el, options) {
        var $el = $(el);
        if (!$el.data("hammer")) {
            $el.data("hammer", new Hammer($el[0], options));
        };
    };

    $.fn.hammer = function(options) {
        return this.each(function() {
            hammerify(this, options);
        });
    };

    Hammer.Manager.prototype.emit = (function(originalEmit) {
        return function(type, data) {
            originalEmit.call(this, type, data);
            $(this.element).trigger({
                type: type,
                gesture: data
            });
        };
    })(Hammer.Manager.prototype.emit);
}));

$(document).ready(function() {
    function _open(rel, index, length) {
        _appendImages(rel);
        _checkPreviousNext(index, length);
        _updateCounter(index, length);
        _updateDownload(rel, index);
        _updateCaption(rel, index);
        $('#sd-lightbox').attr({
            'data-rel': rel,
            'data-index': index,
            'data-length': length
        }).addClass('open');
        setTimeout(function() {
            $('#sd-lightbox-images img[data-index="' + index + '"]').addClass('active');
        }, 400);
        $('body').css('overflow', 'hidden');
    };

    function _previous() {
        var rel = $('#sd-lightbox').attr('data-rel');
        var index = parseFloat($('#sd-lightbox').attr('data-index')) - 1;
        var length = $('#sd-lightbox').attr('data-length');
        if (index >= 1) {
            $('#sd-lightbox').attr('data-index', index);
            _checkPreviousNext(index, length);
            _updateCounter(index, length);
            _updateDownload(rel, index);
            _moveImages(index, "previous");
            setTimeout(function() {
                _updateCaption(rel, index);
            }, 400);
        };
    };

    function _next() {
        var rel = $('#sd-lightbox').attr('data-rel');
        var index = parseFloat($('#sd-lightbox').attr('data-index')) + 1;
        var length = $('#sd-lightbox').attr('data-length');
        if (index <= length) {
            $('#sd-lightbox').attr('data-index', index);
            _checkPreviousNext(index, length);
            _updateCounter(index, length);
            _updateDownload(rel, index);
            _moveImages(index, "next");
            setTimeout(function() {
                _updateCaption(rel, index);
            }, 400);
        };
    };

    function _close() {
        $('#sd-lightbox-images img').removeClass('active');
        _closeFullscreen();
        $('#sd-lightbox').removeClass('open');
        $('#sd-lightbox-top, #sd-lightbox-previous, #sd-lightbox-next, #sd-lightbox-bottom').removeClass('idle');
        setTimeout(function() {
            $('#sd-lightbox-images img').remove();
            $('#sd-lightbox-counter').html('');
            $('#sd-lightbox-download').attr('href', '#');
            $('#sd-lightbox-caption').html('');
        }, 400);
        $('body').attr('style', '');
    };

    function _toggleFullscreen() {
        if ($('#sd-lightbox')[0].requestFullScreen) {
            if (document.fullScreen == false) {
                $('#sd-lightbox')[0].requestFullscreen();
            } else {
                document.exitFullScreen();
            };
        } else if ($('#sd-lightbox')[0].mozRequestFullScreen) {
            if (document.mozFullScreen == false) {
                $('#sd-lightbox')[0].mozRequestFullScreen();
            } else {
                document.mozCancelFullScreen();
            };
        } else if ($('#sd-lightbox')[0].webkitRequestFullScreen) {
            if (document.webkitIsFullScreen == false) {
                $('#sd-lightbox')[0].webkitRequestFullScreen();
            } else {
                document.webkitCancelFullScreen();
            };
        };
    };

    function _closeFullscreen() {
        if ($('#sd-lightbox')[0].requestFullScreen) {
            document.exitFullScreen();
        } else if ($('#sd-lightbox')[0].mozRequestFullScreen) {
            document.mozCancelFullScreen();
        } else if ($('#sd-lightbox')[0].webkitRequestFullScreen) {
            document.webkitCancelFullScreen();
        };
        $('#sd-lightbox-fullscreen').removeClass('fullscreen-open');
    };

    function _appendImages(rel) {
        $('.sd-lightbox[rel="' + rel + '"]').each(function(index) {
            var href = $(this).attr('href');
            var title = $(this).find('img').attr('title');
            if (title != undefined) {
                $('#sd-lightbox-images').append('<img title="' + title + '" data-index="' + parseFloat(index + 1) + '" src="' + href + '" />');
            } else {
                $('#sd-lightbox-images').append('<img data-index="' + parseFloat(index + 1) + '" src="' + href + '" />');
            };
        });
    };

    function _checkPreviousNext(index, length) {
        $('#sd-lightbox-previous, #sd-lightbox-next').removeClass('disabled');
        if (index == 1) {
            $('#sd-lightbox-previous').addClass('disabled');
        };
        if (index == length) {
            $('#sd-lightbox-next').addClass('disabled');
        };
    };

    function _updateCounter(index, length) {
        var counter = index + ' / ' + length
        $('#sd-lightbox-counter').html(counter);
    };

    function _updateDownload(rel, index) {
        var href = $('#sd-lightbox-images img[data-index="' + index + '"]').attr('src');
        $('#sd-lightbox-download').attr('href', href);
    };

    function _updateCaption(rel, index) {
        var caption = $('#sd-lightbox-images img[data-index="' + index + '"]').attr('title');
        if (caption != undefined) {
            $('#sd-lightbox-caption').html(caption);
        };
    };

    function _moveImages(index, direction) {
        if (direction == "previous") {
            $('#sd-lightbox-images img[data-index="' + parseFloat(index + 1) + '"]').addClass('previous');
            $('#sd-lightbox-bottom').addClass('idle');
            setTimeout(function() {
                $('#sd-lightbox-images img[data-index="' + parseFloat(index + 1) + '"]').removeClass('active');
                $('#sd-lightbox-images img[data-index="' + index + '"]').addClass('active');
                $('#sd-lightbox-top, #sd-lightbox-previous, #sd-lightbox-next, #sd-lightbox-bottom').removeClass('idle');
            }, 400);
            setTimeout(function() {
                $('#sd-lightbox-images img[data-index="' + parseFloat(index + 1) + '"]').removeClass('previous');
            }, 800);
        } else if (direction == "next") {
            $('#sd-lightbox-images img[data-index="' + parseFloat(index - 1) + '"]').addClass('next');
            $('#sd-lightbox-bottom').addClass('idle');
            setTimeout(function() {
                $('#sd-lightbox-images img[data-index="' + parseFloat(index - 1) + '"]').removeClass('active');
                $('#sd-lightbox-images img[data-index="' + index + '"]').addClass('active');
                $('#sd-lightbox-top, #sd-lightbox-previous, #sd-lightbox-next, #sd-lightbox-bottom').removeClass('idle');
            }, 400);
            setTimeout(function() {
                $('#sd-lightbox-images img[data-index="' + parseFloat(index - 1) + '"]').removeClass('next');
            }, 800);
        };
    };

    $('.sd-lightbox').on('click', function(event) {
        event.preventDefault();
        var rel = $(this).attr('rel');
        var index = $('.sd-lightbox[rel="' + rel + '"]').index(this) + 1;
        var length = $('.sd-lightbox[rel="' + rel + '"]').length;
        _open(rel, index, length);
    });

    $('#sd-lightbox-previous').on('click', function(event) {
        event.preventDefault();
        _previous();
    });

    $('#sd-lightbox-next').on('click', function(event) {
        event.preventDefault();
        _next();
    });

    $('#sd-lightbox-close, #sd-lightbox-overlay').on('click', function(event) {
        event.preventDefault();
        _close();
    });

    $('#sd-lightbox-fullscreen').on('click', function(event) {
        event.preventDefault();
        $(this).toggleClass('fullscreen-open');
        _toggleFullscreen();
    });

    $('#sd-lightbox-images').on('click', function() {
        $('#sd-lightbox-top, #sd-lightbox-previous, #sd-lightbox-next, #sd-lightbox-bottom').toggleClass('idle');
    });

    $(document).keyup(function(event) {
        if (event.keyCode == 27 || event.keyCode == 38 || event.keyCode == 40) {
            _close();
        } else if (event.keyCode == 37) {
            _previous();
        } else if (event.keyCode == 39) {
            _next();
        };
    });

    $('#sd-lightbox').hammer();
    $('#sd-lightbox').data('hammer').get('pan').set({
        pointers: 1,
        threshold: 0
    });

    var currentTransform;
    var currentTransformX;

    $('#sd-lightbox').on('panstart', function(event) {
        $('#sd-lightbox-images img.active').addClass('no-transition');
        currentTransform = $('#sd-lightbox-images img.active').css('-webkit-transform').split(/[()]/)[1]
        currentTransformX = currentTransform.split(',')[4];
    });

    $('#sd-lightbox').on('panleft panright', function(event) {
        var deltaX = event.gesture.deltaX;
        var newTransformX = parseFloat(currentTransformX) + parseFloat(deltaX);
        var opacity = deltaX / 300;
        if (opacity < 0) {
            opacity = opacity * -1;
        };
        $('#sd-lightbox-images img.active').css({
            '-webkit-transform': 'translate(' + newTransformX + 'px, -50%) scale(1)',
            'transform': 'translate(' + newTransformX + 'px, -50%) scale(1)',
            'opacity': 1 - opacity
        });
    });

    $('#sd-lightbox').on('panend', function(event) {
        var deltaX = event.gesture.deltaX;
        var velocity = event.gesture.velocityX;
        var index = $('#sd-lightbox').attr('data-index');
        var length = $('#sd-lightbox').attr('data-length');
        $('#sd-lightbox-images img.active').removeClass('no-transition');
        if (index == 1) {
            if (deltaX < -100 || velocity < -1) {
                $('#sd-lightbox-images img.active').attr('style', '');
                _next();
            } else {
                $('#sd-lightbox-images img.active').attr('style', '');
            };
        } else if (index == length) {
            if (deltaX > 100 || velocity > 1) {
                $('#sd-lightbox-images img.active').attr('style', '');
                _previous();
            } else {
                $('#sd-lightbox-images img.active').attr('style', '');
            };
        } else {
            if (deltaX > 100 || velocity > 1) {
                $('#sd-lightbox-images img.active').attr('style', '');
                _previous();
            } else if (deltaX < -100 || velocity < -1) {
                $('#sd-lightbox-images img.active').attr('style', '');
                _next();
            } else {
                $('#sd-lightbox-images img.active').attr('style', '');
            };
        };
    });
});
