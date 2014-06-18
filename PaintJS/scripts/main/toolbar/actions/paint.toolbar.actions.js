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

    me.fill = function(){
        paint.canvas.clearPreDefinedOptions();
        paint.canvasElement.onclick = function(e) {

            console.log(paint.ctxTemp.getImageData(e.clientX, e.clientY, 1, 1));

            var colorLayer = paint.ctxTemp.getImageData(0,0,paint.canvasTemp.offsetWidth,paint.canvasTemp.offsetHeight),
            pixelStack = [[e.clientX, e.clientY]];

            var fillColorR = 255,
            fillColorG = 0,
            fillColorB = 0;

            while(pixelStack.length)
            {
                var newPos, x, y, pixelPos, reachLeft, reachRight;
                newPos = pixelStack.pop();
                x = newPos[0];
                y = newPos[1];

                pixelPos = (y*paint.canvasTemp.offsetWidth + x) * 4;
                while(y-- >= 0 && matchStartColor(pixelPos))
                {
                    pixelPos -= paint.canvasTemp.offsetWidth * 4;
                }
                pixelPos += paint.canvasTemp.offsetWidth * 4;
                ++y;
                reachLeft = false;
                reachRight = false;
                while(y++ < paint.canvasTemp.offsetHeight-1 && matchStartColor(pixelPos))
                {
                    colorPixel(pixelPos);

                    if(x > 0)
                    {
                        if(matchStartColor(pixelPos - 4))
                        {
                            if(!reachLeft){
                                pixelStack.push([x - 1, y]);
                                reachLeft = true;
                            }
                        }
                        else if(reachLeft)
                        {
                            reachLeft = false;
                        }
                    }

                    if(x < paint.canvasTemp.offsetWidth-1)
                    {
                        if(matchStartColor(pixelPos + 4))
                        {
                            if(!reachRight)
                            {
                                pixelStack.push([x + 1, y]);
                                reachRight = true;
                            }
                        }
                        else if(reachRight)
                        {
                            reachRight = false;
                        }
                    }

                    pixelPos += paint.canvasTemp.offsetWidth * 4;
                }
            }
            paint.ctxTemp.putImageData(colorLayer, 0, 0);

            function matchStartColor(pixelPos)
            {
                var r = colorLayer.data[pixelPos];
                var g = colorLayer.data[pixelPos+1];
                var b = colorLayer.data[pixelPos+2];

                return (r == 0 && g == 0 && b == 0);
                //return (r == startR && g == startG && b == startB);
            }

            function colorPixel(pixelPos)
            {
                colorLayer.data[pixelPos] = fillColorR;
                colorLayer.data[pixelPos+1] = fillColorG;
                colorLayer.data[pixelPos+2] = fillColorB;
                colorLayer.data[pixelPos+3] = 255;
            }
        }
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

    me.eraseCanvasContent = function () {
        paint.canvas.clearCanvas();

        var canvasElement = paint.canvasTemp;
        var ctx = paint.ctxTemp;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        ctx.restore();
    }

    me.getPixelColor = function () {
        $(paint.canvasElement).on("click", function (e) {
            function componentToHex(c) {
                var hex = c.toString(16);
                return hex.length === 1 ? "0" + hex : hex;
            }

            function rgbToHex(r, g, b) {
                return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
            }

            var pixelCount = 1;
            var imageData = paint.ctx.getImageData(e.offsetX, e.offsetY, pixelCount, pixelCount).data;
            var red = imageData[0];
            var green = imageData[1];
            var blue = imageData[2];
            var color = rgbToHex(red, green, blue);

            $('#color-picker-1').remove();
            $('<input id="color-picker-1" class="color-picker" type="color" value="' + color + '">').prependTo($('#color-1-container'));
        });
    }

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