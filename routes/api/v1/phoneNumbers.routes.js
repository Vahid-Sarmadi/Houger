var express = require('express');
var router = express.Router();
var Houger = require('../../../Houger_module');

router.post('/add',  Houger.phoneNumbers.add);
router.post('/edit/:_id',  Houger.phoneNumbers.edit);
router.post('/delete',  Houger.phoneNumbers.delete);



module.exports = router;