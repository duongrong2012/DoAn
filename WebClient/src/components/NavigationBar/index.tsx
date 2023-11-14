import React from 'react';

import styles from './style.module.scss';
import { AutoComplete, Avatar, Badge, Dropdown, Input } from 'antd';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import images from 'assets';
import AuthModal from 'components/AuthModal';
import { useDispatch } from 'react-redux';
import { AuthActions } from 'redux/slices/auth';
import useAppSelector from 'hooks/useAppSelector';
import { getHeaderItem } from './constantHeader';
import routes from 'constants/routes';
import { Link, useNavigate } from 'react-router-dom';
import { CartActions } from 'redux/slices/cart';
import { ProductActions } from 'redux/slices/product';

interface State {
    autoCompleteValue: string,
}


export default function NavigationBar() {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const user = useAppSelector((reduxState) => reduxState.auth.user);

    const cartListTotal = useAppSelector((reduxState) => reduxState.cart.cartListTotal);

    const productListByFilter = useAppSelector((reduxState) => reduxState.product.productListByFilter);

    const [state, setState] = React.useState<State>({
        autoCompleteValue: ''
    })

    const onClickAuthModal = React.useCallback(() => {
        dispatch(AuthActions.toggleAuthModal())
    }, [dispatch])

    const productListOption = React.useMemo(() => {
        return productListByFilter.map((item) => ({
            label: item.name,
            value: item._id
        }))
    }, [productListByFilter])

    const onClickDropdownItem = React.useCallback((item: any) => {
        if (item.key === "logOut") dispatch(AuthActions.checkLogOut())
        if (item.key === "order") navigate(routes.UserOrderListPage().path)
        if (item.key === "Trang Cá Nhân") navigate(routes.UserAccountPage().path)
    }, [dispatch, navigate])

    React.useEffect(() => {
        if (user) {
            dispatch(CartActions.getCartList({
                page: 1,
                limit: 999,
            }))
        }
    }, [dispatch, user])

    React.useEffect(() => {
        dispatch(ProductActions.getProducts({ stateName: "productListByFilter", limit: 999999, page: 1, keyword: state.autoCompleteValue }))
    }, [dispatch, state.autoCompleteValue])

    const onChangeAutoComplete = React.useCallback((value: string) => {
        setState((prevState) => ({ ...prevState, autoCompleteValue: value }))
    }, []);

    return (
        <div className={`${styles.navBarContainer}`}>
            <div className='resolution navbar-body flex'>
                <Link to={routes.Home().path}>
                    <img src={images.logo} className='logo' alt='' />
                </Link>
                <AutoComplete
                    size="large"
                    value={state.autoCompleteValue}
                    onChange={onChangeAutoComplete}
                    options={productListOption}
                >
                    <Input.Search size="large" placeholder="Tìm kiếm sản phẩm" />
                </AutoComplete>
                <div className={styles.accountContainer}>
                    {user ? (
                        <Dropdown menu={{ items: getHeaderItem(routes), onClick: onClickDropdownItem }} placement="bottomRight" arrow={true} trigger={["click"]}>
                            <div className={`${styles.accountInfo} center ${styles.loginContainer}`}>
                                <Avatar size={24} icon={<img alt="" src={user.avatar} />} />
                                <div className={`${styles.userNameContainer} long-content`}>
                                    {user?.fullName}
                                </div>
                            </div>
                        </Dropdown>
                    ) : (
                        <UserOutlined className='user' onClick={onClickAuthModal} />
                    )}
                </div>
                {(false) ? (
                    <ShoppingCartOutlined className='cart-icon' />
                ) : (
                    <Link to={routes.CartPage().path}>
                        <Badge count={cartListTotal}>
                            <ShoppingCartOutlined className='cart-icon' />
                        </Badge>
                    </Link>
                )}
            </div>
            <AuthModal />
        </div>
    )

}