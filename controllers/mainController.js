const { User } = require("../models");

exports.getUser = function(req, res, next) {
    User.findByPk(req.user.id)
        .then((user) => {
            if (!user) {
                return next(new Error('User not found'));
            }
            req.user = user;
            res.locals.user = user;
            next();
        })
        .catch((err) => {
            return next(err);
        });
};