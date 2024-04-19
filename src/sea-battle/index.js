'use strict';

import GameController from './js/class/game-controller.js';

let gameController = new GameController(
    'player-one',
    'player-one-count-ship-info',
    'player-two',
    'player-two-count-ship-info',
    'generate',
);
gameController.init();
