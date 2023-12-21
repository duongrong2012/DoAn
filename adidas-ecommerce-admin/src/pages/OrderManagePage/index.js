import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {
  Tag,
  Table,
  Button,
  // Input,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useHistory, useLocation } from 'react-router-dom';

import styles from './styles.module.css';
import { formatCurrency } from '../../utils';
import * as ActionTypes from '../../redux/actionTypes';
import { routes, transactionStatusColor, transactionStatusLabel } from '../../constants';
import { getQueryStringValue, updateQueryString } from '../../utils/query';
import useQuery from '../../hooks/useQuery';
import { push } from 'connected-react-router';

dayjs.extend(utc)

const OrderManagePage = () => {
  const dispatch = useDispatch();

  const query = useQuery();

  let history = useHistory();

  const location = useLocation();

  const loading = useSelector((state) => state.transactions.loading);

  const transactions = useSelector((state) => state.transactions.transactionList)

  const totalTransactions = useSelector((state) => state.transactions.totalTransactions)

  const onClickDetail = React.useCallback((item) => () => {
    dispatch(push(routes.ORDER_DETAIL(item._id).path));
  }, [dispatch]);

  // const onSearch = React.useCallback((text) => {

  // }, []);

  let { userId } = useParams();

  const currentPage = React.useMemo(() => {
    return getQueryStringValue(query, "page", 1)
  }, [query])

  const pageSize = React.useMemo(() => {
    return getQueryStringValue(query, "limit", 50)
  }, [query])

  const onChangePagination = React.useCallback((page, pageSize) => {
    updateQueryString(query, history, location, { page, limit: pageSize })
  }, [history, location, query])

  const columns = [
    {
      width: 100,
      title: <div className='center'>Đơn hàng</div>,
      dataIndex: 'id',
      render: (text, item, index) => {
        return <div className={styles.customCenter}>{index + 1}</div>
      }
    },
    {
      title: <div className='center'>Tên khách hàng</div>,
      dataIndex: 'fullName',
      render: (text, item) => {
        return <div className={styles.customCenter}>{item.user.fullName}</div>
      }
    },
    {
      title: <div className='center'>Email</div>,
      dataIndex: 'user_email',
      render: (text, item) => {
        return <div className={styles.customCenter}>{item.user.email}</div>
      }
    },
    {
      title: <div className='center'>Số điện thoại</div>,
      dataIndex: 'user_phone',
      render: (text, item) => {
        return <div className={styles.customCenter}>{item.user.phone}</div>
      }
    },
    {
      title: <div className='center'>Tổng tiền</div>,
      dataIndex: 'amount',
      render: (text, item) => {
        let totalAmount = 0

        let amount = 0

        item.orderDetails.forEach(orderDetailItem => {
          amount = orderDetailItem.price * orderDetailItem.quantity

          return totalAmount += amount
        });

        return (
          <div className={styles.customCenter}>{formatCurrency(`${totalAmount} VNĐ`)}</div>
        )
      }
    },
    {
      title: <div className='center'>Trạng thái</div>,
      dataIndex: 'status',
      render: (text, item) => (
        <div className='center'>
          <Tag color={transactionStatusColor[item.status]}>{transactionStatusLabel[item.status]}</Tag>
        </div>
      )
    },
    {
      width: 175,
      title: <div className='center'>Ngày tạo</div>,
      dataIndex: 'created_at',
      render: (text) => <div className='center'>{dayjs.utc(text || undefined).format('HH:mm DD/MM/YYYY')}</div>
    },
    // {
    //   width: 175,
    //   title: 'Cập nhật cuối',
    //   dataIndex: 'updated_at',
    //   key: 'updated_at',
    // },
    {
      width: 175,
      title: 'Chức năng',
      dataIndex: 'functions',
      key: 'id',
      render: (text, item) => (
        <Button
          type="primary"
          className={styles.buttonSeparator}
          onClick={onClickDetail(item)}
        >
          Chi tiết
        </Button>
      )
    },
  ];

  React.useEffect(() => {
    dispatch({
      type: ActionTypes.GET_TRANSACTIONS, payload: {
        page: currentPage,
        limit: pageSize,
        userId
      }
    });
  }, [currentPage, dispatch, pageSize, userId]);

  return (
    <div className={styles.container}>
      {/* <div className={styles.searchContainer}>
        <Input.Search
          enterButton
          placeholder="Mã đơn hàng"
          onSearch={onSearch}
        />
      </div> */}

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        // tableLayout="fixed"
        dataSource={transactions}
        pagination={{
          showQuickJumper: true,
          current: currentPage,
          total: totalTransactions,
          pageSize: pageSize,
          pageSizeOptions: [20, 50, 1],
          showSizeChanger: true,
          onChange: onChangePagination,
        }}
      />
    </div>
  );
}
export default OrderManagePage;