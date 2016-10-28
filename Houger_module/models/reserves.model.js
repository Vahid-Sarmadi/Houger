var mongoose = require('mongoose');

var Reserve = new mongoose.Schema({
    'user' : { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    'table' : { type: mongoose.Schema.Types.ObjectId, ref: 'Table', require: true },
    'date' : { type: String, require: true },
    'time' : { type: String, require: true },
    'moreSeat' : { type: Number, default: 0 },
    'description' : { type: String, require: true },
    'registrationDate' : { type: String, default: Math.floor(Date.now() / 1000) },
    'payed' : { type: Boolean, default: false },
    'deleted' : { type: Boolean, default: false }
});

Reserve.virtual('id')
    .get(function() {
        return this._id;
    });


Reserve.pre('save', function(next) {

    next();
});

module.exports = mongoose.model('Reserve', Reserve);