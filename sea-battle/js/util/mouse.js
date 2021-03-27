import {DIM} from '../constant/constant.js';

export function coordsToCell(mousePosX, mousePosY) {
    let x = (Math.floor((mousePosX - DIM) / DIM)) + 1;
    let y = (Math.floor((mousePosY - DIM) / DIM)) + 1;

    return {x: x, y: y};
}

export function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();

    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
