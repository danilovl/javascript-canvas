import {COLOR, DIM, SHIPS} from '../constant/constant.js';
import {arrayFindIndexPoint, arrayRemoveByIndex} from '../util/array.js';
import {highlightPlayingCell} from '../util/context.js';
import {getAreaAroundPoint, generateMatrixPoint} from '../util/point.js';

export default class Player {
    constructor(id, canvas, canvasShips, ships) {
        this.id = id;
        this.canvasShips = canvasShips;
        this.canvas = canvas;
        this.ships = ships;
        this.points = generateMatrixPoint();
        this.isLastlShipAlive = true;
        this.isLastHitSucces = false;
        this.infoDataShips = JSON.parse(JSON.stringify(SHIPS));
    }

    getAliveShip() {
        return this.ships.filter(ship => ship.isAlive() === true);
    }

    isHasAliveShip() {
        return this.ships.some(ship => ship.isAlive() === true);
    }

    fire(point) {
        if (this.isPointAlreadyHit(point)) {
            return;
        }

        this.tryHitShip(point);
    }

    removePoint(point) {
        if (this.isPointAlreadyHit(point) === true) {
            return;
        }

        const index = arrayFindIndexPoint(point, this.points);
        this.points = arrayRemoveByIndex(index, this.points)
    }

    isPointAlreadyHit(point) {
        const index = arrayFindIndexPoint(point, this.points);

        return index === -1;
    }

    tryHitShip(point) {
        const aliveShips = this.getAliveShip();
        let isSuccessFire = false;
        let shipHit = null;

        for (let i = 0; i < aliveShips.length; i++) {
            if (this.isPointAlreadyHit(point)) {
                break;
            }

            const ship = aliveShips[i];
            isSuccessFire = ship.fire(point);

            if (!isSuccessFire) {
                continue;
            }

            shipHit = ship;

            highlightPlayingCell(this.canvas.context, point.x, point.y, COLOR.hit, DIM);
            this.removePoint(point);

            if (ship.isAlive()) {
                break;
            }

            this.reduceAliveShips(ship);

            for (let p = 0; p < ship.points.length; p++) {
                const shipPoint = ship.points[p];

                const that = this;
                const getAreaAroundPoints = getAreaAroundPoint(shipPoint, ship.points);

                getAreaAroundPoints.forEach(point => {
                    highlightPlayingCell(that.canvas.context, point.x, point.y, COLOR.miss, DIM);
                    that.removePoint(point);
                });
            }

            break;
        }

        this.isLastlShipAlive = shipHit !== null && shipHit.isAlive();

        if (isSuccessFire) {
            this.isLastHitSucces = true;

            return;
        }

        highlightPlayingCell(this.canvas.context, point.x, point.y, COLOR.miss, DIM);
        this.removePoint(point);

        this.isLastHitSucces = false;
    }

    getAllShipPoints() {
        const points = []
        this.ships.forEach(ship => {
            points.push(...ship.points);
        })

        return points;
    }

    reduceAliveShips(ship) {
        const index = this.infoDataShips.findIndex(item => item.length === ship.points.length);
        let count = this.infoDataShips[index].count;

        this.infoDataShips[index].count = --count;
    }
}
