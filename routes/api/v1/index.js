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


module.exports = router;