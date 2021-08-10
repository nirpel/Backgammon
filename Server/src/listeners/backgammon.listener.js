const {
    backgammonInviteRequest,
    backgammonInviteRejected,
    backgammonInviteAccepted,
    diceRolled,
    beginnerDecided,
    turnStarted
} = require('../events/backgammon.events');

module.exports = (io, socket, users) => {
    socket.on('backgammon-invite', (data) => {
        data.to = getSocketId(data.to, users);
        backgammonInviteRequest(io, socket, data);
    });

    socket.on('backgammon-invite-answer', (data) => {
        data.to = {
            id: getSocketId(data.to, users),
            username: data.to
        };
        if (data.isAccepted) {
            backgammonInviteAccepted(io, socket, data);
        } else {
            backgammonInviteRejected(io, socket, data);
        }
    });

    socket.on('roll-dice', (data) => {
        data.to = getSocketId(data.to, users);
        diceRolled(io, socket, data);
    });

    socket.on('roll-to-start-ended', (data) => {
        data.to = getSocketId(data.to, users);
        beginnerDecided(io, socket, data);
    });

    socket.on('turn-ended', (data) => {
        data.to = getSocketId(data.to, users);
        turnStarted(io, socket, data);
    });
}

const getSocketId = (username, users) => {
    for (let i = 0; i < users.length; i++) {
        if (username === users[i].username) {
            return users[i].id;
        }
    }
}