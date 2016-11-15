
var Foods = require('mongoose').model('Food');

var Functions = require('../functions.js');

module.exports = {

    getSpecial : function (req, res, next) {
        // var currentUser = req.user;


        Foods
            .findOne({_id: req.params._id})
            .where('deleted', false)
            .populate("category")
            .exec(function (err, food) {
                if (err) {
                    console.error(err);
                    return res.json({ status: 500, message: 'Failed. Something bad happened./n/n' + err, content: {} });
                }

                if (!food) {
                    console.log('No food found!');
                    Functions.setResult(req, 400, 'No food found!', "food", []);
                    return next();

                } else {

                    console.log('Done! food Returned.');
                    Functions.setResult(req, 200, 'Done! food Returned.', "food", food);
                    return next();
                }
            });
    },

    get : function (req, res, next) {
      //  var currentUser = req.user;
     //   var userList = [];

        Foods
            .find()
            .where('deleted', false)
            .populate('category')
            .exec(function (err, foods) {
                if (err) {
                    console.error(err);
                    return res.json({ status: 500, message: 'Failed. Something bad happened./n/n' + err, content: {} });
                }

                if (Functions.isEmptyObject(foods)) {
                    console.log('No foods found!');
                    Functions.setResult(req, 400, 'No Food found!', "foods", []);
                    return next();

                } else {
                    console.log('Done! foods List Returned.');
                    Functions.setResult(req, 200, 'Done! foods List Returned.', "foods", foods);
                    return next();
                }
            });
    },

    add : function (req, res, next) {

        if (Functions.isEmpty(req.body.name) ||
            Functions.isEmpty(req.body.description) ||
            Functions.isEmpty(req.body.ingredients) ||
            Functions.isEmpty(req.body.category) ||
            Functions.isEmpty(req.body.price)
        ) {
            console.log('Complete All Field!');
            Functions.setFlash(req.session, "error", "خطا! ", 'همه موارد را پر کنید.', {});
            return res.redirect('/admin/foods/add');
        }

        if(req.files.image) {
            if(req.files.image[0].mimetype.indexOf("image") == -1) {
                console.log("File is Not image!!");
                Functions.setFlash(req.session, "error", "خطا!", 'فایل انتخاب شده "تصویر" نیست');
                return res.redirect('/admin/foods/add');
            }
        } else
        {
            console.log('Complete All Field!');
            Functions.setFlash(req.session, "error", "خطا! ", 'همه موارد را پر کنید.', {});
            return res.redirect('/admin/foods/add');
        }

        Foods
            .findOne({ name : req.body.name })
            .where('deleted', false)
            .populate("category")
            .exec(function (err, food) {
                if (err) {
                    console.error(err);
                    Functions.setFlash(req.session, "error", "errorPage", "خطا در سرور..." + "/n/n" + err , {});
                    return res.redirect('/error');
                }

                if (food) {
                    console.log('Food Already Exists.');
                    Functions.setFlash(req.session, "error", "خطا! ", 'غذا قبلا ثبت شده است.', {});
                    return res.redirect('/admin/foods/add');
                }

                var newFood = new Foods({
                    name : req.body.name,
                    description : req.body.description,
                    ingredients: req.body.ingredients,
                    category: req.body.category,

                    price: req.body.price,
                    image: '/images/foods/' + req.files.image[0].filename
                });



                newFood.save(function (err) {
                    if (err) {
                        console.error(err);
                        Functions.setFlash(req.session, "error", "errorPage", "خطا در سرور..." + "/n/n" + err , {});
                        return res.redirect('/error');
                    }

                    console.log('New Food added successfully.');
                    Functions.setFlash(req.session, "success", "", 'غذای جدید اضافه شد.', {});
                    return res.redirect('/admin/foods');

                });

            });
    },

    edit : function (req, res, next) {

        if (Functions.isEmpty(req.body.name) ||
            Functions.isEmpty(req.body.description) ||
            Functions.isEmpty(req.body.ingredients) ||
            Functions.isEmpty(req.body.category) ||
            Functions.isEmpty(req.body.price)
        ) {
            console.log('Complete All Field!');
            Functions.setFlash(req.session, "error", "خطا! ", 'همه موارد را پر کنید.', {});
            return res.redirect('/admin/foods/edit' + req.params._id);
        }

        if(req.files.avatar) {
            if(req.files.avatar[0].mimetype.indexOf("image") == -1) {
                console.log("File is Not image!!");
                Functions.setFlash(req.session, "error", "خطا!", 'فایل انتخاب شده "تصویر" نیست');
                return res.redirect('/admin/users/edit' + req.params._id);
            }
        }



        Foods.findOneAndUpdate({_id: req.params._id, deleted: false}, {
                description :req.body.description,
                ingredients :req.body.ingredients,
                category    :req.body.category,
                name        :req.body.name,
                price       :req.body.price
        }, function (err, food) {
            if (err) {
                console.error(err);
                Functions.setFlash(req.session, "error", "errorPage", "خطا در سرور..." + "/n/n" + err , {});
                return res.redirect('/error');
            }

            if (!food) {
                // if no user find
                console.log('Delete food failed. food not found.');
                Functions.setFlash(req.session, "error", "خطا! ", 'غذای مورد نظر یافت نشد.', {});
                return res.redirect('/admin/foods/edit/' + req.params._id);

            } else {

                if(req.files.image) {
                    food.image = '/images/foods/' + req.files.image[0].filename;
                }

                food.save();

                console.log('food Edited!');
                Functions.setFlash(req.session, "success", "", 'غذای مورد نظر ویرایش شد.', {});
                return res.redirect('/admin/foods');

            }
        });
    },

    delete : function (req, res, next) {
        //var currentUser = req.user;


        Foods.findOneAndUpdate({ _id: req.body._id, deleted: false }, {
            deleted: true
        }, function (err, food) {
            if (err) {
                console.error(err);
                Functions.setFlash(req.session, "error", "errorPage", 'خطای نا شناخته...' + '/n/n' + err, {});
                return res.redirect('/error');
            }

            if (!food) {
                // if no user find
                console.log('Delete food failed. food not found.');
                Functions.setFlash(req.session, "error", "خطا! ", 'غذا مورد نظر یافت نشد.', {});
                return res.redirect('/admin/foods');

            } else {

                console.log('food Deleted!');
                Functions.setFlash(req.session, "success", "", 'غذا مورد نظر حذف شد.', {});
                return res.redirect('/admin/foods');
            }
        });
    },

};