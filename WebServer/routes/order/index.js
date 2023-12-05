var express = require('express');
const passport = require('passport');

const {
    onBuyProduct,
    onGetOrderList,
    onGetOrderDetail,
} = require('./controllers');
const { validateProductsExist } = require('./middlewares');
const { checkCaptCha } = require('../user/middlewares');

// const passport = require('passport');
const router = express.Router();

router.post('/',
    passport.authenticate('jwt', { session: false }),
    validateProductsExist,
    onBuyProduct,
);

router.get('/',
    passport.authenticate('jwt', { session: false }),
    onGetOrderList,
);

router.get('/chi-tiet-don-hang/:id',
    passport.authenticate('jwt', { session: false }),
    onGetOrderDetail,
);

module.exports = router;
