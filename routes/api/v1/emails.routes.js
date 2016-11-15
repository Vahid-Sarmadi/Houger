var express = require('express');
var router = express.Router();
var Houger = require('../../../Houger_module');

router.post('/add',  Houger.Emails.add);
router.post('/edit/:_id',  Houger.Emails.edit);
router.post('/delete',  Houger.Emails.delete);



module.exports = router;