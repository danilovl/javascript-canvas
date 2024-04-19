export function rayPoints(ray) {
    return radianPoints(ray.startPoint, ray.radian, ray.width);
}

export function radianPoints(startPoint, radian, width) {
    const coordinatesArray = [];

    const centerX = startPoint.x;
    const centerY = startPoint.y;

    for (let i = 0; i < width; i++) {
        const x = centerX + i * Math.cos(radian);
        const y = centerY + i * Math.sin(radian);

        coordinatesArray.push({x: x, y: y});
    }

    return coordinatesArray;
}
