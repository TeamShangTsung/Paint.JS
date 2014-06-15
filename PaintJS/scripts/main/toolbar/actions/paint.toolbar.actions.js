(function (paint, $, undefined) {
    paint.toolbar.actions = {};
    var me = paint.toolbar.actions;

    me.eraser = function (eraserWidth) {
        var eraserWidth = eraserWidth || 5;

        paint.canvas.drawing({
            type: 'eraser',
            lineWidth: eraserWidth,
            color: 'white'
        });
    };

    me.startDrawing = function (target) {
        var brushtype = target.attr('data-brush-type');
        var lineWidth = parseInt($('#line-width').attr('data-line-width'));
        var brushObject = {
            type: brushtype,
            lineWidth: lineWidth
        };
        paint.canvas.drawing(brushObject);
    };

    me.spray = function (sprayWidth) {
        var sprayWidth = sprayWidth || 5;

        paint.canvas.drawing({
            type: 'spray',
            lineWidth: sprayWidth
        });
    };

    me.smoothingShadow = function (brushWidth, color) {
        var brushWidth = brushWidth || 1,
            color = color || 'black';

        paint.canvas.drawing({
            type: 'smoothingShadow',
            lineWidth: brushWidth,
            color: color
        });
    };

    me.radialGradient = function (brushWidth, color) {
        var brushWidth = brushWidth || 5,
            color = color || 'black';

        paint.canvas.drawing({
            type: 'radialGradient',
            lineWidth: brushWidth,
            color: color
        });
    };

    me.customPen = function (brushWidth, color) {
        var brushWidth = brushWidth || 5,
            color = color || 'black';

        paint.canvas.drawing({
            type: 'customPen',
            lineWidth: brushWidth,
            color: color
        });
    };

    me.slicedPen = function (brushWidth, color) {
        var brushWidth = brushWidth || 5,
            color = color || 'black';

        paint.canvas.drawing({
            type: 'slicedPen',
            lineWidth: brushWidth,
            color: color
        });
    };

    me.trailPen = function (brushWidth, color) {
        var brushWidth = brushWidth || 5,
            color = color || 'black';

        paint.canvas.drawing({
            type: 'trailPen',
            lineWidth: brushWidth,
            color: color
        });
    };

    me.randomRadius = function (brushRadius, color) {
        var brushRadius = brushRadius || 5,
            color = color || 'black';

        paint.canvas.drawing({
            type: 'randomRadius',
            lineWidth: brushRadius,
            color: color
        });
    };

    me.neighbourPoints = function (brushWidth, color) {
        var brushWidth = brushWidth || 5,
            color = color || 'black';

        paint.canvas.drawing({
            type: 'neighbourPoints',
            lineWidth: brushWidth,
            color: color
        });
    };

    me.downloadDrawing = function (name) {
        var url = paint.canvasElement.toDataURL();
        name = name || "paintJS";

        var link = document.createElement("a");
        link.download = name;
        link.href = url;
        link.click();
    };

})(window.paint = window.paint || {}, jQuery);