import React from 'react';

import styles from './style.module.scss';
import UserPageManagementLayout from 'components/UserPageManagementLayout';
import { useDispatch } from 'react-redux';
import { orderListLimit } from '../../constants';
import useAppSelector from 'hooks/useAppSelector';
import { Checkbox, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Order, OrderStatus } from 'constants/types/order';
import { getOrderStatusLabel } from 'utils';
import { getQueryStringValue } from 'utils/query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import routes from 'constants/routes';
import { CartActions } from 'redux/slices/cart';
import { Cart } from 'constants/types/cart';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import InputChange from 'components/InputChange';

interface State {
    checkList: Cart["_id"][],
    checkListData: Cart[],
    checkTest: boolean,
}

export default function CartPage() {
    const dispatch = useDispatch()

    const navigate = useNavigate();

    const cartList = useAppSelector((reduxState) => reduxState.cart.cartList);

    const [searchParams, setSearchParams] = useSearchParams();

    const [state, setState] = React.useState<State>({
        checkList: [],
        checkListData: [],
        checkTest: false,
    })

    const currentPage = React.useMemo(() => {
        return getQueryStringValue(searchParams, "page", 1)
    }, [searchParams])


    const pageSize = React.useMemo(() => {
        return getQueryStringValue(searchParams, "limit", 20)
    }, [searchParams])

    React.useEffect(() => {
        dispatch(CartActions.getCartList({
            page: currentPage,
            limit: orderListLimit,
        }))
    }, [currentPage, dispatch])

    const checkAll = React.useMemo(() => {
        return state.checkListData.length === cartList.length
    }, [cartList.length, state.checkListData.length])

    const onChangePagination = React.useCallback((page: number, pageSize: number) => {
        setSearchParams({ page: page.toString(), limit: pageSize.toString() })
    }, [setSearchParams])

    const onCheckAllChange = React.useCallback((e: CheckboxChangeEvent) => {
        if (e.target.checked) {
            setState((prevState) => ({ ...prevState, checkListData: cartList }))
        } else {
            setState((prevState) => ({ ...prevState, checkListData: [] }))
        }
    }, [cartList])

    const onChangeRowCheckBox = React.useCallback((item: Cart) => (e: CheckboxChangeEvent) => {
        const index = state.checkListData.findIndex((cartItem) => cartItem._id === item._id) //return -1 neu khong tim ra

        if (index === -1) {
            setState((prevState) => ({ ...prevState, checkListData: prevState.checkListData.concat(item) }))
        } else {
            setState((prevState) => {
                const checkListData = [...prevState.checkListData];

                checkListData.splice(index, 1);

                return {
                    ...prevState,
                    checkListData,
                }
            });
        }
    }, [state.checkListData])

    const onChangeProductNumber = React.useCallback((item: Cart) => (quantity: number) => {
        if (quantity < 1) return

        let newQuantity = quantity

        if (quantity > item.product.quantity) {
            newQuantity = item.product.quantity
        }

        dispatch(CartActions.addCartProductList({
            product: item.product._id,
            quantity: newQuantity,
            isToggleAllert: false,
        }))

    }, [dispatch])

    const columns: ColumnsType<Cart> = [
        {
            title:
                <Checkbox onChange={onCheckAllChange} checked={checkAll}>
                    Chọn Hết
                </Checkbox>,
            render: (text, item, index) =>
                <Checkbox
                    checked={state.checkListData.some((cartItem) => cartItem._id === item._id)}
                    onChange={onChangeRowCheckBox(item)}
                />
        },
        {
            title: <div className=''>Tên Sản Phẩm</div>,
            render: (text, item, index) => <div className='name-container flex'>
                <img className='product-image' alt='' src={item.product.images[0].url} />
                <div className='name long-content'>{item.product.name}</div>
            </div>
        }, {
            title: <div className='center'>Thành Tiền</div>,
            render: (text, item, index) => <div className='justifyCenter money-color'>₫ {item.quantity * item.product.price}</div>
        }, {
            title: <div className='center'>Số lượng</div>,
            render: (text, item, index) => <InputChange value={item.quantity} onChange={onChangeProductNumber(item)} />
        },
    ];

    return (
        <UserPageManagementLayout>
            <div className={`${styles.cartPageContainer} column`}>
                <div className='header-label'>Giỏ Hàng Của Tôi</div>
                <Table
                    className='table-container'
                    columns={columns}
                    dataSource={cartList}
                    rowKey={(item) => item._id}
                    pagination={{
                        showQuickJumper: true,
                        current: currentPage,
                        total: cartList.length ?? 0,
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