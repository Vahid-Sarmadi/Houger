var mongoose = require('mongoose');

var Transaction = new mongoose.Schema({
    'user' : { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    'reserve' : { type: mongoose.Schema.Types.ObjectId, ref: 'Reserve', require: true },
    'date' : { type: String, require: true },
    'time' : { type: String, require: true },
    'missionary' : { type: String, require: true },
    'registrationDate' : { type: String, default: Math.floor(Date.now() / 1000) },
    'deleted' : { type: Boolean, default: false }
});

Transaction.virtual('id')
    .get(function() {
        return this._id;
    });


Transaction.pre('save', function(next) {

    next();
});

module.exports = mongoose.model('Transaction', Transaction);