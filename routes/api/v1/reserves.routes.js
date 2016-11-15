var express = require('express');
var router = express.Router();
var Houger = require('../../../Houger_module');

router.post('/add',  Houger.Reserves.add);
router.post('/edit/:_id',  Houger.Reserves.edit);
router.post('/delete', Houger.Reserves.delete);



module.exports = router;