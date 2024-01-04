import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Checkbox } from 'antd';

import styles from './styles.module.css';
import { localStorageKey } from '../../constants';
import * as ActionTypes from '../../redux/actionTypes';

const LoginPage = () => {
  const prevUserName = React.useRef(localStorage.getItem(localStorageKey.RECENTLY_USERNAME) || '');

  const loginLoading = useSelector((state) => state.app.loginLoading);

  const dispatch = useDispatch();

  const onFinish = React.useCallback((values) => {
    dispatch({ type: ActionTypes.LOGIN, payload: values })
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <Form
        autoComplete="off"
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 16 }}
        initialValues={{
          remember: true,
          username: prevUserName.current,
          password: '',
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Tên Đăng Nhập"
          name="username"
          rules={[
            {
              required: true,
              message: 'Vui lòng điền tên đăng nhập!',
            },
          ]}
        >
          <Input disabled={loginLoading} />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            {
              required: true,
              message: 'Vui lòng điền mật khẩu!',
            },
          ]}
        >
          <Input.Password disabled={loginLoading} />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Checkbox disabled={loginLoading}>Ghi nhớ đăng nhập?</Checkbox>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            loading={loginLoading}
            disabled={loginLoading}
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default LoginPage;
