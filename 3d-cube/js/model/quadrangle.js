export default class Quadrangle {
    constructor(color, points) {
        this.color = color;
        this.points = points || [];
    }

    getCountVisiblePoint() {
        return this.points.filter((point) => point.visible).length;
    }
}
