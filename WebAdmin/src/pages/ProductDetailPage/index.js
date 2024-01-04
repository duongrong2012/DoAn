/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  TreeSelect,
  InputNumber,
  Spin,
} from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useDispatch, useSelector } from 'react-redux';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';

import AppInput from '../../components/AppInput';

import styles from './styles.module.css';
import * as ActionTypes from '../../redux/actionTypes';
import { maxProductImage, maxProductImageList } from '../AddProductPage';
import { formatCurrency, readFile } from '../../utils';

dayjs.extend(utc)

const ProductDetailPage = () => {
  const dispatch = useDispatch();

  let { productId } = useParams();

  const loadingIcon = <LoadingOutlined spin className={styles.loadingIcon} />;

  const productDetail = useSelector((state) => state.products.productDetail);

  const productDetailLoading = useSelector((state) => state.products.productDetailLoading);

  const categories = useSelector((state) => state.categories.categoryList);

  const deleteLoading = useSelector((state) => state.products.deleteLoading);

  React.useEffect(() => {
    dispatch({ type: ActionTypes.GET_PRODUCT_DETAIL, payload: { productId } });
  }, [dispatch, productId])

  // const [state, setState] = React.useState(() => {
  //   const clonedSelectedProduct = JSON.parse(JSON.stringify(productDetail));

  //   const imageList = getImageListByString(clonedSelectedProduct?.image_list, imageListSeparator, false).map((url) => ({
  //     url: getFormatImageSource(url),
  //     originUrl: url,
  //   }));

  //   return {
  //     imageList,
  //     selectedProduct: clonedSelectedProduct,
  //     image: getFormatImageSource(clonedSelectedProduct?.image),
  //   };
  // });

  const [state, setState] = React.useState({
    image: null,
    imageList: [],
  });

  const modalRef = React.useRef();

  const onFinish = React.useCallback(async (values) => {
    dispatch({
      type: ActionTypes.UPDATE_PRODUCT, payload: {
        productId,
        values
      }
    });
  }, [dispatch, productId]);

  React.useEffect(() => {
    if (productDetail) {
      setState((prevState) => ({
        ...prevState,
        image: productDetail.images[0].url,
        imageList: productDetail.images.slice(1)
      }))
    }
  }, [productDetail])

  const renderFormItem = React.useCallback((item) => {
    if (item.formItem) return item.formItem;

    const sharedProps = {
      key: item.name,
      name: item.name,
      label: item.label,
      rules: item.rules,
      wrapperCol: item.wrapperCol,
    };

    if (item.valuePropName) {
      sharedProps.valuePropName = item.valuePropName;
    }

    if (item.getValueFromEvent) {
      sharedProps.getValueFromEvent = item.getValueFromEvent;
    }

    return (
      <Form.Item
        {...sharedProps}
      >
        {item.component || <AppInput />}
      </Form.Item>
    )
  }, []);

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

  const onUploadImageListChange = React.useCallback((e) => {
    setState((prevState) => ({ ...prevState, imageList: e.fileList }));

    return e.fileList;
  }, []);

  const renderCategoryItem = React.useCallback((item) => {
    let childrens = [];

    return (
      <TreeSelect.TreeNode
        key={item._id}
        value={item._id}
        title={item.name}
      >
        {childrens}
      </TreeSelect.TreeNode>
    );
  }, []);

  const formItems = React.useMemo(() => [
    {
      name: 'name',
      label: 'Tên sản phẩm',
      rules: [{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]
    },
    {
      name: 'price',
      label: 'Giá sản phẩm',
      rules: [
        { required: true, message: 'Vui lòng nhập giá sản phẩm!' },
        { type: 'number', message: 'Giá sản phẩm không hợp lệ!' },
      ],
      component: (
        <InputNumber
          className={styles.priceInput}
          parser={value => {
            // const valueWithoutCurrency = value.replace(' VNĐ', '');
            // const valueWithoutSeparator = valueWithoutCurrency.replace(/,/g, '').trim();
            return value.replace(/\D/g, '').trim();
          }}
          formatter={(value) => formatCurrency(`${value} VNĐ`)} />
      )
    },
    {
      name: 'quantity',
      label: 'Số lượng',
      rules: [
        { required: true, message: 'Vui lòng nhập số lượng!' },
        { type: 'number', message: 'Số lượng không hợp lệ!' },
      ],
      component: (
        <InputNumber placeholder="Số lượng" style={{ width: '100%' }} />
      )
    },
    {
      name: 'category',
      label: 'Danh mục',
      rules: [{ required: true, message: 'Vui lòng chọn danh mục cho sản phẩm!' }],
      component: (
        <TreeSelect
          treeDefaultExpandAll
          placeholder="Chọn danh mục"
          treeCheckable
        >
          {categories.map(renderCategoryItem)}
        </TreeSelect>
      )
    },
    {
      name: 'image',
      valuePropName: 'fileList',
      label: 'Hình ảnh đại diện',
      getValueFromEvent: onUploadChange,
      rules: [{ required: true, min: 1, type: 'array', message: 'Vui lòng chọn hình ảnh!' }],
      // rules: [{ required: true, message: 'Vui lòng nhập hình ảnh!' }]
      component: (
        <Upload
          accept="image/*"
          listType="picture"
          showUploadList={false}
          maxCount={maxProductImage}
          className={`avatar-uploader ${styles.uploadButton}`}
          beforeUpload={onBeforeUpload}
        >
          {state?.image
            ? <img src={state?.image.base64 ?? state?.image} alt="avatar" className={styles.uploadImage} />
            : (
              <div className={styles.uploadButtonPlaceholder}>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Chọn ảnh</div>
              </div>
            )}
        </Upload>
      )
    },
    {
      name: 'imageList',
      valuePropName: 'fileList',
      label: 'Hình ảnh chi tiết',
      getValueFromEvent: onUploadImageListChange,
      rules: [{ required: true, min: 1, type: 'array', message: 'Vui lòng chọn hình ảnh!' }],
      component: (
        <Upload
          accept="image/*"
          listType="picture-card"
          className="avatar-uploader"
          maxCount={maxProductImageList}
          multiple={state?.imageList.length < maxProductImageList - 1}
          beforeUpload={onBeforeUpload}
        >
          {state?.imageList.length < maxProductImageList && (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Chọn ảnh</div>
            </div>
          )}
        </Upload>
      )
    },
    {
      name: 'description',
      label: 'Mô tả',
      rules: [
        { required: true, message: 'Vui lòng nhập mô tả cho sản phẩm.' },
        { max: 10000, message: 'Mô tả quá dài!' },
      ],
      component: <Input.TextArea rows={8} />
    },
    {
      name: 'submit',
      wrapperCol: {
        offset: 5,
        span: 10,
      },
      component: (
        <Button type="primary" htmlType="submit">
          Cập nhật
        </Button>
      )
    },
  ], [
    categories,
    state?.image,
    state?.imageList.length,
    renderCategoryItem,
    onBeforeUpload,
    onUploadChange,
    onUploadImageListChange,
  ]);

  // const onClickRemoveProduct = React.useCallback(() => {
  //   const modal = Modal.confirm({
  //     maskClosable: false,
  //     okButtonProps: { danger: true },
  //     title: `Bạn có chắc chắn muốn xóa sản phẩm ${state.selectedProduct.name}?`,
  //     okText: 'Xác nhận',
  //     cancelText: 'Hủy bỏ',
  //     onOk: () => dispatch({
  //       type: ActionTypes.DELETE_PRODUCT,
  //       payload: state.selectedProduct,
  //       route: routes.PRODUCTS.path,
  //     })
  //   });

  //   modalRef.current = modal;
  // }, [dispatch, state.selectedProduct]);

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

  if (productDetailLoading) return (
    <div className={styles.loadingContainer}>
      <Spin indicator={loadingIcon} />
    </div>
  )

  return (
    <div className={styles.container}>
      <Card
      // title={`Sản phẩm: ${state.selectedProduct.name}`}
      // extra={<Button danger icon={<FaTrashAlt />} onClick={onClickRemoveProduct} />}
      >
        <Form
          name="product-form"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 10 }}
          initialValues={{
            // ...state.selectedProduct,
            // sizes: state.selectedProduct.detail_products,
            // image: [{
            //   url: getFormatImageSource(state.selectedProduct.image),
            //   originUrl: state.selectedProduct.image,
            // }],
            // imageList: state.imageList
            name: productDetail?.name,
            quantity: productDetail?.quantity,
            price: productDetail?.price,
            category: productDetail?.categories.map((item) => item._id),
            image: [{ url: productDetail?.images[0].url }],
            imageList: productDetail?.images.slice(1).map((item) => ({
              ...item,
              thumbUrl: item.url
            })),
            description: productDetail?.description,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          {formItems.map(renderFormItem)}
        </Form>
      </Card>
    </div>
  );
}

export default ProductDetailPage;
