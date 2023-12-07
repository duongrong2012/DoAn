var express = require('express');
const passport = require('passport')

const {
    onRegister,
    onLogin,
    onGetAdmin,
} = require('./controllers');
const { checkBruteForceAttack, checkCaptCha, userAvatarMulter } = require('./middlewares');
const router = express.Router();

router.post('/dang-ki',
    onRegister
);

router.post('/dang-nhap',
    checkCaptCha,
    onLogin,
    checkBruteForceAttack
);

router.get('/',
    passport.authenticate('jwt', { session: false }), // yeu cau bat buoc phai truyen token
    onGetAdmin,
);

module.exports = router;
