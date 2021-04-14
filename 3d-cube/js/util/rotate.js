export function rotatePoint(cube, point, theta, phi) {
    rotatePointX(cube, point, phi);
    rotatePointY(cube, point, -theta);

    point.visible = point.z > 0;
}

function rotatePointX(cube, point, radian) {
    let cos = Math.cos(radian);
    let sin = Math.sin(radian);

    let y = (point.y - cube.y) * cos - (point.z - cube.z) * sin;
    let z = (point.y - cube.y) * sin + (point.z - cube.z) * cos;

    point.y = y + cube.y;
    point.z = z + cube.z;
}

function rotatePointY(cube, point, radian) {
    let cos = Math.cos(radian);
    let sin = Math.sin(radian);

    let x = (point.z - cube.z) * sin + (point.x - cube.x) * cos;
    let z = (point.z - cube.z) * cos - (point.x - cube.x) * sin;

    point.x = x + cube.x;
    point.z = z + cube.z;
}
