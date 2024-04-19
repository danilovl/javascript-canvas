export const DIM = 40;
export const VERTICAL_LETTER = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
export const SHIPS = [
    {
        length: 4,
        count: 1
    },
    {
        length: 3,
        count: 2
    },
    {
        length: 2,
        count: 3
    },
    {
        length: 1,
        count: 4
    }
];

export const COLOR = {
    warning: 'rgb(255,186,3)',
    ship: 'rgb(117,187,253)',
    infoShip: 'rgb(250,170,117)',
    hit: 'rgb(255,69,69)',
    miss: 'rgb(198,198,198)',
    activeBorderCanvas: 'rgb(0,179,7)',
    borderCanvas: 'rgb(160,160,160)',
    winner: 'rgb(255,0,248)',
    loser: 'rgb(0,0,0)',
    letter: 'rgb(0,0,0)'
}
export const LETTER_FONT = {
    default: 'bold 18px sans-serif'
}

export const DIRECTION = {
    up: 'up',
    down: 'down',
    left: 'left',
    right: 'right'
}

export const POSITION = {
    vertical: 'vertical',
    horizontal: 'horizontal',
    both: 'both',
}
