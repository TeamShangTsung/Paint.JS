(function (paint, $, undefined) {
    paint.canvas = {};
    var me = paint.canvas;

    var canvasElement, ctx;

    $(function () {
        canvasElement = $('canvas')[0];
        ctx = canvasElement.getContext('2d');

        var header = $('header')[0];
        ctx.translate(0, -header.offsetHeight);
    })

    //Todo should be modified to base function
    me.drawing = function () {
        var isDrawing;

        canvasElement.onmousedown = function (e) {
            isDrawing = true;
            ctx.moveTo(e.clientX, e.clientY);
        };
        canvasElement.onmousemove = function (e) {
            if (isDrawing) {
                ctx.lineTo(e.clientX, e.clientY);
                ctx.stroke();
            }
        };
        canvasElement.onmouseup = function () {
            isDrawing = false;
        };
    }

    me.stopDrawing = function () {
        canvasElement.onmousedown = undefined;
        canvasElement.onmousemove = undefined;
        canvasElement.onmouseup = undefined;
    }
})(window.paint = window.paint || {}, jQuery);