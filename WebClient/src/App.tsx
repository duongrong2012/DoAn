import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';

import routes from 'constants/routes';
import store from 'redux/store';

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
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
