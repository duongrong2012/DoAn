var express = require('express');

const passport = require('passport');
const { validateProductExist, validateProductExistInCart } = require('./middlewares');

const {
    onAddProduct,
    onGetProduct
} = require('./controllers');
const { } = require('./middlewares');

// const passport = require('passport');
const router = express.Router();

router.post('/',
    passport.authenticate('jwt', { session: false }),
    validateProductExist,
    onAddProduct,
);

router.get('/',
    passport.authenticate('jwt', { session: false }),
    onGetProduct,
);


module.exports = router;
