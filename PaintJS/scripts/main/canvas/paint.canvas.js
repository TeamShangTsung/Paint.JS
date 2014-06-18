(function (paint, $, undefined) {
    paint.canvas = {};
    var me = paint.canvas;

    var animationPath = [];

    me.currentBrush = undefined;

    me.drawing = function (arguments) {
        var isDrawing;
        var currentBrush = undefined;

        //default values
        paint.ctx.lineJoin = 'round';
        paint.ctx.lineCap = 'round';

        if (arguments) {
            if (arguments.lineWidth) {
                paint.ctx.lineWidth = arguments.lineWidth;
            }

            if (arguments.strokeColor) {
                paint.ctx.strokeStyle = arguments.strokeColor;
            }

            if (arguments.fillColor) {
                paint.ctx.fillStyle = arguments.fillColor;
            }

            if (arguments.type) {
                currentBrush = brushes[arguments.type];
                currentBrush.init();
            }
        }
        
        $(paint.canvasElement).on("mousedown", function (e) {
            isDrawing = true;
            paint.ctx.moveTo(e.clientX, e.clientY);

            animationPath.push({x: e.clientX, y: e.clientY});

            if (currentBrush && currentBrush.onMouseDownSpecific) {
                currentBrush.onMouseDownSpecific(e);
            }
        });

        $(paint.canvasElement).on("mousemove", function (e) {
            if (isDrawing) {
                animationPath.push({ x: e.clientX, y: e.clientY });

                if (!currentBrush || !currentBrush.action) {
                    paint.ctx.lineTo(e.clientX, e.clientY);
                    paint.ctx.stroke();
                } else {
                    currentBrush.action(e);
                }
            }
        });

        $(paint.canvasElement).on("mouseup", function () {
            isDrawing = false;
            animationPath.push({ x: "skip", y: "skip" });

            if (currentBrush && currentBrush.onMouseUpSpecific) {
                currentBrush.onMouseUpSpecific();
            }
        });
    }

    me.animateDrawing = function(){
        var ctx = paint.ctx,
            index = 0;

        me.clearCanvasTemp();
        me.clearCanvas();
        ctx.beginPath();
        ctx.moveTo(animationPath[0]['x'], animationPath[0]['y']);

        function drawAnimation(){
            if(index === animationPath.length - 1) {
                return;
            }
            index += 1;
            if (animationPath[index]['x'] !== "skip") {
                ctx.lineTo(animationPath[index]['x'], animationPath[index]['y']);
                ctx.stroke();
            } else {
                if (index+1 < animationPath.length) {
                    ctx.moveTo(animationPath[index+1]['x'], animationPath[index+1]['y']);
                }
            }

            window.requestAnimationFrame(drawAnimation);
        }
        drawAnimation();
    };

    me.clearPreDefinedOptions = function () {
        $(paint.canvasElement).off();

        var clearColor = "white";

        paint.ctx.fillStyle = clearColor;
        paint.ctx.strokeStyle = clearColor;
        paint.ctx.shadowColor = clearColor;
        paint.ctx.shadowBlur = 0;

        paint.shape.prototype.cleanEvents();
    }

    me.clearCanvas = function () {
        var canvasElement = paint.canvasElement;
        var ctx = paint.ctx;

        // Store the current transformation matrix
        ctx.save();

        // Use the identity matrix while clearing the canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        // Restore the transform
        ctx.restore();
    }

    me.clearCanvasTemp = function () {
        var canvasElement = paint.canvasTemp;
        var ctx = paint.ctxTemp;

        // Store the current transformation matrix
        ctx.save();

        // Use the identity matrix while clearing the canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        // Restore the transform
        ctx.restore();
    }

    me.changeLineWidth = function (lineWidth) {
        lineWidth = lineWidth || 5;
        paint.ctx.lineWidth = lineWidth;
        paint.ctxTemp.lineWidth = lineWidth;

        if (me.currentBrush) {
            var currentBrush = brushes[me.currentBrush];
            currentBrush.init();
        }
    };

    me.changeStrokeColor = function (color) {
        color = color || "black";
        paint.ctx.strokeStyle = color;
        paint.ctxTemp.strokeStyle = color;

        if (me.currentBrush) {
            var currentBrush = brushes[me.currentBrush];
            currentBrush.init();
        }
    }

    me.changeFillColor = function (color) {
        color = color || "black";
        paint.ctx.fillStyle = color;
        paint.ctxTemp.fillStyle = color;

        if (me.currentBrush) {
            var currentBrush = brushes[me.currentBrush];
            currentBrush.init();
        }
    }

    //Brush types
    var smoothingShadow = {
        init: function () {
            paint.ctx.shadowBlur = 10;
            paint.ctx.strokeStyle = paint.ctx.strokeStyle || 'rgb(0, 0, 0)';
            paint.ctx.shadowColor = paint.ctx.strokeStyle;
        }
    };

    var radialGradient = {
        init: function () {
            return;
        },
        action: function (e) {
            paint.ctx.lineWidth = paint.ctx.lineWidth || 5;
            paint.ctx.strokeStyle = paint.ctx.strokeStyle || '#000';

            var startRadius = paint.ctx.lineWidth;
            var color = paint.ctx.strokeStyle;

            var radialGradient = paint.ctx.createRadialGradient(e.clientX, e.clientY, startRadius,
                e.clientX, e.clientY, startRadius * 2);

            radialGradient.addColorStop(0, color);
            radialGradient.addColorStop(0.5, 'rgba(0,0,0,0.5)');
            radialGradient.addColorStop(1, 'rgba(0,0,0,0)');
            paint.ctx.fillStyle = radialGradient;

            paint.ctx.fillRect(e.clientX - startRadius * 2, e.clientY - startRadius * 2,
                startRadius * 4, startRadius * 4);
        }
    };

    var brushFurPen = {
        init: function () {
            this.img = new Image();
            this.img.src = '../../styles/images/brushPattern.png';
        },
        onMouseDownSpecific: function (e) {
            this.lastPoint = {
                x: e.clientX,
                y: e.clientY
            };
        },
        action: function (e) {
            var currentPoint = {
                x: e.clientX,
                y: e.clientY
            };

            var dist = this.distanceBetween(this.lastPoint, currentPoint);
            var angle = this.angleBetween(this.lastPoint, currentPoint);

            for (var i = 0; i < dist; i++) {
                x = this.lastPoint.x + (Math.sin(angle) * i) - 25;
                y = this.lastPoint.y + (Math.cos(angle) * i) - 25;
                paint.ctx.drawImage(this.img, x, y);
            }

            this.lastPoint = currentPoint;
        },
        distanceBetween: function distanceBetween(point1, point2) {
            return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
        },
        angleBetween: function angleBetween(point1, point2) {
            return Math.atan2(point2.x - point1.x, point2.y - point1.y);
        }
    };

    var rotatingFur = {
        init: function () {
            this.img = new Image();
            this.img.src = '../../styles/images/brushPattern.png';
            this.img.width = 10;
        },
        onMouseDownSpecific: function (e) {
            this.lastPoint = {
                x: e.clientX,
                y: e.clientY
            };
        },
        action: function (e) {
            var currentPoint = {
                x: e.clientX,
                y: e.clientY
            };

            var dist = this.distanceBetween(this.lastPoint, currentPoint);
            var angle = this.angleBetween(this.lastPoint, currentPoint);

            for (var i = 0; i < dist; i++) {
                x = this.lastPoint.x + (Math.sin(angle) * i);
                y = this.lastPoint.y + (Math.cos(angle) * i);
                paint.ctx.save();
                paint.ctx.translate(x, y);
                paint.ctx.scale(0.5, 0.5);
                paint.ctx.rotate(Math.PI * 180 / this.getRandomInt(0, 180));
                paint.ctx.drawImage(this.img, 0, 0);
                paint.ctx.restore();
            }

            this.lastPoint = currentPoint;
        },
        distanceBetween: function distanceBetween(point1, point2) {
            return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
        },
        angleBetween: function angleBetween(point1, point2) {
            return Math.atan2(point2.x - point1.x, point2.y - point1.y);
        },
        getRandomInt: function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    };

    var customPen = {
        init: function () {
            return;
        },
        onMouseDownSpecific: function (e) {
            this.lastPoint = {
                x: e.clientX,
                y: e.clientY
            };
        },
        action: function (e) {
            paint.ctx.lineWidth = paint.ctx.lineWidth || 1;
            var endRange = paint.ctx.lineWidth * 2;

            paint.ctx.beginPath();

            paint.ctx.moveTo(this.lastPoint.x - this.getRandomInt(0, endRange), this.lastPoint.y - this.getRandomInt(0, endRange));
            paint.ctx.lineTo(e.clientX - this.getRandomInt(0, endRange), e.clientY - this.getRandomInt(0, endRange));
            paint.ctx.stroke();

            paint.ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
            paint.ctx.lineTo(e.clientX, e.clientY);
            paint.ctx.stroke();

            paint.ctx.moveTo(this.lastPoint.x + this.getRandomInt(0, endRange), this.lastPoint.y + this.getRandomInt(0, endRange));
            paint.ctx.lineTo(e.clientX + this.getRandomInt(0, endRange), e.clientY + this.getRandomInt(0, endRange));
            paint.ctx.stroke();

            this.lastPoint = {
                x: e.clientX,
                y: e.clientY
            };
        },
        getRandomInt: function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    };

    var slicedPen = {
        init: function () {
            return;
        },
        onMouseDownSpecific: function (e) {
            this.lastPoint = {
                x: e.clientX,
                y: e.clientY
            };
        },
        action: function (e) {
            paint.ctx.lineWidth = 3;

            paint.ctx.beginPath();

            paint.ctx.globalAlpha = 1;
            paint.ctx.moveTo(this.lastPoint.x - 4, this.lastPoint.y - 4);
            paint.ctx.lineTo(e.clientX - 4, e.clientY - 4);
            paint.ctx.stroke();

            paint.ctx.globalAlpha = 0.6;
            paint.ctx.moveTo(this.lastPoint.x - 2, this.lastPoint.y - 2);
            paint.ctx.lineTo(e.clientX - 2, e.clientY - 2);
            paint.ctx.stroke();

            paint.ctx.globalAlpha = 0.4;
            paint.ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
            paint.ctx.lineTo(e.clientX, e.clientY);
            paint.ctx.stroke();

            paint.ctx.globalAlpha = 0.3;
            paint.ctx.moveTo(this.lastPoint.x + 2, this.lastPoint.y + 2);
            paint.ctx.lineTo(e.clientX + 2, e.clientY + 2);
            paint.ctx.stroke();

            paint.ctx.globalAlpha = 0.2;
            paint.ctx.moveTo(this.lastPoint.x + 4, this.lastPoint.y + 4);
            paint.ctx.lineTo(e.clientX + 4, e.clientY + 4);
            paint.ctx.stroke();

            this.lastPoint = {
                x: e.clientX,
                y: e.clientY
            };
        }
    };

    var trailPen = {
        init: function () {
            paint.ctx.fillStyle = paint.ctx.fillStyle || "#000";
            paint.ctx.strokeStyle = paint.ctx.strokeStyle || "#000";
        },
        onMouseDownSpecific: function (e) {
            this.lastPoint = {
                x: e.clientX,
                y: e.clientY
            };
        },
        action: function (e) {
            paint.ctx.lineWidth = 1;

            var currentPoint = {
                x: e.clientX,
                y: e.clientY
            };
            var dist = this.distanceBetween(this.lastPoint, currentPoint);
            var angle = this.angleBetween(this.lastPoint, currentPoint);

            for (var i = 0; i < dist; i += 5) {
                x = this.lastPoint.x + (Math.sin(angle) * i) - 25;
                y = this.lastPoint.y + (Math.cos(angle) * i) - 25;
                paint.ctx.beginPath();
                paint.ctx.arc(x + 10, y + 10, 20, false, Math.PI * 2, false);
                paint.ctx.closePath();
                paint.ctx.fill();
                paint.ctx.stroke();
            }

            this.lastPoint = currentPoint;
        },
        distanceBetween: function distanceBetween(point1, point2) {
            return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
        },
        angleBetween: function angleBetween(point1, point2) {
            return Math.atan2(point2.x - point1.x, point2.y - point1.y);
        }
    };

    var randomRadius = {
        init: function () {
            paint.ctx.strokeStyle = "white";
            this.points = [];
            this.radius = paint.ctx.lineWidth;
        },
        onMouseDownSpecific: function (e) {
            this.points.push({
                x: e.clientX,
                y: e.clientY,
                radius: this.getRandomInt(this.radius * 0.66, this.radius * 2),
                opacity: Math.random()
            });
        },
        onMouseUpSpecific: function (e) {
            this.points.length = 0;
        },
        action: function (e) {
            this.points.push({
                x: e.clientX,
                y: e.clientY,
                radius: this.getRandomInt(this.radius * 0.33, this.radius + (this.radius * 0.33)),
                opacity: Math.random()
            });

            paint.ctx.clearRect(0, 0, paint.ctx.canvas.width, paint.ctx.canvas.height);
            for (var i = 0; i < this.points.length; i++) {
                paint.ctx.beginPath();
                paint.ctx.globalAlpha = this.points[i].opacity;
                paint.ctx.arc(
                  this.points[i].x, this.points[i].y, this.points[i].radius,
                  false, Math.PI * 2, false);
                paint.ctx.fill();
            }
        },
        getRandomInt: function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    };

    var spray = {
        init: function () {
            paint.ctx.lineWidth = paint.ctx.lineWidth || 10;
            this.density = paint.ctx.lineWidth * 5;
        },
        action: function (e) {
            var radius = this.density * 0.4;
            for (var i = this.density; i--;) {
                var offsetX = this.getRandomInt(-radius, radius);
                var offsetY = this.getRandomInt(-radius, radius);
                paint.ctx.fillRect(e.clientX + offsetX, e.clientY + offsetY, 1, 1);
            }
        },
        getRandomInt: function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    };

    var neighbourPoints = {
        init: function () {
            paint.ctx.lineWidth = 1;
            this.points = [];
        },
        onMouseDownSpecific: function (e) {
            this.points = [];
            this.points.push({
                x: e.clientX,
                y: e.clientY
            });
        },
        onMouseUpSpecific: function (e) {
            this.points.length = 0;
        },
        action: function (e) {
            this.points.push({
                x: e.clientX,
                y: e.clientY
            });

            paint.ctx.beginPath();
            paint.ctx.moveTo(this.points[this.points.length - 2].x, this.points[this.points.length - 2].y);
            paint.ctx.lineTo(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y);
            paint.ctx.stroke();

            for (var i = 0, len = this.points.length; i < len; i++) {
                dx = this.points[i].x - this.points[this.points.length - 1].x;
                dy = this.points[i].y - this.points[this.points.length - 1].y;
                d = dx * dx + dy * dy;

                if (d < 1000) {
                    paint.ctx.beginPath();
                    paint.ctx.strokeStyle = 'rgba(0,0,0,0.3)';
                    paint.ctx.moveTo(this.points[this.points.length - 1].x + (dx * 0.2), this.points[this.points.length - 1].y + (dy * 0.2));
                    paint.ctx.lineTo(this.points[i].x - (dx * 0.2), this.points[i].y - (dy * 0.2));
                    paint.ctx.stroke();
                }
            }
        }
    };

    var eraserPen = {
        init: function () {
            paint.ctx.lineCap = 'square';
        }
    };

    var brushes = {
        eraser: eraserPen,
        smoothingShadow: smoothingShadow,
        radialGradient: radialGradient,
        brushFurPen: brushFurPen,
        rotatingFur: rotatingFur,
        customPen: customPen,
        slicedPen: slicedPen,
        trailPen: trailPen,
        randomRadius: randomRadius,
        spray: spray,
        neighbourPoints: neighbourPoints
    };

})(window.paint = window.paint || {}, jQuery);