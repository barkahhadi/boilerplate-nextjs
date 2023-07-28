/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Mon Jul 17 2023 12:28:05 PM
 * File: index.tsx
 * Description: Main Layout
 */

import { Layout, ConfigProvider } from "antd";
import React, { ReactElement, useEffect, useState } from "react";
import enUS from "antd/lib/locale/en_US";
import Sidebar from "../Sidebar";
import themeSettings from "@styles/theme.module.scss";
import Header from "../Header";
import Footer from "../Footer";

const MainLayout: React.FC<{
  children: ReactElement;
}> = (props) => {
  let { children } = props;

  const [isClientRender, setIsClientRender] = useState(false);

  useEffect(() => {
    setIsClientRender(true);
  }, []);

  return (
    isClientRender && (
      <ConfigProvider
        locale={enUS}
        theme={{
          token: {
            colorPrimary: themeSettings.primaryColor,
            colorSuccess: themeSettings.successColor,
            colorWarning: themeSettings.warningColor,
            colorError: themeSettings.errorColor,
            colorInfo: themeSettings.infoColor,
            colorBgContainer: themeSettings.bgContainerColor,
            colorBgElevated: themeSettings.bgElevatedColor,
            colorBgBase: themeSettings.bgBaseColor,
            fontSize: parseInt(themeSettings.fontSize) || 14,
          },
        }}
      >
        <Layout
          style={{
            minHeight: "calc(100vh - 25px)",
          }}
        >
          <Sidebar />
          <Layout>
            <Header />
            {children}
          </Layout>
        </Layout>
        <Footer />
      </ConfigProvider>
    )
  );
};

export default MainLayout;
