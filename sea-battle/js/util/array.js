export function arrayRemoveByValue(arr, value) {
    return arr.filter(item => item !== value);
}

export function arrayRandomItem(items) {
    let number = Math.floor(Math.random() * items.length);

    return items[number];
}

export function arrayRandomNumber(max) {
    return Math.floor(Math.random() * max);
}

export function arrayRemoveByIndex(index, array) {
    return array.filter((item, itemIndex) => itemIndex !== index)
}

export function arrayFindIndexPoint(point, array) {
    return array.findIndex(item => item.x === point.x && item.y === point.y)
}

export function arrayRemoveByPoint(point, array) {
    return array.filter(item => item.x !== point.x && item.y !== point.y)
}

export function filterExceptPoints(points, exceptPoints) {
    return points.filter(point => arrayFindIndexPoint(point, exceptPoints) === -1);
}

export function filterIncludePoints(points, includePoints) {
    return points.filter(point => arrayFindIndexPoint(point, includePoints) !== -1);
}

export function arrayFindIndexPointShips(point, ships) {
    return ships.findIndex(ship => ship.hasPoint(point))
}

export function isPointIntersects(firstPoints, secondPoint) {
    for (let i = 0; i < firstPoints.length; i++) {
        let point = firstPoints[i];

        if (arrayFindIndexPoint(point, secondPoint) !== -1) {
            return true;
        }
    }

    return false;
}

export function sortPoints(points) {
    points.sort((a, b) => a.x - b.x);
    points.sort((a, b) => a.y - b.y);
}
