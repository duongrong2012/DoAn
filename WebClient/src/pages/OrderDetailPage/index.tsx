import React from 'react';

import styles from './style.module.scss';
import UserPageManagementLayout from 'components/UserPageManagementLayout';
import { useDispatch } from 'react-redux';
import { OrderActions } from 'redux/slices/order';
import { orderListLimit } from '../../constants';
import useAppSelector from 'hooks/useAppSelector';
import { Table } from 'antd';
import { getQueryStringValue } from 'utils/query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useQuery from 'hooks/useQuery';
import { OrderDetail } from 'constants/types/orderDetail';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';

export default function OrderDetailPage() {
    const dispatch = useDispatch()

    const query = useQuery();

    let navigate = useNavigate();

    const { orderId } = useParams();

    //  const location = useLocation();

    const { state } = useLocation();

    const { data } = state;

    let totalProducts = 0;

    let totalAmount = 0

    const user = useAppSelector((reduxState) => reduxState.auth.user);

    const orderDetailList = useAppSelector((reduxState) => reduxState.order.orderDetailList);

    const currentPage = React.useMemo(() => {
        return getQueryStringValue(query, "page", 1)
    }, [query])


    const pageSize = React.useMemo(() => {
        return getQueryStringValue(query, "limit", 50)
    }, [query])


    const onChangePagination = React.useCallback((page: number, pageSize: number) => {
        // updateQueryString(query, navigate, location, { page, limit: pageSize })
    }, [])

    orderDetailList.map((item) => {

        totalProducts += item.quantity

        totalAmount += item.quantity * item.price
    })

    React.useEffect(() => {
        dispatch(OrderActions.getOrder({
            page: currentPage,
            limit: orderListLimit,
        }))
    }, [currentPage, dispatch])

    React.useEffect(() => {
        if (orderId) {
            dispatch(OrderActions.getOrderDetail({
                id: orderId,
                page: currentPage,
                limit: orderListLimit,
            }))
        }
    }, [currentPage, dispatch, orderId])

    const columns: ColumnsType<OrderDetail> = [
        {
            title: <div className='center'>STT</div>,
            render: (text, item, index) => <div>{index}</div>
        },
        {
            title: <div className=''>Tên Sản Phẩm</div>,
            render: (text, item, index) => <div className='name-container flex'>
                <img className='product-image' alt='' src={item.images[0].url} />
                <div className='name long-content'>{item.name}</div>
            </div>
        },
        {
            title: <div className='center'>Số Lượng</div>,
            render: (text, item, index) => <div className='justifyCenter'>{item.quantity}</div>
        },
        {
            title: <div className='center'>Thành Tiền</div>,
            render: (text, item, index) => <div className='justifyCenter'>₫ {item.quantity * item.price}</div>
        },
    ];

    const orderInformations = [{
        labelName: "Mã đơn hàng",
        valueName: orderId
    }, {
        labelName: "Ngày đặt hàng",
        valueName: moment(data.createdAt).format("DD-MM-YYYY")
    }, {
        labelName: "Tên người đặt",
        valueName: user?.fullName
    }, {
        labelName: "Địa chỉ giao hàng",
        valueName: data.deliveryAddress
    },
    ]

    return (
        <UserPageManagementLayout>
            <div className={`${styles.orderDetailPageContainer} column`}>
                <div className='order-list-container'>
                    <div className='header-label'>Chi Tiết Đơn Hàng Của Tôi</div>
                    <Table
                        className='table-container'
                        columns={columns}
                        dataSource={orderDetailList}
                        rowKey={(item) => item._id}
                    />
                </div>
                <div className='order-detail-container flex'>
                    <div className='order-infor-container column'>
                        {orderInformations.map((item) => (
                            <div className='order-infor-row flex' key={item.labelName}>
                                <div className='order-infor-label'>{item.labelName}</div>
                                <div className='order-infor-value'>{item.valueName}</div>
                            </div>
                        ))}
                    </div>
                    <div className='total-amount-container column'>
                        <div className='total-amount-header'>Tổng Cộng</div>
                        <div className={`${styles.borderBottom} flex total-amount-row`}>
                            <div className='total-amount-label'>Tổng Sản Phẩm</div>
                            <div className='total-amount-value'>{totalProducts}</div>
                        </div>
                        <div className='flex total-amount-row'>
                            <div className='total-amount-label'>Tổng Cộng</div>
                            <div className='total-amount-value money-color long-content'>₫ {totalAmount}</div>
                        </div>
                    </div>
                </div>
            </div >
        </UserPageManagementLayout>
    )

}