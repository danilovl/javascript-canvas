import {coordsToCell, getMousePos} from '../util/mouse.js';
import {arrayFindIndexPointShips, isPointIntersects, filterExceptPoints} from '../util/array.js';
import {moveShipPoints, getAreaAroundShipPoint, isPointOutside, flipShipPoints} from '../util/point.js';
import {highlightPlayingCell, drawPlayingField} from '../util/context.js';
import {COLOR, DIM} from '../constant/constant.js';

export default class ShipPositionMove {
    constructor(game, playerCanvas, player) {
        this.isDestroyed = false;
        this.playerCanvas = playerCanvas;
        this.player = player;
        this.canDrag = false;
        this.mouseDownPoint = null;
        this.indexDragShip = null;

        this.init();
    }

    init() {
        this.playerCanvas.canvas.onmousedown = this.onMouseDown.bind(this);
        this.playerCanvas.canvas.onmouseup = this.onMouseUp.bind(this);
        this.playerCanvas.canvas.onmousemove = this.onMouseMove.bind(this);
        this.playerCanvas.canvas.ondblclick = this.onMouseDblClick.bind(this);
    }

    destroy() {
        if (this.isDestroyed) {
            return;
        }

        this.playerCanvas.canvas.onmousedown = null;
        this.playerCanvas.canvas.onmouseup = null;
        this.playerCanvas.canvas.onmousemove = null;
        this.playerCanvas.canvas.ondblclick = null;

        this.isDestroyed = true;
    }

    onMouseDown(e) {
        e.preventDefault();
        e.stopPropagation();

        const mousePos = getMousePos(this.playerCanvas.canvas, e);
        this.mouseDownPoint = coordsToCell(mousePos.x, mousePos.y);

        this.indexDragShip = arrayFindIndexPointShips(this.mouseDownPoint, this.player.ships);
        if (this.indexDragShip === -1) {
            return;
        }

        this.canDrag = true;

        const ship = this.player.ships[this.indexDragShip];
        const aroundShipPoint = getAreaAroundShipPoint(ship)

        this.drawAroundShipPoint(aroundShipPoint);
        this.drawPlayerShips(this.player.ships);
    }

    onMouseUp(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        this.canDrag = false;

        this.playerCanvas.clear();
        drawPlayingField(this.playerCanvas.context);

        this.drawPlayerShips(this.player.ships);
    }

    onMouseMove(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        if (!this.canDrag) {
            return;
        }

        const mousePos = getMousePos(this.playerCanvas.canvas, evt);
        const newPoint = coordsToCell(mousePos.x, mousePos.y);
        if (isPointOutside(newPoint)) {
            return;
        }

        let ship = this.player.ships[this.indexDragShip];
        const allPlayerShipsPoint = this.player.getAllShipPoints();
        const pointsExceptActualShip = filterExceptPoints(allPlayerShipsPoint, ship.points)

        ship = moveShipPoints(this.mouseDownPoint, newPoint, ship);
        const aroundShipPoint = getAreaAroundShipPoint(ship)
        const aroundShipPointWithShip = [...aroundShipPoint, ...ship.points];

        if (isPointIntersects(aroundShipPointWithShip, pointsExceptActualShip)) {
            return;
        }

        this.player.ships[this.indexDragShip] = ship;

        this.mouseDownPoint = newPoint;
        this.playerCanvas.clear();
        drawPlayingField(this.playerCanvas.context);

        this.drawAroundShipPoint(aroundShipPoint);
        this.drawPlayerShips(this.player.ships);
    }

    onMouseDblClick(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        const mousePos = getMousePos(this.playerCanvas.canvas, evt);
        const point = coordsToCell(mousePos.x, mousePos.y);
        const indexShip = arrayFindIndexPointShips(point, this.player.ships);

        if (isPointOutside(point) || indexShip === -1) {
            return;
        }

        let ship = this.player.ships[indexShip];
        const allPlayerShipsPoint = this.player.getAllShipPoints();
        const pointsExceptActualShip = filterExceptPoints(allPlayerShipsPoint, ship.points)

        ship = flipShipPoints(point, ship);
        const aroundShipPoint = getAreaAroundShipPoint(ship)
        const aroundShipPointWithShip = [...aroundShipPoint, ...ship.points];

        if (isPointIntersects(aroundShipPointWithShip, pointsExceptActualShip)) {
            return;
        }

        this.player.ships[this.indexDragShip] = ship;

        this.playerCanvas.clear();
        drawPlayingField(this.playerCanvas.context);

        this.drawAroundShipPoint(aroundShipPoint);
        this.drawPlayerShips(this.player.ships);
    }

    drawAroundShipPoint(points) {
        points.forEach(aroundPoint => {
            highlightPlayingCell(this.playerCanvas.context, aroundPoint.x, aroundPoint.y, COLOR.warning, DIM);
        });
    }

    drawPlayerShips(ships) {
        for (let i = 0; i < ships.length; i++) {
            ships[i].points.forEach(shipPoint => {
                highlightPlayingCell(this.playerCanvas.context, shipPoint.x, shipPoint.y, COLOR.ship, DIM);
            });
        }
    }
}
