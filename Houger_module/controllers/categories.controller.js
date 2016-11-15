var Categories = require('mongoose').model('Category');

var Functions = require('../functions.js');

module.exports = {

    getSpecial : function (req, res, next) {
       // var currentUser = req.user;


        Categories
            .findOne({_id: req.params._id})
            .where('deleted', false)
            .exec(function (err, category) {
                if (err) {
                    console.error(err);
                    return res.json({ status: 500, message: 'Failed. Something bad happened./n/n' + err, content: {} });
                }

                if (!category) {
                    console.log('No category found!');
                    Functions.setResult(req, 400, 'No category found!', "category", []);
                    return next();

                } else {

                    console.log('Done! category Returned.');
                    Functions.setResult(req, 200, 'Done! category Returned.', "category", category);
                    return next();
                }
            });
    },

    get : function (req, res, next) {
       // var currentUser = req.user;


        Categories
            .find()
            .where('deleted', false)
            .exec(function (err, categories) {
                if (err) {
                    console.error(err);
                    return res.json({ status: 500, message: 'Failed. Something bad happened./n/n' + err, content: {} });
                }

                if (Functions.isEmptyObject(categories)) {
                    console.log('No categories found!');
                    Functions.setResult(req, 400, 'No categories found!', "categories", []);
                    return next();

                } else {

                    console.log('Done! categories Returned.');
                    Functions.setResult(req, 200, 'Done! categories Returned.', "categories", categories);
                    return next();
                }
            });
    },

    add : function (req, res, next) {

        if (Functions.isEmpty(req.body.name)) {
            console.log('Complete All Field!');
            Functions.setFlash(req.session, "error", "خطا! ", 'همه موارد را پر کنید.', {});
            return res.redirect('/admin/categories/add');
        }

        if(req.files.image) {
            if(req.files.image[0].mimetype.indexOf("image") == -1) {
                console.log("File is Not image!!");
                Functions.setFlash(req.session, "error", "خطا!", 'فایل انتخاب شده "تصویر" نیست');
                return res.redirect('/admin/categories/add');
            }
        } else {
            console.log('Complete All Field!');
            Functions.setFlash(req.session, "error", "خطا! ", 'همه موارد را پر کنید.', {});
            return res.redirect('/admin/categories/add');
        }

        Categories
            .findOne({ name : req.body.name })
            .where('deleted', false)
            .exec(function (err, category) {
                if (err) {
                    console.error(err);
                    Functions.setFlash(req.session, "error", "errorPage", "خطا در سرور..." + "/n/n" + err , {});
                    return res.redirect('/error');
                }

                if (category) {
                    console.log('Category Already Exists.');
                    Functions.setFlash(req.session, "error", "خطا! ", 'دسته بندی قبلا ثبت شده است.', {});
                    return res.redirect('/admin/categories/add');
                }

                var newCategory = new Categories({
                    name : req.body.name,
                    image: '/images/categories/' + req.files.image[0].filename
                });



                newCategory.save(function (err) {
                    if (err) {
                        console.error(err);
                        Functions.setFlash(req.session, "error", "errorPage", "خطا در سرور..." + "/n/n" + err , {});
                        return res.redirect('/error');
                    }

                    console.log('New Category added successfully.');
                    Functions.setFlash(req.session, "success", "", 'دسته بندی جدید اضافه شد.', {});
                    return res.redirect('/admin/categories');

                });

            });
    },

    edit : function (req, res, next) {

        if (Functions.isEmpty(req.body.name)) {
            console.log('Complete All Field!');
            Functions.setFlash(req.session, "error", "خطا! ", 'همه موارد را پر کنید.', {});
            return res.redirect('/admin/categories/edit/' + req.params._id);
        }

        if(req.files.image) {
            if(req.files.image[0].mimetype.indexOf("image") == -1) {
                console.log("File is Not image!!");
                Functions.setFlash(req.session, "error", "خطا!", 'فایل انتخاب شده "تصویر" نیست');
                return res.redirect('/admin/categories/edit/' + req.params._id);
            }
        }



        Categories.findOneAndUpdate({_id: req.params._id, deleted: false}, {
            name: req.body.name
        }, function (err, category) {
            if (err) {
                console.error(err);
                Functions.setFlash(req.session, "error", "errorPage", "خطا در سرور..." + "/n/n" + err , {});
                return res.redirect('/error');
            }

            if (!category) {
                // if no category find
                console.log('Delete category failed. category not found.');
                Functions.setFlash(req.session, "error", "خطا! ", 'دسته بندی مورد نظر یافت نشد.', {});
                return res.redirect('/admin/categories/edit/' + req.params._id);

            } else {

                if(req.files.image) {
                    category.image = '/images/categories/' + req.files.image[0].filename;
                }

                category.save();

                console.log('category Edited!');
                Functions.setFlash(req.session, "success", "", 'دسته بندی مورد نظر ویرایش شد.', {});
                return res.redirect('/admin/categories');

            }
        });
    },

    delete : function (req, res, next) {
        //var currentUser = req.user;

        if (Functions.isEmpty(req.body._id)) {
            console.log('Complete All Field!');
            Functions.setFlash(req.session, "error", "خطا! ", 'موردی انتخاب نشده است.', {});
            return res.redirect('/admin/categories');
        }

        Categories.findOneAndUpdate({ _id: req.body._id, deleted: false }, {
            deleted: true
        }, function (err, category) {
            if (err) {
                console.error(err);
                Functions.setFlash(req.session, "error", "errorPage", 'خطای نا شناخته...' + '/n/n' + err, {});
                return res.redirect('/error');
            }

            if (!category) {
                console.log('Delete category failed. category not found.');
                Functions.setFlash(req.session, "error", "خطا! ", 'دسته بندی مورد نظر یافت نشد.', {});
                return res.redirect('/admin/categories');

            } else {

                console.log('category Deleted!');
                Functions.setFlash(req.session, "success", "", 'دسته بندی مورد نظر حذف شد.', {});
                return res.redirect('/admin/categories');
            }
        });
    },

};