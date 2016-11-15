var mongoose = require('mongoose');

var Food = new mongoose.Schema({
    'category' : { type: mongoose.Schema.Types.ObjectId, ref: 'Category', require: true },
    'name' : { type: String, require: true },
    'ingredients' : { type: String, require: true },
    'description' : { type: String, require: true },
    'image' : { type: String, require: true },
    'price' : { type: String, require: true },
    'deleted' : { type: Boolean, default: false }
});

Food.virtual('id')
    .get(function() {
        return this._id;
    });


Food.pre('save', function(next) {

    next();
});

module.exports = mongoose.model('Food', Food);