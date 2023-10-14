var express = require('express');

const {
    onCreateProduct,
    onCreateCategory,
    onGetCategory,
    onGetProduct,
} = require('./controllers');
const { productImageMulter, categoryImageMulter } = require('./middlewares');
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


module.exports = router;
