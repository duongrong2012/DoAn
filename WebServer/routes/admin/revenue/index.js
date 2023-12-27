var express = require('express');
const passport = require('passport')

const { getRevenue } = require('./controllers');

const router = express.Router();

router.get('/',
    passport.authenticate('jwt', { session: false }),
    getRevenue,
);

module.exports = router;
