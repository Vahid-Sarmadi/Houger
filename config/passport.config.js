// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var Users = require('mongoose').model('User');

// load the auth variables
var configAuth = require('./auth.config.js');

var Functions = require('../Houger_module/functions');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        Users.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, fullName, nationalCode, done) {

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {

                if (Functions.isEmpty(fullName) || Functions.isEmpty(nationalCode)) {
                    return done(null, false, { message: 'لطفا همه موارد را وارد کنید' });
                }

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                Users
                    .findOne({ $or: [{'local.email' :  email}, {'google.email' :  email}] })
                    .where('deleted', false)
                    .exec(function(err, user) {
                        // if there are any errors, return the error
                        if (err)
                            return done(err);

                        // check to see if theres already a user with that email
                        if (user) {
                            if (user.local) {
                                return done(null, false, { message: 'شما قبلا ثبت نام کرده اید' });
                            } else if (user.google) {
                                return done(null, false, { message: 'شما قبلا  با گوگل ثبت نام کرده اید' });
                            }

                        } else {

                            // if there is no user with that email
                            // create the user
                            var newUser = new Users();

                            // set the user's local credentials
                            newUser.fullName        = fullName;
                            newUser.nationalCode    = nationalCode;

                            // save the user
                            newUser.save(function(err) {
                                if (err)
                                    done(err);
                                return done(null, newUser, {'message': 'خوش آمدید'});
                            });
                        }

                    });

            });

        }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form

            if (Functions.isEmpty(email) || Functions.isEmpty(password)) {
                return done(null, false, { status: 501, message: 'لطفا همه موارد را وارد کنید' });
            }

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            Users
                .findOne({'email' :  email })
                .where('deleted', false)
                .exec(function(err, user) {
                    // if there are any errors, return the error before anything else
                    if (err)
                        return done(err);


                    // if no user is found, return the message
                    if (!user)
                        return done(null, false, { status: 400, message: 'ایمیل یا کلمه عبور نادرست است' });

                    // if the user is found but the password is wrong
                    if (!user.authenticate(password))
                        return done(null, false, { status: 400, message:  'ایمیل یا کلمه عبور نادرست است'});

                    // all is well, return successful user
                    return done(null, user, { status: 200, message: 'خوش آمدید.'});
                });


        }));

};