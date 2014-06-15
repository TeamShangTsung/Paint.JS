(function (paint, $, undefined) {
    // Constructor
    paint.shape.circle = function () {
        // Call the parent constructor
        paint.shape.call(this)
        paint.canvasElement.addEventListener("mousedown", this.onMouseDown);

        var self = this;
        var ctx = paint.ctx;
        var canvas = paint.canvasElement;

        // override base methods
        paint.shape.circle.prototype.onMouseMove = function (ev) {
            // call base method
            paint.shape.prototype.onMouseMove(ev);

            ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
            var radius = Math.abs(self.startPosition.x - self.finalPosition.x);
            ctx.beginPath();
            ctx.arc(self.startPosition.x, self.startPosition.y, radius, 0, 2 * Math.PI);
            ctx.stroke();

            canvas.addEventListener("mouseup", self.onMouseUp);
        }
    }

    $(function () {
        // inherit paint.shape
        paint.shape.circle.prototype = new paint.shape();

        // correct the constructor pointer because it points to paint.shape
        paint.shape.circle.prototype.constructor = paint.shape.circle;
    });
})(window.paint = window.paint || {}, jQuery);