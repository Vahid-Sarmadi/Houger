var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');
var multer = require('multer');

require('./Houger_module');
require('./config/passport.config.js')(passport); // pass passport for configuration


/* routes */
var Routes = {
  Admin: {
    index: require('./routes/admin/index'),
    Users: require('./routes/admin/users.routes'),
    Categories: require('./routes/admin/categories.routes'),
    Foods: require('./routes/admin/foods.routes'),
    Tables: require('./routes/admin/tables.routes'),
    phoneNumbers: require('./routes/admin/phoneNumbers.routes'),
    Reserves: require('./routes/admin/reserves.routes'),
    ReserveCodes: require('./routes/admin/reserveCodes.routes'),
    Emails: require('./routes/admin/emails.routes'),
  },
  Manager: {
    index: require('./routes/manager/index'),
  },
  Reception: {
    index: require('./routes/reception/index'),
  },
  Customer: {
    index: require('./routes/customer/index'),
  },
  Api: {
    index: require('./routes/api/v1/index'),
    Foods: require('./routes/api/v1/foods.routes'),
    Categories: require('./routes/api/v1/categories.routes'),
    Tables : require('./routes/api/v1/tables.routes'),
    Emails : require('./routes/api/v1/emails.routes'),
    phoneNumbers : require('./routes/api/v1/phoneNumbers.routes'),
    ReserveCodes : require('./routes/api/v1/reserveCodes.routes'),
    Reserves : require('./routes/api/v1/reserves.routes'),
    Users : require('./routes/api/v1/users.routes'),
  }
};

var app = express();

// trust first proxy
app.set('trust proxy', 1);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'Houger@310274',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());

// User -> routes
app.use('/', Routes.Customer.index);

// Api -> routes
app.use('/api', Routes.Api.index);
app.use('/api/foods', Routes.Api.Foods);
app.use('/api/categories', Routes.Api.Categories);
app.use('/api/tables', Routes.Api.Tables);
app.use('/api/emails', Routes.Api.Emails);
app.use('/api/phoneNumbers', Routes.Api.phoneNumbers);
app.use('/api/Reserves', Routes.Api.Reserves);
app.use('/api/reserveCodes', Routes.Api.ReserveCodes);
app.use('/api/users', Routes.Api.Users);

// Reception -> routes
app.use('/reception', Routes.Reception.index);

// Manager -> routes
app.use('/manager', Routes.Manager.index);

// Admin -> routes
app.use('/admin', Routes.Admin.index);
app.use('/admin/users', Routes.Admin.Users);
app.use('/admin/foods', Routes.Admin.Foods);
app.use('/admin/categories', Routes.Admin.Categories);
app.use('/admin/tables', Routes.Admin.Tables);
app.use('/admin/phoneNumbers', Routes.Admin.phoneNumbers);
app.use('/admin/Reserves', Routes.Admin.Reserves);
app.use('/admin/reserveCodes', Routes.Admin.ReserveCodes);
app.use('/admin/emails', Routes.Admin.Emails);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
