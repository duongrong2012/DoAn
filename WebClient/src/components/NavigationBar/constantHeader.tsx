import React from 'react';
import { UserOutlined, LockOutlined, LogoutOutlined } from '@ant-design/icons';

import styles from './style.module.scss';
import images from 'assets';

export const getHeaderItem = (routes: any) => [
    {
        key: '1',
        label: (
            <div>
                <UserOutlined className={styles.marginIcon} />
                Trang Cá Nhân
            </div>
        ),
    },
    {
        key: 'order',
        label: (
            <div>
                <img alt="" src={images.order} className={styles.icon} />
                Đơn Hàng Của Tôi
            </div>
        ),
    },
    {
        key: '3',
        label: (
            <div>
                <LockOutlined className={styles.marginIcon} />
                Đổi Mật Khẩu
            </div>
        ),
    },
    {
        key: 'logOut',
        label: (
            <div>
                <LogoutOutlined className={styles.marginIcon} />
                Đăng xuất
            </div>
        ),
    },
];
