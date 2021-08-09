
const initGame = (users) => {
    return {
        black: users[0],
        white: users[1],
        blacksLocations: [5, 5, 5, 5, 5, 7, 7, 7, 12, 12, 12, 12, 12, 23, 23],
        whitesLocations: [18, 18, 18, 18, 18, 16, 16, 16, 11, 11, 11, 11, 11, 0, 0]
    }
}

const backgammonRulesService = {
    initGame
};
module.exports = backgammonRulesService;