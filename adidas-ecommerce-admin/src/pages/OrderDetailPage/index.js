/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Tag, Table, Select, Button, Image } from 'antd';
import { useParams } from 'react-router-dom';

import styles from './styles.module.css';
import { formatCurrency } from '../../utils';
import * as ActionTypes from '../../redux/actionTypes';
import { routes, transactionStatusColor, transactionStatusLabel } from '../../constants';

const OrderDetailPage = () => {
  let { orderId } = useParams();

  const transactionDetail = useSelector((state) => state.transactions.transactionDetail);

  // if (!transactionDetail) {
  //   return <Redirect to={routes.ORDERS().path} />;
  // }

  const dispatch = useDispatch();

  const updateLoading = useSelector((state) => state.transactions.updateLoading);

  React.useEffect(() => {
    dispatch({
      type: ActionTypes.GET_TRANSACTIONS_DETAIL,
      payload: {
        orderId
      }
    })
  }, [dispatch, orderId])

  const { totalProducts, totalAmount } = React.useMemo(() => {
    let totalProductValue = 0

    let totalAmountValue = 0

    transactionDetail?.orderDetails?.forEach((item) => {

      totalProductValue += item.quantity

      totalAmountValue += item.quantity * item.price
    })

    return { totalProducts: totalProductValue, totalAmount: totalAmountValue }
  }, [transactionDetail?.orderDetails])

  const columns = [
    {
      width: 100,
      title: <div className='center'>Id</div>,
      render: (text, item, index) => {
        return (
          <div className='center'>{index + 1}</div>)
      }
    },
    {
      title: <div className='center'>Tên sản phẩm</div>,
      dataIndex: 'name',
      render: (text, item) => {
        return (
          <div className='center'>{item.name}</div>)
      }
    },
    {
      title: <div className='center'>Hình ảnh</div>,
      dataIndex: 'image',
      render: (text, item) =>
        <div className='center'>
          <Image className={styles.productImage} alt='' src={item.images[0].url} width={100} />,
        </div>
    },
    {
      width: 100,
      title: <div className='center'>Số lượng</div>,
      dataIndex: 'quantity',
      render: (text, item) => {
        return (
          <div className='center'>{item.quantity}</div>)
      }
    },
    {
      width: 200,
      title: <div className='center'>Giá</div>,
      dataIndex: 'price',
      render: (text) => {
        return (
          <div className='center'>{formatCurrency(`${text} VNĐ`)}</div>)
      }
    },
  ];

  const [state, setState] = React.useState({
    status: transactionDetail?.status,
  });

  const onChangeSelect = React.useCallback((value) => {
    setState((prevState) => ({ ...prevState, status: value }));
  }, []);

  const onSubmit = React.useCallback(() => {
    const canUpdate = state.status !== transactionDetail?.status;

    if (!canUpdate) return;

    dispatch({
      type: ActionTypes.UPDATE_TRANSACTION,
      payload: {
        id: transactionDetail?.id,
        status: state.status,
      },
    });
  }, [
    dispatch,
    state.status,
    transactionDetail?.id,
    transactionDetail?.status,
  ]);

  return (
    <div className={styles.container}>
      <Card title="Chi tiết đơn hàng" className={styles.customerDetailCard}>
        <div className={styles.fieldContainer}>
          <div className={styles.fieldLabel}><span>Mã đơn hàng:</span></div>
          <span>#{transactionDetail?._id}</span>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.fieldLabel}><span>Trạng thái:</span></div>
          <Select value={transactionDetail?.status} disabled={updateLoading} onChange={onChangeSelect}>
            {Object.keys(transactionStatusColor).map((key) => (
              <Select.Option key={key} value={+key}>
                <Tag color={transactionStatusColor[key]}>{transactionStatusLabel[key]}</Tag>
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.fieldLabel}><span>Tên khách hàng:</span></div>
          <span>{transactionDetail?.user.fullName}</span>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.fieldLabel}><span>Địa chỉ:</span></div>
          <span>{transactionDetail?.deliveryAddress}</span>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.fieldLabel}><span>Số điện thoại:</span></div>
          <span>{transactionDetail?.user.phone}</span>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.fieldLabel}><span>Email:</span></div>
          <span>{transactionDetail?.user.email}</span>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.fieldLabel}><span>Tổng tiền:</span></div>
          <span>{formatCurrency(`${totalAmount} VNĐ`)}</span>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.fieldLabel}><span>Tổng sản phẩm:</span></div>
          <span>{totalProducts} sản phẩm</span>
        </div>

        <div className={styles.submitContainer}>
          <Button
            type="primary"
            disabled={updateLoading}
            loading={updateLoading}
            onClick={onSubmit}
          >
            Cập nhật
          </Button>
        </div>
      </Card>

      <Table
        rowKey="id"
        columns={columns}
        tableLayout="fixed"
        dataSource={transactionDetail?.orderDetails}
        pagination={{ pageSize: 5 }}
      />

      {/* <AppInput
        bordered
        disabled
        size="large"
        value={state.Order_Id}
        className={styles.input}
        addonBefore={<div className={styles.inputAddonBefore}>Order_Id</div>}
        onChange={onChange('Order_Id')}
      /> */}

      {/* <Button
        type="primary"
        size="large"
        className={styles.submitButton}
        onClick={onSubmit}
      >
        Cập nhật
      </Button> */}
    </div>
  );
}

export default OrderDetailPage;
