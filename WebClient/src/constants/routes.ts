import HomePage from 'pages/Home';
import LoginPage from 'pages/Login';

const routes = {
  Home: () => ({
    path: '/',
    Component: HomePage,
  }),
  Login: () => ({
    path: '/login',
    Component: LoginPage,
  })
}

export default routes;
