var express = require('express');
var router = express.Router();
var Houger = require('../../../Houger_module');

router.post('/add',  Houger.ReserveCodes.add);
router.post('/edit/:_id',  Houger.ReserveCodes.edit);
router.post('/delete', Houger.ReserveCodes.delete);



module.exports = router;