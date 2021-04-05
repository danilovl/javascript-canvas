export default class Point {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.originX = this.x;
        this.originY = this.y;
        this.originZ = this.z;
    }

    resetToOrigin() {
        this.x = this.originX;
        this.y = this.originY;
        this.z = this.originZ;
    }
}
