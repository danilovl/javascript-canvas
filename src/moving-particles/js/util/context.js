export function drawLineBetweenPoints(context, p1, p2, lineWidth, color) {
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.moveTo(p1.x, p1.y);
    context.lineTo(p2.x, p2.y);
    context.stroke();
    context.closePath();
}

export function drawCirclePoint(context, point, color) {
    context.beginPath();
    context.fillStyle = color;
    context.arc(point.x, point.y, point.radius, 0, 2 * Math.PI, false);
    context.fill();
    context.closePath();
}
