import React from 'react';

import styles from './style.module.scss';
import { AutoComplete, Badge, Input, Menu } from 'antd';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import images from 'assets';

interface Props {
    children?: React.ReactNode
}

export default function NavigationBar({ children }: Props) {

    return (
        <div className={`${styles.navBarContainer}`}>
            <div className='resolution navbar-body flex'>
                <img src={images.logo} className='logo' alt='' />
                <AutoComplete
                    size="large"
                >
                    <Input.Search size="large" placeholder="Tìm kiếm sản phẩm" />
                </AutoComplete>
                <UserOutlined className='user' />
                {(false) ? (
                    <ShoppingCartOutlined className='cart-icon' />
                ) : (
                    <Badge count={99}>
                        <ShoppingCartOutlined className='cart-icon' />
                    </Badge>
                )}
            </div>
        </div>
    )

}