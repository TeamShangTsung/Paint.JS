(function ($) {
    window.paint = {};

    $(function () {
        paint.canvasElement = $('#canvas')[0];
        paint.canvasTemp = $('#canvasTemp')[0];

        paint.ctx = paint.canvasElement.getContext('2d');
        paint.ctxTemp = paint.canvasTemp.getContext('2d');

        var header = $('#toolbar-container')[0];
        var mainContainer = $('#canvas')[0];

        paint.ctx.translate(-mainContainer.offsetLeft, -header.offsetHeight-header.offsetTop);
        paint.ctxTemp.translate(-mainContainer.offsetLeft, -header.offsetHeight-header.offsetTop);

        CanvasRenderingContext2D.prototype.canvasPosition = {
            x: 0,
            y: -header.offsetHeight
        };
    })

})(jQuery);