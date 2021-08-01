getPublicContent = (req, res) => {
    res.status(200).send("Public Content.");
};

getUserContent = (req, res) => {
    res.status(200).send("User Content.");
};

const userController = {
    getPublicContent,
    getUserContent
};
module.exports = userController;