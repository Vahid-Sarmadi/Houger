var mongoose = require('mongoose');

var PhoneNumber = new mongoose.Schema({
    'phone' : { type: String, require: true },
    'timeToSend' : { type: String, require: true },
    'text' : { type: String, require: true },
    'sent' : { type: Boolean, default: false },
    'deleted' : { type: Boolean, default: false }
});

PhoneNumber.virtual('id')
    .get(function() {
        return this._id;
    });


PhoneNumber.pre('save', function(next) {

    next();
});

module.exports = mongoose.model('PhoneNumber', PhoneNumber);