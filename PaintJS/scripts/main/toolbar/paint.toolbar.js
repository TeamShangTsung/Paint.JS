(function (paint, $, undefined) {
    paint.toolbar = {};
    var me = paint.toolbar;

	$('#toolbar-container').on('click', '.tool', function(e) {
		if (location.hash === ("#" + e.target.id)) {
			location.hash = '';
		}
		else {
			location.hash = ("#" + e.target.id);
		}
	});

	$('#toolbar-container').on('click', '.brush-type', function(e) {
		location.hash = ('#brush');
	});

	$('#toolbar-container').on('click', '#line-width-select', function(e) {
		if (location.hash === '#line-width-select') {
			location.hash = '';
		}
		else {
			location.hash = '#line-width-select';
		}
	});
})(window.paint = window.paint || {}, jQuery);