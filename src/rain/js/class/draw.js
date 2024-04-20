import CanvasUtil from '../util/canvas-util.js';
import Drop from './drop.js';

export default class Draw {
    constructor(idCanvas, config) {
        this.canvasUtil = new CanvasUtil(idCanvas);
        this.config = config;
        this.drops = [];
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

        this.initBlocks();
    }

    initBlocks() {
        this.drops = [];

        let id = 0;
        let init = [];

        while (id < this.config.NUM_DROP) {
            const drop = new Drop(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight,
                Math.random(),
                Math.random() - 4 + 3,
                Math.random() * 10 + 4
            )

            init.push(drop)

            id++;
        }

        for (let b = 0; b < this.config.NUM_DROP; b++) {
            this.drops[b] = init[b];
        }
    }

    drawBlocksFillRect() {
        for (let c = 0; c < this.drops.length; c++) {
            const drop = this.drops[c];

            this.drawDrop(drop);
        }
    }

    drawDrop(drop) {
        const context = this.canvasUtil.context;

        context.beginPath();
        context.moveTo(drop.x, drop.y);
        context.lineTo(drop.x + drop.l * drop.xs, drop.y + drop.l * drop.ys);

        context.strokeStyle = 'rgba(172,185,209,0.5)';
        context.lineWidth = 1;
        context.lineCap = 'round';

        context.stroke();
    }

    startDrawing() {
        window.requestAnimationFrame(this.startDrawing.bind(this));
        this.canvasUtil.clear();

        this.drawBlocksFillRect()
        this.move()
    }

    move() {
        for (let b = 0; b < this.drops.length; b++) {
            let drop = this.drops[b];
            drop.y += drop.xs;
            drop.y += drop.ys;
            if (drop.x > window.innerWidth || drop.y > window.innerHeight) {
                drop.x = Math.random() * window.innerWidth;
                drop.y = -20;
            }
        }
    }
}
