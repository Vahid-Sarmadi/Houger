var Reserves = require('mongoose').model('Reserve');
var Users = require('mongoose').model('User');
var Functions = require('../functions.js');
var role;
module.exports = {

    getSpecial : function (req, res, next) {
        // var currentUser = req.user;


        Reserves
            .findOne({_id: req.params._id})
            .where('deleted', false)
            .exec(function (err, reserve) {
                if (err) {
                    console.error(err);
                    return res.json({ status: 500, message: 'Failed. Something bad happened./n/n' + err, content: {} });
                }

                if (!reserve) {
                    console.log('No reserve found!');
                    Functions.setResult(req, 400, 'No reserve found!', "reserve", []);
                    return next();

                } else {

                    console.log('Done! reserve Returned.');
                    Functions.setResult(req, 200, 'Done! reserves Returned.', "reserve", reserve);
                    return next();
                }
            });
    },

    get : function (req, res, next) {
        // var currentUser = req.user;


        Reserves
            .find()
            .where('deleted', false)
            .populate('user table')
            .exec(function (err, reserves) {
                if (err) {
                    console.error(err);
                    return res.json({ status: 500, message: 'Failed. Something bad happened./n/n' + err, content: {} });
                }
                console.log(reserves);
                if (Functions.isEmptyObject(reserves)) {
                    console.log('No reserves found!');
                    Functions.setResult(req, 400, 'No reserves found!', "reserves", []);
                    return next();

                } else {

                    console.log('Done! reserves Returned.');
                    Functions.setResult(req, 200, 'Done! reserves Returned.', "reserves", reserves);
                    return next();
                }
            });
    },

    add : function (req, res, next) {

        if (Functions.isEmpty(req.body.user) ||
            Functions.isEmpty(req.body.table) ||
            Functions.isEmpty(req.body.date) ||
            Functions.isEmpty(req.body.time) ||
            Functions.isEmpty(req.body.description)
        ) {
            console.log('Complete All Field!');
            Functions.setFlash(req.session, "error", "خطا! ", 'همه موارد را پر کنید.', {});
            return res.redirect('/admin/reserves/add');
        }


        Reserves
            .findOne({ user : req.body.user })
            .where('deleted', false )
            .exec(function (err, reserve) {
                if (err) {
                    console.error(err);
                    Functions.setFlash(req.session, "error", "errorPage", "خطا در سرور..." + "/n/n" + err , {});
                    return res.redirect('/error');
                }

                if (reserve) {////////////////////////////////
                    console.log('reserve Already Exists.');
                    Functions.setFlash(req.session, "error", "خطا! ", 'رزرو قبلا ثبت شده است.', {});
                    return res.redirect('/admin/reserves/add');
                }
                Users
                    .findOne({_id: req.body.user})
                    .where('deleted', false)
                    .exec(function (err, user) {
                        if (err) {
                            console.error(err);
                            return res.json({ status: 500, message: 'Failed. Something bad happened./n/n' + err, content: {} });
                        }

                        if (!user) {
                            console.log('No reserve found!');
                            Functions.setResult(req, 400, 'No reserves found!', "reserves", []);
                            return next();

                        } else {

                             role = user.role;
                        }
                    });

                var newReserve = new Reserves({
                    user:    req.body.user ,
                    table: req.body.table,
                    date: req.body.date ,
                    time:  req.body.time ,
                    description:    req.body.description
                });
                newReserve.save(function (err) {
                    if (err) {
                        console.error(err);
                        Functions.setFlash(req.session, "error", "errorPage", "خطا در سرور..." + "/n/n" + err , {});
                        return res.redirect('/error');
                    }
                    if(role == "Manager" || role == "Admin" || role == "Reception" )
                    {
                        newReserve.payed = true;
                    }
                    if(newReserve.payed == true)
                    {
                        console.log('New reserve added successfully.');
                        Functions.setFlash(req.session, "success", "", 'رزرو جدید اضافه شد.', {});
                        return res.redirect('/admin/reserves');
                    }
                    else
                    {
                        console.log('Payed not!!!');
                        Functions.setFlash(req.session, "error", "خطا! ", 'شما حق ثبت این رزرو را ندارید زیرا هزینه پرداخت نشده است', {});
                        return res.redirect('/admin/reserves/add');
                    }


                });

            });
    },

    edit : function (req, res, next) {

        if (Functions.isEmpty(req.body.date) ||
            Functions.isEmpty(req.body.time) ||
            Functions.isEmpty(req.body.description)
        ){
            console.log('Complete All Field!');
            Functions.setFlash(req.session, "error", "خطا! ", 'همه موارد را پر کنید.', {});
            return res.redirect('/admin/reserves/edit/' + req.params._id);
        }




        Reserves.findOneAndUpdate({_id: req.params._id, deleted: false}, {
            user:    req.body.user ,
            table: req.body.table,
            date: req.body.date ,
            time:  req.body.time ,
            description:    req.body.description
        }, function (err, reserve) {
            if (err) {
                console.error(err);
                Functions.setFlash(req.session, "error", "errorPage", "خطا در سرور..." + "/n/n" + err , {});
                return res.redirect('/error');
            }

            if (!reserve) {
                // if no user find
                console.log('Delete reserve failed. reserve not found.');
                Functions.setFlash(req.session, "error", "خطا! ", 'رزرو مورد نظر یافت نشد.', {});
                return res.redirect('/admin/reserves/edit/' + req.params._id);

            } else
            {
                reserve.save();

                console.log('reserve Edited!');
                Functions.setFlash(req.session, "success", "", 'رزرو مورد نظر ویرایش شد.', {});
                return res.redirect('/admin/reserves');

            }
        });
    },

    delete : function (req, res, next) {
        //var currentUser = req.user;

        if (Functions.isEmpty(req.body._id)) {
            console.log('Complete All Field!');
            Functions.setFlash(req.session, "error", "خطا! ", 'موردی انتخاب نشده است.', {});
            return res.redirect('/admin/reserves');
        }

        Reserves.findOneAndUpdate({ _id: req.body._id, deleted: false }, {
            deleted: true
        }, function (err, reserve) {
            if (err) {
                console.error(err);
                Functions.setFlash(req.session, "error", "errorPage", 'خطای نا شناخته...' + '/n/n' + err, {});
                return res.redirect('/error');
            }

            if (!reserve) {
                console.log('Delete user failed. user not found.');
                Functions.setFlash(req.session, "error", "خطا! ", 'رزرو مورد نظر یافت نشد.', {});
                return res.redirect('/admin/reserves');

            } else
            {
                console.log('reserve Deleted!');
                Functions.setFlash(req.session, "success", "", 'رزرو مورد نظر حذف شد.', {});
                return res.redirect('/admin/reserves');
            }
        });
    },

};