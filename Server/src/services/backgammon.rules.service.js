const whiteColor = 1;
const blackColor = 0;

const initGame = (users) => {
    return {
        black: users[0],
        white: users[1],
        blacksLocations: [5, 5, 5, 5, 5, 7, 7, 7, 12, 12, 12, 12, 12, 23, 23],
        whitesLocations: [18, 18, 18, 18, 18, 16, 16, 16, 11, 11, 11, 11, 11, 0, 0],
        turnOf: users[0]
    };
}

const setBeginner = (rolls) => {
    return {
        beginner: rolls[0].value >= rolls[1].value ? 0 : 1,
        beginnerDecided: rolls[0].value !== rolls[1].value
    };
}

const getMoveOptions = (board, rolls, color, pieceLocation) => {
    // if player tries to move a piece on board while having one or more 'dead' pieces
    if (isOneOrMorePiecesAreEaten(board, color)) {
        return []; // return empty options array
    }
    // 'rolls' length will be 4 in case of double; 2 in any other case
    // regular rolls case (not a double)
    if (rolls.length === 2) {
        return getMoveOptionsForRegularRoll(board, rolls, color, pieceLocation);
    } else {    // double case (4 rolls; two dices with same value)
        return getMoveOptionsForDoubleRoll(board, rolls, color, pieceLocation);
    }
}

const MovePiece = (board, movement) => {
    for (let i = 0; i < 15; i++) {
        if (movement.color === whiteColor && board.whitesLocations[i] === movement.fromLocation) {
            board.whitesLocations[i] = movement.newLocation;
            eatPieceIfNeeded(board, movement.color, movement.newLocation);
            break;
        }
        if (movement.color === blackColor && board.blacksLocations[i] === movement.fromLocation) {
            board.blacksLocations[i] = movement.newLocation;
            eatPieceIfNeeded(board, movement.color, movement.newLocation);
            break;
        }
    }
    return {
        board: board,
        rolls: getRollsAfterMove(movement.rolls, movement.diceValue)
    };
}

//#region Private Functions

const getRollsAfterMove = (rolls, diceValue) => {
    for (let i = 0; i < rolls.length; i++) {
        if (rolls[i].value === diceValue && !rolls[i].isUsed) {
            rolls[i].isUsed = true;
            break;
        }
    }
    return rolls;
}

const eatPieceIfNeeded = (board, color, location) => {
    if (color === whiteColor && board.blacksLocations.filter(loc => loc === location).length === 1) {
        let index = board.blacksLocations.indexOf(location);
        board.blacksLocations[index] = -1;
    }
    if (color === blackColor && board.whitesLocations.filter(loc => loc === location).length === 1) {
        let index = board.whitesLocations.indexOf(location);
        board.whitesLocations[index] = -1;
    }
}

const calcNewLocation = (roll, color, pieceLocation) => {
    // if is eaten
    if (pieceLocation === -1) {
        return color === whiteColor ? (roll.value - 1) : (24 - roll.value);
    } else { // if is on board
        let newLocation = color === whiteColor ? (pieceLocation + roll.value) : (pieceLocation - roll.value);
        // if result is outside board, return new index = 24 (index for out-pieces)
        return (newLocation < 0 || newLocation > 23) ? 24 : newLocation;
    }
}

const isStepAvailable = (board, color, newLocation) => {
    if (newLocation === 24) {
        return isAllPiecesAtHome(board, color);
    }
    if (color === whiteColor) {
        return (board.blacksLocations.filter((loc) => loc === newLocation).length <= 1);
    } else {
        return (board.whitesLocations.filter((loc) => loc === newLocation).length <= 1);
    }
}

const isOneOrMorePiecesAreEaten = (board, color) => {
    return color === whiteColor ? board.whitesLocations.includes(-1) : board.blacksLocations.includes(-1);
}

const isAllPiecesAtHome = (board, color) => {
    if (color === blackColor) {
        return (board.blacksLocations.filter((loc) => loc <= 5 && loc >= 0 || loc === 24).length === 15);
    } else {
        return (board.whitesLocations.filter((loc) => loc <= 24 && loc >= 18).length === 15);
    }
}

const getMoveOptionsForRegularRoll = (board, rolls, color, pieceLocation) => {
    const options = [];
    // iterate rolls
    for (let i = 0; i < rolls.length; i++) {
        // get the new location of specific roll
        let newLocation = calcNewLocation(rolls[i], color, pieceLocation);
        // if roll is relevant (not used already in same turn & step to new location is available)
        if (!rolls[i].isUsed && isStepAvailable(board, color, newLocation)) {
            // add as a new move option
            options.push({
                newLocation: newLocation,
                diceValue: rolls[i].value
            });
        }
    }
    return options;
}

const getMoveOptionsForDoubleRoll = (board, rolls, color, pieceLocation) => {
    const options = [];
    let newLocation = calcNewLocation(rolls[0], color, pieceLocation);
    // if roll is relevant (step to new location is available)
    if (!rolls[0].isUsed && isStepAvailable(board, color, newLocation)) {
        // add as a new move option
        options.push({
            newLocation: newLocation,
            diceValue: rolls[0].value
        });
    }
    return options;
}

//#endregion

const backgammonRulesService = {
    initGame,
    setBeginner,
    getMoveOptions,
    MovePiece
};
module.exports = backgammonRulesService;