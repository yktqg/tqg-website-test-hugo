const express = require('express');
const session = require('express-session');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressGoogleAnalytics = require('express-google-analytics');
const analytics = expressGoogleAnalytics('UA-121802688-1');
const dotenv = require('dotenv').config();
const engines = require('consolidate');

const API_KEY = '0a98e767024f339985a40eec93099c5d-c27bf672-180902ee';
const DOMAIN = 'mg.johnssonswebb.com';
const mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN});

const indexRoute = require('./routes/index');
const aboutRoute = require('./routes/about');
const investorRelationsRoute = require('./routes/investor_relations');
const customerRelationsRoute = require('./routes/customer_relations');
const downloadsRoute = require('./routes/downloads');
const mailRoutes = require('./routes/mail');
const dashboardRoute = require('./routes/dashboard');
const shortPulseTransformersRoute = require('./routes/short_pulse_transformers');
const dcdcTransformersAndMicroGridsRoute = require('./routes/dcdc_transformers_and_microgrids');
const industrialIotControlRoute = require('./routes/industrial_iot_control');
const tempHumidityRoute = require('./routes/temp_humidity');
const opcUaRoute = require('./routes/opc_ua');
const oneEightRoute = require('./routes/1_8kw_power_supply');
const fiftyShortPulse = require('./routes/50kv_100a_short_pulse');
const tenKwRoute = require('./routes/10kw_dcdc_transformer');
const thanksRoute = require('./routes/thanks');
const apiRoute = require('./routes/api');
const loginRoute = require('./routes/login');
const competencesRoute = require('./routes/competences_and_services');

const app = express();

const env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup
app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'ejs');

//app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(analytics);
app.use('/', indexRoute);
app.use('/about', aboutRoute);
app.use('/investor_relations', investorRelationsRoute);
app.use('/customer_relations', customerRelationsRoute);
app.use('/competences_and_services', competencesRoute);

// main focus areas
app.use('/short_pulse_transformers', shortPulseTransformersRoute);
app.use('/dcdc_transformers_and_microgrids', dcdcTransformersAndMicroGridsRoute);
app.use('/industrial_iot_control', industrialIotControlRoute);

// products and prototypes
app.use('/temp_humidity_sensor', tempHumidityRoute);
app.use('/opc_ua', opcUaRoute);
app.use('/1_8kw_power_supply', oneEightRoute);
app.use('/50kv_100a_short_pulse', fiftyShortPulse);
app.use('/10kw_dcdc_transformer', tenKwRoute);

// downloads
app.use('/downloads', downloadsRoute);

// mail
app.use('/mail', mailRoutes);

// thanks
app.use('/thanks', thanksRoute);

// dashboard
app.use('/dashboard', dashboardRoute);

// api
app.use('/api', apiRoute);

// login
app.use('/login', loginRoute);

/// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});

module.exports = app;
