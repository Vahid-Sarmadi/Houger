var express = require('express');
var router = express.Router();
var Houger = require('../../Houger_module');


router.get('/', Houger.Functions.isAdmin,
    Houger.Tables.get,
    function(req, res, next) {

            var content =  req.result.content ;
            content.title = "میز ها | مدیریت | هوگر";
            content.flash = Houger.Functions.getFlash(req.session);
            //content.user = req.user.fullName;

            console.log(content);

            res.render('admin/pages/tables', content);
    });

router.get('/add', Houger.Functions.isAdmin,
    Houger.Tables.get,
    function(req, res, next) {

        var content = req.result.content ;
        content.title = "هوگر | مدیریت | افزودن میز";
        content.flash = Houger.Functions.getFlash(req.session);
        //content.user = req.user.fullName;

        console.log(content);

        res.render('admin/pages/tables/add', content);
    });

router.get('/edit/:_id', Houger.Functions.isAdmin,
    Houger.Tables.getSpecial,
    function(req, res, next) {

        var content =  req.result.content ;
        content.title = "هوگر | مدیریت | تغییر میز";
        content.flash = Houger.Functions.getFlash(req.session);
        //content.user = req.user.fullName;


        console.log(content);

        res.render('admin/pages/tables/edit', content);
    });


module.exports = router;
