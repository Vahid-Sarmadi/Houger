var express = require('express');
var passport = require('passport');
var router = express.Router();
var Houger = require('../../../Houger_module');


router.get('/', function(req, res, next) {
    console.log('Welcome to our api(v1) . . .');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({ status: 200, message: "Welcome to our api(v1) . . ." });
});

router.get('/testConnection', Houger.testConnection);

router.get('/createSampleUser', Houger.createAdminUser);

router.post('/login', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
        if (err) {
            Houger.Functions.setFlash(req.session, "error", "خطا!", err);
            return res.json({status: 500, redirect: '/error'});
        }
        if (!user) {
            Houger.Functions.setFlash(req.session, "error", "خطا!", info.message);
            return res.json(info);
        }
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;    // 1 day

        Houger.Functions.setFlash(req.session, "success", "", info.message);
        req.logIn(user, function(err) {
            if (err) {
                Houger.Functions.setFlash(req.session, "error", "خطا!", err);
                return res.json({status: 500, redirect: '/error'});
            }

            if(user.role == "Reception") {
                return res.json({status: 200, redirect: '/reception'});
            } else if(user.role == "Manager") {
                return res.json({status: 200, redirect: '/admin'});
            }

        });

    })(req, res, next);
});

router.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect('/');
});

module.exports = router;