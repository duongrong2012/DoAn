var express = require('express');
const passport = require('passport');

const {
    onCreateCategory,
    onGetCategory,
    onGetProduct,
    onGetProductDetail,
    onRatingProduct,
    onGetProductRating,
} = require('./controllers');
const { categoryImageMulter, validateProductExist } = require('./middlewares');
const { checkCaptCha } = require('../user/middlewares');
// const passport = require('passport');
const router = express.Router();


router.get('/',
    onGetProduct,
);

router.get('/danh-muc',
    onGetCategory,
);

router.get('/:slug',
    onGetProductDetail,
);

router.get('/:id/rating',
    validateProductExist,
    onGetProductRating,
);

router.post('/:id/rating',
    passport.authenticate('jwt', { session: false }),
    validateProductExist,
    onRatingProduct,
);

module.exports = router;
