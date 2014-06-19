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
            var fillColor = $('#color-picker-2').val()

            floodFill(e.clientX - 183, e.clientY - 111, paint.ctx, fillColor, 10);

            function floodFill(x,y,context,color,tolerance){
                pixelStack = [[x,y]];
                width = context.canvas.width;
                height = context.canvas.height;
                pixelPos = (y*width + x) * 4;
                imageData =  context.getImageData(0, 0, width, height);
                startR = imageData.data[pixelPos];
                startG = imageData.data[pixelPos+1];
                startB = imageData.data[pixelPos+2];
                while(pixelStack.length){
                    newPos = pixelStack.pop();
                    x = newPos[0];
                    y = newPos[1];
                    pixelPos = (y*width + x) * 4;
                    while(y-- >= 0 && floodfill_matchTolerance(pixelPos,color,tolerance)){
                        pixelPos -= width * 4;
                    }
                    pixelPos += width * 4;
                    ++y;
                    reachLeft = false;
                    reachRight = false;
                    while(y++ < height-1 && floodfill_matchTolerance(pixelPos,color,tolerance)){
                        floodfill_colorPixel(pixelPos,color);
                        if(x > 0){
                            if(floodfill_matchTolerance(pixelPos - 4,color,tolerance)) {
                                if(!reachLeft){
                                    pixelStack.push([x - 1, y]);
                                    reachLeft = true;
                                }
                            }
                            else if(reachLeft){
                                reachLeft = false;
                            }
                        }
                        if(x < width-1){
                            if(floodfill_matchTolerance(pixelPos + 4,color,tolerance)){
                                if(!reachRight){
                                    pixelStack.push([x + 1, y]);
                                    reachRight = true;
                                }
                            }
                            else if(floodfill_matchTolerance(pixelPos + 4 -(width *4),color,tolerance)) {
                                if(!reachLeft){
                                    pixelStack.push([x + 1, y - 1]);
                                    reachLeft = true;
                                }
                            }
                            else if(reachRight){
                                reachRight = false;
                            }
                        }
                        pixelPos += width * 4;
                    }
                }
                context.putImageData(imageData, 0, 0);
            }

            function floodfill_hexToR(h) {
                return parseInt((floodfill_cutHex(h)).substring(0,2),16)
            }
            function floodfill_hexToG(h) {
                return parseInt((floodfill_cutHex(h)).substring(2,4),16)
            }
            function floodfill_hexToB(h) {
                return parseInt((floodfill_cutHex(h)).substring(4,6),16)
            }
            function floodfill_cutHex(h) {
                return (h.charAt(0)=="#") ? h.substring(1,7):h
            }

            function floodfill_matchTolerance(pixelPos,color,tolerance){
                var rMax = startR + (startR * (tolerance / 100));
                var gMax = startG + (startG * (tolerance / 100));
                var bMax = startB + (startB * (tolerance / 100));

                var rMin = startR - (startR * (tolerance / 100));
                var gMin = startG - (startG * (tolerance / 100));
                var bMin = startB - (startB * (tolerance / 100));

                var r = imageData.data[pixelPos];
                var g = imageData.data[pixelPos+1];
                var b = imageData.data[pixelPos+2];

                return ((
                    (r >= rMin && r <= rMax)
                    && (g >= gMin && g <= gMax)
                    && (b >= bMin && b <= bMax)
                    )
                    && !(r == floodfill_hexToR(color)
                        && g == floodfill_hexToG(color)
                        && b == floodfill_hexToB(color))
                    );
            }

            function floodfill_colorPixel(pixelPos,color){
                imageData.data[pixelPos] = floodfill_hexToR(color);
                imageData.data[pixelPos+1] = floodfill_hexToG(color);
                imageData.data[pixelPos+2] = floodfill_hexToB(color);
                imageData.data[pixelPos+3] = 255;
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
        //Clean predifined options for the canvas
        paint.canvas.clearPreDefinedOptions();

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
        paint.canvas.clearCanvas("temp");
        paint.canvas.clearCanvas();
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