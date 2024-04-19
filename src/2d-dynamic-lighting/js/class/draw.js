import CanvasUtil from '../util/canvas-util.js';
import Block from './block.js';
import Point from './point.js';
import Ray from './ray.js';
import {arrayRandomBetween} from '../util/array.js';
import {getMousePos} from '../util/mouse.js';
import {rayPoints, radianPoints} from '../util/point.js';
import {isIntersectionBlocks, getRayAreaBlock} from '../util/block.js';

export default class Draw {
    constructor(idCanvas, config) {
        this.canvasUtil = new CanvasUtil(idCanvas);
        this.config = config;
        this.blocks = [];
        this.mousePos = {x: 500, y: 500};
    }

    start() {
        this.initEventListeners();
        this.onResize();
        this.startDrawing();
    }

    initEventListeners() {
        window.addEventListener('resize', this.onResize.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    onResize() {
        this.canvasUtil.canvas.setAttribute('width', window.innerWidth);
        this.canvasUtil.canvas.setAttribute('height', window.innerHeight);

        this.initBlocks();
    }

    onMouseMove(evt) {
        this.mousePos = getMousePos(this.canvasUtil.canvas, evt);
        this.startDrawing();
    }

    initBlocks() {
        this.blocks = [];

        let id = 0;
        let count = this.config.BLOCK.numBlocks;

        while (id < count) {
            const x = arrayRandomBetween(0, this.canvasUtil.canvas.width);
            const y = arrayRandomBetween(0, this.canvasUtil.canvas.height);
            const width = arrayRandomBetween(this.config.BLOCK.minWidth, this.config.BLOCK.maxWidth);
            const height = arrayRandomBetween(this.config.BLOCK.minHeight, this.config.BLOCK.maxHeight);

            const point = new Point(x, y);
            const block = new Block(id, point, width, height);

            this.blocks.push(block);

            id++;
        }
    }

    resetBlocks() {
        for (let i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i];
            block.visible = false;
        }
    }

    drawBlocksRect(block) {
        const context = this.canvasUtil.context;

        context.beginPath();
        context.strokeStyle = this.config.COLOR.blockNotVisible;
        context.lineWidth = 1;
        context.rect(block.point.x, block.point.y, block.width, block.height);
        context.stroke();
    }

    drawBlocksFillRect() {
        const context = this.canvasUtil.context;

        for (let i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i];

            context.beginPath();
            context.lineWidth = 1;
            context.fillStyle = block.visible ? this.config.COLOR.blockVisible : this.config.COLOR.blockNotVisible;
            context.fillRect(block.point.x, block.point.y, block.width, block.height);
            context.stroke();
        }
    }

    startDrawing() {
        this.canvasUtil.clear();
        this.resetBlocks();

        const context = this.canvasUtil.context;
        const colorConfig = this.config.COLOR;
        const radius = this.config.RAY.width;

        context.fillStyle = "#000000";
        context.fillRect(0, 0, this.canvasUtil.width, this.canvasUtil.height);

        const angle = 180;
        let curAngle = angle - 360 / 2;
        const addTo = 1 / radius;
        for (curAngle; curAngle < angle + curAngle / 2; curAngle += addTo * (180 / Math.PI) * 2) {
            const rayEndPoint = new Point(null, null);
            const ray = new Ray(this.mousePos, rayEndPoint, curAngle, radius);

            this.calculateRayPoint(ray);

            context.beginPath();
            context.moveTo(ray.startPoint.x, ray.startPoint.y);
            context.lineTo(ray.endPoint.x, ray.endPoint.y);
            context.strokeStyle = colorConfig.ray;
            context.lineWidth = 0.1;
            context.closePath();
            context.stroke();
        }

        this.drawBlocksFillRect();
    }

    calculateRayPoint(ray) {
        const context = this.canvasUtil.context;

        const rayStartX = ray.startPoint.x;
        const rayStartY = ray.startPoint.y;
        const radian = ray.radian;
        const radius = ray.width;

        let rayEndX = rayStartX + ray.width * Math.cos(radian);
        let rayEndY = rayStartY + ray.width * Math.sin(radian);
        ray.endPoint.x = rayEndX;
        ray.endPoint.y = rayEndY;

        const rayAreaBlock = getRayAreaBlock(ray);
        const intersectBlocks = [];
        for (let i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i];

            if (isIntersectionBlocks(rayAreaBlock, block)) {
                intersectBlocks.push(block);
            }
        }

        if (intersectBlocks.length === 0) {
            return;
        }

        const rayLinePoints = rayPoints(ray).reverse();

        const visibleBlocks = [];
        let isStartPointInsideBlock = false;
        let distanceToClosestIntersectionBlock = 0;

        for (let i = 0; i < intersectBlocks.length; i++) {
            let block = intersectBlocks[i];
            this.drawBlocksRect(block);

            let isPointInsideBlock = false;
            for (let i = 0; i < rayLinePoints.length; i++) {
                let point = rayLinePoints[i];
                if (context.isPointInPath(point.x, point.y)) {
                    isPointInsideBlock = true;
                } else if (isPointInsideBlock) {
                    rayEndX = point.x;
                    rayEndY = point.y;
                    visibleBlocks.push(block)

                    break;
                }
            }

            if (context.isPointInPath(rayStartX, rayStartY)) {
                ray.endPoint.x = rayStartX;
                ray.endPoint.y = rayStartY;

                isStartPointInsideBlock = true;

                break;
            }

            if (isPointInsideBlock) {
                let blockRayTouchX = rayEndX - rayStartX;
                let blockRayTouchY = rayEndY - rayStartY;
                let distance = radius - Math.sqrt(blockRayTouchX ** 2 + blockRayTouchY ** 2);

                if (distance >= block.width / 3) {
                    distance = block.width / 2;
                }

                distanceToClosestIntersectionBlock = distance;

                const newRayEndX = rayEndX + Math.cos(radian) * distance;
                const newRayEndY = rayEndY + Math.sin(radian) * distance;

                const rayLineBeforeBlockTouchPoints = radianPoints({x: rayEndX, y: rayEndY}, radian, distance);
                let latsPointInsideBlock = null;

                for (let i = 0; i < rayLineBeforeBlockTouchPoints.length; i++) {
                    const point = rayLineBeforeBlockTouchPoints[i];
                    if (context.isPointInPath(point.x, point.y)) {
                        latsPointInsideBlock = point;
                    } else if (latsPointInsideBlock !== null) {
                        rayEndX = latsPointInsideBlock.x;
                        rayEndY = latsPointInsideBlock.y;
                        latsPointInsideBlock = null;

                        break;
                    }
                }

                if (latsPointInsideBlock !== null) {
                    rayEndX = newRayEndX;
                    rayEndY = newRayEndY;
                }
            }

            const actualRayEndX = ray.endPoint.x;
            const actualRayEndY = ray.endPoint.y;
            let actualDistanceTouchBlock;
            let newDistanceTouchBlock;

            if (rayStartX > actualRayEndX) {
                actualDistanceTouchBlock = Math.sqrt((rayStartX - actualRayEndX) ** 2 + (rayStartY - actualRayEndY) ** 2);
                newDistanceTouchBlock = Math.sqrt((rayStartX - rayEndX) ** 2 + (rayStartY - rayEndY) ** 2);
            } else {
                actualDistanceTouchBlock = Math.sqrt((actualRayEndX - rayStartX) ** 2 + (actualRayEndY - rayStartY) ** 2);
                newDistanceTouchBlock = Math.sqrt((rayEndX - rayStartX) ** 2 + (rayEndY - rayStartY) ** 2);
            }

            if (actualRayEndX !== null && actualRayEndY !== null) {
                if (newDistanceTouchBlock < actualDistanceTouchBlock) {
                    ray.endPoint.x = rayEndX;
                    ray.endPoint.y = rayEndY;
                }

                if (newDistanceTouchBlock < distanceToClosestIntersectionBlock) {
                    distanceToClosestIntersectionBlock = newDistanceTouchBlock;
                }
            } else {
                ray.endPoint.x = rayEndX;
                ray.endPoint.y = rayEndY;
            }
        }

        if (isStartPointInsideBlock) {
            this.blocks.forEach(function (block) {
                block.visible = false;
            });

            return;
        }

        visibleBlocks.forEach((block) => {
            this.drawBlocksRect(block);
            if (context.isPointInPath(ray.endPoint.x, ray.endPoint.y)) {
                block.visible = true;
            }
        })
    }
}
