var Tables = require('mongoose').model('Table');

var Functions = require('../functions.js');

module.exports = {

    getSpecial : function (req, res, next) {
        // var currentUser = req.user;

        
        Tables
            .findOne({_id: req.params._id})
            .where('deleted', false)
            .exec(function (err, table) {
                if (err) {
                    console.error(err);
                    return res.json({ status: 500, message: 'Failed. Something bad happened./n/n' + err, content: {} });
                }

                if (!table) {
                    console.log('No tables found!');
                    Functions.setResult(req, 400, 'No tables found!', "table", []);
                    return next();

                } else {

                    console.log('Done! tables Returned.');
                    Functions.setResult(req, 200, 'Done! tables Returned.', "table", table);
                    return next();
                }
            });
    },

    get : function (req, res, next) {
       // var currentUser = req.user;


        Tables
            .find()
            .where('deleted', false)
            .exec(function (err, tables) {
                if (err) {
                    console.error(err);
                    return res.json({ status: 500, message: 'Failed. Something bad happened./n/n' + err, content: {} });
                }

                if (Functions.isEmptyObject(tables)) {
                    console.log('No tables found!');
                    Functions.setResult(req, 400, 'No tables found!', "tables", []);
                    return next();

                } else {

                    console.log('Done! tables Returned.');
                    Functions.setResult(req, 200, 'Done! tables Returned.', "tables", tables);
                    return next();
                }
            });
    },

    add : function (req, res, next) {

        if (Functions.isEmpty(req.body.number) ||
            Functions.isEmpty(req.body.capacity)
        ) {
            console.log('Complete All Field!');
            Functions.setFlash(req.session, "error", "خطا! ", 'همه موارد را پر کنید.', {});
            return res.redirect('/admin/tables/add');
        }

        if(req.files.image) {
            if(req.files.image[0].mimetype.indexOf("image") == -1) {
                console.log("File is Not image!!");
                Functions.setFlash(req.session, "error", "خطا!", 'فایل انتخاب شده "تصویر" نیست');
                return res.redirect('/admin/tables/add');
            }
        } else {
            console.log('Complete All Field!');
            Functions.setFlash(req.session, "error", "خطا! ", 'همه موارد را پر کنید.', {});
            return res.redirect('/admin/tables/add');
        }

        Tables
            .findOne({ number : req.body.number })
            .where('deleted', false)
            .exec(function (err, tables) {
                if (err) {
                    console.error(err);
                    Functions.setFlash(req.session, "error", "errorPage", "خطا در سرور..." + "/n/n" + err , {});
                    return res.redirect('/error');
                }

                if (tables) {
                    console.log('Table Already Exists.');
                    Functions.setFlash(req.session, "error", "خطا! ", 'میز قبلا ثبت شده است.', {});
                    return res.redirect('/admin/tables/add');
                }


                var newTable = new Tables({
                    number : req.body.number,
                    capacity : req.body.capacity,
                    description: req.body.description,
                    image: '/images/tables/' + req.files.image[0].filename
                });



                newTable.save(function (err) {
                    if (err) {
                        console.error(err);
                        Functions.setFlash(req.session, "error", "errorPage", "خطا در سرور..." + "/n/n" + err , {});
                        return res.redirect('/error');
                    }

                    console.log('New table added successfully.');
                    Functions.setFlash(req.session, "success", "", 'میز جدید اضافه شد.', {});
                    return res.redirect('/admin/tables');

                });



            });
    },

    edit : function (req, res, next) {

        if (Functions.isEmpty(req.body.number) ||
            Functions.isEmpty(req.body.capacity)
        ) {
            console.log('Complete All Field!');
            Functions.setFlash(req.session, "error", "خطا! ", 'همه موارد را پر کنید.', {});
            return res.redirect('/admin/users/edit' + req.params._id);
        }

        if(req.files.image) {
            if(req.files.image[0].mimetype.indexOf("image") == -1) {
                console.log("File is Not image!!");
                Functions.setFlash(req.session, "error", "خطا!", 'فایل انتخاب شده "تصویر" نیست');
                return res.redirect('/admin/users/edit' + req.params._id);
            }
        }



        Tables.findOneAndUpdate({_id: req.params._id, deleted: false}, {
            number: req.body.number ,
            capacity : req.body.capacity
        }, function (err, table) {
            if (err) {
                console.error(err);
                Functions.setFlash(req.session, "error", "errorPage", "خطا در سرور..." + "/n/n" + err , {});
                return res.redirect('/error');
            }

            if (!table) {
                // if no user find
                console.log('Delete user failed. User not found.');
                Functions.setFlash(req.session, "error", "خطا! ", 'میز مورد نظر یافت نشد.', {});
                return res.redirect('/admin/tables/edit/' + req.params._id);

            } else
            {

                if(req.files.image) {
                    table.image = '/images/tables/' + req.files.image[0].filename;

                }
                table.save();

                console.log('table Edited!');
                Functions.setFlash(req.session, "success", "", 'میز مورد نظر ویرایش شد.', {});
                return res.redirect('/admin/tables');

            }
        });
    },

    delete : function (req, res, next) {
        var currentUser = req.user;


        Tables.findOneAndUpdate({ _id: req.body._id, deleted: false }, {
            deleted: true
        }, function (err, tables) {
            if (err) {
                console.error(err);
                Functions.setFlash(req.session, "error", "errorPage", 'خطای نا شناخته...' + '/n/n' + err, {});
                return res.redirect('/error');
            }

            if (!tables) {
                // if no user find
                console.log('Delete user failed. User not found.');
                Functions.setFlash(req.session, "error", "خطا! ", 'میز مورد نظر یافت نشد.', {});
                return res.redirect('/admin/tables');

            } else {

                console.log('Table Deleted!');
                Functions.setFlash(req.session, "success", "", 'میز مورد نظر حذف شد.', {});
                return res.redirect('/admin/tables');
            }
        });
    },

};