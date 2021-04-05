export default class Square {
    constructor(vertices) {
        this.vertices = vertices;
    }

    getLeftTrianglePoints() {
        return [
            this.vertices[0],
            this.vertices[1],
            this.vertices[2]
        ]
    }

    getRightTrianglePoints() {
        return [
            this.vertices[3],
            this.vertices[1],
            this.vertices[2]
        ]
    }
}
