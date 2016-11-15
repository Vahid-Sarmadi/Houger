var Emails = require('mongoose').model('Email');

var Functions = require('../functions.js');

module.exports = {
    getSpecial : function (req, res, next) {
        // var currentUser = req.user;


        Emails
            .findOne({_id: req.params._id})
            .where('deleted', false)
            .exec(function (err, emails) {
                if (err) {
                    console.error(err);
                    return res.json({ status: 500, message: 'Failed. Something bad happened./n/n' + err, content: {} });
                }

                if (!emails) {
                    console.log('No email found!');
                    Functions.setResult(req, 400, 'No email found!', "emails", []);
                    return next();

                } else
                {

                    console.log('Done! email Returned.');
                    Functions.setResult(req, 200, 'Done! email Returned.', "emails", emails);
                    return next();
                }
            });
    },

    get : function (req, res, next) {
       // var currentUser = req.user;


        Emails
            .find()
            .where('deleted', false)
            .exec(function (err, emails) {
                if (err) {
                    console.error(err);
                    return res.json({ status: 500, message: 'Failed. Something bad happened./n/n' + err, content: {} });
                }

                if (Functions.isEmptyObject(emails)) {
                    console.log('No Email found!');
                    Functions.setResult(req, 400, 'No email found!', "emails", []);
                    return next();

                } else {

                    console.log('Done! email Returned.');
                    Functions.setResult(req, 200, 'Done! Emails Returned.', "emails", emails);
                    return next();
                }
            });
    },

    add : function (req, res, next) {

        console.log(req.body.emailAddress);
        console.log(req.body.timeToSend);
        console.log(req.body.text);

        if (Functions.isEmpty(req.body.emailAddress) ||
            Functions.isEmpty(req.body.timeToSend) ||
            Functions.isEmpty(req.body.text) 
        ){
            console.log('Complete All Field!');
            Functions.setFlash(req.session, "error", "خطا! ", 'همه موارد را پر کنید.', {});
            return res.redirect('/admin/emails/add');
        }

        Emails
            .findOne({ emailAddress : req.body.emailAddress })
            .where('deleted', false)
            .exec(function (err, emails) {
                if (err) {
                    console.error(err);
                    Functions.setFlash(req.session, "error", "errorPage", "خطا در سرور..." + "/n/n" + err , {});
                    return res.redirect('/error');
                }

                if (emails) {
                    console.log('Category Already Exists.');
                    Functions.setFlash(req.session, "error", "خطا! ", 'ایمیل  قبلا ثبت شده است.', {});
                    return res.redirect('/admin/emails/add');
                }

                var newEmail = new Emails({
                    emailAddress : req.body.emailAddress,
                    timeToSend : req.body.timeToSend,
                    text : req.body.text
                });



                newEmail.save(function (err) {
                    if (err) {
                        console.error(err);
                        Functions.setFlash(req.session, "error", "errorPage", "خطا در سرور..." + "/n/n" + err , {});
                        return res.redirect('/error');
                    }

                    console.log('New Email added successfully.');
                    Functions.setFlash(req.session, "success", "", 'ایمیل  جدید اضافه شد.', {});
                    return res.redirect('/admin/emails');

                });

            });
    },

    edit : function (req, res, next) {

        if (Functions.isEmpty(req.body.emailAddress) ||
            Functions.isEmpty(req.body.timeToSend) ||
            Functions.isEmpty(req.body.text)
        ) {
            console.log('Complete All Field!');
            Functions.setFlash(req.session, "error", "خطا! ", 'همه موارد را پر کنید.', {});
            return res.redirect('/admin/emails/edit' + req.params._id);
        }




        Emails.findOneAndUpdate({_id: req.params._id, deleted: false}, {
            emailAddress :  req.body.emailAddress ,
            timeToSend :  req.body.timeToSend ,
            text :  req.body.text
        }, function (err, email) {
            if (err) {
                console.error(err);
                Functions.setFlash(req.session, "error", "errorPage", "خطا در سرور..." + "/n/n" + err , {});
                return res.redirect('/error');
            }
            

            if (!email) {
                console.log('Delete email failed. email not found.');
                Functions.setFlash(req.session, "error", "خطا! ", 'ایمیل مورد نظر یافت نشد.', {});
                return res.redirect('/admin/emails/edit/' + req.params._id);

            } else
            {
    
                email.save();

                console.log('Email Edited!');
                Functions.setFlash(req.session, "success", "", 'ایمیل مورد نظر ویرایش شد.', {});
                return res.redirect('/admin/emails');

            }
        });
    },

    delete : function (req, res, next) {
        //var currentUser = req.user;
        if (Functions.isEmpty(req.body._id)) {
            console.log('Complete All Field!');
            Functions.setFlash(req.session, "error", "خطا! ", 'موردی انتخاب نشده است.', {});
            return res.redirect('/admin/emails');
        }

        Emails.findOneAndUpdate({ _id: req.body._id, deleted: false }, {
            deleted: true
        }, function (err, email) {
            if (err) {
                console.error(err);
                Functions.setFlash(req.session, "error", "errorPage", 'خطای نا شناخته...' + '/n/n' + err, {});
                return res.redirect('/error');
            }

            if (!email) {
                // if no email find
                console.log('Delete email failed. email not found.');
                Functions.setFlash(req.session, "error", "خطا! ", 'ایمیل مورد نظر یافت نشد.', {});
                return res.redirect('/admin/emails');

            }
            else
            {

                console.log('email Deleted!');
                Functions.setFlash(req.session, "success", "", 'ایمیل مورد نظر حذف شد.', {});
                return res.redirect('/admin/emails');
            }
        });
    },

};