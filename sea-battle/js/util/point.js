import {filterExceptPoints, filterIncludePoints, arrayFindIndexPoint, sortPoints} from './array.js';
import {DIRECTION, POSITION} from '../constant/constant.js';
import Ship from '../class/ship.js';

export function getAreaAroundPoint(targetPoint, exceptPoint, includePoint) {
    let points = []

    points.push({
        x: targetPoint.x - 1,
        y: targetPoint.y
    })

    points.push({
        x: targetPoint.x - 1,
        y: targetPoint.y - 1
    })

    points.push({
        x: targetPoint.x,
        y: targetPoint.y - 1
    })

    points.push({
        x: targetPoint.x + 1,
        y: targetPoint.y - 1
    })

    points.push({
        x: targetPoint.x + 1,
        y: targetPoint.y
    })

    points.push({
        x: targetPoint.x + 1,
        y: targetPoint.y + 1
    })

    points.push({
        x: targetPoint.x,
        y: targetPoint.y + 1
    })

    points.push({
        x: targetPoint.x - 1,
        y: targetPoint.y + 1
    })

    points = points.filter(point => point.x >= 1 && point.x <= 10 && point.y >= 1 && point.y <= 10);

    if (exceptPoint !== undefined && exceptPoint !== null) {
        points = filterExceptPoints(points, exceptPoint);
    }

    if (includePoint !== undefined && includePoint !== null) {
        points = filterIncludePoints(points, includePoint);
    }

    return points;
}

export function getAreaAroundShipPoint(ship) {
    let aroundPoints = []

    for (let i = 0; i < ship.points.length; i++) {
        let shipPoint = ship.points[i];
        aroundPoints.push(...getAreaAroundPoint(shipPoint, ship.points))
    }

    return aroundPoints
}

export function getTargetSuccessDirectionPoints(successPoints, exceptPoint, includePoint) {
    let points = []

    successPoints.sort((a, b) => a.x - b.x);
    successPoints.sort((a, b) => a.y - b.y);

    let firstPoint = successPoints[0];
    let lastPoint = successPoints[successPoints.length - 1];

    if (firstPoint.x === lastPoint.x) {
        points.push({x: firstPoint.x, y: firstPoint.y - 1})
        points.push({x: lastPoint.x, y: lastPoint.y + 1})
    }

    if (firstPoint.y === lastPoint.y) {
        points.push({x: firstPoint.x - 1, y: firstPoint.y})
        points.push({x: lastPoint.x + 1, y: lastPoint.y})
    }

    points = points.filter(function (point) {
        return point.x >= 1 && point.x <= 10 && point.y >= 1 && point.y <= 10;
    });

    if (exceptPoint !== undefined && exceptPoint !== null) {
        points = filterExceptPoints(points, exceptPoint);
    }

    if (includePoint !== undefined && includePoint !== null) {
        points = filterIncludePoints(points, includePoint);
    }

    return points;
}

export function generateMatrixPoint() {
    let points = []

    for (let x = 1; x <= 10; x++) {
        for (let y = 1; y <= 10; y++) {
            points.push({
                x: x,
                y: y
            })
        }
    }

    return points;
}

export function moveShipPoints(oldPoint, newPoint, ship) {
    let newShip = ship.clone();
    let position = newShip.getPositionName();

    if (position === POSITION.vertical) {
        for (let i = 0; i < newShip.points.length; i++) {
            let point = newShip.points[i];
            point.x = newPoint.x
        }
        if (newPoint.y !== oldPoint.y) {
            if (newPoint.y > oldPoint.y) {
                for (let i = 0; i < newShip.points.length; i++) {
                    let point = newShip.points[i];
                    point.y = point.y + (newPoint.y - oldPoint.y);
                }
            } else {
                for (let i = 0; i < newShip.points.length; i++) {
                    let point = newShip.points[i];
                    point.y = point.y - (oldPoint.y - newPoint.y);
                }
            }
        }
    }

    if (position === POSITION.horizontal) {
        for (let i = 0; i < newShip.points.length; i++) {
            let point = newShip.points[i];
            point.y = newPoint.y
        }

        if (newPoint.x !== oldPoint.x) {
            if (newPoint.x > oldPoint.x) {
                for (let i = 0; i < newShip.points.length; i++) {
                    let point = newShip.points[i];
                    point.x = point.x + (newPoint.x - oldPoint.x);
                }
            } else {
                for (let i = 0; i < newShip.points.length; i++) {
                    let point = newShip.points[i];
                    point.x = point.x - (oldPoint.x - newPoint.x);
                }
            }
        }
    }

    if (position === POSITION.both) {
        for (let i = 0; i < newShip.points.length; i++) {
            let point = newShip.points[i];

            point.x = newPoint.x
            point.y = newPoint.y
        }
    }

    let isOutside = newShip.points.some(point => isPointOutside(point))

    return isOutside ? ship : newShip;
}

export function flipShipPoints(clickPoint, ship) {
    let newShip = ship.clone();
    sortPoints(newShip.points);
    let position = newShip.getPositionName();

    if (position === POSITION.vertical) {
        let index = arrayFindIndexPoint(clickPoint, newShip.points);
        for (let i = 0; i < newShip.points.length; i++) {
            let point = newShip.points[i];
            if (point.isEqual(clickPoint)) {
                index = 1;

                continue;
            }

            if (point.y < clickPoint.y) {
                point.x = point.x + index;
                index--;
            } else {
                point.x = point.x - index;
                index++;
            }

            point.y = clickPoint.y
        }
    }

    if (position === POSITION.horizontal) {
        let index = arrayFindIndexPoint(clickPoint, newShip.points);
        for (let i = 0; i < newShip.points.length; i++) {
            let point = newShip.points[i];
            if (point.isEqual(clickPoint)) {
                index = 1;

                continue;
            }

            if (point.x < clickPoint.x) {
                point.y = point.y - index;
                index--;
            } else {
                point.y = point.y + index;
                index++;
            }

            point.x = clickPoint.x
        }
    }

    let isOutside = newShip.points.some(point => isPointOutside(point))

    return isOutside ? ship : newShip;
}

export function isPointOutside(point) {
    return point.x < 1 || point.x > 10 || point.y < 1 || point.y > 10;
}

export function getPossibleShipPointsByLengthDirection(startPoint, length, direction) {
    let {x: startX, y: startY} = startPoint;
    let points = [];
    length--;

    switch (direction) {
        case DIRECTION.up:
            let lengthUp = startY - length;
            for (let i = startY; i >= lengthUp; i--) {
                let point = {x: startX, y: i};
                if (isPointOutside(point)) {
                    return null;
                }

                points.push(point)
            }

            break;
        case DIRECTION.down:
            let lengthDown = startY + length;
            for (let i = startY; i <= lengthDown; i++) {
                let point = {x: startX, y: i};
                if (isPointOutside(point)) {
                    return null;
                }

                points.push(point)
            }

            break;
        case DIRECTION.left:
            let lengthLeft = startX - length;
            for (let i = startX; i >= lengthLeft; i--) {
                let point = {x: i, y: startY};
                if (isPointOutside(point)) {
                    return null;
                }

                points.push(point)
            }
            break;
        case DIRECTION.right:
            let lengthRight = startX + length;
            for (let i = startX; i <= lengthRight; i++) {
                let point = {x: i, y: startY};
                if (isPointOutside(point)) {
                    return null;
                }

                points.push(point)
            }
            break;
        default:
    }

    return points.length > 0 ? points : null;
}

export function getPossibleShipsByLength(startPoint, length) {
    let shipPoints
    let shipsPoints = []

    shipPoints = getPossibleShipPointsByLengthDirection(startPoint, length, DIRECTION.up);
    if (startPoint !== null) {
        shipsPoints.push(new Ship(shipPoints));
    }

    shipPoints = getPossibleShipPointsByLengthDirection(startPoint, length, DIRECTION.down);
    if (shipPoints !== null) {
        shipsPoints.push(new Ship(shipPoints));
    }

    shipPoints = getPossibleShipPointsByLengthDirection(startPoint, length, DIRECTION.left);
    if (shipPoints !== null) {
        shipsPoints.push(new Ship(shipPoints));
    }

    shipPoints = getPossibleShipPointsByLengthDirection(startPoint, length, DIRECTION.right);
    if (shipPoints !== null) {
        shipsPoints.push(new Ship(shipPoints));
    }

    return shipsPoints.length > 0 ? shipsPoints : null;
}
