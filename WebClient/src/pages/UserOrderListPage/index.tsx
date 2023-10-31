import React from 'react';

import styles from './style.module.scss';
import UserPageManagementLayout from 'components/UserPageManagementLayout';
import { useDispatch } from 'react-redux';
import { OrderActions } from 'redux/slices/order';
import { orderListLimit } from '../../constants';
import useAppSelector from 'hooks/useAppSelector';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Order, OrderStatus } from 'constants/types/order';
import { getOrderStatusLabel } from 'utils';
import { getQueryStringValue } from 'utils/query';
import { useLocation, useNavigate } from 'react-router-dom';
import useQuery from 'hooks/useQuery';
import routes from 'constants/routes';

export default function UserOrderListPage() {
    const dispatch = useDispatch()

    const query = useQuery();

    const navigate = useNavigate();

    const orderList = useAppSelector((reduxState) => reduxState.order.orderList);

    const user = useAppSelector((reduxState) => reduxState.auth.user);

    const currentPage = React.useMemo(() => {
        return getQueryStringValue(query, "page", 1)
    }, [query])


    const pageSize = React.useMemo(() => {
        return getQueryStringValue(query, "limit", 50)
    }, [query])


    const onChangePagination = React.useCallback((page: number, pageSize: number) => {
        // updateQueryString(query, navigate, location, { page, limit: pageSize })
    }, [])

    React.useEffect(() => {
        if (user) {
            dispatch(OrderActions.getOrder({
                page: currentPage,
                limit: orderListLimit,
            }))
        }
    }, [currentPage, dispatch, user])

    // const onRow = React.useCallback((record: any) => {

    // }, [])

    const columns: ColumnsType<Order> = [
        {
            title: 'STT',
            render: (text, item, index) => <div>{index}</div>
        },
        {
            title: 'Mã Đơn Hàng',
            render: (text, item, index) => <div>{item._id}</div>
        },
        {
            title: 'Số Lượng',
            render: (text, item, index) => {
                let sum = 0

                item.orderDetails.map((item) => sum += item.quantity)

                return (
                    <div>{sum}</div>
                )
            }
        },
        {
            title: 'Tổng Giá',
            render: (text, item, index) => {
                let sum = 0

                item.orderDetails.map((item) => sum += item.quantity * item.price)

                return (
                    <div>{sum}</div>
                )
            }
        },
        {
            title: 'Tình Trạng',
            render: (text, item, index) => <div>{getOrderStatusLabel(item.status as OrderStatus)}</div>
        },
    ];

    return (
        <UserPageManagementLayout>
            <div className={`${styles.userOrderListPageContainer} column`}>
                <div className='header-label'>Đơn Hàng Của Tôi</div>
                <Table
                    className='table-container'
                    columns={columns}
                    dataSource={orderList}
                    rowKey={(item) => item._id}
                    onRow={(record) => {
                        return {
                            onClick: (event) => { navigate(routes.OrderDetailPage(record._id).path, { state: { data: record } }) }, // click row
                        };
                    }}
                    pagination={{
                        showQuickJumper: true,
                        current: currentPage,
                        total: orderList.length ?? 0,
                        pageSize: pageSize,
                        pageSizeOptions: [50, 100, 1],
                        showSizeChanger: true,
                        onChange: onChangePagination,
                    }}
                />
            </div >
        </UserPageManagementLayout>
    )

}