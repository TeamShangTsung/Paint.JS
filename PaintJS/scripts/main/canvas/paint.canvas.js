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
        var currentBrush = undefined;

        if (arguments.lineWidth) {
            ctx.lineWidth = arguments.lineWidth;
        }

        if (arguments.color) {
            ctx.strokeStyle = arguments.color;
        }

        if (arguments.type) {
            currentBrush = brushes[arguments.type];
            currentBrush.init();
        }

        canvasElement.onmousedown = function (e) {
            isDrawing = true;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.moveTo(e.clientX, e.clientY);

            if (currentBrush.onMouseDownSpecific) {
                currentBrush.onMouseDownSpecific(e);
            }
        };

        canvasElement.onmousemove = function (e) {
            if (isDrawing) {
                if (!currentBrush.action) {
                    ctx.lineTo(e.clientX, e.clientY);
                    ctx.stroke();
                } else {
                    currentBrush.action(e);
                }
            }
        };

        canvasElement.onmouseup = function () {
            isDrawing = false;
            if (currentBrush.onMouseUpSpecific) {
                currentBrush.onMouseUpSpecific();
            }
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
        }
    };

    var radialGradient = {
        init: function () {
            return;
        },
        action: function (e) {
            ctx.lineWidth = ctx.lineWidth || 5;
            ctx.strokeStyle = ctx.strokeStyle || '#000';

            var startRadius = ctx.lineWidth;
            var color = ctx.strokeStyle;

            var radialGradient = ctx.createRadialGradient(e.clientX, e.clientY, startRadius,
                e.clientX, e.clientY, startRadius * 2);

            radialGradient.addColorStop(0, color);
            radialGradient.addColorStop(0.5, 'rgba(0,0,0,0.5)');
            radialGradient.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = radialGradient;

            ctx.fillRect(e.clientX - startRadius * 2, e.clientY - startRadius * 2,
                startRadius * 4, startRadius * 4);
        }
    };

    var brushFurPen = {
        init: function () {
            this.img = new Image();
            this.img.src = '../../styles/images/brush2.png';
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
                ctx.drawImage(this.img, x, y);
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
            this.img.src = '../../styles/images/brush2.png';
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
                ctx.save();
                ctx.translate(x, y);
                ctx.scale(0.5, 0.5);
                ctx.rotate(Math.PI * 180 / this.getRandomInt(0, 180));
                ctx.drawImage(this.img, 0, 0);
                ctx.restore();
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
            ctx.lineWidth = ctx.lineWidth || 1;
            var endRange = ctx.lineWidth * 2;

            ctx.beginPath();

            ctx.moveTo(this.lastPoint.x - this.getRandomInt(0, endRange), this.lastPoint.y - this.getRandomInt(0, endRange));
            ctx.lineTo(e.clientX - this.getRandomInt(0, endRange), e.clientY - this.getRandomInt(0, endRange));
            ctx.stroke();

            ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
            ctx.lineTo(e.clientX, e.clientY);
            ctx.stroke();

            ctx.moveTo(this.lastPoint.x + this.getRandomInt(0, endRange), this.lastPoint.y + this.getRandomInt(0, endRange));
            ctx.lineTo(e.clientX + this.getRandomInt(0, endRange), e.clientY + this.getRandomInt(0, endRange));
            ctx.stroke();

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
            ctx.lineWidth = 3;

            ctx.beginPath();

            ctx.globalAlpha = 1;
            ctx.moveTo(this.lastPoint.x - 4, this.lastPoint.y - 4);
            ctx.lineTo(e.clientX - 4, e.clientY - 4);
            ctx.stroke();

            ctx.globalAlpha = 0.6;
            ctx.moveTo(this.lastPoint.x - 2, this.lastPoint.y - 2);
            ctx.lineTo(e.clientX - 2, e.clientY - 2);
            ctx.stroke();

            ctx.globalAlpha = 0.4;
            ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
            ctx.lineTo(e.clientX, e.clientY);
            ctx.stroke();

            ctx.globalAlpha = 0.3;
            ctx.moveTo(this.lastPoint.x + 2, this.lastPoint.y + 2);
            ctx.lineTo(e.clientX + 2, e.clientY + 2);
            ctx.stroke();

            ctx.globalAlpha = 0.2;
            ctx.moveTo(this.lastPoint.x + 4, this.lastPoint.y + 4);
            ctx.lineTo(e.clientX + 4, e.clientY + 4);
            ctx.stroke();

            this.lastPoint = {
                x: e.clientX,
                y: e.clientY
            };
        }
    };

    var trailPen = {
        init: function () {
            ctx.fillStyle = ctx.strokeStyle;
            ctx.strokeStyle = "black";
        },
        onMouseDownSpecific: function (e) {
            this.lastPoint = {
                x: e.clientX,
                y: e.clientY
            };
        },
        action: function (e) {
            ctx.lineWidth = 1;

            var currentPoint = {
                x: e.clientX,
                y: e.clientY
            };
            var dist = this.distanceBetween(this.lastPoint, currentPoint);
            var angle = this.angleBetween(this.lastPoint, currentPoint);

            for (var i = 0; i < dist; i += 5) {
                x = this.lastPoint.x + (Math.sin(angle) * i) - 25;
                y = this.lastPoint.y + (Math.cos(angle) * i) - 25;
                ctx.beginPath();
                ctx.arc(x + 10, y + 10, 20, false, Math.PI * 2, false);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
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
            ctx.fillStyle = ctx.strokeStyle;
            ctx.strokeStyle = "white";
            this.points = [];
            this.radius = ctx.lineWidth;
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

            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            for (var i = 0; i < this.points.length; i++) {
                ctx.beginPath();
                ctx.globalAlpha = this.points[i].opacity;
                ctx.arc(
                  this.points[i].x, this.points[i].y, this.points[i].radius,
                  false, Math.PI * 2, false);
                ctx.fill();
            }
        },
        getRandomInt: function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    };

    var spray = {
        init: function () {
            ctx.lineWidth = ctx.lineWidth || 10;
            this.density = ctx.lineWidth * 5;
        },
        action: function (e) {
            var radius = this.density * 0.4;
            for (var i = this.density; i--;) {
                var offsetX = this.getRandomInt(-radius, radius);
                var offsetY = this.getRandomInt(-radius, radius);
                ctx.fillRect(e.clientX + offsetX, e.clientY + offsetY, 1, 1);
            }
        },
        getRandomInt: function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    };

    var neighbourPoints = {
        init: function () {
            ctx.lineWidth = 1;
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

            ctx.beginPath();
            ctx.moveTo(this.points[this.points.length - 2].x, this.points[this.points.length - 2].y);
            ctx.lineTo(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y);
            ctx.stroke();

            for (var i = 0, len = this.points.length; i < len; i++) {
                dx = this.points[i].x - this.points[this.points.length - 1].x;
                dy = this.points[i].y - this.points[this.points.length - 1].y;
                d = dx * dx + dy * dy;

                if (d < 1000) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
                    ctx.moveTo(this.points[this.points.length - 1].x + (dx * 0.2), this.points[this.points.length - 1].y + (dy * 0.2));
                    ctx.lineTo(this.points[i].x - (dx * 0.2), this.points[i].y - (dy * 0.2));
                    ctx.stroke();
                }
            }
        }
    };

    var brushes = {
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