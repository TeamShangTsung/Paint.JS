(function (paint, $, undefined) {
    //Constructor
    paint.shape.chat = function () {
        // Call the parent constructor
        paint.shape.call(this)
        paint.canvasElement.addEventListener("mousedown", this.onMouseDown);

        var self = this;
        var ctx = paint.ctx;
        var canvas = paint.canvasElement;

        //override base methods
        paint.shape.chat.prototype.onMouseMove = function (ev) {
            //call base method
            paint.shape.prototype.onMouseMove(ev);

            ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
            var chat = Math.abs(self.startPosition.x - self.finalPosition.x) / 5;
            ctx.beginPath();
            ctx.moveTo(self.startPosition.x, self.startPosition.y);
            ctx.lineTo(self.finalPosition.x, self.startPosition.y);
            ctx.lineTo(self.finalPosition.x, self.finalPosition.y);
            ctx.lineTo(self.startPosition.x + (2 * chat), self.finalPosition.y);
            ctx.lineTo(self.startPosition.x + (1.5 * chat), self.finalPosition.y + (chat / 2));
            ctx.lineTo(self.startPosition.x + chat, self.finalPosition.y);
            ctx.lineTo(self.startPosition.x, self.finalPosition.y);
            ctx.closePath();
            ctx.stroke();

            canvas.addEventListener("mouseup", self.onMouseUp);
        }
    }

    $(function () {
        // inherit paint.shape
        paint.shape.chat.prototype = new paint.shape();

        // correct the constructor pointer because it points to paint.shape
        paint.shape.chat.prototype.constructor = paint.shape.chat;
    });
})(window.paint = window.paint || {}, jQuery);