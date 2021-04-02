export default class Ray {
    constructor(startPoint, endPoint, angle, width) {
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.angle = angle;
        this.width = width;
        this.radian = angle * (Math.PI / 180);
    }
}
