import CanvasUtil from '../util/canvas-util.js';
import Particle from './particle.js';
import Point from './point.js';
import {arrayRandomBetween} from '../util/array.js';
import {drawLineBetweenPoints, drawCirclePoint} from '../util/context.js';
import {getMousePos} from '../util/mouse.js';

export default class Draw {
    constructor(idCanvas, config) {
        this.canvasUtil = new CanvasUtil(idCanvas);
        this.config = config;
        this.particles = [];
        this.mousePos = {x: 0, y: 0};
    }

    start() {
        this.initEventListeners();
        this.onResize();
        this.startDrawing();
    }

    initEventListeners() {
        window.addEventListener('resize', this.onResize.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvasUtil.canvas.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    }

    onResize() {
        this.canvasUtil.canvas.setAttribute('width', window.innerWidth);
        this.canvasUtil.canvas.setAttribute('height', window.innerHeight);

        this.initParticles();
    }

    onMouseMove(evt) {
        this.mousePos = getMousePos(this.canvasUtil.canvas, evt);
    }

    onMouseLeave() {
        this.mousePos = null;
    }

    initParticles() {
        this.particles = [];

        let id = 0;
        const count = this.config.PARTICLE.numParticles;

        while (id < count) {
            const x = arrayRandomBetween(0, this.canvasUtil.canvas.width);
            const y = arrayRandomBetween(0, this.canvasUtil.canvas.height);
            const radius = arrayRandomBetween(this.config.CIRCLE_RADIUS.min, this.config.CIRCLE_RADIUS.max);

            const point = new Point(x, y, radius);
            const particle = new Particle(id, this.canvasUtil, point, this.config.PARTICLE.maxSpeed);

            this.particles.push(particle);

            id++;
        }
    }

    startDrawing() {
        window.requestAnimationFrame(this.startDrawing.bind(this));
        this.canvasUtil.clear();

        let id = 0;
        const distanceConfig = this.config.DISTANCE_COEFFICIENT;
        const increaseByRadius = distanceConfig.increaseByRadius;
        const increaseByRadiusLineWidth = distanceConfig.increaseByRadiusLineWidth;

        const count = this.config.PARTICLE.numParticles;
        const width = this.canvasUtil.canvas.width;

        while (id < count) {
            const particle = this.particles[id];
            particle.move();

            drawCirclePoint(this.canvasUtil.context, particle.point, this.config.COLOR.circle)

            if (this.mousePos !== null) {
                let distanceMouse = particle.distanceToPoint(this.mousePos);
                if (distanceMouse <= width * distanceConfig.toMouse) {
                    const lineWidth = this.config.PARTICLE.defaultLineWidth + (particle.point.radius * increaseByRadiusLineWidth);

                    drawLineBetweenPoints(
                        this.canvasUtil.context,
                        particle.point,
                        this.mousePos,
                        lineWidth,
                        this.config.COLOR.line
                    );
                }
            }

            for (let i = 0; i < count; i++) {
                const nearParticle = this.particles[i];
                const distance = nearParticle.distanceToPoint(particle.point);
                const distanceCoefficient = distanceConfig.toPoint + (particle.point.radius * increaseByRadius);

                if (particle.id !== nearParticle.id && distance <= width * distanceCoefficient) {
                    const lineWidth = this.config.PARTICLE.defaultLineWidth + (particle.point.radius * increaseByRadiusLineWidth);
                    drawLineBetweenPoints(
                        this.canvasUtil.context,
                        particle.point,
                        nearParticle.point,
                        lineWidth,
                        this.config.COLOR.line
                    );
                }
            }

            id++;
        }
    }
}
