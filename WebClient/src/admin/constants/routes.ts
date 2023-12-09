import LoginPage from "admin/pages/LoginPage";
import UserManagementPage from "admin/pages/UserManagementPage";

const adminRoutes = {
  Login: () => ({
    path: '/quan-tri/dang-nhap',
    Component: LoginPage,
  }),
  UserManagementPage: () => {
    let path = '/quan-tri/quan-ly-nguoi-dung'

    return {
      path,
      exact: true,
      private: true,
      Component: UserManagementPage
    }
  },
}

export default adminRoutes;
