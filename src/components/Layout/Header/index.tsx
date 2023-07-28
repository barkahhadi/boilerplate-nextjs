/**
 * Author: Barkah Hadi
 * Description: The header component.
 * Last Modified: 02-06-2023
 *
 * email: barkah.hadi@gmail.com
 */

import { Layout, Row, Col, Space, Dropdown, Avatar } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import themeSettings from "@styles/theme.module.scss";
import { useAppDispatch, useAppSelector } from "@/store";
import { useRouter } from "next/router";
import { logout } from "@/store/thunk/auth";

const Header: React.FC = () => {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/login");
  };

  return (
    <Layout.Header
      style={{ padding: "0px 16px", background: themeSettings.bgHeaderColor }}
    >
      <Row justify="space-between">
        <Col></Col>
        <Col>
          <Space>
            <Dropdown
              placement="bottomRight"
              menu={{
                items: [
                  {
                    key: "logout",
                    icon: <LogoutOutlined />,
                    label: "Logout",
                    onClick: () => {
                      handleLogout();
                    },
                  },
                ],
              }}
            >
              <Space>
                {auth.user?.name}
                <Avatar
                  style={{
                    backgroundColor: "#87d068",
                    cursor: "pointer",
                    margin: "0px 8px",
                  }}
                  icon={<UserOutlined />}
                />
              </Space>
            </Dropdown>
          </Space>
        </Col>
      </Row>
    </Layout.Header>
  );
};

export default Header;
