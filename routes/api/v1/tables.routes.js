var express = require('express');
var multer = require('multer');
var router = express.Router();
var Houger = require('../../../Houger_module');
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '../../../../public/images/tables');
    },
    filename: function (req, file, callback) {
        var temp = file.originalname.split('.');
        var ex = '.' + temp[(temp.length - 1)];
        callback(null, file.fieldname + '-' + Date.now() + ex);
    }
});

var upload = multer({ storage: storage});
var cpUpload = upload.fields([{ name: 'image', maxCount: 1 }]);

router.post('/add', cpUpload, Houger.Tables.add);
router.post('/edit/:_id', cpUpload, Houger.Tables.edit);
router.post('/delete', Houger.Tables.delete);



module.exports = router;