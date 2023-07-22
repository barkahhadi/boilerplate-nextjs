/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Mon Jul 17 2023 12:28:05 PM
 * File: index.tsx
 * Description: Main Layout
 */

import { LogoutOutlined } from "@ant-design/icons";
import { ProConfigProvider } from "@ant-design/pro-components";
import dynamic from "next/dynamic";
const ProLayout = dynamic(() => import("@ant-design/pro-layout"), {
  ssr: false,
});
import { ConfigProvider, Dropdown, Space, Image } from "antd";
import React, { ReactElement } from "react";
import { NextPage } from "next";
import layoutSettings from "@/settings/layout/layout";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@store/thunk/auth";
import { useRouter } from "next/router";
import enUS from "antd/lib/locale/en_US";

const MainLayout: NextPage<{
  children: ReactElement;
}> = (props) => {
  let { children } = props;

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/login");
  };

  return (
    <div
      id="main-layout"
      style={{
        height: "100vh",
        overflow: "auto",
      }}
    >
      <ProConfigProvider hashed={false}>
        <ConfigProvider
          getTargetContainer={() => {
            return document.getElementById("main-layout") || document.body;
          }}
          locale={enUS}
        >
          <ProLayout
            avatarProps={{
              src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
              size: "small",
              title: isAuthenticated ? user.name : null,
              render: (props, dom) => {
                return (
                  <Space className="bl-avatar">
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
                      {dom}
                    </Dropdown>
                  </Space>
                );
              },
            }}
            headerTitleRender={() => {
              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    router.push("/");
                  }}
                >
                  <Image
                    src="/images/app-logo/logo-text-dark.png"
                    width={110}
                    preview={false}
                    alt="logo"
                  />
                </div>
              );
            }}
            menuFooterRender={(props) => {
              if (props?.collapsed) return undefined;
              return (
                <div
                  style={{
                    fontSize: 12,
                    paddingBlockStart: 12,
                  }}
                >
                  <div>© 2023 Boilerplate with antd</div>
                  <div>by Barkah Hadi</div>
                </div>
              );
            }}
            onMenuHeaderClick={(e) => console.log(e)}
            menuItemRender={(item, dom) => (
              <div
                onClick={() => {
                  router.push(item.path || "/");
                }}
              >
                {dom}
              </div>
            )}
            {...layoutSettings}
          >
            {children}
          </ProLayout>
        </ConfigProvider>
      </ProConfigProvider>
    </div>
  );
};

export default MainLayout;
