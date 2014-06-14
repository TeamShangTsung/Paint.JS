﻿(function (paint, $, undefined) {
    paint.shape.rectangle = function () {
        // paint.shape.call(this);
        //implement base functions with this.
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");

        var startPosition = {
            x: 0,
            y: 0
        };

        var finalPosition = {
            x: 0,
            y: 0
        };

        canvas.addEventListener("mousedown", onMouseDown);

        function onMouseDown(ev) {
            startPosition.x = ev.layerX;
            startPosition.y = ev.layerY;

            canvas.addEventListener("mousemove", onMouseMove);
        }

        function onMouseMove(ev) {
            finalPosition.x = ev.layerX;
            finalPosition.y = ev.layerY;

            ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
            ctx.beginPath();
            ctx.moveTo(startPosition.x, startPosition.y);
            ctx.lineTo(finalPosition.x, startPosition.y);
            ctx.lineTo(finalPosition.x, finalPosition.y);
            ctx.lineTo(startPosition.x, finalPosition.y);
            ctx.closePath();
            ctx.stroke();

            canvas.addEventListener("mouseup", onMouseUp);
        }

        function onMouseUp(ev) {
            canvas.removeEventListener("mousemove", onMouseMove);

            finalPosition.x = ev.layerX;
            finalPosition.y = ev.layerY;

            var stepX = 0;
            var stepY = 0;
            var stepCount = 0;

            if (startPosition.x < finalPosition.x) {
                stepX = 5;
            } else if (startPosition.x > finalPosition.x) {
                stepX = -5;
            }

            // else stepX = 0 it is default

            stepCount = Math.abs((finalPosition.x - startPosition.x) / stepX);
            stepY = Math.abs((finalPosition.y - startPosition.y) / stepCount);

            if (startPosition.y > finalPosition.y) {
                stepY *= -1;
            }

            var multiplier = Math.abs((finalPosition.x - startPosition.x) / stepCount);
        }
    }
})(window.paint = window.paint || {}, jQuery);