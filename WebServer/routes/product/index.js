var express = require('express');
const passport = require('passport');

const {
    onCreateProduct,
    onCreateCategory,
    onGetCategory,
    onGetProduct,
    onGetProductDetail,
    onRatingProduct,
    onGetProductRating,
} = require('./controllers');
const { productImageMulter, categoryImageMulter, validateProductExist } = require('./middlewares');
const { checkCaptCha } = require('../user/middlewares');
// const passport = require('passport');
const router = express.Router();

router.post('/',
    // passport.authenticate('jwt', { session: false }),
    productImageMulter.array("productImages"),
    onCreateProduct,
);

router.get('/',
    onGetProduct,
);


router.post('/danh-muc',
    // passport.authenticate('jwt', { session: false }),
    categoryImageMulter.single("image"),
    onCreateCategory,
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
    checkCaptCha,
    passport.authenticate('jwt', { session: false }),
    validateProductExist,
    onRatingProduct,
);

module.exports = router;
