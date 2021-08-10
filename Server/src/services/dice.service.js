const randomNumber = () => {
    return Math.floor(Math.random() * 6) + 1;
}

const rollToBegin = () => {
    return [{
        value: randomNumber(),
        isUsed: true
    }];
}

const rollDices = () => {
    roll1 = randomNumber();
    roll2 = randomNumber();
    rolls = [];
    if (roll1 === roll2) {
        for (let i = 0; i < 4; i++) {
            rolls.push({ value: roll1, isUsed: false });
        }
    } else {
        rolls.push({ value: roll1, isUsed: false });
        rolls.push({ value: roll2, isUsed: false });
    }
    return rolls;
}

const diceService = {
    rollToBegin,
    rollDices
};
module.exports = diceService;