var express = require('express');
var router = express.Router();
var Houger = require('../../Houger_module');


router.get('/', Houger.Functions.isAdmin,
    function(req, res, next) {

        var content = {};
        content.title = "مدیریت | رستوران هوگر";
        content.flash = Houger.Functions.getFlash(req.session);
        content.user = req.user.fullName;

        console.log(content);

        res.render('admin/pages/index', content);
    });


/* GET profile page. */
router.get('/profile', Houger.Functions.isAdmin,
    function(req, res, next) {
        var content = {};
        content.title = "پروفایل | مدیریت | رستوران هوگر";
        console.log(req.user);
        content.user = req.user.fullName;
        content.you = req.user;

        console.log(content);

        res.render('admin/pages/profile/profile', content);
    });

/* GET changePassword page. */
router.get('/changePassword', Houger.Functions.isAdmin,
    function(req, res, next) {

        var content = {};
        content.title = "تغییر کلمه عبور | مدیریت | رستوران هوگر";
        content.user = req.user.fullName;

        console.log(content);

        res.render('admin/pages/profile/changePassword', content);
    });

module.exports = router;
