export function arrayFindIndex(array, value) {
    return array.findIndex(item => item === value)
}

export function arrayRandomNumber(max) {
    return Math.floor(Math.random() * max);
}

export function arrayRandomBetween(min, max, except = null) {
    let rand = arrayRandomNumber(max - min + 1) + min;

    if (except !== null && arrayFindIndex(except, rand) !== -1) {
        rand = arrayRandomBetween(min, max, except);
    }

    return rand;
}
