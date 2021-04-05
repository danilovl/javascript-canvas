import Canvas from './canvas.js';
import Square from './square.js';
import Point from './point.js';

export default class Draw {
    constructor(idCanvas, config) {
        this.canvas = new Canvas(idCanvas);
        this.config = config;
        this.squares = [];
        this.waveHeight = config.WAVE.waveHeight;
        this.squareWidth = config.WAVE.squareWidth;
        this.squareHeight = config.WAVE.squareHeight;
        this.speedOffsetX = config.WAVE.speedOffsetX;
        this.speedffsetY = config.WAVE.speedOffsetY;
        this.offsetX = 0;
        this.offsetY = 0;
        this.isRemoveInvisibleSquares = false;
        this.noise = perlin;

        this.initParameters();
    }

    start() {
        this.initEventListeners();
        this.initSquares()
        this.startDrawing();
    }

    initParameters() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.increaseCanvasWidth = this.canvas.width * 2.5;
        this.increaseCanvasHeight = this.canvas.height;

        this.cols = this.increaseCanvasWidth / this.squareWidth;
        this.rows = this.increaseCanvasHeight / this.squareHeight;

        this.gridWidth = this.increaseCanvasWidth / this.cols;
        this.gridHeight = this.increaseCanvasHeight / this.rows;

        this.increaseOffsetX = this.increaseCanvasWidth / 4;

        this.speedOffsetX = this.config.WAVE.speedOffsetX;
        this.speedffsetY = this.config.WAVE.speedOffsetY;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    initEventListeners() {
        window.addEventListener('resize', this.onResize.bind(this));
    }

    onResize() {
        this.canvas.canvas.setAttribute('width', window.innerWidth);
        this.canvas.canvas.setAttribute('height', window.innerHeight);

        this.initParameters();
        this.initSquares();
    }

    initSquares() {
        this.squares = [];
        let gridDepth = 1 / this.rows;

        for (let col = 0; col < this.cols; col++) {
            for (let row = this.rows; row > 0; row--) {
                let point;
                let points = [];

                point = new Point(
                    col * this.gridWidth - this.increaseOffsetX,
                    row * this.gridHeight,
                    row * gridDepth
                );
                points.push(point);

                point = new Point(
                    col * this.gridWidth - this.increaseOffsetX,
                    row * this.gridHeight + this.gridHeight,
                    row * gridDepth + gridDepth
                );
                points.push(point);

                point = new Point(
                    col * this.gridWidth + this.gridWidth - this.increaseOffsetX,
                    row * this.gridHeight,
                    row * gridDepth
                );
                points.push(point);

                point = new Point(
                    col * this.gridWidth + this.gridWidth - this.increaseOffsetX,
                    row * this.gridHeight + this.gridHeight,
                    row * gridDepth + gridDepth
                );
                points.push(point);

                let square = new Square(points);
                this.squares.push(square);
            }
        }
    }

    removeInvisibleTriangles(square) {
        let waveHeight = this.config.WAVE.waveHeight;
        let vertices = square.vertices;
        for (let i = 0; i < vertices.length; i++) {
            let point = vertices[i];
            if (point.x > -waveHeight && point.x < this.canvas.width + waveHeight && point.y > -waveHeight && point.y < this.canvas.height + waveHeight) {
                return false;
            }
        }

        return true;
    }

    addNoise(offsetX, offsetY) {
        for (let m = 0; m < this.squares.length; m++) {
            let vertices = this.squares[m].vertices;
            for (let p = 0; p < vertices.length; p++) {
                let noiseX = vertices[p].x / 200 + offsetX;
                let noiseY = vertices[p].y / 50 + offsetY;
                vertices[p].y = vertices[p].y + this.waveHeight * this.noise.get(noiseX, noiseY);
            }
        }
    }

    transformGrid() {
        let removeIndexes = [];

        for (let m = 0; m < this.squares.length; m++) {
            let vertices = this.squares[m].vertices;
            for (let p = 0; p < vertices.length; p++) {
                let point = vertices[p];
                point.resetToOrigin();

                let scaleX = 4 * point.z;
                let scaleY = 0.5 * point.z;

                point.x = (point.x * scaleX) + this.increaseCanvasWidth / 4;
                point.y = (point.y * scaleY) + this.increaseCanvasHeight / 1.5;
            }

            if (!this.isRemoveInvisibleSquares) {
                if (this.removeInvisibleTriangles(this.squares[m])) {
                    removeIndexes.push(m)
                }
            }
        }

        if (!this.isRemoveInvisibleSquares) {
            removeIndexes.sort((a, b) => b - a);
            removeIndexes.forEach((index) => this.squares.splice(index, 1));
        }

        this.isRemoveInvisibleSquares = true;
    }

    startDrawing() {
        window.requestAnimationFrame(this.startDrawing.bind(this));

        this.canvas.clear();

        this.offsetX += this.speedOffsetX;
        this.offsetY -= this.speedffsetY;

        this.transformGrid();
        this.addNoise(this.offsetX, this.offsetY);

        let context = this.canvas.context;
        context.strokeStyle = this.config.COLOR.waveStroke;

        for (let i = 0; i < this.squares.length; i++) {
            let left = this.squares[i].getLeftTrianglePoints();

            context.beginPath();
            context.fillStyle = this.config.COLOR.wave;
            context.moveTo(left[0].x, left[0].y);

            for (let p = 0; p < left.length; p++) {
                context.lineTo(left[p].x, left[p].y);
            }

            context.closePath();
            context.stroke();
            context.fill();

            let right = this.squares[i].getRightTrianglePoints();

            context.beginPath();
            context.moveTo(right[0].x, right[0].y);

            for (let p = 0; p < right.length; p++) {
                context.lineTo(right[p].x, right[p].y);
            }

            context.closePath();
            context.stroke();
            context.fill();
        }
    }
}
