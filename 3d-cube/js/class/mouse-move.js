export default class MouseMove {
    constructor(canvasUtil) {
        this.canvasUtil = canvasUtil;
        this.isMouseDown = false;
        this.isMoving = false;

        this.initEventListeners();
    }

    initEventListeners() {
        this.canvasUtil.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvasUtil.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvasUtil.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    onMouseDown(e) {
        e.preventDefault();
        e.stopPropagation();

        this.isMouseDown = true;
    }

    onMouseUp(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        this.isMouseDown = false;
        this.isMoving = false;
    }

    onMouseMove(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        if (!this.isMouseDown) {
            return;
        }

        this.isMoving = true;
    }
}
