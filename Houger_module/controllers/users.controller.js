var Users = require('mongoose').model('User');

var Functions = require('../functions.js');

module.exports = {

    getSpecial : function (req, res, next) {
        // var currentUser = req.user;


        Users
            .findOne({_id: req.params._id})
            .where('deleted', false)
            .exec(function (err, user) {
                if (err) {
                    console.error(err);
                    return res.json({ status: 500, message: 'Failed. Something bad happened./n/n' + err, content: {} });
                }

                if (!user) {
                    console.log('No user found!');
                    Functions.setResult(req, 400, 'No user found!', "user", []);
                    return next();

                } else {

                    console.log('Done! user Returned.');
                    Functions.setResult(req, 200, 'Done! user Returned.', "user", user);
                    return next();
                }
            });
    },

    get : function (req, res, next) {
        var currentUser = req.user;

        Users
            .find()
            .where('deleted', false)
            .exec(function (err, users) {
                if (err) {
                    console.error(err);
                    return res.json({ status: 500, message: 'Failed. Something bad happened./n/n' + err, content: {} });
                }

                if (Functions.isEmptyObject(users)) {
                    console.log('No user found!');
                    Functions.setResult(req, 400, 'No user found!', "users", []);
                    return next();

                } else {

                    console.log('Done! users Returned.');
                    Functions.setResult(req, 200, 'Done! user Returned.', "users", users);
                    return next();
                }
            });
    },

    add : function (req, res, next) {

        if (Functions.isEmpty(req.body.fullName) ||
            Functions.isEmpty(req.body.nationalCode) ||
            Functions.isEmpty(req.body.phoneNumber) ||
            Functions.isEmpty(req.body.email) ||
            Functions.isEmpty(req.body.password) ||
            Functions.isEmpty(req.body.role)
        ) {
            console.log('Complete All Field!');
            Functions.setFlash(req.session, "error", "خطا! ", 'همه موارد را پر کنید.', {});
            return res.redirect('/admin/users/add');
        }

        if(req.files.image) {
            if(req.files.image[0].mimetype.indexOf("image") == -1) {
                console.log("File is Not image!!");
                Functions.setFlash(req.session, "error", "خطا!", 'فایل انتخاب شده "تصویر" نیست');
                return res.redirect('/admin/users/add');
            }
        } else {
            console.log('Complete All Field!');
            Functions.setFlash(req.session, "error", "خطا! ", 'همه موارد را پر کنید.', {});
            return res.redirect('/admin/users/add');
        }

        Users
            .findOne({ nationalCode : req.body.nationalCode })
            .where('deleted', false)
            .exec(function (err, user) {
                if (err) {
                    console.error(err);
                    Functions.setFlash(req.session, "error", "errorPage", "خطا در سرور..." + "/n/n" + err , {});
                    return res.redirect('/error');
                }

                if (user) {
                    console.log('User Already Exists.');
                    Functions.setFlash(req.session, "error", "خطا! ", 'کاربر قبلا ثبت شده است.', {});
                    return res.redirect('/admin/users/add');
                }

                var newUser = new Users({
                    fullName : req.body.fullName,
                    nationalCode : req.body.nationalCode,
                    phoneNumber : req.body.phoneNumber,
                    email : req.body.email,
                    password : req.body.password,
                    role : req.body.role,
                    image: '/images/users/' + req.files.image[0].filename
                });



                newUser.save(function (err) {
                    if (err) {
                        console.error(err);
                        Functions.setFlash(req.session, "error", "errorPage", "خطا در سرور..." + "/n/n" + err , {});
                        return res.redirect('/error');
                    }

                    console.log('New User added successfully.');
                    Functions.setFlash(req.session, "success", "", 'کاربر جدید اضافه شد.', {});
                    return res.redirect('/admin/users');

                });

            });
    },

    edit : function (req, res, next) {

        if (Functions.isEmpty(req.body.fullName) ||
            Functions.isEmpty(req.body.nationalCode) ||
            Functions.isEmpty(req.body.phoneNumber) ||
            Functions.isEmpty(req.body.email) ||
            Functions.isEmpty(req.body.role)
        ){
            console.log('Complete All Field!');
            Functions.setFlash(req.session, "error", "خطا! ", 'همه موارد را پر کنید.', {});
            return res.redirect('/admin/users/edit/' + req.params._id);
        }

        if(req.files.image) {
            if(req.files.image[0].mimetype.indexOf("image") == -1) {
                console.log("File is Not image!!");
                Functions.setFlash(req.session, "error", "خطا!", 'فایل انتخاب شده "تصویر" نیست');
                return res.redirect('/admin/users/edit/' + req.params._id);
            }
        }



        Users.findOneAndUpdate({_id: req.params._id, deleted: false}, {
            fullName : req.body.fullName,
            nationalCode : req.body.nationalCode,
            phoneNumber : req.body.phoneNumber,
            email : req.body.email ,
            role : req.body.role 
        }, function (err, user) {
            if (err) {
                console.error(err);
                Functions.setFlash(req.session, "error", "errorPage", "خطا در سرور..." + "/n/n" + err , {});
                return res.redirect('/error');
            }

            if (!user) {
                // if no user find
                console.log('Delete user failed. user not found.');
                Functions.setFlash(req.session, "error", "خطا! ", 'کاربر مورد نظر یافت نشد.', {});
                return res.redirect('/admin/users/edit/' + req.params._id);

            } else {

                if(req.files.image) {
                    user.image = '/images/users/' + req.files.image[0].filename;
                }

                user.save();

                console.log('user Edited!');
                Functions.setFlash(req.session, "success", "", 'کاربر مورد نظر ویرایش شد.', {});
                return res.redirect('/admin/users');

            }
        });
    },

    delete : function (req, res, next) {
        //var currentUser = req.user;

        if (Functions.isEmpty(req.body._id)) {
            console.log('Complete All Field!');
            Functions.setFlash(req.session, "error", "خطا! ", 'موردی انتخاب نشده است.', {});
            return res.redirect('/admin/users');
        }

        Users.findOneAndUpdate({ _id: req.body._id, deleted: false }, {
            deleted: true
        }, function (err, user) {
            if (err) {
                console.error(err);
                Functions.setFlash(req.session, "error", "errorPage", 'خطای نا شناخته...' + '/n/n' + err, {});
                return res.redirect('/error');
            }

            if (!user) {
                console.log('Delete user failed. user not found.');
                Functions.setFlash(req.session, "error", "خطا! ", 'کاربر مورد نظر یافت نشد.', {});
                return res.redirect('/admin/users');

            } else {

                console.log('category Deleted!');
                Functions.setFlash(req.session, "success", "", 'کاربر مورد نظر حذف شد.', {});
                return res.redirect('/admin/users');
            }
        });
    },

};