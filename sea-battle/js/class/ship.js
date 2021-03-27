import {POSITION} from '../constant/constant.js';

export default class Ship {
    constructor(points) {
        this.points = points || [];
    }

    hasPoint(targetPoint) {
        for (let i = 0; i < this.points.length; i++) {
            let point = this.points[i];
            if (point.isEqual(targetPoint)) {
                return true;
            }
        }

        return false;
    }

    isAlive() {
        return this.points.some(point => !point.isHit)
    }

    getPositionName() {
        let isVertical = this.points.every((item) => item.x === this.points[0].x);
        let isHorizontal = this.points.every((item) => item.y === this.points[0].y);

        if (isVertical && isHorizontal) {
            return POSITION.both;
        }

        return isVertical ? POSITION.vertical : POSITION.horizontal;
    }

    fire(targetPoint) {
        if (!this.isAlive()) {
            return false;
        }

        for (let i = 0; i < this.points.length; i++) {
            let point = this.points[i];
            if (point.isHit) {
                continue;
            }

            if (point.fire(targetPoint)) {
                return true;
            }
        }

        return false;
    }

    clone() {
        let ship = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        ship.points = this.points.map(point => point.clone());

        return ship;
    }
}
