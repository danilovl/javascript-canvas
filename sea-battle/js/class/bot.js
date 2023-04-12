import {getPossibleShipsByLength, getTargetSuccessDirectionPoints} from '../util/point.js';
import {arrayFindIndexPoint, arrayRandomItem, arrayRemoveByIndex} from '../util/array.js';

export default class Bot {
    constructor(playerOne) {
        this.infoDataShips = playerOne.infoDataShips;
        this.playerOne = playerOne;
        this.successPoint = [];
        this.predictablePlayerOnePoints = [];
    }

    fire() {
        const point = this.getPoint();
        this.playerOne.fire(point)

        if (this.playerOne.isLastHitSucces) {
            this.successPoint.push(point);

            if (!this.playerOne.isLastlShipAlive) {
                this.successPoint = [];
            }
        }

        return this.playerOne.isLastHitSucces;
    }

    getPoint() {
        this.predictablePlayerOnePoints = [...this.playerOne.points];

        return this.successPoint.length === 0 ? this.getPredictablePoint() : this.getNextSuccessPoint();
    }

    getPredictablePoint() {
        const index = this.infoDataShips.findIndex(item => item.length === 1);
        const isOneLengthAliveShip = this.infoDataShips[index].count > 0;

        let point = arrayRandomItem(this.predictablePlayerOnePoints);
        if (!isOneLengthAliveShip) {
            const aliveShips = this.infoDataShips.filter(item => item.count > 0)
            let possibleVariationShips = [];

            aliveShips.forEach(function (item) {
                const possibleShips = getPossibleShipsByLength(point, item.length);
                if (possibleShips !== null) {
                    possibleVariationShips.push(...possibleShips);
                }
            });

            let predictablePlayerOnePoints = this.predictablePlayerOnePoints;
            const removeVariationShips = [];
            possibleVariationShips = possibleVariationShips.filter((ship) => {
                const isShipPointNotFound = ship.points.some(point => arrayFindIndexPoint(point, predictablePlayerOnePoints) === -1);
                if (isShipPointNotFound) {
                    removeVariationShips.push(ship);
                }

                return !isShipPointNotFound;
            });

            if (removeVariationShips.length > 0) {
                removeVariationShips.forEach(ship => {
                    ship.points.forEach(point => {
                        const index = arrayFindIndexPoint(point, predictablePlayerOnePoints);
                        predictablePlayerOnePoints = arrayRemoveByIndex(index, predictablePlayerOnePoints)
                    })
                })
            }

            if (possibleVariationShips.length === 0) {
                point = this.getPredictablePoint();
            }
        }

        return point;
    }

    getNextSuccessPoint() {
        const aroundSuccessPoints = getTargetSuccessDirectionPoints(this.successPoint, null, this.playerOne.points)
        if (aroundSuccessPoints.length === 0) {
            return arrayRandomItem(this.playerOne.points);
        }

        return arrayRandomItem(aroundSuccessPoints);
    }
}
