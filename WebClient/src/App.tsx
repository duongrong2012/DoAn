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

const routeList: RouteObject[] = [{
  path: "/",
  Component: MainLayout,
  children: Object.values(routes).map(item => {
    const routeItem = item();

    return {
      path: routeItem.path,
      Component: routeItem.Component,
    }
  })
}]

const router = createBrowserRouter(routeList);

function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(AuthActions.checkLogin())
  }, [dispatch])

  return (
    <RouterProvider router={router} />
  );
}

export default App;
