var ReserveCodes = require('mongoose').model('ReserveCode');
var Users = require('mongoose').model('User');
var Functions = require('../functions.js');
var role;
module.exports = {

    getSpecial : function (req, res, next) {
        // var currentUser = req.user;


        ReserveCodes
            .findOne({_id: req.params._id})
            .where('deleted', false)
            .exec(function (err, reserveCode) {
                if (err) {
                    console.error(err);
                    return res.json({ status: 500, message: 'Failed. Something bad happened./n/n' + err, content: {} });
                }

                if (!reserveCode) {
                    console.log('No reserveCode found!');
                    Functions.setResult(req, 400, 'No reserveCode found!', "reserveCode", []);
                    return next();

                } else {

                    console.log('Done! reserveCode Returned.');
                    Functions.setResult(req, 200, 'Done! reserveCode Returned.', "reserveCode", reserveCode);
                    return next();
                }
            });
    },

    get : function (req, res, next) {
        // var currentUser = req.user;


        ReserveCodes
            .find()
            .where('deleted', false)
            .populate('user' , 'table')
            .exec(function (err, reserveCodes) {
                if (err) {
                    console.error(err);
                    return res.json({ status: 500, message: 'Failed. Something bad happened./n/n' + err, content: {} });
                }

                if (Functions.isEmptyObject(reserveCodes)) {
                    console.log('No reserveCode found!');
                    Functions.setResult(req, 400, 'No reserveCode found!', "reserveCodes", []);
                    return next();

                } else {

                    console.log('Done! reserveCode Returned.');
                    Functions.setResult(req, 200, 'Done! reserveCode Returned.', "reserveCodes", reserveCodes);
                    return next();
                }
            });
    },

    add : function (req, res, next) {

        if (Functions.isEmpty(req.body.reserve) ||
            Functions.isEmpty(req.body.code) ||
            Functions.isEmpty(req.body.expireTime) ||
            Functions.isEmpty(req.body.voided) ||
            Functions.isEmpty(req.body.canceled)
        ) {
            console.log('Complete All Field!');
            Functions.setFlash(req.session, "error", "خطا! ", 'همه موارد را پر کنید.', {});
            return res.redirect('/admin/pages/reserveCodes/add');
        }


        ReserveCodes
            .findOne({ code : req.body.code })
            .where('deleted'    , false )
            .populate('user')
            .exec(function (err, reservesCodes) {
                if (err) {
                    console.error(err);
                    Functions.setFlash(req.session, "error", "errorPage", "خطا در سرور..." + "/n/n" + err , {});
                    return res.redirect('/error');
                }

                if (reservesCodes) {
                    console.log('reserveCodes Already Exists.');
                    Functions.setFlash(req.session, "error", "خطا! ", ' کد رزرو قبلا ثبت شده است.', {});
                    return res.redirect('/admin/pages/reserveCodes/add');
                }
                console.log(reservesCodes);
                Users
                    .findOne({_id: req.body.user})
                    .where('deleted', false)
                    .exec(function (err, reserveCodes) {
                        if (err) {
                            console.error(err);
                            return res.json({ status: 500, message: 'Failed. Something bad happened./n/n' + err, content: {} });
                        }

                        if (!reserveCodes) {
                            console.log('No reserveCodes found!');
                            Functions.setResult(req, 400, 'No reserveCodes found!', "reserveCodes", []);
                            return next();

                        } else {

                             role = user.role;
                        }
                    });

                var newReserveCode = new ReserveCodes({
                    reserve:    req.body.reserve ,
                    code: req.body.code,
                    expireTime: req.body.expireTime ,
                    voided:  req.body.voided ,
                    canceled:    req.body.canceled
                });
                newReserveCode.save(function (err) {
                    if (err) {
                        console.error(err);
                        Functions.setFlash(req.session, "error", "errorPage", "خطا در سرور..." + "/n/n" + err , {});
                        return res.redirect('/error');
                    }

                        console.log('New reserveCode added successfully.');
                        Functions.setFlash(req.session, "success", "", 'کد رزرو جدید اضافه شد.', {});
                        return res.redirect('/admin/reserveCodes');


                });

            });
    },

    edit : function (req, res, next) {

        if (Functions.isEmpty(req.body.reserve) ||
            Functions.isEmpty(req.body.code) ||
            Functions.isEmpty(req.body.expireTime) ||
            Functions.isEmpty(req.body.voided) ||
            Functions.isEmpty(req.body.canceled)
        ){
            console.log('Complete All Field!');
            Functions.setFlash(req.session, "error", "خطا! ", 'همه موارد را پر کنید.', {});
            return res.redirect('/admin/reserveCodes/edit/' + req.params._id);
        }




        ReserveCodes.findOneAndUpdate({_id: req.params._id, deleted: false}, {
            user:    req.body.user ,
            table: req.body.table,
            date: req.body.date ,
            time:  req.body.time ,
            description:    req.body.description
        }, function (err, reserveCode) {
            if (err) {
                console.error(err);
                Functions.setFlash(req.session, "error", "errorPage", "خطا در سرور..." + "/n/n" + err , {});
                return res.redirect('/error');
            }

            if (!reserveCode) {
                // if no user find
                console.log('Delete reserveCode failed. reserveCode not found.');
                Functions.setFlash(req.session, "error", "خطا! ", 'کد رزرو مورد نظر یافت نشد.', {});
                return res.redirect('/admin/reserveCodes/edit/' + req.params._id);

            } else
            {
                reserveCode.save();

                console.log('reserveCode Edited!');
                Functions.setFlash(req.session, "success", "", 'کد رزرو مورد نظر ویرایش شد.', {});
                return res.redirect('/admin/reserveCodes');

            }
        });
    },

    delete : function (req, res, next) {
        //var currentUser = req.user;

        if (Functions.isEmpty(req.body._id)) {
            console.log('Complete All Field!');
            Functions.setFlash(req.session, "error", "خطا! ", 'موردی انتخاب نشده است.', {});
            return res.redirect('/admin/reserveCodes');
        }

        ReserveCodes.findOneAndUpdate({ _id: req.body._id, deleted: false }, {
            deleted: true
        }, function (err, reserveCode) {
            if (err) {
                console.error(err);
                Functions.setFlash(req.session, "error", "errorPage", 'خطای نا شناخته...' + '/n/n' + err, {});
                return res.redirect('/error');
            }

            if (!reserveCode) {
                console.log('Delete reserveCode failed. reserveCode not found.');
                Functions.setFlash(req.session, "error", "خطا! ", 'کد رزرو مورد نظر یافت نشد.', {});
                return res.redirect('/admin/reserveCodes');

            } else
            {
                console.log('reserveCodes Deleted!');
                Functions.setFlash(req.session, "success", "", 'کد رزرو مورد نظر حذف شد.', {});
                return res.redirect('/admin/reserveCodes');
            }
        });
    },

};