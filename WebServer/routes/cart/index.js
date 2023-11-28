var express = require('express');

const passport = require('passport');
const { validateProductExist, validateProductExistInCart, validateProductCart } = require('./middlewares');

const {
    onAddProduct,
    onDeleteProduct,
    onGetCartProduct,
} = require('./controllers');
const { } = require('./middlewares');
const { checkCaptCha } = require('../user/middlewares');

// const passport = require('passport');
const router = express.Router();

router.post('/',
    checkCaptCha,
    passport.authenticate('jwt', { session: false }),
    validateProductExist,
    onAddProduct,
);
router.delete('/',
    passport.authenticate('jwt', { session: false }),
    onDeleteProduct,
);

router.get('/',
    passport.authenticate('jwt', { session: false }),
    onGetCartProduct,
);


module.exports = router;
