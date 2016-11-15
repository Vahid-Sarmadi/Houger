var Numbers = require('mongoose').model('PhoneNumber');

var Functions = require('../functions.js');

module.exports = {
    getSpecial : function (req, res, next) {
        // var currentUser = req.user;


        Numbers
            .findOne({_id: req.params._id})
            .where('deleted', false)
            .exec(function (err, number) {
                if (err) {
                    console.error(err);
                    return res.json({ status: 500, message: 'Failed. Something bad happened./n/n' + err, content: {} });
                }

                if (!number) {
                    console.log('No phoneNumbers found!');
                    Functions.setResult(req, 400, 'No phoneNumbers found!', "number", []);
                    return next();

                } else
                {

                    console.log('Done! phoneNumbers Returned.');
                    Functions.setResult(req, 200, 'Done! phoneNumbers Returned.', "number", number);
                    return next();
                }
            });
    },

    get : function (req, res, next) {
       // var currentUser = req.user;


        Numbers
            .find()
            .where('deleted', false)
            .exec(function (err, numbers) {
                if (err) {
                    console.error(err);
                    return res.json({ status: 500, message: 'Failed. Something bad happened./n/n' + err, content: {} });
                }

                if (Functions.isEmptyObject(numbers)) {
                    console.log('No phoneNumbers found!');
                    Functions.setResult(req, 400, 'No phoneNumbers found!', "numbers", []);
                    return next();

                } else {

                    console.log('Done! phoneNumbers Returned.');
                    Functions.setResult(req, 200, 'Done! phoneNumbers Returned.', "numbers", numbers);
                    return next();
                }
            });
    },

    add : function (req, res, next) {


        if (Functions.isEmpty(req.body.phone) ||
            Functions.isEmpty(req.body.timeToSend) ||
            Functions.isEmpty(req.body.text) 
        ){
            console.log('Complete All Field!');
            Functions.setFlash(req.session, "error", "خطا! ", 'همه موارد را پر کنید.', {});
            return res.redirect('/admin/phoneNumbers/add');
        }

        Numbers
            .findOne({ phone : req.body.phone })
            .where('deleted', false)
            .exec(function (err, numbers) {
                if (err) {
                    console.error(err);
                    Functions.setFlash(req.session, "error", "errorPage", "خطا در سرور..." + "/n/n" + err , {});
                    return res.redirect('/error');
                }

                if (numbers) {
                    console.log('phoneNumbers Already Exists.');
                    Functions.setFlash(req.session, "error", "خطا! ", 'شماره قبلا ثبت شده است.', {});
                    return res.redirect('/admin/phoneNumbers/add');
                }

                var newPhone = new Numbers({
                    phone : req.body.phone,
                    timeToSend : req.body.timeToSend,
                    text : req.body.text
                });



                newPhone.save(function (err) {
                    if (err) {
                        console.error(err);
                        Functions.setFlash(req.session, "error", "errorPage", "خطا در سرور..." + "/n/n" + err , {});
                        return res.redirect('/error');
                    }

                    console.log('New phoneNumbers added successfully.');
                    Functions.setFlash(req.session, "success", "", 'شماره جدید اضافه شد.', {});
                    return res.redirect('/admin/phoneNumbers');

                });

            });
    },

    edit : function (req, res, next) {

        if (Functions.isEmpty(req.body.phone) ||
            Functions.isEmpty(req.body.timeToSend) ||
            Functions.isEmpty(req.body.text)
        ) {
            console.log('Complete All Field!');
            Functions.setFlash(req.session, "error", "خطا! ", 'همه موارد را پر کنید.', {});
            return res.redirect('/admin/phoneNumbers/edit' + req.params._id);
        }




        Numbers.findOneAndUpdate({_id: req.params._id, deleted: false}, {
            phone :  req.body.phone ,
            timeToSend :  req.body.timeToSend ,
            text :  req.body.text
        }, function (err, number) {
            if (err) {
                console.error(err);
                Functions.setFlash(req.session, "error", "errorPage", "خطا در سرور..." + "/n/n" + err , {});
                return res.redirect('/error');
            }
            

            if (!number) {
                console.log('Delete phoneNumbers failed. phoneNumbers not found.');
                Functions.setFlash(req.session, "error", "خطا! ", 'شماره مورد نظر یافت نشد.', {});
                return res.redirect('/admin/phoneNumbers/edit/' + req.params._id);

            } else
            {
    
                number.save();

                console.log('Email Edited!');
                Functions.setFlash(req.session, "success", "", 'شماره مورد نظر ویرایش شد.', {});
                return res.redirect('/admin/phoneNumbers');

            }
        });
    },

    delete : function (req, res, next) {
        //var currentUser = req.user;
        if (Functions.isEmpty(req.body._id)) {
            console.log('Complete All Field!');
            Functions.setFlash(req.session, "error", "خطا! ", 'موردی انتخاب نشده است.', {});
            return res.redirect('/admin/phoneNumbers');
        }

        Numbers.findOneAndUpdate({ _id: req.body._id, deleted: false }, {
            deleted: true
        }, function (err, number) {
            if (err) {
                console.error(err);
                Functions.setFlash(req.session, "error", "errorPage", 'خطای نا شناخته...' + '/n/n' + err, {});
                return res.redirect('/error');
            }

            if (!number) {
                // if no email find
                console.log('Delete phoneNumbers failed. phoneNumbers not found.');
                Functions.setFlash(req.session, "error", "خطا! ", 'شماره مورد نظر یافت نشد.', {});
                return res.redirect('/admin/phoneNumbers');

            }
            else
            {

                console.log('phoneNumbers Deleted!');
                Functions.setFlash(req.session, "success", "", 'شماره مورد نظر حذف شد.', {});
                return res.redirect('/admin/phoneNumbers');
            }
        });
    },

};