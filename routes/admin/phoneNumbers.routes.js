var express = require('express');
var router = express.Router();
var Houger = require('../../Houger_module');


router.get('/', Houger.Functions.isAdmin,
    Houger.phoneNumbers.get,
    function(req, res, next) {

            var content =  req.result.content ;
            content.title = "شماره تماس ها | مدیریت | هوگر";
            content.flash = Houger.Functions.getFlash(req.session);
            //content.user = req.user.fullName;

            console.log(content);

            res.render('admin/pages/phoneNumbers', content);
    });

router.get('/add', Houger.Functions.isAdmin,
    //Houger.Emails.get,
    function(req, res, next) {

        var content = {} ;//req.result.content ;
        content.title = "هوگر | مدیریت | افزودن شماره تماس";
        content.flash = Houger.Functions.getFlash(req.session);
        //content.user = req.user.fullName;

        console.log(content);

        res.render('admin/pages/phoneNumbers/add', content);
    });

router.get('/edit/:_id', Houger.Functions.isAdmin,
    Houger.phoneNumbers.getSpecial,
    //Houger.Categories.get,
    function(req, res, next) {

        var content =  req.result.content ;
        content.title = "هوگر | مدیریت | تغییر شماره تماس";
        content.flash = Houger.Functions.getFlash(req.session);
        //content.user = req.user.fullName;


        console.log(content);

        res.render('admin/pages/phoneNumbers/edit', content);
    });


module.exports = router;
