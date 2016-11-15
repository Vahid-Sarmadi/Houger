var express = require('express');
var router = express.Router();
var Houger = require('../../Houger_module');


router.get('/', Houger.Functions.isAdmin,
    Houger.Reserves.get,
    function(req, res, next) {

        var content =  req.result.content ;
        content.title = "هوگر | مدیریت | رزرو ها";
        content.flash = Houger.Functions.getFlash(req.session);
        content.user = req.user.fullName;

        console.log(content);

        res.render('admin/pages/reserves', content);
    });

router.get('/add', Houger.Functions.isAdmin,
    Houger.Users.get,
    Houger.Reserves.get,
    Houger.Tables.get,
    function(req, res, next) {

        var content = req.result.content;
        content.title = "هوگر | مدیریت | افزودن رزرو";
        content.flash = Houger.Functions.getFlash(req.session);
        content.user = req.user.fullName;
        console.log(content);

        res.render('admin/pages/reserves/add', content);
    });

router.get('/edit/:_id', Houger.Functions.isAdmin,
    Houger.Reserves.getSpecial,
    function(req, res, next) {

        var content =  req.result.content ;
        content.title = "هوگر | مدیریت | ویرایش کاربر";
        content.flash = Houger.Functions.getFlash(req.session);
        content.user = req.user.fullName;

        console.log(content);

        res.render('admin/pages/reserves/edit', content);
    });


module.exports = router;
