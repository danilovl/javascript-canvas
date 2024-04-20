export default class ContextUtil {
    drawParticle(context, particle) {
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, 0);
        context.strokeStyle = particle.color;
        context.stroke();
        context.fillStyle = particle.color;
        context.save();
        context.globalAlpha = particle.opacity;
        context.fill();
        context.restore();
        context.closePath();
    }
}
