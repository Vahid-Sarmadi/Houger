var mongoose = require('mongoose');

var Category = new mongoose.Schema({
    'name' : { type: String, require: true },
    'deleted' : { type: Boolean, default: false }
});

Category.virtual('id')
    .get(function() {
        return this._id;
    });


Category.pre('save', function(next) {

    next();
});

module.exports = mongoose.model('Category', Category);