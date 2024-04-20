import {COLOR, DIM} from '../constant/constant.js';
import Canvas from './canvas.js';
import Player from './player.js';
import Game from './game.js';
import ShipPositionMove from './ship-position-move.js';
import ShipGenerator from './ship-generator.js';
import {coordsToCell, getMousePos} from '../util/mouse.js';
import {drawPlayingField, highlightPlayingCell} from '../util/context.js';

export default class GameController {
    game = null;
    shipPositionMove = null;

    constructor(
        idCanvasOne,
        idCanvasOneCountShipInfo,
        idCanvasTwo,
        idCanvasTwoCountShipInfo,
        idGenerateShips,
    ) {
        this.playerOneCanvas = new Canvas(idCanvasOne);
        this.playerOneCountShipInfoCanvas = new Canvas(idCanvasOneCountShipInfo);
        this.playerTwoCanvas = new Canvas(idCanvasTwo);
        this.playerTwoCountShipInfoCanvas = new Canvas(idCanvasTwoCountShipInfo);
        this.generateShipsElement = document.getElementById(idGenerateShips);
    }

    init() {
        this.drawPlayingFields();
        this.initGenerateShipsButton();
        this.initPlayerTwoCanvasClick();
    }

    drawPlayingFields() {
        drawPlayingField(this.playerOneCanvas.context);
        drawPlayingField(this.playerTwoCanvas.context);
    }

    initGenerateShipsButton() {
        this.generateShipsElement.onclick = this.generateShips.bind(this);
    }

    initPlayerTwoCanvasClick() {
        this.playerTwoCanvas.canvas.onclick = this.clickPlayerTwoCanvas.bind(this);
    }

    clickPlayerTwoCanvas(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        if (this.game === null) {
            return;
        }

        if (this.game.isEnd) {
            alert('Game end')

            return;
        }

        this.shipPositionMove.destroy();

        const mousePos = getMousePos(this.playerTwoCanvas.canvas, evt);
        const point = coordsToCell(mousePos.x, mousePos.y);

        this.game.fire(point)
    }

    generateShips(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        this.playerOneCanvas.clear();
        this.playerTwoCanvas.clear();
        this.game = null;

        this.drawPlayingFields();

        const playerOneShips = (new ShipGenerator()).getShips();
        const playerTwoShips = (new ShipGenerator()).getShips();

        const playerOne = new Player(1, this.playerOneCanvas, this.playerOneCountShipInfoCanvas, playerOneShips);
        const playerTwo = new Player(2, this.playerTwoCanvas, this.playerTwoCountShipInfoCanvas, playerTwoShips);

        this.game = new Game(playerOne, playerTwo)

        for (let i = 0; i < playerOneShips.length; i++) {
            playerOneShips[i].points.forEach(chipPoint => {
                highlightPlayingCell(this.playerOneCanvas.context, chipPoint.x, chipPoint.y, COLOR.ship, DIM);
            });
        }

        this.shipPositionMove = new ShipPositionMove(this.game, this.playerOneCanvas, playerOne);
    }
}
