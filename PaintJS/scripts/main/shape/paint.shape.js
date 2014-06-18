(function (paint, $, undefined) {
    paint.shape = function () {
        var self = this;

        this.startPosition = {
            x: 0,
            y: 0
        };

        this.finalPosition = {
            x: 0,
            y: 0
        };

        //Base methods
        paint.shape.prototype.attachMouseDown = function () {
            $(paint.canvasElement).on("mousedown", this.onMouseDown);
        }

        paint.shape.prototype.setOptions = function (options) {
            if (options) {
                if (options.lineWidth) {
                    paint.ctx.lineWidth = options.lineWidth;
                    paint.ctxTemp.lineWidth = options.lineWidth;
                }

                if (options.strokeColor) {
                    paint.ctx.strokeStyle = options.strokeColor;
                    paint.ctxTemp.strokeStyle = options.strokeColor;
                }

                if (options.fillColor) {
                    paint.ctx.fillStyle = options.fillColor;
                    paint.ctxTemp.fillStyle = options.fillColor;
                }
            }
        }

        paint.shape.prototype.onMouseDown = function (ev) {
            self.startPosition.x = ev.clientX;
            self.startPosition.y = ev.clientY;

            $(paint.canvasElement).on("mousemove", self.onMouseMove);
        }

        paint.shape.prototype.onMouseMove = function (ev) {
            self.finalPosition.x = ev.clientX;
            self.finalPosition.y = ev.clientY;
        }

        paint.shape.prototype.onMouseUp = function (ev) {
            $(paint.canvasElement).off("mousemove", self.onMouseMove);

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

        paint.shape.prototype.cleanEvents = function (e) {
            $(paint.canvasElement).off();
        }
    }
})(window.paint = window.paint || {}, jQuery);