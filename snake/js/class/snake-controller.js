import {highlightPlayingCell} from '../util/context.js';
import {DIRECTION, DIRECTION_OPPOSITE, DIRECTIONS} from '../constant/constant.js';
import {arrayRandomNumber, isPointInSnake} from '../util/array.js';

export default class SnakeController {
    constructor(snake, snakeColor, target, targetColor, dim, width, height) {
        this.snake = snake;
        this.snakeColor = snakeColor;
        this.target = target;
        this.targetColor = targetColor;
        this.dim = dim;
        this.width = width;
        this.height = height;
        this.direction = DIRECTION.ArrowRight;
        this.isCatched = false;
        this.isGameOver = false;
        this.result = 0;
    }

    drawSnake(context) {
        this.snake.forEach(point => {
            highlightPlayingCell(context, point.x, point.y, this.snakeColor, this.dim);
        })
    }

    drawCatchPoint(context) {
        highlightPlayingCell(context, this.target.x, this.target.y, this.targetColor, this.dim);
    }

    generateCatchPoint() {
        if (!this.isCatched) {
            return;
        }

        let x = 0;
        let y = 0;

        let generate = true;
        while (generate) {
            x = arrayRandomNumber(this.width);
            y = arrayRandomNumber(this.height);

            if (!isPointInSnake(this.snake, {x: x, y: y})) {
                generate = false;
            }
        }

        this.target.x = x;
        this.target.y = y;

        this.isCatched = false;
    }

    changeDirection(event) {
        const keyName = event.key;

        if (!DIRECTIONS.includes(keyName)) {
            return;
        }

        const opposite = DIRECTION_OPPOSITE[this.direction];
        if (opposite === keyName) {
            return;
        }

        this.direction = keyName;
    }

    move() {
        let first = this.snake[this.snake.length - 1];

        switch (this.direction) {
            case DIRECTION.ArrowUp:
                first = {
                    x: first.x, y: first.y - 1
                };

                this.snake.push(first)

                break;
            case DIRECTION.ArrowDown:
                first = {
                    x: first.x, y: first.y + 1
                };

                this.snake.push(first)

                break;

            case DIRECTION.ArrowLeft:
                first = {
                    x: first.x - 1, y: first.y
                };

                this.snake.push(first)

                break;

            case DIRECTION.ArrowRight:
                first = {
                    x: first.x + 1, y: first.y
                };

                this.snake.push(first)

                break;
            default:
        }

        if (first.x === this.target.x && first.y === this.target.y) {
            this.isCatched = true;
            this.result++;

            return;
        }

        this.snake.shift();
    }

    checkGameOver() {
        const first = this.snake[this.snake.length - 1];
        const snake = this.snake.slice(0, this.snake.length - 1);

        if (isPointInSnake(snake, first)) {
            this.isGameOver = true;

            return;
        }

        if (first.x < 0 || first.x > this.width - 1 || first.y < 0 || first.y > this.height - 1) {
            this.isGameOver = true;
        }
    }
}
