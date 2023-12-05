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

    const productSearchSuggestions = useAppSelector((reduxState) => reduxState.product.productSearchSuggestions);

    const [state, setState] = React.useState<State>({
        autoCompleteValue: ''
    })

    const onClickAuthModal = React.useCallback(() => {
        dispatch(AuthActions.toggleAuthModal())
    }, [dispatch])

    const productListOption = React.useMemo(() => {
        if (!state.autoCompleteValue) return []

        return productSearchSuggestions.map((item) => ({
            label: item.name,
            value: item._id
        }))
    }, [productSearchSuggestions, state.autoCompleteValue])

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
        dispatch(ProductActions.getProducts({ stateName: "productListByFilter", limit: 999999, page: 1, keyword: '' }))
    }, [dispatch])

    const onSearchAutoComplete = React.useCallback((value: string) => {
        setState((prevState) => ({ ...prevState, autoCompleteValue: value }))
    }, []);

    const onSelectAutoComplete = React.useCallback((value: string, item: any) => {
        navigate(routes.FilterPage({ keyword: item.label }).path)

        setState((prevState) => ({ ...prevState, autoCompleteValue: item.label }))
    }, [navigate]);

    const onInputKeyDown = React.useCallback<React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>>((event) => {
        if (event.key === 'Enter') {
            navigate(routes.FilterPage({ keyword: state.autoCompleteValue }).path)
        }
    }, [navigate, state.autoCompleteValue]);

    return (
        <div className={`${styles.navBarContainer}`}>
            <div className='resolution navbar-body flex'>
                <Link to={routes.Home().path}>
                    <img src={images.logo} className='logo' alt='' />
                </Link>
                <AutoComplete
                    size="large"
                    value={state.autoCompleteValue}
                    onSelect={onSelectAutoComplete}
                    onSearch={onSearchAutoComplete}
                    options={productListOption}
                    onInputKeyDown={onInputKeyDown}
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