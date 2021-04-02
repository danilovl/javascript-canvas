export function rayPoints(ray) {
    return radianPoints(ray.startPoint, ray.radian, ray.width);
}

export function radianPoints(startPoint, radian, width) {
    let coordinatesArray = [];

    let centerX = startPoint.x;
    let centerY = startPoint.y;

    for (let i = 0; i < width; i++) {
        let x = centerX + i * Math.cos(radian);
        let y = centerY + i * Math.sin(radian);

        coordinatesArray.push({x: x, y: y});
    }

    return coordinatesArray;
}
