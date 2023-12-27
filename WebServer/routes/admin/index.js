var express = require('express');
const passport = require('passport')

const {
    onRegister,
    onLogin,
    onGetUserInfor,
    onGetAdmin,
    UpdateUserByAdmin,
    onCreateProduct,
    onCreateCategory,
    onGetAllOrderList,
    onGetUserOrderDetailByAdmin,
    onUpdateCategoryByAdmin,
    onUpdateProductByAdmin,
    onUpdateOrderByAdmin,
} = require('./controllers');
const { checkBruteForceAttack, checkCaptCha, userAvatarMulter } = require('./middlewares');
const { productImageMulter, categoryImageMulter } = require('../product/middlewares');
const revenueRouter = require('./revenue');
const router = express.Router();

router.post('/dang-ki',
    onRegister
);

router.post('/dang-nhap',
    checkCaptCha,
    onLogin,
    checkBruteForceAttack
);

router.patch('/nguoi-dung/:id',
    passport.authenticate('jwt', { session: false }),
    UpdateUserByAdmin
);

router.get('/nguoi-dung',
    passport.authenticate('jwt', { session: false }), // yeu cau bat buoc phai truyen token
    onGetUserInfor,
);

router.get('/don-hang',
    passport.authenticate('jwt', { session: false }), // yeu cau bat buoc phai truyen token
    onGetAllOrderList,
);

router.patch('/don-hang/:id',
    passport.authenticate('jwt', { session: false }),
    onUpdateOrderByAdmin,
);

router.get('/chi-tiet-don-hang/:id',
    passport.authenticate('jwt', { session: false }), // yeu cau bat buoc phai truyen token
    onGetUserOrderDetailByAdmin,
);

router.post('/san-pham',
    passport.authenticate('jwt', { session: false }),
    productImageMulter.array("productImages"),
    onCreateProduct,
);

router.patch('/san-pham/:id',
    passport.authenticate('jwt', { session: false }),
    productImageMulter.array("productImages"),
    onUpdateProductByAdmin,
);

router.post('/danh-muc',
    passport.authenticate('jwt', { session: false }),
    categoryImageMulter.single("image"),
    onCreateCategory,
);

router.patch('/danh-muc/:id',
    passport.authenticate('jwt', { session: false }),
    categoryImageMulter.single("image"),
    onUpdateCategoryByAdmin,
);

router.use('/doanh-thu', revenueRouter);

router.get('/',
    passport.authenticate('jwt', { session: false }), // yeu cau bat buoc phai truyen token
    onGetAdmin,
);

module.exports = router;
