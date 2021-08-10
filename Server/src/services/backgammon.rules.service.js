
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

const backgammonRulesService = {
    initGame,
    setBeginner
};
module.exports = backgammonRulesService;