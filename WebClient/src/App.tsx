import React from 'react';
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';

import routes from 'constants/routes';
import MainLayout from 'layouts/MainLayout';
import { AuthActions } from 'redux/slices/auth';
import PrivateRoute from 'components/PrivateRoute';
import { GoogleReCaptcha } from 'react-google-recaptcha-v3';
import { axiosClient } from './constants';
import useAppSelector from 'hooks/useAppSelector';
import AdminLayout from 'admin/components/AdminLayout';
import adminRoutes from 'admin/constants/routes';

const renderRoutItem = (item: any) => {
  const routeItem = item();

  const route: RouteObject = {
    path: routeItem.path,
    Component: routeItem.Component,
  };

  if ((routeItem as any).private) {
    route.Component = undefined;

    route.element = <PrivateRoute Component={routeItem.Component} />
  }

  return route;
}

const routeList: RouteObject[] = [
  {
    path: "/",
    Component: MainLayout,
    children: Object.values(routes).map(renderRoutItem)
  },
  {
    path: "/quan-tri",
    Component: AdminLayout,
    children: Object.values(adminRoutes).map(renderRoutItem)
  }
]

export const router = createBrowserRouter(routeList);

function App() {
  const dispatch = useDispatch();

  const isRefreshCaptcha = useAppSelector((reduxState) => reduxState.app.isRefreshCaptcha);

  React.useEffect(() => {
    dispatch(AuthActions.checkLogin())
  }, [dispatch])

  const onVerifyReCaptcha = React.useCallback((token: string) => {
    axiosClient.defaults.headers.captcha = token
  }, [])

  return (
    <>
      <GoogleReCaptcha
        onVerify={onVerifyReCaptcha}
        refreshReCaptcha={isRefreshCaptcha}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
