export default class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isHit = false;
    }

    isEqual(point) {
        return this.x === point.x && this.y === point.y;
    }

    fire(point) {
        if (this.isEqual(point)) {
            this.isHit = true;

            return true;
        }

        return false;
    }

    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
}
