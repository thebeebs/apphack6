var UtilCanvas = {
    generateCanvasTile : function (width, height, value, background, foreground, offsetX, offsetY) {
    if (offsetX === undefined) offsetX = 0;
    if (offsetY === undefined) offsetY = 0;
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var ctx, imgData;
    canvas.width = width;
    canvas.height = height;

    var x = ctx.canvas.width / 2 | 0;
    var y = ctx.canvas.height * 0.66 | 0
    ctx.font = x + "px 'Segoe UI Symbol'";

    var font = x > y ? y : x;

    ctx.font = font + "px Segoe UI Symbol";
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = foreground;
    ctx.textAlign = "center";
    ctx.fillText(String.fromCharCode(value), x + offsetX, y + offsetY);
    return canvas;
},

generateCanvasTileOffsetBug : function(w, h, s, b, f, shouldreturn) {
    var canvas = this.generateCanvasTile(w, h, s, '#000', '#fff');
    var ctx = canvas.getContext("2d");
    var bounds = this.contextBoundingBox(ctx);
    if (bounds == undefined) return canvas;
    var offsetW = ((w - bounds.w) / 2) | 0;
    offsetW = Math.abs(offsetW - bounds.x);
    var offsetY = ((h - bounds.h) / 2) | 0;
    offsetY = Math.abs(offsetY - bounds.y);
    canvas = this.generateCanvasTile(w, h, s, b, f, -offsetW, +offsetY);
    return canvas;
},

 contextBoundingBox: function(ctx, alphaThreshold) {
    if (alphaThreshold === undefined) alphaThreshold = 255;
    var w = ctx.canvas.width, h = ctx.canvas.height;
    var data = ctx.getImageData(0, 0, w, h).data;
    var x, y, minX, minY, maxY, maxY;
    o1: for (y = h; y--;) for (x = w; x--;) if (data[(w * y + x) * 4 + 1] == alphaThreshold) { maxY = y; break o1 }
    if (!maxY) return;
    o2: for (x = w; x--;) for (y = maxY + 1; y--;) if (data[(w * y + x) * 4 + 1] == alphaThreshold) { maxX = x; break o2 }
    o3: for (x = 0; x <= maxX; ++x) for (y = maxY + 1; y--;) if (data[(w * y + x) * 4 + 1] == alphaThreshold) { minX = x; break o3 }
    o4: for (y = 0; y <= maxY; ++y) for (x = minX; x <= maxX; ++x) if (data[(w * y + x) * 4 + 1] == alphaThreshold) { minY = y; break o4 }
    return { x: minX, y: minY, maxX: maxX, maxY: maxY, w: maxX - minX, h: maxY - minY };
}
}