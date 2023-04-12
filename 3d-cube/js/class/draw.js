import CanvasUtil from '../util/canvas-util.js';
import Cube from '../model/cube.js';
import MouseMove from './mouse-move.js';
import {getMousePos} from '../util/mouse.js';
import {rotatePoint} from '../util/rotate.js';

export default class Draw {
    constructor(idCanvas) {
        this.canvasUtil = new CanvasUtil(idCanvas);
        this.cube = this.getNewCube()
        this.mouseMove = new MouseMove(this.canvasUtil);
        this.mousePos = {x: 0, y: 0};
        this.lastMousePos = {x: 0, y: 0};
    }

    getNewCube() {
        return new Cube(
            this.canvasUtil.canvas.width / 2,
            this.canvasUtil.canvas.height / 2,
            100,
            this.canvasUtil.canvas.height / 6
        );
    }

    start() {
        this.initEventListeners();
        this.startDrawing();
    }

    initEventListeners() {
        window.addEventListener('resize', this.onResize.bind(this));
        this.canvasUtil.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    onMouseMove(evt) {
        this.mousePos = getMousePos(this.canvasUtil.canvas, evt);
        this.rotateCube();

        this.lastMousePos.x = this.mousePos.x;
        this.lastMousePos.y = this.mousePos.y;

        this.startDrawing();
    }

    onResize() {
        this.canvasUtil.canvas.setAttribute('width', window.innerWidth);
        this.canvasUtil.canvas.setAttribute('height', window.innerHeight);

        this.initCube();
    }

    initCube() {
        this.cube = this.getNewCube();
    }

    startDrawing() {
        this.canvasUtil.clear();

        const context = this.canvasUtil.context;
        const quadrangles = this.cube.quadrangles;

        for (let i = 0; i < quadrangles.length; i++) {
            const quadrangle = quadrangles[i];
            const points = quadrangle.points;

            const startPoint = points[0];

            context.beginPath();
            context.moveTo(startPoint.x, startPoint.y);

            for (let j = 1; j < points.length; j++) {
                const nextPoint = points[j];
                context.lineTo(nextPoint.x, nextPoint.y);
            }

            context.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            context.fillStyle = quadrangle.color;
            context.closePath();
            context.stroke();
            context.fill();
        }
    }

    rotateCube() {
        if (!this.mouseMove.isMoving) {
            return;
        }

        const cube = this.cube;
        const theta = (this.lastMousePos.x - this.mousePos.x) * Math.PI / 720;
        const phi = (this.lastMousePos.y - this.mousePos.y) * Math.PI / 720;

        for (let j = 0; j < cube.quadrangles.length; j++) {
            const quadrangles = cube.quadrangles[j];
            const points = quadrangles.points;

            for (let k = 0; k < points.length; k++) {
                const point = points[k];
                rotatePoint(cube, point, theta, phi);
            }
        }

        cube.quadrangles.sort((a, b) => a.getCountVisiblePoint() - b.getCountVisiblePoint())
    }
}
