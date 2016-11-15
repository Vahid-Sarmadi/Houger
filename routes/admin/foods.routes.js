var express = require('express');
var router = express.Router();
var Houger = require('../../Houger_module');


router.get('/', Houger.Functions.isAdmin,
    Houger.Foods.get,
    function(req, res, next) {

        var content =  req.result.content ;
        content.title = "هوگر | مدیریت | غذا ها";
        content.flash = Houger.Functions.getFlash(req.session);
        content.user = req.user.fullName;

        console.log(content);

        res.render('admin/pages/foods', content);
    });

router.get('/add', Houger.Functions.isAdmin,
    Houger.Foods.get,
    Houger.Categories.get,
    function(req, res, next) {

        var content = req.result.content;
        content.title = "هوگر | مدیریت | افزودن غذا";
        content.flash = Houger.Functions.getFlash(req.session);
        content.user = req.user.fullName;

        console.log(content);

        res.render('admin/pages/foods/add', content);
    });

router.get('/edit/:_id', Houger.Functions.isAdmin,
    Houger.Foods.getSpecial,
    Houger.Categories.get,
    function(req, res, next) {

        var content =  req.result.content ;
        content.title = "هوگر | مدیریت | ویرایش غذا";
        content.flash = Houger.Functions.getFlash(req.session);
        content.user = req.user.fullName;

        console.log(content);

        res.render('admin/pages/foods/edit', content);
    });


module.exports = router;
