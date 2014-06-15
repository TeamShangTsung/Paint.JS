(function (paint, $, undefined) {
    // Constructor
    paint.shape.circle = function () {
        // Call the parent constructor
        paint.shape.call(this)
        paint.canvasElement.addEventListener("mousedown", this.onMouseDown);

        var self = this;
        var ctx = paint.ctx;
        var canvas = paint.canvasElement;

        function drawCircle(target) {
            var radius = Math.abs(self.startPosition.x - self.finalPosition.x);
            target.beginPath();
            target.arc(self.startPosition.x, self.startPosition.y, radius, 0, 2 * Math.PI);
            target.stroke();
        }

        // override base methods
        paint.shape.circle.prototype.onMouseMove = function (ev) {
            // call base method
            paint.shape.prototype.onMouseMove(ev);

            paint.canvas.clearCanvas();
            //ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
            drawCircle(ctx);

            canvas.addEventListener("mouseup", self.onMouseUp);
        }

        paint.shape.circle.prototype.onMouseUp = function (ev) {
            //call base method
            paint.shape.prototype.onMouseUp(ev);
            drawCircle(paint.ctxTemp);
        }
    }

    $(function () {
        // inherit paint.shape
        paint.shape.circle.prototype = new paint.shape();

        // correct the constructor pointer because it points to paint.shape
        paint.shape.circle.prototype.constructor = paint.shape.circle;
    });
})(window.paint = window.paint || {}, jQuery);