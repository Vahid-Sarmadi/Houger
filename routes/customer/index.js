var express = require('express');
var router = express.Router();
var Houger = require('../../Houger_module');


router.get('/', function(req, res, next) {

        var content = req.result.content;
        content.title = "";
        content.flash = Houger.Functions.getFlash(req.session);

        console.log(content);

        res.render('customer/pages/index', content);
    });


module.exports = router;