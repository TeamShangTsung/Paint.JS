(function (paint, $, undefined) {
    //Constructor
    paint.shape.rectangle = function () {
        // Call the parent constructor
        paint.shape.call(this)
        paint.canvasElement.addEventListener("mousedown", this.onMouseDown);

        var self = this;
        var ctx = paint.ctx;
        var canvas = paint.canvasElement;

        //override base methods
        paint.shape.rectangle.prototype.onMouseMove = function (ev) {
            //call base method
            paint.shape.prototype.onMouseMove(ev);

            ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
            ctx.beginPath();
            ctx.moveTo(self.startPosition.x, self.startPosition.y);
            ctx.lineTo(self.finalPosition.x, self.startPosition.y);
            ctx.lineTo(self.finalPosition.x, self.finalPosition.y);
            ctx.lineTo(self.startPosition.x, self.finalPosition.y);
            ctx.closePath();
            ctx.stroke();

            canvas.addEventListener("mouseup", self.onMouseUp);
        }
    }

    $(function () {
        // inherit paint.shape
        paint.shape.rectangle.prototype = new paint.shape();

        // correct the constructor pointer because it points to paint.shape
        paint.shape.rectangle.prototype.constructor = paint.shape.rectangle;
    });
})(window.paint = window.paint || {}, jQuery);