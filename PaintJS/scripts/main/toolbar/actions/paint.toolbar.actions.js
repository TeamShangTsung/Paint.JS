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
        paint.canvas.currentBrush = brushtype;
        paint.canvas.drawing(brushObject);
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