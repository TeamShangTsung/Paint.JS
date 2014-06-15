(function (paint, $, undefined) {
    paint.shape = function () {
        var self = this;
        var canvas = paint.canvasElement;

        this.startPosition = {
            x: 0,
            y: 0
        };

        this.finalPosition = {
            x: 0,
            y: 0
        };

        paint.canvasElement.addEventListener("mousedown", this.onMouseDown);

        //Base methods
        paint.shape.prototype.onMouseDown = function (ev) {
            self.startPosition.x = ev.clientX;
            self.startPosition.y = ev.clientY;

            canvas.addEventListener("mousemove", self.onMouseMove);
        }

        paint.shape.prototype.onMouseMove = function (ev) {
            self.finalPosition.x = ev.clientX;
            self.finalPosition.y = ev.clientY;
        }

        paint.shape.prototype.onMouseUp = function (ev) {
            canvas.removeEventListener("mousemove", self.onMouseMove);

            self.finalPosition.x = ev.clientX;
            self.finalPosition.y = ev.clientY;

            var stepX = 0;
            var stepY = 0;
            var stepCount = 0;

            if (self.startPosition.x < self.finalPosition.x) {
                stepX = 5;
            } else if (self.startPosition.x > self.finalPosition.x) {
                stepX = -5;
            }

            // else stepX = 0 it is default

            stepCount = Math.abs((self.finalPosition.x - self.startPosition.x) / stepX);
            stepY = Math.abs((self.finalPosition.y - self.startPosition.y) / stepCount);

            if (self.startPosition.y > self.finalPosition.y) {
                stepY *= -1;
            }

            var multiplier = Math.abs((self.finalPosition.x - self.startPosition.x) / stepCount);
        }
    }
})(window.paint = window.paint || {}, jQuery);