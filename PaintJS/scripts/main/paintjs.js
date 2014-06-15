(function ($) {
    window.paint = {};

    $(function () {
        paint.canvasElement = $('canvas')[0];
        paint.ctx = paint.canvasElement.getContext('2d');

        var header = $('header')[0];
        paint.ctx.translate(0, -header.offsetHeight);
    })

})(jQuery);