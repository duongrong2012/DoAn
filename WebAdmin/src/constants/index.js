import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';
import { FaBox, FaTags, FaUserCircle, FaDollarSign, FaShoppingCart } from 'react-icons/fa';

import NotFound from '../pages/NotFound';
import UserManagePage from '../pages/UserManagePage';
import OrderManagePage from '../pages/OrderManagePage';
import OrderDetailPage from '../pages/OrderDetailPage';
import CategoryManagePage from '../pages/CategoryManagePage';
// import AddCategoryPage from '../pages/AddCategoryPage';
import ProductManagePage from '../pages/ProductManagePage';
import AddProductPage from '../pages/AddProductPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import RevenueManagePage from '../pages/RevenueManagePage';
import store from '../redux/store';

import * as ActionTypes from '../redux/actionTypes';

export const routes = {
  HOME_REDIRECT: {
    path: '/',
    exact: true,
    component: <Redirect to="/users" />
  },
  USERS: {
    path: '/users',
    component: UserManagePage
  },
  ORDERS: (userId = '') => {
    let path = `/orders`;

    if (userId) {
      path = `/orders/${userId}`
    }

    return {
      path,
      component: OrderManagePage,
      defaultParam: '/:userId?'
    }
  },
  ORDER_DETAIL: (orderId = '') => {
    let path = `/order/detail`;

    if (orderId) {
      path = `/order/detail/${orderId}`
    }

    return {
      path,
      component: OrderDetailPage,
      defaultParam: '/:orderId'
    }
  },
  CATEGORIES: {
    path: '/categories',
    exact: true,
    component: CategoryManagePage
  },
  // ADD_CATEGORY: {
  //   path: '/products/add',
  //   component: AddProductPage
  // },
  PRODUCTS: {
    path: '/products',
    exact: true,
    component: ProductManagePage
  },
  ADD_PRODUCT: {
    path: '/products/add',
    component: AddProductPage
  },
  PRODUCT_DETAIL: (productId = '') => {
    let path = `/product/detail`;

    if (productId) {
      path = `/product/detail/${productId}`
    }

    return {
      path,
      component: ProductDetailPage,
      defaultParam: '/:productId'
    }
  },
  REVENUE: {
    path: '/revenue',
    component: RevenueManagePage,
  },
  NOT_FOUND: {
    path: '*',
    component: NotFound,
  }
};

export const sideMenuItems = [
  {
    title: 'Quản lý người dùng',
    path: routes.USERS.path,
    icon: <FaUserCircle />,
  },
  {
    title: 'Quản lý danh mục',
    path: routes.CATEGORIES.path,
    icon: <FaTags />,
  },
  {
    title: 'Quản lý sản phẩm',
    path: routes.PRODUCTS.path,
    icon: <FaBox />,
  },
  {
    title: 'Quản lý đơn hàng',
    path: routes.ORDERS().path,
    icon: <FaShoppingCart />,
  },
  {
    title: 'Quản lý doanh thu',
    path: routes.REVENUE.path,
    icon: <FaDollarSign />,
  },
  {
    title: 'Đăng xuất',
    action: ActionTypes.LOGOUT,
    icon: <BiLogOut />,
  },
];

export const localStorageKey = {
  SIDEBAR_COLLAPSED: 'SIDEBAR_COLLAPSED',
  RECENTLY_USERNAME: 'RECENTLY_USERNAME',
  TOKEN: "TOKEN",
};


export const responseStatus = {
  OK: 'OK', // Success
  NG: 'NG', // Failed
};

export const responseError = {
  UNAUTHENTICATED: 'Unauthenticated.',
};

export const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:3001'
});

export const imageListSeparator = ';';

export const transactionStatus = {
  ORDER_CANCELLED: 0,
  ORDER_SUCCESS: 1,
  ORDER_DELIVERY: 1,
  ORDER_DELIVERED: 1,
}
export const transactionStatusLabel = {
  PROCESSING: 'Đang Xử Lý',
  DELIVERING: 'Đang GIao Hàng',
  DELIVERED: 'Đã Giao Hàng',
}

export const transactionStatusColor = {
  PROCESSING: '#108ee9',
  DELIVERING: '#f50',
  DELIVERED: '#87d068'
}

export const reCaptChaSiteKey = "6LfiwhEpAAAAANF0-Mr6KyMgPdRvi_f4-lGs96OH"

export const reCaptChaSecretKey = "6LfiwhEpAAAAAPgaBbPomjohN06bBum7mjTd36Ct"

axiosClient.interceptors.request.use((config) => {
  if (["dang-nhap", "dang-ki"].some((item) => config.url?.includes(item))) {
    const isRefreshCaptcha = store.getState().app.isRefreshCaptcha

    store.dispatch({
      type: ActionTypes.SET_APP_STATE,
      payload: {
        isRefreshCaptcha: !isRefreshCaptcha
      }
    })

  }

  return config
})