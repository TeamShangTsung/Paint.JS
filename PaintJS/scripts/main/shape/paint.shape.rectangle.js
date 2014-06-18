(function (paint, $, undefined) {
    //Constructor
    paint.shape.rectangle = function () {
        // Call the parent constructor
        paint.shape.call(this)
        $(paint.canvasElement).on("mousedown", this.onMouseDown);

        var self = this;
        var ctx = paint.ctx;

        function drawRectangle(target) {
            target.beginPath();
            target.moveTo(self.startPosition.x, self.startPosition.y);
            target.lineTo(self.finalPosition.x, self.startPosition.y);
            target.lineTo(self.finalPosition.x, self.finalPosition.y);
            target.lineTo(self.startPosition.x, self.finalPosition.y);
            target.closePath();
            target.stroke();
        }

        paint.shape.prototype.cleanEvents();
        paint.shape.prototype.attachMouseDown();

        //override base methods
        paint.shape.rectangle.prototype.onMouseMove = function (ev) {
            //call base method
            paint.shape.prototype.onMouseMove(ev);

            paint.canvas.clearCanvas();
            drawRectangle(ctx);

            $(paint.canvasElement).on("mouseup", self.onMouseUp);
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