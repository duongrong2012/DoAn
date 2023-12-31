import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { push } from 'connected-react-router';
import { AiOutlinePlus } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Table, Button, Image, AutoComplete } from 'antd';

import styles from './styles.module.css';
import { routes } from '../../constants';
import * as ActionTypes from '../../redux/actionTypes';
import { formatCurrency } from '../../utils';
import { getQueryStringValue } from '../../utils/query';
import useQuery from '../../hooks/useQuery';

dayjs.extend(utc)

const ProductManagePage = () => {
  const dispatch = useDispatch();

  const query = useQuery();

  const allProductsLoading = useSelector((state) => state.products.allProductsLoading);
  const allProducts = useSelector((state) => state.products.allProducts)
  const isSearched = useSelector((state) => state.products.isSearched);
  const searchText = useSelector((state) => state.products.searchText);
  const searchResults = useSelector((state) => state.products.searchResults);
  const deleteLoading = useSelector((state) => state.products.deleteLoading);
  const searchSuggests = useSelector((state) => state.products.searchSuggests);

  const modalRef = React.useRef();

  const currentPage = React.useMemo(() => {
    return getQueryStringValue(query, "page", 1)
  }, [query])

  const pageSize = React.useMemo(() => {
    return getQueryStringValue(query, "limit", 50)
  }, [query])

  // const onClickRemove = React.useCallback((item) => () => {
  //   const modal = Modal.confirm({
  //     maskClosable: false,
  //     okButtonProps: { danger: true },
  //     title: `Bạn có chắc chắn muốn xóa sản phẩm ${item.name}?`,
  //     okText: 'Xác nhận',
  //     cancelText: 'Hủy bỏ',
  //     onOk: () => dispatch({ type: ActionTypes.DELETE_PRODUCT, payload: item })
  //   });

  //   modalRef.current = modal;
  // }, [dispatch]);

  const onClickEdit = React.useCallback((item) => () => {
    dispatch(push(routes.PRODUCT_DETAIL(item._id).path));
  }, [dispatch]);

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      render: (text, item, index) => {
        return index + 1
      }
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      render: (text, item) => <Image alt='' src={item.images[0].url} width={100} />,
    },
    {
      width: 200,
      title: 'Giá',
      dataIndex: 'price',
      render: (text) => formatCurrency(`${text} VNĐ`)
    },
    // {
    //   title: 'Mô tả',
    //   dataIndex: 'Description',
    //   key: 'Description',
    // },
    {
      width: 175,
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      render: (text) => dayjs.utc(text || undefined).format('HH:mm DD/MM/YYYY')
    },
    {
      width: 200,
      title: 'Chức năng',
      dataIndex: 'id',
      render: (id, item) => (
        <div>
          <Button type="primary" className={styles.buttonSeparator} onClick={onClickEdit(item)}>Chỉnh sửa</Button>
          {/* <Button type="primary" danger onClick={onClickRemove(item)}>Xóa</Button> */}
        </div>
      )
    },
  ];

  React.useEffect(() => {
    if (!modalRef.current) return;

    if (deleteLoading) {
      modalRef.current.update({
        okButtonProps: {
          loading: deleteLoading,
          disabled: deleteLoading,
        },
        cancelButtonProps: {
          disabled: deleteLoading
        }
      });
    } else {
      modalRef.current.destroy();
    }
  }, [deleteLoading]);

  React.useEffect(() => {
    dispatch({
      type: ActionTypes.GET_PRODUCTS,
      payload: {
        stateName: "allProducts",
        page: currentPage,
        limit: pageSize,
      }
    });
  }, [currentPage, dispatch, pageSize]);

  const onClickAddProduct = React.useCallback(() => {
    dispatch(push(routes.ADD_PRODUCT.path));
  }, [dispatch]);

  const onSelect = React.useCallback((text) => {
    dispatch({ type: ActionTypes.SUBMIT_PRODUCT_SUGGEST, payload: text });
  }, [dispatch]);

  const onSearch = React.useCallback((text) => {
    dispatch({ type: ActionTypes.SUGGEST_SEARCH_PRODUCT, payload: text });
  }, [dispatch]);

  const cardExtra = React.useMemo(() => (
    <div className={styles.cardExtra}>
      <Button
        type="primary"
        icon={<AiOutlinePlus />}
        className={styles.addProductButton}
        onClick={onClickAddProduct}
      >
        Thêm sản phẩm
      </Button>

      <AutoComplete
        allowClear
        defaultValue={searchText}
        options={searchSuggests.map((x) => ({ label: x.name, value: x.name }))}
        className={styles.searchInput}
        onSelect={onSelect}
        onSearch={onSearch}
        placeholder="Tìm kiếm sản phẩm..."
      />
    </div>
  ), [
    searchText,
    searchSuggests,
    onSearch,
    onSelect,
    onClickAddProduct,
  ]);

  return (
    <div className={styles.container}>
      <Card
        title="Quản lý kho"
        extra={cardExtra}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          rowKey="id"
          loading={allProductsLoading}
          columns={columns}
          dataSource={isSearched ? searchResults : allProducts}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
export default ProductManagePage;