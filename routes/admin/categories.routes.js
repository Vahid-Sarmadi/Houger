var express = require('express');
var router = express.Router();
var Houger = require('../../Houger_module');


router.get('/', Houger.Functions.isAdmin,
    Houger.Categories.get,
    function(req, res, next) {

        var content =  req.result.content ;
        content.title = "دسته بندی ها | مدیریت | هوگر";
        content.flash = Houger.Functions.getFlash(req.session);
        content.user = req.user.fullName;

        console.log(content);

        res.render('admin/pages/categories', content);
    });

router.get('/add', Houger.Functions.isAdmin,
    function(req, res, next) {

        var content = {} /* req.result.content */;
        content.title = "هوگر | مدیریت | افزودن دسته بندی";
        content.flash = Houger.Functions.getFlash(req.session);
        content.user = req.user.fullName;

        console.log(content);

        res.render('admin/pages/categories/add', content);
    });

router.get('/edit/:_id', Houger.Functions.isAdmin,
    Houger.Categories.getSpecial,
    function(req, res, next) {

        var content = req.result.content;
        content.title = "هوگر | مدیریت | تغییر دسته بندی";
        content.flash = Houger.Functions.getFlash(req.session);
        content.user = req.user.fullName;


        console.log(content);

        res.render('admin/pages/categories/edit', content);
    });


module.exports = router;
