import Point from '../class/point.js';
import Block from '../class/block.js';

export function getRayAreaBlock(ray) {
    const angle = ray.angle;
    const startX = ray.startPoint.x;
    const startY = ray.startPoint.y;
    const radius = ray.width;
    let startPoint = null;

    if (angle >= 0 && angle < 90) {
        startPoint = new Point(startX, startY);
    }

    if (angle >= 90 && angle < 180) {
        startPoint = new Point(startX - radius, startY);
    }

    if (angle >= 180 && angle < 270) {
        startPoint = new Point(startX - radius, startY - radius);
    }

    if (angle >= 270 && angle < 360) {
        startPoint = new Point(startX, startY - radius);
    }

    return new Block(null, startPoint, radius, radius);
}

export function isIntersectionBlocks(blockA, blockB) {
    const ax = blockA.point.x;
    const ax2 = blockA.point.x + blockA.width;
    const ay = blockA.point.y;
    const ay2 = blockA.point.y + blockA.height;

    const bx = blockB.point.x;
    const bx2 = blockB.point.x + blockB.width;
    const by = blockB.point.y;
    const by2 = blockB.point.y + blockB.height;

    const intersectTop = Math.max(ay, by);
    const intersectRight = Math.min(ax2, bx2);
    const intersectBottom = Math.min(ay2, by2);
    const intersectLeft = Math.max(ax, bx);

    const intersectWidth = intersectRight - intersectLeft;
    const intersectHeight = intersectBottom - intersectTop;

    return intersectWidth > 0 && intersectHeight > 0;
}
