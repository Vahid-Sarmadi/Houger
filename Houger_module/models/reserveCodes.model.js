var mongoose = require('mongoose');

var ReserveCode = new mongoose.Schema({
    'reserve' : { type: mongoose.Schema.Types.ObjectId, ref: 'Reserve', require: true },
    'code' : { type: String, require: true },
    'expireTime' : { type: String, require: true },
    'voided' : { type: Boolean, default: false },
    'canceled' : { type: Boolean, default: false },
    'deleted' : { type: Boolean, default: false }
});

ReserveCode.virtual('id')
    .get(function() {
        return this._id;
    });


ReserveCode.pre('save', function(next) {

    next();
});

module.exports = mongoose.model('ReserveCode', ReserveCode);