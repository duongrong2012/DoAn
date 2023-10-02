var express = require('express');

const {
    onCreateProduct,
    onCreateCategory,
    onGetCategory,
    onGetProduct,
} = require('./controllers');
// const passport = require('passport');
const router = express.Router();

router.post('/',
    // passport.authenticate('jwt', { session: false }),
    onCreateProduct,
);

router.get('/',
    onGetProduct,
);

router.post('/danh-muc',
    // passport.authenticate('jwt', { session: false }),
    onCreateCategory,
);

router.get('/danh-muc',
    onGetCategory,
);


module.exports = router;
