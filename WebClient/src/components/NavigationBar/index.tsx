import React from 'react';

import styles from './style.module.scss';
import { AutoComplete, Badge, Input } from 'antd';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import images from 'assets';
import AuthModal from 'components/AuthModal';
import { useDispatch } from 'react-redux';
import { AuthActions } from 'redux/slices/auth';
import useAppSelector from 'hooks/useAppSelector';

export default function NavigationBar() {

    const dispatch = useDispatch();

    const user = useAppSelector((reduxState) => reduxState.auth.user);

    const onClickAuthModal = React.useCallback(() => {
        dispatch(AuthActions.toggleAuthModal())
    }, [dispatch])
    console.log(user)
    return (
        <div className={`${styles.navBarContainer}`}>
            <div className='resolution navbar-body flex'>
                <img src={images.logo} className='logo' alt='' />
                <AutoComplete
                    size="large"
                >
                    <Input.Search size="large" placeholder="Tìm kiếm sản phẩm" />
                </AutoComplete>
                <UserOutlined className='user' onClick={onClickAuthModal} />
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