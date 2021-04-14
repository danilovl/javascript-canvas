import Point from './point.js';
import Quadrangle from './quadrangle.js';

export default class Cube {
    constructor(x, y, z, side) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.side = side;
        this.quadrangles = [];

        this.generatePoints();
    }

    generatePoints() {
        let vertices = [
            new Point(this.x - this.side, this.y - this.side, this.z + this.side),
            new Point(this.x - this.side, this.y - this.side, this.z - this.side),
            new Point(this.x + this.side, this.y - this.side, this.z - this.side),
            new Point(this.x + this.side, this.y - this.side, this.z + this.side),
            new Point(this.x + this.side, this.y + this.side, this.z + this.side),
            new Point(this.x + this.side, this.y + this.side, this.z - this.side),
            new Point(this.x - this.side, this.y + this.side, this.z - this.side),
            new Point(this.x - this.side, this.y + this.side, this.z + this.side)
        ];

        let quadranglesPoints = [
            [vertices[0], vertices[1], vertices[2], vertices[3]],
            [vertices[3], vertices[2], vertices[5], vertices[4]],
            [vertices[4], vertices[5], vertices[6], vertices[7]],
            [vertices[7], vertices[6], vertices[1], vertices[0]],
            [vertices[7], vertices[0], vertices[3], vertices[4]],
            [vertices[1], vertices[6], vertices[5], vertices[2]]
        ];

        for (let i = 0; i < quadranglesPoints.length; i++) {
            let quadrangle = new Quadrangle(this.randomColor(), quadranglesPoints[i]);
            this.quadrangles.push(quadrangle);
        }
    }

    randomColor() {
        let r = Math.floor(Math.random() * 256);
        let g = Math.floor(Math.random() * 256);
        let b = Math.floor(Math.random() * 256);

        return `rgb(${r}, ${g}, ${b}, 1)`;
    }
}
