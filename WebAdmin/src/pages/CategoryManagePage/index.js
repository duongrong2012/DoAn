import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { AiOutlinePlus } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';
import { Card, Table, Button, Input, Modal, Form, Upload } from 'antd';

import styles from './styles.module.css';
import * as ActionTypes from '../../redux/actionTypes';
import { readFile } from '../../utils';

dayjs.extend(utc)

const CategoryManagePage = () => {
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.categories.loading);
  const addLoading = useSelector((state) => state.categories.addLoading);
  const updateLoading = useSelector((state) => state.categories.updateLoading);
  const deleteLoading = useSelector((state) => state.categories.deleteLoading);

  const categories = useSelector((state) => state.categories.categoryList);

  const modalRef = React.useRef();
  const formRef = React.useRef();
  const modalConfigRef = React.useRef();

  const [state, setState] = React.useState({
    image: null,
  });

  // const onClickDelete = React.useCallback((item) => () => {
  //   const modal = Modal.confirm({
  //     maskClosable: false,
  //     okButtonProps: { danger: true },
  //     title: `Bạn có chắc chắn muốn xóa danh mục ${item.name}?`,
  //     okText: 'Xác nhận',
  //     cancelText: 'Hủy bỏ',
  //     onOk: (c) => dispatch({ type: ActionTypes.DELETE_CATEGORY, payload: item })
  //   });

  //   modalRef.current = modal;
  // }, [dispatch]);

  // const onSearch = React.useCallback((text) => {

  // }, []);

  const onBeforeUpload = React.useCallback(() => false, []);

  const setImageBase64 = React.useCallback(async (fieldName, file) => {
    try {
      const response = await readFile(file);

      setState((prevState) => ({
        ...prevState,
        [fieldName]: {
          ...file,
          base64: response.result,
        },
      }))
    } catch (error) {

    }
  }, []);

  const onUploadChange = React.useCallback((e) => {
    setImageBase64('image', e.file);

    return e.fileList;
  }, [setImageBase64]);

  const modalContent = React.useCallback((initialValues, resolve) => {
    return (
      <Form
        ref={formRef}
        autoComplete="off"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={initialValues}
        style={{ margin: '24px 0 -24px -38px' }}
        onFinish={resolve}
      >
        {!!initialValues.categoryId && <Form.Item name="categoryId" hidden />}

        <Form.Item
          label="Tên danh mục"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Chọn ảnh"
          name="image"
          valuePropName='fileList'
          getValueFromEvent={onUploadChange}
          rules={[{ required: true, message: 'Vui lòng chọn ảnh cho danh mục' }]}
        >
          <Upload
            accept="image/*"
            listType="picture"
            disabled={addLoading}
            showUploadList={false}
            maxCount={1}
            className={`avatar-uploader ${styles.uploadButton}`}
            beforeUpload={onBeforeUpload}
          >
            {state.image
              ? <img src={state.image.base64 ?? state.image} alt="avatar" className={styles.uploadImage} />
              : (
                <div className={styles.uploadButtonPlaceholder}>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Chọn ảnh</div>
                </div>
              )}
          </Upload>
        </Form.Item>

        {/* <Form.Item label="Danh mục cha" name="type">
                <Select disabled={!!initialValues.subs?.length} placeholder="Chọn thư mục cha">
                  {[{ id: null, name: 'Không có' }].concat(categories.filter((x) => !x.type)).map((c) => (
                    <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item> */}
      </Form>
    )
  }, [addLoading, onBeforeUpload, onUploadChange, state.image])

  const showCategoryModal = React.useCallback(async (title, actionType, initialValues = { categoryId: null, name: '', image: [] }) => {
    let modal;

    try {
      const values = await new Promise((resolve, reject) => {
        modalConfigRef.current = { initialValues, resolve }

        modal = Modal.confirm({
          title,
          onCancel: reject,
          onOk: (c) => {
            formRef.current.submit();
          },
          content: modalContent(initialValues, resolve),
        });

        modalRef.current = modal;
      })

      const payload = { ...values }

      if (payload.name === initialValues.name) {
        payload.name = undefined
      }

      dispatch({ type: actionType, payload });
    } catch (error) {
      setState((prevState) => ({ ...prevState, image: null }))
      modal.destroy();
    }
  }, [dispatch, modalContent]);

  React.useEffect(() => {
    if (state.image) {
      modalRef.current?.update({ content: modalContent(modalConfigRef.current.initialValues, modalConfigRef.current.resolve) })
    }
  }, [modalContent, state.image])

  const onClickEdit = React.useCallback((item) => async () => {
    setState((prevState) => ({ ...prevState, image: item.image }))

    showCategoryModal(
      'Chỉnh sửa danh mục',
      ActionTypes.UPDATE_CATEGORY,
      {
        categoryId: item._id,
        name: item.name,
        image: [{ url: item.image, thumbUrl: item.image }]
      },
    );
  }, [showCategoryModal]);

  const columns = [
    {
      width: 100,
      title: 'Id',
      dataIndex: 'id',
      render: (text, item, index) => {
        return index + 1
      }
    },
    {
      width: 130,
      title: <div className='center'>Hình ảnh</div>,
      dataIndex: 'id',
      render: (text, item, index) => {
        return (
          <img alt='' src={item.image} className={styles.categoryImage}></img>
        )
      }
    },
    {
      title: 'Danh mục',
      dataIndex: 'name',
    },
    {
      // width: 175,
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      render: (created_at) => dayjs.utc(created_at || undefined).format('HH:mm DD/MM/YYYY')
    },
    {
      width: 200,
      title: 'Chức năng',
      dataIndex: 'functions',
      key: 'functions',
      render: (_, item) => {
        return (
          <div>
            <Button
              type="primary"
              className={styles.buttonSeparator}
              onClick={onClickEdit(item)}
            >
              Chỉnh sửa
            </Button>
            {/* <Button
              danger
              type="primary"
              onClick={onClickDelete(item)}
            >
              Xóa
            </Button> */}
          </div>
        )
      }
    },
  ];

  React.useEffect(() => {
    if (!modalRef.current) return;

    let loading = addLoading || updateLoading || deleteLoading;

    if (loading) {
      modalRef.current.update({
        okButtonProps: {
          loading,
          disabled: loading,
        },
        cancelButtonProps: {
          disabled: loading
        }
      });
    } else if (modalRef.current) {
      modalRef.current.destroy();
      modalRef.current = null;
    }
  }, [addLoading, updateLoading, deleteLoading]);

  React.useEffect(() => {
    dispatch({ type: ActionTypes.GET_CATEGORIES });
  }, [dispatch]);

  const onClickAddCategory = React.useCallback(() => {
    showCategoryModal('Thêm danh mục', ActionTypes.ADD_CATEGORY);
  }, [showCategoryModal]);

  const cardExtra = React.useMemo(() => (
    <div className={styles.cardExtra}>
      <Button
        type="primary"
        icon={<AiOutlinePlus />}
        className={styles.addCategoryButton}
        onClick={onClickAddCategory}
      >
        Thêm danh mục
      </Button>

      {/* <div className={styles.searchContainer}>
        <Input.Search
          enterButton
          placeholder="Tìm kiếm danh mục..."
          onSearch={onSearch}
        />
      </div> */}
    </div>
  ), [onClickAddCategory]);

  return (
    <div className={styles.container}>
      <Card
        title="Quản lý danh mục sản phẩm"
        extra={cardExtra}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          tableLayout="fixed"
          dataSource={categories}
          pagination={{ pageSize: 7 }}
          expandable={{ childrenColumnName: 'subs' }}
        />
      </Card>
    </div>
  );
}

export default CategoryManagePage;
