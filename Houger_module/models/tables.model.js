var mongoose = require('mongoose');

var Table = new mongoose.Schema({
    'number' : { type: String, require: true, unique: true },
    'capacity' : { type: Number, require: true },
    'position' : { type: String, require: true },
    'image' : { type: String, require: true },
    'description' : { type: String },
    'deleted' : { type: Boolean, default: false }
});

Table.virtual('id')
    .get(function() {
        return this._id;
    });

Table.pre('save', function(next) {

    next();
});

module.exports = mongoose.model('Table', Table);