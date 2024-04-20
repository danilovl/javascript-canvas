import Particle from '../class/particle.js';
import ColorUtil from './color-util.js';

export default class ParticlesUtil {
    initParticles(count, radius, speed, innerWidth, innerHeight) {
        const particles = [];

        let id = 0;
        const colorUtil = new ColorUtil();

        while (id < count) {
            let particleRadius = Math.random() * 10 + radius;
            let x = Math.random() * (innerWidth - 2 * particleRadius) + particleRadius;
            let y = Math.random() * (innerHeight - 2 * particleRadius) + particleRadius;
            let color = colorUtil.generateRandomColor();

            if (id !== 0) {
                for (let j = 0; j < particles.length; j++) {
                    if (this.getDistance(x, y, particles[j].x, particles[j].y) - 2 * particleRadius < 0) {
                        x = Math.random() * (innerWidth - 2 * particleRadius) + particleRadius;
                        y = Math.random() * (innerHeight - 2 * particleRadius) + particleRadius;
                        j = -1;
                    }
                }
            }
            const particle = new Particle(id, x, y, particleRadius, color, speed);

            particles.push(particle);

            id++;
        }

        return particles
    }

    update(particles, particle, innerWidth, innerHeight) {
        for (let i = 0; i < particles.length; i++) {
            if (particle.id === particles[i].id) {
                continue;
            }

            const distance = this.getDistance(particle.x, particle.y, particles[i].x, particles[i].y);

            if (distance - particle.radius - particles[i].radius <= 0) {
                this.resolveCollision(particle, particles[i]);
            }
        }

        if (particle.x + particle.radius > innerWidth || particle.x - particle.radius <= 1) {
            particle.speed.x = -particle.speed.x;
        }

        if (particle.y + particle.radius > innerHeight || particle.y - particle.radius < 0) {
            particle.speed.y = -particle.speed.y;
        }

        particle.x += particle.speed.x;
        particle.y += particle.speed.y;
    }

    getDistance(x1, y1, x2, y2) {
        let x = Math.abs(x1 - x2);
        let y = Math.abs(y1 - y2);

        return Math.sqrt(x * x + y * y);
    }

    resolveCollision(particle1, particle2) {
        const u1 = {
            x: particle1.speed.x,
            y: particle1.speed.y
        };
        const u2 = {
            x: particle2.speed.x,
            y: particle2.speed.y
        };

        const v1 = {
            x: 0,
            y: 0
        };
        const v2 = {
            x: 0,
            y: 0
        };

        const m1 = particle1.mass;
        const m2 = particle2.mass;
        const xSpeedDiff = u1.x - u2.x;
        const ySpeedDiff = u1.y - u2.y;
        const xDist = particle2.x - particle1.x;
        const yDist = particle2.y - particle1.y;

        if (xSpeedDiff * xDist + ySpeedDiff * yDist >= 0) {
            v1.x = ((m1 - m2) * u1.x + 2 * m2 * u2.x) / (m1 + m2);
            v1.y = ((m1 - m2) * u1.y + 2 * m2 * u2.y) / (m1 + m2);
            v2.x = ((m2 - m1) * u2.x + 2 * m1 * u1.x) / (m1 + m2);
            v2.y = ((m2 - m1) * u2.y + 2 * m1 * u1.y) / (m1 + m2);

            particle1.speed = {
                x: v1.x,
                y: v1.y
            };
            particle2.speed = {
                x: v2.x,
                y: v2.y
            };
        }
    }
}
