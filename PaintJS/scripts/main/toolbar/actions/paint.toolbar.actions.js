(function (paint, $, undefined) {
    paint.toolbar.actions = {};
    var me = paint.toolbar.actions;

    me.eraser = function (eraserWidth) {
        var eraserWidth = eraserWidth || 5;

        //Clean predifined options for the canvas
        paint.canvas.clearPreDefinedOptions();

        paint.canvas.drawing({
            type: 'eraser',
            lineWidth: eraserWidth,
            strokeColor: 'white',
            fillColor: 'white'
        });
    };

    me.startDrawing = function (target) {
        var lineWidth = parseInt($('#line-width').attr('data-line-width'));
        var strokeColor = $('#color-picker-1').val();
        var fillColor = $('#color-picker-2').val();
        
        var brushObject = {
            lineWidth: lineWidth,
            strokeColor: strokeColor,
            fillColor: fillColor
        };

        //Clean predifined options for the canvas
        paint.canvas.clearPreDefinedOptions();

        var brushtype = target.attr('data-brush-type');
        if (brushtype) {
            brushObject.type = brushtype;
            paint.canvas.currentBrush = brushtype;
        }

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