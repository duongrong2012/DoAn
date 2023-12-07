import LoginPage from "admin/pages/LoginPage";

const adminRoutes = {
  Login: () => ({
    path: '/quan-tri/dang-nhap',
    Component: LoginPage,
  }),
}

export default adminRoutes;
