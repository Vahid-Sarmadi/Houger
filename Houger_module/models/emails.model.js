var mongoose = require('mongoose');

var Email = new mongoose.Schema({
    'emailAddress' : { type: String, require: true },
    'timeToSend' : { type: String, require: true },
    'text' : { type: String, require: true },
    'sent' : { type: Boolean, default: false },
    'deleted' : { type: Boolean, default: false }
});

Email.virtual('id')
    .get(function() {
        return this._id;
    });


Email.pre('save', function(next) {

    next();
});

module.exports = mongoose.model('Email', Email);