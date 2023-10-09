import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';

import routes from 'constants/routes';
import store from 'redux/store';
import NavigationBar from 'components/NavigationBar';

const router = createBrowserRouter(Object.values(routes).map(item => {
  const routeItem = item();

  return {
    path: routeItem.path,
    Component: routeItem.Component,
  }
}));

function App() {
  return (
    <Provider store={store}>
      <NavigationBar />
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
