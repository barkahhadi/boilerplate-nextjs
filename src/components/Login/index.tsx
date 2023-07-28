/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Wed Jul 05 2023 3:26:05 PM
 * File: index.tsx
 * Description: Login Component
 */

import {
  Layout,
  Card,
  Button,
  Checkbox,
  Form,
  Input,
  Image,
  Divider,
  Typography,
  message,
} from "antd";
import classes from "./index.module.scss";
import { useAppSelector, useAppDispatch } from "@/store";
import { login } from "@/store/thunk/auth";
import { useEffect, useState } from "react";
import AuthCookie from "@utils/cookies/auth";
import { useRouter } from "next/router";
import { AuthState } from "@/store/slice/auth";
import { authActions } from "@/store/slice/auth";

const { Text } = Typography;
const { Content } = Layout;

const Login: React.FC | any = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, error }: AuthState = useAppSelector(
    (state) => state.auth
  );
  const [messageApi, contextHolder] = message.useMessage();
  const [isDisableButton, setIsDisableButton] = useState<boolean>(false);

  const onFinish = (values: any) => {
    setIsDisableButton(true);
    dispatch(login(values));
  };

  const onFinishFailed = (errorInfo: any) => {};

  useEffect(() => {
    if (AuthCookie.isAuthenticated) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      messageApi.open({
        type: "success",
        content: "Login success",
      });

      setTimeout(() => {
        setIsDisableButton(false);
      }, 500);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      messageApi.open({
        type: "error",
        content: error,
        onClose: () => {
          dispatch(authActions.setError(null));
        },
      });
    }
  }, [error]);

  return (
    <>
      <Content className={classes.loginContainer}>
        {contextHolder}
        <Card className={classes.cardLogin}>
          <div className={classes.logo}>
            <Image
              src="/images/app-logo/logo-text-light.png"
              width={160}
              preview={false}
              alt="logo"
            />
          </div>
          <Divider></Divider>
          <p style={{ marginBottom: 20 }}>
            <Text type="secondary">Welcome, please enter your credential.</Text>
          </p>
          <Form
            name="basic"
            layout="vertical"
            initialValues={{ remember: false }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            onChange={() => {
              setIsDisableButton(false);
            }}
            autoComplete="off"
          >
            <Form.Item
              label="Username or Email"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="middle"
                block
                loading={isLoading}
                disabled={isDisableButton}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </>
  );
};

export default Login;
