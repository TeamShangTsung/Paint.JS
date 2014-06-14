(function (paint, $, undefined) {
	paint.toolbar.actions = {};
	var me = paint.toolbar.actions;

	me.eraser = function (eraserWidth) {
		var eraserWidth = eraserWidth || 5;

		paint.canvas.drawing({
			type: 'eraser',
			lineWidth: eraserWidth,
			color: 'white'
		});
	}

})(window.paint = window.paint || {}, jQuery);