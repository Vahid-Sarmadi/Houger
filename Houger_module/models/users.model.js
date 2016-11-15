var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var User = new mongoose.Schema({
    'fullName' : { type: String, require: true },
    'nationalCode' : { type: String, require: true },           //todo: ??? bashe ya nabashe
    'phoneNumber' : { type: String, require: true },
    'email' : { type: String, require: true },
    '_password' : { type: String },
    'image' : { type: String, require: true },
    'registrationDate' : { type: String, default: Math.floor(Date.now() / 1000) },
    'role' : { type: String, enum:["Customer", "Reception", "Manager", "Admin"], default: "Customer"  },
    'deleted' : { type: Boolean, default: false }
});

User.virtual('id')
    .get(function() {
        return this._id;
    });

User.virtual('password')
    .set(function(password) {
        this._password = this.encryptPassword(password);
    });

User.method('authenticate', function(password) {
    return bcrypt.compareSync(password, this._password);
});

User.method('encryptPassword', function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
});


User.pre('save', function(next) {

    next();
});

module.exports = mongoose.model('User', User);