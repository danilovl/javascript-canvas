import CanvasUtil from '../util/canvas-util.js';
import ParticlesUtil from '../util/particles-util.js';
import ContextUtil from '../util/context-util.js';

export default class Draw {
    constructor(idCanvas, config) {
        this.canvasUtil = new CanvasUtil(idCanvas);
        this.config = config;
        this.particles = [];
    }

    start() {
        this.initEventListeners();
        this.onResize();
        this.startDrawing();
    }

    initEventListeners() {
        window.addEventListener('resize', this.onResize.bind(this));
     }

    onResize() {
        this.canvasUtil.canvas.setAttribute('width', window.innerWidth);
        this.canvasUtil.canvas.setAttribute('height', window.innerHeight);

        this.initParticles();
    }

    initParticles() {
        const count = this.config.PARTICLE.numParticles;
        const radius = this.config.PARTICLE.radius;
        const speed = this.config.PARTICLE.speed;

        this.particles = (new ParticlesUtil()).initParticles(
            count,
            radius,
            speed,
            this.canvasUtil.canvas.width,
            this.canvasUtil.canvas.height
        );
    }

    startDrawing() {
        window.requestAnimationFrame(this.startDrawing.bind(this));
        this.canvasUtil.clear();

        const context = this.canvasUtil.context;
        const contextUtil = new ContextUtil()
        const particlesUtil = new ParticlesUtil()

        for (let i = 0; i < this.particles.length; i++) {
            let particle = this.particles[i];

            contextUtil.drawParticle(context, particle);
            particlesUtil.update(
                this.particles,
                particle,
                this.canvasUtil.canvas.width,
                this.canvasUtil.canvas.height
            );
        }
    }
}
