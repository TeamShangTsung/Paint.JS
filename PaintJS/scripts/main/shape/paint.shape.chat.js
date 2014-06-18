(function (paint, $, undefined) {
    //Constructor
    paint.shape.chat = function () {
        // Call the parent constructor
        paint.shape.call(this)
        $(paint.canvasElement).on("mousedown", this.onMouseDown);

        var self = this;

        function drawChat(target) {
            var chat = Math.abs(self.startPosition.x - self.finalPosition.x) / 5;
            target.beginPath();
            target.moveTo(self.startPosition.x, self.startPosition.y);
            target.lineTo(self.finalPosition.x, self.startPosition.y);
            target.lineTo(self.finalPosition.x, self.finalPosition.y);
            target.lineTo(self.startPosition.x + (2 * chat), self.finalPosition.y);
            target.lineTo(self.startPosition.x + (1.5 * chat), self.finalPosition.y + (chat / 2));
            target.lineTo(self.startPosition.x + chat, self.finalPosition.y);
            target.lineTo(self.startPosition.x, self.finalPosition.y);
            target.closePath();
            target.stroke();
        }

        paint.shape.prototype.cleanEvents();
        paint.shape.prototype.attachMouseDown();

        //override base methods
        paint.shape.chat.prototype.onMouseMove = function (ev) {
            //call base method
            paint.shape.prototype.onMouseMove(ev);

            paint.canvas.clearCanvas();
            drawChat(paint.ctx);

            $(paint.canvasElement).on("mouseup", self.onMouseUp);
        }

        paint.shape.chat.prototype.onMouseUp = function (ev) {
            //call base method
            paint.shape.prototype.onMouseUp(ev);
            drawChat(paint.ctxTemp);
        }
    }

    $(function () {
        // inherit paint.shape
        paint.shape.chat.prototype = new paint.shape();

        // correct the constructor pointer because it points to paint.shape
        paint.shape.chat.prototype.constructor = paint.shape.chat;
    });
})(window.paint = window.paint || {}, jQuery);