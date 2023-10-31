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


export default function NavigationBar() {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const user = useAppSelector((reduxState) => reduxState.auth.user);

    const onClickAuthModal = React.useCallback(() => {
        dispatch(AuthActions.toggleAuthModal())
    }, [dispatch])

    const onClickDropdownItem = React.useCallback((item: any) => {
        if (item.key === "logOut") dispatch(AuthActions.checkLogOut())
        if (item.key === "order") navigate(routes.UserOrderListPage().path)
    }, [dispatch])

    return (
        <div className={`${styles.navBarContainer}`}>
            <div className='resolution navbar-body flex'>
                <Link to={routes.Home().path}>
                    <img src={images.logo} className='logo' alt='' />
                </Link>
                <AutoComplete
                    size="large"
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
                    <Badge count={99}>
                        <ShoppingCartOutlined className='cart-icon' />
                    </Badge>
                )}
            </div>
            <AuthModal />
        </div>
    )

}