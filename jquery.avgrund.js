/**
 *  jQuery Avgrund Popin Plugin
 *  http://github.com/voronianski/jquery.avgrund.js/
 *
 *  (c) 2012-2013 http://pixelhunter.me/
 *  MIT licensed
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    $.fn.avgrund = function (options) {
        var defaults = {
            width                   :   380, // max = 640
            height                  :   280, // max = 350
            showClose               :   false,
            showCloseText           :   '',
            closeByEscape           :   true,
            closeByDocument         :   true,
            holderClass             :   '',
            overlayClass            :   '',
            enableStackAnimation    :   false,
            onBlurContainer         :   '',
            openOnEvent             :   true,
            setEvent                :   'click',
            onLoad                  :   false,
            onUnload                :   false,
            template                :   '<p>This is test popin content!</p>',
            title                   :   false,
            afterComplete           :   false
        };

        options = $.extend(defaults, options);

        return this.each(function() {
            var self = $(this),
                body = $('body'),
                maxWidth = options.width > 640 ? 640 : options.width,
                maxHeight = options.height > 350 ? 350 : options.height,
                template = typeof options.template === 'function' ? options.template(self) : options.template;
                template = '<div class="avgrund-content">' + template + '</div>';

            body.addClass('avgrund-ready');

            if ($('.avgrund-overlay').length === 0) {
                body.append('<div class="avgrund-overlay ' + options.overlayClass + '"></div>');
            }

            if (options.onBlurContainer !== '') {
                $(options.onBlurContainer).addClass('avgrund-blur');
            }

            function onDocumentKeyup (e) {
                if (options.closeByEscape) {
                    if (e.keyCode === 27) {
                        deactivate();
                    }
                }
            }

            function onDocumentClick (e) {
                if (options.closeByDocument) {
                    if ($(e.target).is('.avgrund-overlay, .avgrund-close')) {
                        e.preventDefault();
                        deactivate();
                    }
                } else if ($(e.target).is('.avgrund-close')) {
                        e.preventDefault();
                        deactivate();
                }
            }

            function onResize(e) {
                var h = $(window).height();
                body.height(h);
                $(".avgrund-overlay").height(h);
            }

            function activate () {
                if (typeof options.onLoad === 'function') {
                    options.onLoad(self);
                }

                onResize();

                setTimeout(function() {
                    body.addClass('avgrund-active');
                }, 100);

                var $popin = $('<div class="avgrund-popin ' + options.holderClass + '"></div>');
                $popin.append(template);
                body.append($popin);

                $('.avgrund-popin').css({
                    'width': maxWidth + 'px',
                    'height': maxHeight + 'px'
                });

                if (options.showClose) {
                    $('.avgrund-popin').append('<a href="#" class="avgrund-close">' + options.showCloseText + '</a>');
                }

                if (options.title) {
                    $('.avgrund-popin').append('<div class="avgrund-title">' + options.title + '</div>');
                }

                if (options.enableStackAnimation) {
                    $('.avgrund-popin').addClass('stack');
                }

                positionPopin();

                body.bind('keyup', onDocumentKeyup)
                    .bind('click', onDocumentClick);
                $(window).resize(function() { onResize(); positionPopin(); });

                if (typeof options.afterComplete === 'function') {
                    options.afterComplete(self);
                }
            }

            function positionPopin() {
                var popin =  $(".avgrund-popin"),
                    h = popin.height(),
                    w = popin.width();

                console.log(h, w);

                popin.css("position", "absolute")
                    .css("top", $(window).height() / 2 - h / 2)
                    .css("left", $(window).width() / 2 - w / 2);
            }

            function deactivate () {
                body.unbind('keyup', onDocumentKeyup)
                    .unbind('click', onDocumentClick)
                    .height("auto")
                    .removeClass('avgrund-active');

                $(window).off("resize");

                setTimeout(function() {
                    $('.avgrund-popin').remove();
                }, 500);

                if (typeof options.onUnload === 'function') {
                    options.onUnload(self);
                }
            }

            if (options.openOnEvent) {
                self.bind(options.setEvent, function (e) {
                    e.stopPropagation();

                    if ($(e.target).is('a')) {
                        e.preventDefault();
                    }

                    activate();
                });
            } else {
                activate();
            }
        });
    };
}));
