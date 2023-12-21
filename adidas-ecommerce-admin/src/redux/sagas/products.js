import { Modal } from 'antd';
import { push } from 'connected-react-router';
import { put, call, fork, select, takeLeading, takeLatest } from 'redux-saga/effects';

import * as ActionTypes from '../actionTypes';
import { apiErrorHandler, createFile } from '../../utils';
import { axiosClient, imageListSeparator, responseStatus, routes } from '../../constants';

function* getProducts({ payload }) {
  try {
    const { data } = yield axiosClient.get(`/san-pham`, { params: payload });

    yield put({
      type: ActionTypes.GET_PRODUCTS_SUCCESS, payload: {
        data: data.results,
        stateName: payload.stateName,
        page: payload.page,
        total: data.total,
      }
    });

  } catch (error) {
    apiErrorHandler(error)

    yield put({ type: ActionTypes.GET_PRODUCTS_FAILED });
  }
}

function* onProductSuccess({ successAction, productId, sizes }) {
  // Show success modal
  const showModal = function* () {
    let modal;
    yield new Promise((resolve) => {
      modal = Modal.success({
        title: 'Thành công',
        content: successAction === ActionTypes.ADD_PRODUCT_SUCCESS ? 'Thêm sản phẩm thành công' : 'Cập nhật sản phẩm thành công',
        onOk: resolve,
      })
    });

    modal.destroy();

    yield put(push(routes.PRODUCTS.path))
  };

  yield fork(showModal);

  // Hide loading
  yield put({ type: successAction });

  // Reload product list
  // yield call(getProducts);

  // const isSearched = yield select((state) => state.products.isSearched);

  // if (isSearched) {
  //   const searchText = yield select((state) => state.products.searchText);

  //   yield put({ type: ActionTypes.SUBMIT_PRODUCT_SUGGEST, payload: searchText });
  // }
}

function* addProductAction(action) {
  try {
    const { payload } = action;

    const formData = new FormData();

    const productImages = [...payload.image, ...payload.imageList]

    formData.append('name', payload.name);
    formData.append('categories', `${payload.categories}`);
    formData.append('price', payload.price);
    formData.append('quantity', payload.quantity);
    formData.append('description', payload.description);

    for (const image of productImages) {
      formData.append('productImages', image.originFileObj);
    }

    yield axiosClient.post('/quan-tri-vien/san-pham', formData);

    yield call(onProductSuccess, {
      successAction: ActionTypes.ADD_PRODUCT_SUCCESS,
    });

  } catch (error) {
    apiErrorHandler(error)

    yield put({ type: ActionTypes.ADD_PRODUCT_FAILED });
  }
}

function* updateProductAction(action) {
  try {
    const { payload } = action;

    const formData = new FormData();

    const productDetail = yield select((state) => state.products.productDetail)

    const productImages = [...payload.values.image, ...payload.values.imageList]

    const promises = productImages.map((item) => {
      if (item.url) {
        return createFile(item.url)
      }

      return Promise.resolve(item.originFileObj)
    })

    const images = yield Promise.all(promises)
    console.log(productDetail.name !== payload.values.name)
    if (productDetail.name !== payload.values.name) {
      console.log('vo if')
      formData.append('name', payload.values.name);
    }
    formData.append('categories', `${payload.values.categories}`);
    formData.append('price', payload.values.price);
    formData.append('quantity', payload.values.quantity);
    formData.append('description', payload.values.description);

    for (const image of images) {
      formData.append('productImages', image);
    }

    yield axiosClient.patch(`/quan-tri-vien/san-pham/${payload.productId}`, formData);

    yield call(onProductSuccess, {
      successAction: ActionTypes.UPDATE_PRODUCT_SUCCESS,
    });

  } catch (error) {
    apiErrorHandler(error)

    yield put({ type: ActionTypes.UPDATE_PRODUCT_FAILED });
  }
}

// function* updateProductAction(action) {
//   let errorMessage = '';

//   try {
//     const { payload } = action;
//     const selectedProduct = yield select((state) => state.products.selectedProduct);

//     const formData = new FormData();

//     formData.append('name', payload.name);
//     formData.append('category_id', payload.category_id);
//     formData.append('price', payload.price);
//     formData.append('description', payload.description);
//     formData.append('specifications', payload.specifications);
//     formData.set('image_list_string', '');

//     for (const image of payload.image) {
//       if (image.originFileObj) {
//         formData.append('image', image.originFileObj);
//       }
//     }

//     const oldImageList = [];
//     for (const item of payload.imageList) {
//       if (item.originUrl) {
//         oldImageList.push(item.originUrl);
//       } else {
//         formData.append('image_list[]', item.originFileObj);
//       }
//     }

//     if (oldImageList.length) {
//       formData.set('image_list_string', oldImageList.join(imageListSeparator))
//     }

//     const { data } = yield axiosClient.post(`/product/${selectedProduct.id}`, formData);

//     if (data.status === responseStatus.OK) {
//       yield call(onProductSuccess, {
//         successAction: ActionTypes.UPDATE_PRODUCT_SUCCESS,
//         productId: selectedProduct.id,
//         sizes: payload.sizes
//       });
//       return;
//     }

//     errorMessage = data.errors.jwt_mdlw_error;
//   } catch (error) {
//     errorMessage = error.response?.data?.errors?.jwt_mdlw_error ?? error.message;
//   }

//   yield put({ type: ActionTypes.UPDATE_PRODUCT_FAILED });

//   yield call(apiErrorHandler, errorMessage);
// }

// function* deleteProductAction(action) {
//   let errorMessage = '';

//   try {
//     const { payload, route } = action;
//     const { id } = payload;

//     const { data } = yield axiosClient.delete('/product', {
//       data: {
//         ids: [id]
//       }
//     });

//     if (data.status === responseStatus.OK) {
//       yield put({ type: ActionTypes.DELETE_PRODUCT_SUCCESS, payload: action.payload });

//       if (typeof route === 'string') {
//         yield put(push(route));
//       }
//       return;
//     }

//     errorMessage = data.errors.jwt_mdlw_error;
//   } catch (error) {
//     errorMessage = error.response?.data?.errors?.jwt_mdlw_error ?? error.message;
//   }

//   yield put({ type: ActionTypes.DELETE_PRODUCT_FAILED });

//   yield call(apiErrorHandler, errorMessage);
// }

function* getProductDetail({ payload }) {
  try {
    const { data } = yield axiosClient.get(`/san-pham/${payload.productId}`);

    yield put({
      type: ActionTypes.GET_PRODUCT_DETAIL_SUCCESS,
      payload: data.results
    });

  } catch (error) {
    yield put({ type: ActionTypes.GET_PRODUCT_DETAIL_FAILED });

    apiErrorHandler(error)
  }
}

function* suggestSearchProductAction(action) {
  if (!action.payload) return;

  try {
    const { data } = yield axiosClient.get(`/product/search-products?name=${action.payload}`);

    if (data.status === responseStatus.OK) {
      yield put({ type: ActionTypes.SUGGEST_SEARCH_PRODUCT_SUCCESS, payload: data.results });
      return;
    }
  } catch (error) {

  }

  yield put({ type: ActionTypes.SUGGEST_SEARCH_PRODUCT_FAILED });
}

export default function* productsSaga() {
  yield takeLeading(ActionTypes.GET_PRODUCTS, getProducts);
  yield takeLeading(ActionTypes.GET_PRODUCT_DETAIL, getProductDetail);
  yield takeLeading(ActionTypes.ADD_PRODUCT, addProductAction);
  yield takeLeading(ActionTypes.UPDATE_PRODUCT, updateProductAction);
  // yield takeLeading(ActionTypes.DELETE_PRODUCT, deleteProductAction);
  yield takeLatest(ActionTypes.SUGGEST_SEARCH_PRODUCT, suggestSearchProductAction);
}