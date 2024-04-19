import {COLOR, DIM, VERTICAL_LETTER, LETTER_FONT} from '../constant/constant.js';

export function drawPlayingField(context) {
    for (let y = 1; y <= 10; y++) {
        context.fillStyle = COLOR.letter;
        context.font = LETTER_FONT.default;
        context.testBaseLine = 'bottom';
        context.fillText(VERTICAL_LETTER[y - 1], 10, y * DIM + 24);
    }

    for (let x = 1; x <= 10; x++) {
        context.fillStyle = COLOR.letter;
        context.font = LETTER_FONT.default;
        context.testBaseLine = 'bottom';
        context.fillText(x, x * DIM + 14, 20);
    }

    for (let x = 1; x <= 10; x++) {
        for (let y = 1; y <= 10; y++) {
            context.rect(x * DIM, y * DIM, DIM, DIM);
            context.lineWidth = 2;
            context.strokeStyle = COLOR.borderCanvas;
            context.stroke();
        }
    }
}

export function drawBorderPlayingField(context, dim, color) {
    context.beginPath();
    context.rect(dim, dim, 10 * dim, 10 * dim);
    context.lineWidth = 4;
    context.strokeStyle = color;
    context.stroke();
}

export function drawBorder(context, x, y, w, h, color) {
    context.beginPath();
    context.rect(x, y, w, h);
    context.lineWidth = 4;
    context.strokeStyle = color;
    context.stroke();
}

export function highlightPlayingCell(context, x, y, color, dim) {
    if (x < 1 || x > 10 || y < 1 || y > 10) {
        return
    }

    context.beginPath();
    context.rect(x * dim + 1, y * dim + 1, dim - 2, dim - 2);
    context.fillStyle = color;
    context.fill();
}

export function highlightRect(context, x, y, w, h, color) {
    context.beginPath();
    context.rect(x, y, w, h);
    context.fillStyle = color;
    context.fill();
}
