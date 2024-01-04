var express = require('express');
const passport = require('passport')

const { getRevenue } = require('./controllers');
const { checkCaptCha } = require('../middlewares');

const router = express.Router();

router.get('/',
    passport.authenticate('jwt', { session: false }),
    getRevenue,
);

module.exports = router;
