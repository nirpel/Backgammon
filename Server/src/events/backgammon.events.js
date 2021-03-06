const backgammonRulesService = require('../services/backgammon.rules.service');
const diceService = require('../services/dice.service');

const backgammonInviteRequest = (io, socket, data) => {
    io.to(data.to).emit('backgammon-invite-request', data.from);
}

const backgammonInviteRejected = (io, socket, data) => {
    io.to(socket.id).to(data.to).emit('backgammon-invite-rejected', data.from);
}

const backgammonInviteAccepted = (io, socket, data) => {
    // init game from game service & add it to emitted data
    let initGameData = backgammonRulesService.initGame([data.from, data.to.username]);
    io.to(data.to.id).to(socket.id).emit('backgammon-invite-accepted', initGameData);
}

const diceRolled = (io, socket, data) => {
    let rolls = data.firstRoll ? diceService.rollToBegin() : diceService.rollDices();
    if (!data.firstRoll && !backgammonRulesService.isAbleToMoveSomething(data.board, rolls, data.color)) {
        for (let i = 0; i < rolls.length; i++) {
            rolls[i].isUsed = true;
        }
    }
    io.to(data.to).to(socket.id).emit('dice-rolled', rolls);
}

const beginnerDecided = (io, socket, data) => {
    let beginnerData = backgammonRulesService.setBeginner(data.rolls);
    io.to(data.to).emit('beginner-decided', beginnerData);
}

const turnStarted = (io, socket, data) => {
    io.to(data.to).to(socket.id).emit('turn-started');
}

const movementOptions = (io, socket, data) => {
    let moveOptions = backgammonRulesService.getMoveOptions(data.board, data.rolls, data.color, data.location);
    io.to(socket.id).emit('movement-options', moveOptions);
}

const pieceMoved = (io, socket, data) => {
    let afterMoveData = backgammonRulesService.MovePiece(data.board, data.movement);
    if (!backgammonRulesService.isAbleToMoveSomething(data.board, data.movement.rolls, data.movement.color)) {
        for (let i = 0; i < afterMoveData.rolls.length; i++) {
            afterMoveData.rolls[i].isUsed = true;
        }
    }
    io.to(data.to).to(socket.id).emit('piece-moved', afterMoveData);
    if (backgammonRulesService.isGameOver(data.board)) {
        gameOver(io, socket, data);
    }
}

const gameOver = (io, socket, data) => {
    let gameOverData = backgammonRulesService.getWinner(data.board);
    io.to(data.to).to(socket.id).emit('game-over', gameOverData);
}

module.exports = {
    backgammonInviteRequest,
    backgammonInviteRejected,
    backgammonInviteAccepted,
    diceRolled,
    beginnerDecided,
    turnStarted,
    movementOptions,
    pieceMoved,
    gameOver
}