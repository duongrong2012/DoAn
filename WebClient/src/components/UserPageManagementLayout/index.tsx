import React from 'react';

import styles from './style.module.scss';
import images from 'assets';
import routes from 'constants/routes';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { UserOutlined } from '@ant-design/icons';

export interface Props {
    children?: React.ReactNode
}

export default function UserPageManagementLayout({ children }: Props) {

    const location = useLocation()

    const items = React.useMemo(() => [{
        icon: <UserOutlined style={{ fontSize: "24px" }} />,
        link: "google.com",
        text: "Cá nhân",
    }, {
        icon: <img alt="" src={images.order} className='icon' />,
        link: routes.UserOrderListPage().path,
        text: "Quản lý đơn hàng",
    },
    ], [])

    return (
        <div className={`${styles.userPageManagementLayout} flex resolution`}>
            <div className='menu-list column'>
                {items.map((item) => {
                    let isSelected = location.pathname.includes(item.link)

                    let to = item.link

                    if (item.link === routes.UserOrderListPage().path
                        && location.pathname.includes(routes.UserOrderListPage().path)
                    ) {
                        isSelected = true
                    }

                    return (
                        <Link
                            className={classNames({
                                "menu-item-container": true,
                                "isSelected": isSelected,
                            })}
                            to={to}
                            key={item.text}
                        >
                            {item.icon}
                            {item.text}
                        </Link>
                    )
                })}
            </div>
            {children}
        </div >
    )

}