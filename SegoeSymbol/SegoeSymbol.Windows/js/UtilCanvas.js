function generateCanvasTile(width, height, value, colour) {
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
    ctx.fillStyle = colour;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(String.fromCharCode(value), x, y);
    return canvas;
}
