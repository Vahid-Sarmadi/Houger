var express = require('express');
var router = express.Router();
var Houger = require('../../Houger_module');


router.get('/', Houger.Functions.isAdmin,
    Houger.ReserveCodes.get,
    function(req, res, next) {

        var content =  req.result.content ;
        content.title = "هوگر | مدیریت | کد رزرو ها";
        content.flash = Houger.Functions.getFlash(req.session);
        content.user = req.user.fullName;

        console.log(content);

        res.render('admin/pages/reserveCodes', content);
    });

router.get('/add', Houger.Functions.isAdmin,
    //Houger.reserveCodes.get,
    Houger.Reserves.get,

    function(req, res, next) {

        var content = req.result.content;
        content.title = "هوگر | مدیریت | افزودن کد رزرو";
        content.flash = Houger.Functions.getFlash(req.session);
        content.user = req.user.fullName;

        console.log(content);

        res.render('admin/pages/reserveCodes/add', content);
    });

router.get('/edit/:_id', Houger.Functions.isAdmin,
    Houger.ReserveCodes.getSpecial,
    Houger.Reserves.get,
    function(req, res, next) {

        var content =  req.result.content ;
        content.title = "هوگر | مدیریت | ویرایش کد رزرو";
        content.flash = Houger.Functions.getFlash(req.session);
        content.user = req.user.fullName;

        console.log(content);

        res.render('admin/pages/reserveCodes/edit', content);
    });


module.exports = router;
