module.exports = {

    getFlash: function (session) {
        var flash = {};
        if(session.flash) {
            flash.status     = session.flash.status;
            flash.title      = session.flash.title;
            flash.message    = session.flash.message;
            flash.form       = session.flash.form;
            session.flash    = undefined;
        }

        return flash;
    },

    setFlash: function (session, status, title, message, form) {
        session.flash = {
            status      : status,
            title       : title || "",
            message     : message,
            form        : form || {}
        };

        return true;
    },

    clearFlash: function (session) {
        session.flash = undefined;

        return true;
    },

    checkLoggedIn: function (req, res, next) {
        req.isAuthenticated();
        return next();
    },

    isLoggedIn: function(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/login');
    },

    isAdmin: function(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated() && req.user.role == 'Manager') {
            return next();
        }

        // if they aren't redirect them to the home page
        res.redirect('/login');
    },

    isManager: function(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated() && req.user.role == 'Manager') {
            return next();
        }

        // if they aren't redirect them to the home page
        res.redirect('/login');
    },

    isReception: function(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated() && req.user.role == 'Reception') {
            return next();
        }

        // if they aren't redirect them to the home page
        res.redirect('/login');
    },

    isEmptyObject: function (obj) {
        return !Object.keys(obj).length;
    },

    isEmpty: function (str) {
        if (!str) {
            return true;
        }
        return !!(str == '' || str == null || str == undefined);

    },

    checkRole: function (role, target) {
        if(role instanceof Array) {
            var item;
            for (item in role) {
                if (role[item] === target) return true;
            }
        }
        else {
            if(role === target) return true;
        }
        return false;
    },

    login: function (user, token, callback) {
        var error, content;
        var timestamp = Math.floor(Date.now() / 1000);
        var tokenExpiryDate = timestamp + (72 * 60 * 60);    //3 days

        user.token = token;
        user.tokenExpiryDate = tokenExpiryDate;

        user.save(function (err) {
            if (err) {
                error = err;
            } else {
                content = {
                    token: user.token,
                    username: user.username,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    role: user.role
                };

                if (callback) {
                    callback(error, content);
                }
            }
        });

    },

    setResult: function (req, status, message, key, value, key2, value2) {
        if(!req.result) {
            req.result = {};
        }
        if(!req.result.content) {
            req.result.content = {};
        }

        req.result.status = status;
        req.result.message = message;
        if (key && value) {
            req.result.content[key] = value;
        }
        if (key2 && value2) {
            req.result.content[key2] = value2;
        }

    }

};