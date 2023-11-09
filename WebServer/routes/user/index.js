var express = require('express');
const passport = require('passport')

const {
    onRegister,
    onLogin,
    onGetUser,
} = require('./controllers');
const { checkBruteForceAttack } = require('./middlewares');
const router = express.Router();

router.post('/dang-ki', onRegister);

router.post('/dang-nhap',
    onLogin,
    checkBruteForceAttack
);

router.get('/',
    passport.authenticate('jwt', { session: false }), // yeu cau bat buoc phai truyen token
    onGetUser,
);

module.exports = router;
