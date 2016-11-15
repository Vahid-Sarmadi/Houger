var express = require('express');
var router = express.Router();
var Houger = require('../../Houger_module');


router.get('/', Houger.Functions.isAdmin,
    Houger.Users.get,
    function(req, res, next) {

        var content =  req.result.content ;
        content.title = "هوگر | مدیریت | کاربران";
        content.flash = Houger.Functions.getFlash(req.session);
        content.user = req.user.fullName;

        console.log(content);

        res.render('admin/pages/users', content);
    });

router.get('/add', Houger.Functions.isAdmin,
    function(req, res, next) {

        var content = {};
        content.title = "هوگر | مدیریت | افزودن کاربر";
        content.flash = Houger.Functions.getFlash(req.session);
        content.user = req.user.fullName;

        console.log(content);

        res.render('admin/pages/users/add', content);
    });

router.get('/edit/:_id', Houger.Functions.isAdmin,
    Houger.Users.getSpecial,
    function(req, res, next) {

        var content =  req.result.content ;
        content.title = "هوگر | مدیریت | ویرایش کاربر";
        content.flash = Houger.Functions.getFlash(req.session);
        content.user = req.user.fullName;

        console.log(content);

        res.render('admin/pages/users/edit', content);
    });


module.exports = router;
