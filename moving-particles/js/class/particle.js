import {arrayRandomBetween} from '../util/array.js';
import {isFloat} from '../util/number.js';
import Point from './point.js';

export default class Particle {
    constructor(id, canvas, point, speed) {
        this.id = id;
        this.canvas = canvas;
        this.point = point;
        this.directionPoint = this.getDirectionPoint(speed);
    }

    getDirectionPoint(speed) {
        let directionX = arrayRandomBetween(-speed, speed);
        let directionY = arrayRandomBetween(-speed, speed);

        if (isFloat(speed)) {
            directionX = parseFloat(directionX.toFixed(2));
            directionY = parseFloat(directionY.toFixed(2));
        }

        let point = new Point(directionX, directionY)

        if (point.x === 0 && point.y === 0) {
            point = this.getDirectionPoint(speed);
        }

        return point;
    }

    move() {
        this.point.x += this.directionPoint.x;
        this.point.y += this.directionPoint.y;

        this.point.x = Math.round(this.point.x);
        this.point.y = Math.round(this.point.y);

        if (this.point.x <= 0 || this.point.x >= this.canvas.canvas.width) {
            this.directionPoint.x = -this.directionPoint.x;
        }

        if (this.point.y <= 0 || this.point.y >= this.canvas.canvas.height) {
            this.directionPoint.y = -this.directionPoint.y;
        }
    }

    distanceToPoint(point) {
        let dx = point.x - this.point.x;
        dx = Math.pow(dx, 2);

        let dy = point.y - this.point.y;
        dy = Math.pow(dy, 2);

        return Math.sqrt(dx + dy);
    }
}
