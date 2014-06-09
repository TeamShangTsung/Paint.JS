(function (paint, $, undefined) {
	paint.shape.circle = function () {
		paint.shape.call(this);
		//implement base functions with this.
	}
})(window.paint = window.paint || {}, jQuery);