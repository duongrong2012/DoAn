const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const JwtStrategy = require('passport-jwt').Strategy;
const mongoose = require('mongoose');
const passport = require('passport');
const dotenv = require('dotenv')
const slug = require('mongoose-slug-generator');
const multer = require('multer');
const cors = require('cors');

mongoose.plugin(slug, { lang: "vi", });

dotenv.config();

const indexRouter = require('./routes/index');
const productRouter = require('./routes/product');

const { jwtOptions, multerErrorMessages, mongooseCastErrorField } = require('./utils/constants');
const User = require('./models/User');

passport.use(new JwtStrategy(jwtOptions, async function (jwt_payload, done) {
    try {

        const user = await User.findById(jwt_payload.id, '-password').lean({ getters: true })

        if (user) {
            return done(null, user)
        } else {
            return done(null, false)
        }
    } catch (error) {
        return done(error, false)
    }

}));

var app = express();

mongoose.connect(process.env.DB_URL)

mongoose.connection.on('error', (err) => {
    if (err) {
        throw new Error(`Unable to connect to database: ${err.toString()}`);
    }
});

app.use(cors({ origin: '*' }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //_dirname:thu muc hien tai

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/san-pham', productRouter);

app.use((error, req, res, next) => {
    let { message } = error;

    // const isMongooseError = error.errors;

    let errors = undefined

    const isMongooseError = error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError;

    if (isMongooseError) {
        console.log(error)
        if (error.errors) {
            const [firstErrorKey] = Object.keys(error.errors);

            const firstError = error.errors[firstErrorKey];

            errors = error.errors;

            ({ message } = firstError);

            if (firstError instanceof mongoose.Error.CastError) {
                message = `${firstErrorKey} không hợp lệ`;
            }
        } else {
            message = `${error.path} không hợp lệ`;
        }

    } else if (error instanceof multer.MulterError) {
        message = multerErrorMessages[error.code];
    } else {
        console.error(error);
    }

    res.status(400).json({
        ok: false,
        message,
        errors,
    })
})

module.exports = app;
