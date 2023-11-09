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
import { useNavigate, useSearchParams } from 'react-router-dom';
import routes from 'constants/routes';

export default function UserOrderListPage() {
    const dispatch = useDispatch()

    const navigate = useNavigate();

    const orderList = useAppSelector((reduxState) => reduxState.order.orderList);

    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = React.useMemo(() => {
        return getQueryStringValue(searchParams, "page", 1)
    }, [searchParams])


    const pageSize = React.useMemo(() => {
        return getQueryStringValue(searchParams, "limit", 20)
    }, [searchParams])


    const onChangePagination = React.useCallback((page: number, pageSize: number) => {
        setSearchParams({ page: page.toString(), limit: pageSize.toString() })
    }, [setSearchParams])

    React.useEffect(() => {
        dispatch(OrderActions.getOrderList({
            page: currentPage,
            limit: pageSize,
        }))
    }, [currentPage, dispatch, pageSize])


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
                            onClick: (event) => { navigate(routes.OrderDetailPage(record._id).path) }, // click row
                        };
                    }}
                    pagination={{
                        showQuickJumper: true,
                        current: currentPage,
                        total: orderList.length ?? 0,
                        pageSize: pageSize,
                        pageSizeOptions: [20, 50, 1],
                        showSizeChanger: true,
                        onChange: onChangePagination,
                    }}
                />
            </div >
        </UserPageManagementLayout>
    )

}