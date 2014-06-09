(function (paint, $, undefined) {
    var canvasElement, ctx;

    $(function () {
        canvasElement = $('canvas')[0];
        ctx = canvasElement.getContext('2d');

        var header = $('header')[0];
        ctx.translate(0, -header.offsetHeight);
    })

    paint.canvas = {};
    var me = paint.canvas;

    me.drawing = function (arguments) {
        var isDrawing;

        if (arguments.lineWidth) {
            ctx.lineWidth = arguments.lineWidth;
        }

        if (arguments.color) {
            ctx.strokeStyle = arguments.color;
        }

        if (arguments.type) {
            var currentBrush = brushes[arguments.type];
            currentBrush.init();
        }

        canvasElement.onmousedown = function (e) {
            isDrawing = true;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
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

    //Brush types
    var smoothingShadow = {
        init: function () {
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgb(0, 0, 0)';
        },
        action: function () {
        }
    }

    var brushes = {
        smoothingShadow: smoothingShadow
    };

})(window.paint = window.paint || {}, jQuery);