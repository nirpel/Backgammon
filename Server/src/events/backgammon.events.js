const backgammonRulesService = require('../services/backgammon/backgammon.rules.service');

const backgammonInviteRequest = (io, socket, data) => {
    io.to(data.to).emit('backgammon-invite-request', data.from);
}

const backgammonInviteRejected = (io, socket, data) => {
    io.to(data.to).emit('backgammon-invite-rejected', data.from);
}

const backgammonInviteAccepted = (io, socket, data) => {
    // init game from game service & add it to emitted data
    let initGameData = backgammonRulesService.initGame([data.from, data.to.username]);
    io.to(data.to.id).to(socket.id).emit('backgammon-invite-accepted', initGameData);
}

module.exports = {
    backgammonInviteRequest,
    backgammonInviteRejected,
    backgammonInviteAccepted
}