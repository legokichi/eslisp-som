function genColor() {
    return normalizeColor({
        r: Math.random(),
        g: Math.random(),
        b: Math.random()
    });
}
function normalizeColor(color) {
    var abs = Math.sqrt(Math.pow(color.r, 2) + (Math.pow(color.g, 2) + Math.pow(color.b, 2)));
    return {
        r: color.r / abs,
        g: color.g / abs,
        b: color.b / abs
    };
}
function getWinner(input, map) {
    var max = -1;
    var winner = null;
    for (var i = 0; i < map.length; ++i) {
        var col = map[i];
        for (var j = 0; j < col.length; ++j) {
            var color = col[j];
            var score = input.r * color.r + (input.g * color.g + input.b * color.b);
            if (max < score) {
                max = score;
                winner = {
                    i: i,
                    j: j,
                    color: color
                };
            }
        }
    }
    return winner;
}
function learn(input, winner, map) {
    for (var i = 0; i < map.length; ++i) {
        var col = map[i];
        for (var j = 0; j < col.length; ++j) {
            var x = Math.exp(-(Math.abs(winner.i - i) + Math.abs(winner.j - j) / 2));
            col[j].r += input.r * x;
            col[j].g += input.g * x;
            col[j].b += input.b * x;
            col[j] = normalizeColor(col[j]);
        }
    }
}
function repaint(canvas, map) {
    var cxt = canvas.getContext('2d');
    var dat = cxt.getImageData(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < map.length; ++i) {
        var col = map[i];
        for (var j = 0; j < col.length; ++j) {
            var index = (i + j * canvas.width) * 4;
            var color = col[j];
            dat.data[index] = color.r * 255;
            dat.data[index + 1] = color.g * 255;
            dat.data[index + 2] = color.b * 255;
            dat.data[index + 3] = 255;
        }
    }
    cxt.putImageData(dat, 0, 0);
}
window.addEventListener('load', function () {
    var canvas = document.getElementById('target');
    var map = [];
    for (var i = 0; i < canvas.width; ++i) {
        var col = [];
        map.push(col);
        for (var j = 0; j < canvas.height; ++j) {
            col.push(genColor());
        }
    }
    setInterval(function () {
        var input = genColor();
        var winner = getWinner(input, map);
        if (!winner)
            return null;
        learn(input, winner, map);
        repaint(canvas, map);
    }, 0);
});
