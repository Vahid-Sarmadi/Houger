var express = require('express');
var router = express.Router();
var Houger = require('../../Houger_module');


router.get('/', Houger.Functions.isManager,
    function(req, res, next) {

        var content = {};
        content.title = "مدیریت";
        content.flash = Houger.Functions.getFlash(req.session);
        content.user = req.user.local.name;

        console.log(content);

        res.render('admin/pages/index', content);
    });


module.exports = router;
