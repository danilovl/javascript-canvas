import {COLOR, DIM, WIDTH, HEIGHT} from '../constant/constant.js';

export function drawPlayingField(context) {
    context.fillStyle = COLOR.playingField;
    context.fillRect(0, 0, DIM * WIDTH, DIM * HEIGHT);

    for (let x = 1; x <= WIDTH; x++) {
        context.beginPath();
        context.moveTo(x * DIM, 0);
        context.lineTo(x * DIM, HEIGHT * DIM);
        context.stroke();
    }

    for (let y = 1; y <= HEIGHT; y++) {
        context.beginPath();
        context.moveTo(0, y * DIM);
        context.lineTo(WIDTH * DIM, y * DIM);
        context.stroke();
    }

    drawBorder(context, 0, 0, DIM * WIDTH, DIM * HEIGHT, COLOR.borderCanvas);
}

export function drawBorder(context, x, y, w, h, color) {
    context.beginPath();
    context.rect(x, y, w, h);
    context.lineWidth = 2;
    context.strokeStyle = color;
    context.stroke();
}

export function highlightPlayingCell(context, x, y, color, dim) {
    context.beginPath();
    context.rect(x * dim + 1, y * dim + 1, dim - 2, dim - 2);
    context.fillStyle = color;
    context.fill();
}
