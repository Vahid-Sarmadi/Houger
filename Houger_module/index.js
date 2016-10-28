var mongoose = require('mongoose');

var configDB = require('../config/database.config.js');

mongoose.Promise = global.Promise;
mongoose.connect(configDB.url);

/* set models here */
require('./models/categories.model');
require('./models/emails.model');
require('./models/foods.model');
require('./models/phoneNumbers.model');
require('./models/reserveCodes.model');
require('./models/reserves.model');
require('./models/tables.model');
require('./models/transactions.model');
require('./models/users.model');

var Functions = require('./functions.js');

module.exports = {

    Users           : require('./controllers/users.controller'),
    Functions       : Functions,
    testConnection  : function (req, res, next) {
        res.json({
            status: 200,
            message: 'Connected!'
        });
    },
    createAdminUser : function(req, res, next) {
        var Users = mongoose.model('User');
        var sampleUser = new Users({
            fullName: "Vahid Sarmadi",
            nationalCode: "1111",
            phoneNumber: "09136666666",
            email: "sarmadivahid@gmail.com",
            role: "Admin"
        });

        sampleUser.save(function(err){
            if(err) {
                console.error(err);
                return res.json({message: 'Failed. Something bad happened.', err: err});
            }
            else {
                return res.json({status: 200, message: 'Sample user saved successfully ...'});
            }
        });
    }

};