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
        var options = getOptions();

        var brushObject = {
            lineWidth: options.lineWidth,
            strokeColor: options.strokeColor,
            fillColor: options.fillColor
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

    me.selectedShape = undefined;

    me.drawShapes = function (target) {
        var options = getOptions();
        var shapeType = target.attr('id');
        if (me.selectedShape) {
            me.selectedShape = undefined;
        }

        switch (shapeType) {
            case 'line':
                me.selectedShape = new paint.shape.line(options);
                break;
            case 'rectangle':
                me.selectedShape = new paint.shape.rectangle(options);
                break;
            case 'circle':
                me.selectedShape = new paint.shape.circle(options);
                break;
            case 'chat':
                me.selectedShape = new paint.shape.chat(options);
                break;
            default:
                return;
        }
    };

    me.downloadDrawing = function (name) {
        var url = paint.canvasElement.toDataURL();
        name = name || "paintJS";

        var link = document.createElement("a");
        link.download = name;
        link.href = url;
        link.click();
    };

    function getOptions() {
        var lineWidth = parseInt($('#line-width').attr('data-line-width'));
        var strokeColor = $('#color-picker-1').val();
        var fillColor = $('#color-picker-2').val();

        return {
            lineWidth: lineWidth,
            strokeColor: strokeColor,
            fillColor: fillColor
        };
    }

})(window.paint = window.paint || {}, jQuery);