var express = require('express');
const passport = require('passport')

const {
    onRegister,
    onLogin,
    onGetUser,
} = require('./controllers');
const { checkBruteForceAttack, checkCaptCha } = require('./middlewares');
const router = express.Router();

router.post('/dang-ki',
    checkCaptCha,
    onRegister
);

router.post('/dang-nhap',
    checkCaptCha,
    onLogin,
    checkBruteForceAttack
);

router.get('/',
    passport.authenticate('jwt', { session: false }), // yeu cau bat buoc phai truyen token
    onGetUser,
);

module.exports = router;
