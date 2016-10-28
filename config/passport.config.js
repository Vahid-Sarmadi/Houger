// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var Users = require('mongoose').model('User');

// load the auth variables
var configAuth = require('./auth.config.js');

var Functions = require('./functions');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'fullName',
            passwordField : 'nationalCode',
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
                return done(null, false, { message: 'لطفا همه موارد را وارد کنید' });
            }

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            Users
                .findOne({'local.email' :  email })
                .where('deleted', false)
                .exec(function(err, user) {
                    // if there are any errors, return the error before anything else
                    if (err)
                        return done(err);


                    // if no user is found, return the message
                    if (!user)
                        return done(null, false, { message: 'ایمیل وارد شده نادرست است.' });

                    // if the user is found but the password is wrong
                    if (!user.authenticate(password))
                        return done(null, false, { message:  'کلمه عبور نادرست است.'});

                    // all is well, return successful user
                    return done(null, user, { message: 'خوش آمدید.'});
                });


        }));


    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

            clientID        : configAuth.googleAuth.clientID,
            clientSecret    : configAuth.googleAuth.clientSecret,
            callbackURL     : configAuth.googleAuth.callbackURL

        },
        function(token, refreshToken, profile, done) {

            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Google
            process.nextTick(function() {

                // try to find the user based on their google id
                Users
                    .findOne({ $or: [{'google.id' : profile.id }, {'local.email' : profile.emails[0].value}] })
                    .where('deleted', false)
                    .exec(function(err, user) {
                        if (err)
                            return done(err);

                        if (user) {

                            // if a user is found, log them in
                            return done(null, user, { message: 'خوش آمدید' });
                        } else {
                            // if the user isnt in our database, create a new user
                            var newUser          = new Users();

                            // set all of the relevant information
                            newUser.google.id    = profile.id;
                            newUser.google.token = token;
                            newUser.google.name  = profile.displayName;
                            newUser.google.email = profile.emails[0].value; // pull the first email

                            newUser.createProfile();

                            // save the user
                            newUser.save(function(err) {
                                if (err)
                                    done(err);
                                process.nextTick(function () {
                                    //Functions.sendWelcomeEmail(user);      //todo: send welcome email to new User
                                });
                                return done(null, newUser, { message: 'خوش آمدید' });
                            });
                        }
                    });
            });

        }));


};