const whiteColor = 1;
const blackColor = 0;

const initGame = (users) => {
    return initGameToAlmostEndTest(users);
    return {
        black: users[0],
        white: users[1],
        blacksLocations: [5, 5, 5, 5, 5, 7, 7, 7, 12, 12, 12, 12, 12, 23, 23],
        whitesLocations: [18, 18, 18, 18, 18, 16, 16, 16, 11, 11, 11, 11, 11, 0, 0],
        turnOf: users[0]
    };
}

const initGameToAlmostEndTest = (users) => {
    return {
        black: users[0],
        white: users[1],
        blacksLocations: [24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 3, 2, 2, 2, 1],
        whitesLocations: [18, 18, 18, 18, 18, 17, 17, 20, 21, 22, 22, 21, 20, 23, 19],
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
    if (isOneOrMorePiecesAreEaten(board, color) && pieceLocation !== -1) {
        return []; // return empty options array
    }
    return getMoveOptionsForAnyRoll(board, rolls, color, pieceLocation)
}

const isAbleToMoveSomething = (board, rolls, color) => {
    for (let i = 0; i < 15; i++) {
        let pieceLocation = color === whiteColor ? board.whitesLocations[i] : board.blacksLocations[i];
        let options = getMoveOptions(board, rolls, color, pieceLocation);
        if (options.length > 0) {
            return true;
        }
    }
    return false;
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

const isGameOver = (board) => {
    return getWinner(board) !== null;
}

const getWinner = (board) => {
    if (board.whitesLocations.filter(loc => loc !== 24).length === 0) {
        return { winner: 'white' };
    }
    if (board.blacksLocations.filter(loc => loc !== 24).length === 0) {
        return { winner: 'black' };
    }
    return null;
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
    if (location === 24) return;
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

const getMoveOptionsForAnyRoll = (board, rolls, color, pieceLocation) => {
    const options = [];
    for (let i = 0; i < rolls.length; i++) {
        let newLocation = calcNewLocation(rolls[i], color, pieceLocation);
        // if new location is 24 (remove piece) and there are further pieces with the specific roll to be relevant for them for being removed
        if (newLocation === 24 && isFurtherPiecesExistForRemovingRoll(board, rolls[i], color, pieceLocation)) {
            // pass to next roll and do NOT consider removing this piece as valid move.
            continue;
        }
        // if roll is relevant (step to new location is available)
        if (!rolls[i].isUsed && isStepAvailable(board, color, newLocation)) {
            // add as a new move option
            options.push({
                newLocation: newLocation,
                diceValue: rolls[i].value
            });
            if (rolls.length > 2) {
                break;
            }
        }
    }
    return options;
}

const isFurtherPiecesExistForRemovingRoll = (board, specificRoll, color, pieceLocation) => {
    // if piecelocation + dicevalue > exactly 24, than check if there are more behind. if yes, than result = true. else false.
    if (color === whiteColor && pieceLocation + specificRoll.value > 24) {
        return board.whitesLocations.filter(loc => loc < pieceLocation).length > 0;
    }
    // if dicevalue - piecelocation > exactly 1, than check if there are more behind. if yes, than result = true. else false.
    if (color === blackColor && specificRoll.value - pieceLocation > 1) {
        return board.blacksLocations.filter(loc => loc > pieceLocation && loc !== 24).length > 0;
    }
}

//#endregion

const backgammonRulesService = {
    initGame,
    setBeginner,
    getMoveOptions,
    MovePiece,
    isAbleToMoveSomething,
    isGameOver,
    getWinner
};
module.exports = backgammonRulesService;