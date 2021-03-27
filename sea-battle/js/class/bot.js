import {getPossibleShipsByLength, getTargetSuccessDirectionPoints} from '../util/point.js';
import {arrayFindIndexPoint, arrayRandomItem, arrayRemoveByIndex} from '../util/array.js';
import {SHIPS} from '../constant/constant.js';

export default class Bot {
    constructor(playerOne) {
        this.infoDataShips = playerOne.infoDataShips;
        this.playerOne = playerOne;
        this.successPoint = [];
        this.predictablePlayerOnePoints = [];
    }

    fire() {
        let point = this.getPoint();
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
        let point;

        let index = this.infoDataShips.findIndex(item => item.length === 1);
        let isOneLengthAliveShip = this.infoDataShips[index].count > 0;

        point = arrayRandomItem(this.predictablePlayerOnePoints);
        if (!isOneLengthAliveShip) {
            let aliveShips = this.infoDataShips.filter(item => item.count > 0)
            let possibleVariationShips = [];

            aliveShips.forEach(function (item) {
                let possibleShips = getPossibleShipsByLength(point, item.length);
                if (possibleShips !== null) {
                    possibleVariationShips.push(...possibleShips);
                }
            });

            let predictablePlayerOnePoints = this.predictablePlayerOnePoints;
            let removeVariationShips = [];
            possibleVariationShips = possibleVariationShips.filter((ship) => {
                let isShipPointNotFound = ship.points.some(point => arrayFindIndexPoint(point, predictablePlayerOnePoints) === -1);
                if (isShipPointNotFound) {
                    removeVariationShips.push(ship);
                }

                return !isShipPointNotFound;
            });

            if (removeVariationShips.length > 0) {
                removeVariationShips.forEach(ship => {
                    ship.points.forEach(point => {
                        let index = arrayFindIndexPoint(point, predictablePlayerOnePoints);
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
        let aroundSuccessPoints = getTargetSuccessDirectionPoints(this.successPoint, null, this.playerOne.points)
        if (aroundSuccessPoints.length === 0) {
            return arrayRandomItem(this.playerOne.points);
        }

        return arrayRandomItem(aroundSuccessPoints);
    }
}
