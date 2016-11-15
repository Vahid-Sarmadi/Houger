var express = require('express');
var router = express.Router();
var Houger = require('../../Houger_module');


router.get('/', Houger.Functions.isAdmin,
    Houger.Emails.get,
    function(req, res, next) {

            var content =  req.result.content ;
            content.title = "ایمیل ها | مدیریت | هوگر";
            content.flash = Houger.Functions.getFlash(req.session);
            content.user = req.user.fullName;

            console.log(content);

            res.render('admin/pages/emails', content);
    });

router.get('/add', Houger.Functions.isAdmin,
    //Houger.Emails.get,
    function(req, res, next) {

        var content = {} ;//req.result.content ;
        content.title = "هوگر | مدیریت | افزودن ایمیل";
        content.flash = Houger.Functions.getFlash(req.session);
        content.user = req.user.fullName;

        console.log(content);

        res.render('admin/pages/emails/add', content);
    });

router.get('/edit/:_id', Houger.Functions.isAdmin,
    Houger.Emails.getSpecial,
    //Houger.Categories.get,
    function(req, res, next) {

        var content =  req.result.content ;
        content.title = "هوگر | مدیریت | تغییر ایمیل";
        content.flash = Houger.Functions.getFlash(req.session);
        content.user = req.user.fullName;


        console.log(content);

        res.render('admin/pages/emails/edit', content);
    });


module.exports = router;
