import Point from '../class/point.js';
import Block from '../class/block.js';

export function getRayAreaBlock(ray) {
    let angle = ray.angle;
    let startX = ray.startPoint.x;
    let startY = ray.startPoint.y;
    let radius = ray.width;
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
    let ax = blockA.point.x;
    let ax2 = blockA.point.x + blockA.width;
    let ay = blockA.point.y;
    let ay2 = blockA.point.y + blockA.height;

    let bx = blockB.point.x;
    let bx2 = blockB.point.x + blockB.width;
    let by = blockB.point.y;
    let by2 = blockB.point.y + blockB.height;

    let intersectTop = Math.max(ay, by);
    let intersectRight = Math.min(ax2, bx2);
    let intersectBottom = Math.min(ay2, by2);
    let intersectLeft = Math.max(ax, bx);

    let intersectWidth = intersectRight - intersectLeft;
    let intersectHeight = intersectBottom - intersectTop;

    return intersectWidth > 0 && intersectHeight > 0;
}
