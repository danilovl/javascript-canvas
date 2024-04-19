import Canvas from './canvas.js';
import {drawPlayingField} from '../util/context.js';
import SnakeController from './snake-controller.js';
import {COLOR, DIM, DEFAULT_SNAKE, DEFAULT_START_POINT, WIDTH, HEIGHT, DEFAULT_SPEED} from '../constant/constant.js';

export default class GameController {
    game;

    constructor(idCanvas, idResult, idRestart) {
        this.canvas = new Canvas(idCanvas);
        this.resultCounter = document.getElementById(idResult);
        this.restartButton = document.getElementById(idRestart);

        this.initNewSnakeController();
    }

    init() {
        this.initEventListeners();
        drawPlayingField(this.canvas.context);

        this.snakeController.drawSnake(this.canvas.context);
        this.snakeController.drawCatchPoint(this.canvas.context);

        this.start();
    }

    initEventListeners() {
        window.addEventListener('keydown', (event) => {
            this.snakeController.changeDirection(event);
        });

        this.restartButton.addEventListener('click', () => {
            this.restart();
        });
    }

    start() {
        this.game = setInterval(() => {
            this.canvas.clear();

            drawPlayingField(this.canvas.context);

            this.snakeController.move();
            this.snakeController.generateCatchPoint();

            this.snakeController.drawSnake(this.canvas.context);
            this.snakeController.drawCatchPoint(this.canvas.context);

            this.snakeController.checkGameOver();

            this.resultCounter.innerText = this.snakeController.result;

            if (this.snakeController.isGameOver) {
                clearInterval(this.game);
                this.restartButton.classList.remove('none');
            }
        }, DEFAULT_SPEED)
    }

    restart() {
        this.restartButton.classList.add('none');
        clearInterval(this.game);

        this.initNewSnakeController();

        this.start();
    }

    initNewSnakeController() {
        this.snakeController = new SnakeController(
            [...DEFAULT_SNAKE],
            COLOR.snake,
            Object.assign({}, DEFAULT_START_POINT),
            COLOR.target,
            DIM,
            WIDTH,
            HEIGHT
        );
    }
}
