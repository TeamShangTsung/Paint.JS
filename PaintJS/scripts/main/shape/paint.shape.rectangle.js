﻿(function (paint, $, undefined) {
    //Constructor
    paint.shape.rectangle = function () {
        // Call the parent constructor
        paint.shape.call(this)
        paint.canvasElement.addEventListener("mousedown", this.onMouseDown);

        var self = this;
        var ctx = paint.ctx;
        var canvas = paint.canvasElement;

        function drawRectangle(target) {
            target.beginPath();
            target.moveTo(self.startPosition.x, self.startPosition.y);
            target.lineTo(self.finalPosition.x, self.startPosition.y);
            target.lineTo(self.finalPosition.x, self.finalPosition.y);
            target.lineTo(self.startPosition.x, self.finalPosition.y);
            target.closePath();
            target.stroke();
        }

        //override base methods
        paint.shape.rectangle.prototype.onMouseMove = function (ev) {
            //call base method
            paint.shape.prototype.onMouseMove(ev);

            paint.canvas.clearCanvas();
            //ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
            drawRectangle(ctx);

            canvas.addEventListener("mouseup", self.onMouseUp);
        }

        paint.shape.rectangle.prototype.onMouseUp = function (ev) {
            //call base method
            paint.shape.prototype.onMouseUp(ev);
            drawRectangle(paint.ctxTemp);
        }
    }

    $(function () {
        // inherit paint.shape
        paint.shape.rectangle.prototype = new paint.shape();

        // correct the constructor pointer because it points to paint.shape
        paint.shape.rectangle.prototype.constructor = paint.shape.rectangle;
    });
})(window.paint = window.paint || {}, jQuery);