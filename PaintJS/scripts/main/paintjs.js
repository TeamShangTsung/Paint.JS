(function ($) {
    window.paint = {};

    $(function () {
        paint.canvasElement = $('#canvas')[0];
        paint.canvasTemp = $('#canvasTemp')[0];

        paint.ctx = paint.canvasElement.getContext('2d');
        paint.ctxTemp = paint.canvasTemp.getContext('2d');

        var header = $('header')[0];
        paint.ctx.translate(0, -header.offsetHeight);
        paint.ctxTemp.translate(0, -header.offsetHeight);

        CanvasRenderingContext2D.prototype.canvasPosition = {
            x: 0,
            y: -header.offsetHeight
        };
    })

})(jQuery);