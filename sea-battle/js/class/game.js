import Bot from './bot.js';
import {COLOR, DIM, SHIPS} from '../constant/constant.js';
import {drawBorder, drawBorderPlayingField, highlightRect} from '../util/context.js';

export default class Game {
    constructor(playerOne, playerTwo) {
        this.inProgress = false;
        this.isEnd = false;
        this.winnerPlayer = null;
        this.movePlayer = playerOne;
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        this.bot = new Bot(playerOne);
        this.startFireInterval = null;

        this.drawPlayersCountShipInfo();
        this.drawActiveBorder();
    }

    fire(point) {
        this.inProgress = true;

        if (this.movePlayer.id !== this.playerOne.id) {
            return;
        }

        let isPointAlreadyHit = this.playerTwo.isPointAlreadyHit(point);
        if (isPointAlreadyHit === true) {
            return;
        }

        this.playerTwo.fire(point);
        if (this.playerTwo.isLastHitSucces === false) {
            this.movePlayer = this.playerTwo;

            this.drawActiveBorder();
            this.startBackFire();
        }

        if (this.playerTwo.isHasAliveShip() === false) {
            this.isEnd = true;
            this.winnerPlayer = this.playerOne;
            this.drawWinnerBorder();
        }

        this.drawPlayersCountShipInfo();
    }

    startBackFire() {
        this.startFireInterval = setInterval(() => this.botFire(), 1000)
    }

    botFire() {
        if (!this.bot.fire()) {
            this.movePlayer = this.playerOne;
            clearInterval(this.startFireInterval);
        }

        if (!this.playerOne.isHasAliveShip()) {
            this.isEnd = true;
            this.winnerPlayer = this.playerTwo;
            clearInterval(this.startFireInterval)

            this.drawPlayersCountShipInfo();
            this.drawWinnerBorder();

            return;
        }

        this.drawPlayersCountShipInfo();
        this.drawActiveBorder();
    }

    drawActiveBorder() {
        let active = this.movePlayer.id === this.playerOne.id ? this.playerTwo : this.playerOne;
        let notActive = this.movePlayer.id === this.playerOne.id ? this.playerOne : this.playerTwo;

        drawBorderPlayingField(active.canvas.context, DIM, COLOR.activeBorderCanvas)
        drawBorderPlayingField(notActive.canvas.context, DIM, COLOR.borderCanvas)
    }

    drawWinnerBorder() {
        if (this.winnerPlayer === null) {
            return;
        }

        let winner = this.winnerPlayer.id === this.playerOne.id ? this.playerOne : this.playerTwo;
        let loser = this.winnerPlayer.id === this.playerOne.id ? this.playerOne : this.playerTwo;

        drawBorderPlayingField(winner.canvas.context, DIM, COLOR.winner)
        drawBorderPlayingField(loser.canvas.context, DIM, COLOR.loser)
    }

    drawPlayersCountShipInfo() {
        this.drawPlayerCountShipInfo(this.playerOne)
        this.drawPlayerCountShipInfo(this.playerTwo)
    }

    drawPlayerCountShipInfo(player) {
        player.canvasShips.clear();
        this.drawPlayerCountShipInfoCell(player);

        let dim = 30;
        let y = 1;
        player.infoDataShips.forEach(configShip => {
            let counter = 0;

            while (counter < configShip.count) {
                for (let x = 0; x < configShip.length; x++) {
                    highlightRect(
                        player.canvasShips.context,
                        x * dim + 10,
                        y * dim + 15,
                        dim - 2,
                        dim - 2,
                        COLOR.infoShip
                    );
                }

                counter++;
                y++;
            }
        });
    }

    drawPlayerCountShipInfoCell(player) {
        drawBorder(
            player.canvasShips.context,
            5,
            DIM,
            player.canvasShips.canvas.width - 10,
            player.canvasShips.canvas.height - (DIM + 10),
            COLOR.borderCanvas
        );
    }
}
