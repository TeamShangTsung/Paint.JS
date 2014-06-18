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
        
        $('#toolbar-container').on('click', '.color-container', function(e) {
            if (e.target.id == 'color-picker-1') {
                location.hash = '#color-1-container';
            }
            else if (e.target.id == 'color-picker-2'){
                location.hash = '#color-2-container';
            }
            else {
                location.hash = ("#" + e.target.id);
            }
        });

        $('#toolbar-container').on('click', '.color', function(e) {
            if (location.hash === '#color-1-container' ||
                    location.hash === '#color-2-container') {
                var currentColorPicker;
                var newColor;

                if (location.hash === '#color-1-container') {
                    currentColorPicker = '#color-picker-1';
                }
                else {
                    currentColorPicker = '#color-picker-2';
                }

                switch (e.target.id)
                {
                    case 'black':
                        newColor = '#000000';
                        break;
                    case 'gray':
                        newColor = '#7F7F7F';
                        break;
                    case 'dark-red':
                        newColor = '#880015';
                        break;
                    case 'red':
                        newColor = '#ED1C24';
                        break;
                    case 'orange':
                        newColor = '#FF7F27';
                        break;
                    case 'yellow':
                        newColor = '#FFF200';
                        break;
                    case 'green':
                        newColor = '#22B14C';
                        break;
                    case 'blue':
                        newColor = '#00A2E8';
                        break;
                    case 'dark-blue':
                        newColor = '#3F48CC';
                        break;
                    case 'purple':
                        newColor = '#A349A4';
                        break;
                    case 'white':
                        newColor = '#FFFFFF';
                        break;
                    case 'light-gray':
                        newColor = '#C3C3C3';
                        break;
                    case 'brown':
                        newColor = '#B97A57';
                        break;
                    case 'pink':
                        newColor = '#FFAEC9';
                        break;
                    case 'light-orange':
                        newColor = '#FFC90E';
                        break;
                    case 'light-yellow':
                        newColor = '#EFE4B0';
                        break;
                    case 'light-green':
                        newColor = '#B5E61D';
                        break;
                    case 'sky-blue':
                        newColor = '#99D9EA';
                        break;
                    case 'light-blue':
                        newColor = '#7092BE';
                        break;
                    case 'light-purple':
                        newColor = '#C8BFE7';
                        break;
                }

                $(currentColorPicker).remove();
                $('<input id="' + currentColorPicker.substring(1) + '" class="color-picker" type="color" value="' + newColor + '">').prependTo($(location.hash));

                if (currentColorPicker === '#color-picker-1') {
                    paint.canvas.changeStrokeColor(newColor);
                } else {
                    paint.canvas.changeFillColor(newColor);
                }
            }
        });
    });
})(window.paint = window.paint || {}, jQuery);