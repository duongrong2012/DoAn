import React from 'react';

import { useDispatch } from 'react-redux';
import styles from './style.module.scss';
import { useLocation } from 'react-router-dom';
import useAppSelector from 'hooks/useAppSelector';
import { Product } from 'constants/types/product';
import { Button, Input } from 'antd';
import { OrderActions } from 'redux/slices/order';

export interface OrderProduct {
  product: Product,
  quantity: number,
}

interface State {
  deliveryAddress: string,
}

const OrderPage = () => {
  const dispatch = useDispatch()

  const { state } = useLocation();

  const [myState, setState] = React.useState<State>({
    deliveryAddress: ""
  },)

  const user = useAppSelector((reduxState) => reduxState.auth.user);

  let totalAmount = 0

  let totalOrderProducts = 0

  const orderData = state.products?.map((item: OrderProduct) => {
    return {
      id: item.product._id,
      quantity: item.quantity,
    }
  })

  React.useEffect(() => {
    setState((prevState) => ({ ...prevState, deliveryAddress: user?.address ?? "" }))
  }, [user?.address])

  const onChange = React.useCallback((fieldName: keyof State): React.ChangeEventHandler<HTMLInputElement> => {
    return function (event) {
      setState((prevState) => ({ ...prevState, [fieldName]: event.target.value }))
    }
  }, [])

  const onclickConfirmOrder = React.useCallback(() => {
    dispatch(OrderActions.order({
      deliveryAddress: myState.deliveryAddress,
      products: orderData
    }))
  }, [dispatch, myState.deliveryAddress, orderData])

  return (
    <div className={`${styles.orderPageContainer} column resolution`}>
      <div className='shipping-address-container'>
        <div className='label'>Địa chỉ giao hàng</div>
        <div className='shipping-infor column'>
          <div className='shipping-infor-row flex'>
            <div className='shipping-infor-label'>Tên :</div>
            <div className='name'>{user?.fullName}</div>
          </div>
          <div className='shipping-infor-row flex'>
            <div className='shipping-infor-label'>Địa chỉ giao hàng :</div>
            <Input
              placeholder="Nhập địa chỉ giao hàng"
              onChange={onChange("deliveryAddress")}
              required
            />
          </div>
        </div>
      </div>
      <div className='body-container flex'>
        <div className='products-container column'>
          {state.products?.map((item: OrderProduct) => {
            const amount = item.product.price * item.quantity

            totalAmount += amount

            totalOrderProducts += item.quantity

            return (
              <div className='item-container flex' key={item.product._id}>
                <img alt="" src={item.product?.images[0].url} className='product-image' />
                <div className='item-name long-content'>{item.product.name}</div>
                <div className='price long-content'>₫ {amount}</div>
                <div className='quantity flex'>
                  <div className='quantity-prefix'>Số lượng:</div>
                  <div className='quantity-value'>{item.quantity}</div>
                </div>
              </div>
            )
          })}
        </div>
        <div className='confirm-order-container column'>
          <div className='confirm-order-label'>Thông tin đơn hàng</div>
          <div className='checkout-summary-row flex'>
            <div className='checkout-summary-label'>Tổng sản phẩm</div>
            <div className='checkout-summary-value'>{totalOrderProducts}</div>
          </div>
          <div className='summary flex'>
            <div className='summary-label'>Tổng cộng</div>
            <div className='summary-value'>₫ {totalAmount}</div>
          </div>
          <Button className='confirm-order-button' onClick={onclickConfirmOrder}>Đặt Hàng</Button>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
