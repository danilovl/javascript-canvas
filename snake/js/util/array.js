export function arrayRandomNumber(max) {
    return Math.floor(Math.random() * max);
}

export function isPointInSnake(snakePoints, point) {
    for (let snakePoint of snakePoints) {
        if (snakePoint.x === point.x && snakePoint.y === point.y) {
            return true;
        }
    }

    return false;
}
