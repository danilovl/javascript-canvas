export default class Particle {
    constructor(id, x, y, radius, color, speed) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.speed = {
            x: (Math.random() - 0.5) * speed,
            y: (Math.random() - 0.5) * speed
        };
        this.radius = radius;
        this.color = color;
        this.mass = this.radius / 20;
        this.opacity = 0.1;
    }
}
