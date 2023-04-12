import {DIM} from '../constant/constant.js';

export function coordsToCell(mousePosX, mousePosY) {
    const x = (Math.floor((mousePosX - DIM) / DIM)) + 1;
    const y = (Math.floor((mousePosY - DIM) / DIM)) + 1;

    return {x: x, y: y};
}

export function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
