(function (paint, $, undefined) {
    paint.toolbar = {};
    var me = paint.toolbar;

    $(function () {
        $('#toolbar-container').on('click', '.tool', function (e) {
            if (location.hash === ("#" + e.target.id)) {
                location.hash = '';
            }
            else {
                location.hash = ("#" + e.target.id);
            }
        });

        $('#toolbar-container').on('click', '.brush-type', function (e) {
            location.hash = ('#brush');
        });

        $('#toolbar-container').on('click', '#line-width-select', function (e) {
            if (location.hash === '#line-width-select') {
                location.hash = '';
            }
            else {
                location.hash = '#line-width-select';
            }
        });

        //Change current line width 
        $('#toolbar-container').on('click', '.line-width-type', function (e) {
            var currentWidth = $(this).attr('data-line-width');
            $(this).closest('#line-width').attr('data-line-width', currentWidth);
            paint.canvas.changeLineWidth(currentWidth);
        });
        
    });
})(window.paint = window.paint || {}, jQuery);