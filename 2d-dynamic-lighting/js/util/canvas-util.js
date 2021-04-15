export default class CanvasUtil {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.canvas.setAttribute('width', window.innerWidth);
        this.canvas.setAttribute('height', window.innerHeight);
        this.context = this.canvas.getContext('2d');
        this.context.beginPath();
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
