import {
    arrayRemoveByValue,
    arrayRandomItem,
    arrayRandomNumber,
    arrayRemoveByIndex,
    arrayFindIndexPoint,
    sortPoints,
    arrayRemoveByPoint
} from '../util/array.js';
import Point from './point.js';
import Ship from './ship.js';
import {getAreaAroundPoint, generateMatrixPoint, getPossibleShipsByLength} from '../util/point.js';
import {DIRECTION, SHIPS} from '../constant/constant.js';

export default class ShipGenerator {
    constructor() {
        this.points = [];
        this.generatePoints = [];
    }

    getShips() {
        this.points = generateMatrixPoint()
        let ships = [];

        SHIPS.forEach(configShip => {
            let counter = 0;

            while (counter < configShip.count) {
                this.generatePoints = this.points;

                let shipCoordinates = this.getShipCoordinate(configShip.length);
                let ship = new Ship();

                for (let i = 0; i < shipCoordinates.length; i++) {
                    let chipPoint = shipCoordinates[i];
                    let shipPoint = new Point(chipPoint.x, chipPoint.y);

                    ship.points.push(shipPoint);
                }

                ships.push(ship)
                counter++;
            }
        });

        return ships;
    }

    getShipCoordinate(length) {
        let {x: startX, y: startY} = this.generateStartPoint(length);
        let startPoint = {x: startX, y: startY};
        let direction = this.getDirection(length, startPoint);

        let [endX, endY] = [startX, startY];
        let shipPoints = [];
        let areaAroundPoints = [];
        let lengthShip = length - 1;

        switch (direction) {
            case DIRECTION.up:
                endY = endY - lengthShip;

                for (let i = startY; i >= endY; i--) {
                    let point = {x: startX, y: i};

                    shipPoints.push(point)
                    getAreaAroundPoint(point).forEach(function (item) {
                        areaAroundPoints.push(item);
                    });
                }

                break;
            case DIRECTION.down:
                endY = endY + lengthShip;

                for (let i = startY; i <= endY; i++) {
                    let point = {x: startX, y: i};

                    shipPoints.push(point)
                    getAreaAroundPoint(point).forEach(function (item) {
                        areaAroundPoints.push(item);
                    });
                }

                break;
            case DIRECTION.left:
                endX = startX - lengthShip;

                for (let i = startX; i >= endX; i--) {
                    let point = {x: i, y: startY};

                    shipPoints.push(point)
                    getAreaAroundPoint(point).forEach(function (item) {
                        areaAroundPoints.push(item);
                    });
                }
                break;
            case DIRECTION.right:
                endX = startX + lengthShip;

                for (let i = startX; i <= endX; i++) {
                    let point = {x: i, y: startY};

                    shipPoints.push(point)
                    getAreaAroundPoint(point).forEach(function (item) {
                        areaAroundPoints.push(item);
                    });
                }
                break;
            default:
        }

        sortPoints(shipPoints);

        let reGetShipCoordinate = false;
        for (let i = 0; i < shipPoints.length; i++) {
            let shipPoint = shipPoints[i];
            let index = arrayFindIndexPoint(shipPoint, this.points);
            if (index !== -1) {
                continue;
            }

            reGetShipCoordinate = true;

            break;
        }

        if (reGetShipCoordinate) {
            shipPoints = this.getShipCoordinate(length)
        }

        for (let i = 0; i < shipPoints.length; i++) {
            let shipPoint = shipPoints[i];

            let index = arrayFindIndexPoint(shipPoint, this.points);
            this.points = arrayRemoveByIndex(index, this.points)
        }

        for (let i = 0; i < areaAroundPoints.length; i++) {
            let areaAroundPoint = areaAroundPoints[i];

            let index = arrayFindIndexPoint(areaAroundPoint, this.points);
            this.points = arrayRemoveByIndex(index, this.points)
        }

        return shipPoints;
    }

    generateStartPoint(length) {
        let randomNumber = arrayRandomNumber(this.generatePoints.length);
        let point = this.generatePoints[randomNumber];

        let possibleShips = getPossibleShipsByLength(point, length);
        let isPossibleShip = possibleShips.some(ship => {
            return ship.points.every((point) => {
                let index = arrayFindIndexPoint(point, this.points);

                return index !== -1;
            });
        });

        if (!isPossibleShip) {
            this.generatePoints = arrayRemoveByPoint(point, this.generatePoints);

            point = this.generateStartPoint(length)
        }

        return point;
    }

    getDirection(length, startPoint) {
        let {x: startX, y: startY} = startPoint;
        let variants = [...Object.values(DIRECTION)];
        length = length - 1;

        if (startX + length > 10 || startX === 10) {
            variants = arrayRemoveByValue(variants, DIRECTION.right)
        }

        if (startX - length < 1 || startY === 1) {
            variants = arrayRemoveByValue(variants, DIRECTION.left)
        }

        if (startY + length > 10 || startY === 10) {
            variants = arrayRemoveByValue(variants, DIRECTION.down)
        }

        if (startY - length < 1 || startY === 1) {
            variants = arrayRemoveByValue(variants, DIRECTION.up)
        }

        return arrayRandomItem(variants);
    }
}
