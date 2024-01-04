import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {
  Table,
  Button,
  Modal,
  // Input,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { useHistory, useLocation } from 'react-router-dom';

import styles from './styles.module.css';
import * as ActionTypes from '../../redux/actionTypes';
import { routes } from '../../constants';
import { getQueryStringValue, updateQueryString } from '../../utils/query';
import useQuery from '../../hooks/useQuery'


dayjs.extend(utc)

const UserManagePage = () => {
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.users.loading);

  const users = useSelector((state) => state.users.userList);

  const totalUser = useSelector((state) => state.users.totalUser);

  const blockLoading = useSelector((state) => state.users.blockLoading);

  const modalRef = React.useRef();

  const query = useQuery();

  let history = useHistory();

  const location = useLocation();

  const currentPage = React.useMemo(() => {
    return getQueryStringValue(query, "page", 1)
  }, [query])

  const pageSize = React.useMemo(() => {
    return getQueryStringValue(query, "limit", 50)
  }, [query])

  const onClickview = React.useCallback((item) => () => {
    // dispatch(push(routes.PRODUCT_DETAIL(item.Id).path));
    dispatch(push(routes.ORDERS(item._id).path));
    // /ORDERS/id
  }, [dispatch]);


  const onClickBlock = React.useCallback((item) => () => {
    const isBlocked = item.status !== "ACTIVE";

    const blockColor = isBlocked ? 'green' : undefined;

    const modal = Modal.confirm({
      maskClosable: false,
      okButtonProps: {
        danger: !isBlocked,
        style: {
          borderColor: blockColor,
          backgroundColor: blockColor,
        }
      },
      title: `Bạn có chắc chắn muốn ${isBlocked ? 'mở khóa' : 'khóa'} tài khoản ${item.email}?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy bỏ',
      onOk: () => dispatch({ type: ActionTypes.BLOCK_USER, payload: item })
    });

    modalRef.current = modal;
  }, [dispatch]);

  // const onSearch = React.useCallback((text) => {

  // }, []);

  const columns = [
    {
      width: 70,
      title: 'Id',
      key: 'id',
      render: (text, item, index) => {
        return index + 1
      }
    },
    {
      title: 'Họ Tên',
      dataIndex: 'fullName',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      width: 175,
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => dayjs.utc(text || undefined).format('HH:mm DD/MM/YYYY')
    },
    {
      width: 250,
      title: 'Chức năng',
      dataIndex: 'functions',
      key: 'functions',
      render: (text, item) => {
        const isBlocked = item.status !== "ACTIVE";
        const blockColor = isBlocked ? 'green' : undefined;
        return (
          <div>
            <Button
              type="primary"
              danger={!isBlocked}
              style={{
                borderColor: blockColor,
                backgroundColor: blockColor,
              }}
              onClick={onClickBlock(item)}
            >
              {isBlocked ? 'Mở khóa' : 'Khóa'}
            </Button>
            <Button type="primary" className={styles.buttonSeparator} onClick={onClickview(item)}>Xem đơn hàng</Button>
          </div>
        )
      }
    },
  ];

  React.useEffect(() => {
    if (!modalRef.current) return;

    if (blockLoading) {
      modalRef.current.update({
        okButtonProps: {
          loading: blockLoading,
          disabled: blockLoading,
        },
        cancelButtonProps: {
          disabled: blockLoading
        }
      });
    } else {
      modalRef.current.destroy();
    }
  }, [blockLoading]);

  React.useEffect(() => {
    dispatch({
      type: ActionTypes.GET_USERS,
      payload: {
        page: currentPage,
        limit: pageSize,
      }
    });
  }, [currentPage, dispatch, pageSize]);

  const onChangePagination = React.useCallback((page, pageSize) => {
    updateQueryString(query, history, location, { page, limit: pageSize })
  }, [history, location, query])

  return (
    <div className={styles.container}>
      {/* <div className={styles.searchContainer}>
        <Input.Search
          enterButton
          placeholder="Tên người dùng"
          onSearch={onSearch}
        />
      </div> */}

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        tableLayout="fixed"
        dataSource={users}
        pagination={{
          showQuickJumper: true,
          current: currentPage,
          total: totalUser,
          pageSize: pageSize,
          pageSizeOptions: [20, 50, 1],
          showSizeChanger: true,
          onChange: onChangePagination,
        }}
      />
    </div>
  );
}

export default UserManagePage;
