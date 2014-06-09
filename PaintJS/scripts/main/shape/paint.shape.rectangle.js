(function (paint, $, undefined) {
    paint.shape.rectangle = function () {
        paint.shape.call(this);
        //implement base functions with this.
    }
})(window.paint = window.paint || {}, jQuery);