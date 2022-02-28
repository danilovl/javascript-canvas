export const WIDTH = 20;
export const HEIGHT = 30;
export const DIM = 25;
export const DEFAULT_SPEED = 100;

export const COLOR = {
    playingField: 'rgb(255,255,255)',
    snake: 'rgb(0,179,7)',
    borderCanvas: 'rgb(0,0,0)',
    target: 'rgb(255,0,0)'
}

export const DIRECTION = {
    ArrowUp: 'ArrowUp',
    ArrowDown: 'ArrowDown',
    ArrowLeft: 'ArrowLeft',
    ArrowRight: 'ArrowRight'
}

export const DIRECTION_OPPOSITE = {
    ArrowUp: 'ArrowDown',
    ArrowDown: 'ArrowUp',
    ArrowLeft: 'ArrowRight',
    ArrowRight: 'ArrowLeft'
}
export const DIRECTIONS = [DIRECTION.ArrowUp, DIRECTION.ArrowDown, DIRECTION.ArrowLeft, DIRECTION.ArrowRight];

export const DEFAULT_SNAKE = [
    {
        x: 0,
        y: 0,
    },
    {
        x: 0,
        y: 1,
    },
    {
        x: 0,
        y: 2,
    },
    {
        x: 1,
        y: 2,
    },
    {
        x: 2,
        y: 2,
    }
];

export const DEFAULT_START_POINT = {
    x: 10,
    y: 10,
};
