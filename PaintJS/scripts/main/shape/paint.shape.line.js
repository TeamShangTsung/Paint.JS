(function (paint, $, undefined) {
	//Constructor
	paint.shape.line = function (options) {
		// Call the parent constructor
	    paint.shape.call(this);
	    $(paint.canvasElement).on("mousedown", this.onMouseDown);

		var self = this;
		var ctx = paint.ctx;

		function drawLine(target) {
		    target.beginPath();
		    target.moveTo(self.startPosition.x, self.startPosition.y);
		    target.lineTo(self.finalPosition.x, self.finalPosition.y);
		    target.stroke();
		}

		paint.shape.prototype.setOptions(options);
		paint.shape.prototype.cleanEvents();
		paint.shape.prototype.attachMouseDown();

		//override base methods
		paint.shape.line.prototype.onMouseMove = function (ev) {
			//call base method
			paint.shape.prototype.onMouseMove(ev);
            
			paint.canvas.clearCanvas("temp");
			drawLine(paint.ctxTemp);

			$(paint.canvasElement).on("mouseup", self.onMouseUp);
		}

		paint.shape.line.prototype.onMouseUp = function (ev) {
		    //call base method
		    paint.shape.prototype.onMouseUp(ev);
		    drawLine(ctx);
		}
	}

	$(function () {
		// inherit paint.shape
		paint.shape.line.prototype = new paint.shape();

		// correct the constructor pointer because it points to paint.shape
		paint.shape.line.prototype.constructor = paint.shape.line;
	});
})(window.paint = window.paint || {}, jQuery);