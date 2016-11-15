var express = require('express');
var router = express.Router();
var Houger = require('../../Houger_module');


router.get('/', function(req, res, next) {

        var content = {};
        content.title = "";
        content.flash = Houger.Functions.getFlash(req.session);

        console.log(content);

        res.render('customer/pages/index', content);
    });

router.get('/login', function(req, res, next) {

        var content = {};
        content.title = "";
        content.flash = Houger.Functions.getFlash(req.session);

        console.log(content);

        res.render('customer/pages/login', content);
    });

router.get('/reservation', function(req, res, next) {

        var content = {};
        content.title = "";
        content.flash = Houger.Functions.getFlash(req.session);

        console.log(content);

        res.render('customer/pages/reservation', content);
    });

router.get('/reserved', function(req, res, next) {

        var content = {};
        content.title = "";
        content.flash = Houger.Functions.getFlash(req.session);

        console.log(content);

        res.render('customer/pages/reserved', content);
    });

router.get('/menu', function(req, res, next) {

        var content = req.result.content;
        content.title = "";
        content.flash = Houger.Functions.getFlash(req.session);

        console.log(content);

        res.render('customer/pages/menu', content);
    });

router.get('/tour', function(req, res, next) {

        var content = {};
        content.title = "";
        content.flash = Houger.Functions.getFlash(req.session);

        console.log(content);

        res.render('customer/pages/tour', content);
    });

router.get('/contact', function(req, res, next) {

        var content = {};
        content.title = "";
        content.flash = Houger.Functions.getFlash(req.session);

        console.log(content);

        res.render('customer/pages/contact', content);
    });

router.get('/about', function(req, res, next) {

        var content = {};
        content.title = "";
        content.flash = Houger.Functions.getFlash(req.session);

        console.log(content);

        res.render('customer/pages/about', content);
    });

router.get('/payment', function(req, res, next) {

        var content = req.result.content;
        content.title = "";
        content.flash = Houger.Functions.getFlash(req.session);

        console.log(content);

        res.render('customer/pages/payment', content);
    });

router.get('/payment/result', function(req, res, next) {

        var content = req.result.content;
        content.title = "";
        content.flash = Houger.Functions.getFlash(req.session);

        console.log(content);

        res.render('customer/pages/paymentResult', content);
    });


module.exports = router;