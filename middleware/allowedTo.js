const appError = require("../utils/appError");

module.exports = (...roles) => {
    console.log("Roles: ", roles);
    return (req, res, next) => {
        if (!req.currentUser || !req.currentUser.role) {
            // Handle the case where currentUser or role is not defined
            return next(appError.create("User role not defined", 401));
        }

        console.log("req.currentUser.role: ", req.currentUser.role);

        if (!roles.includes(req.currentUser.role)) {
            return next(appError.create("This Role is Not Authorized", 401));
        }
        next(); 
    };
};
