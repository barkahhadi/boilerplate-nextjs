/**
 * Author: Barkah Hadi
 * Description: The blank layout component.
 * Last Modified: 02-06-2023
 *
 * email: barkah.hadi@gmail.com
 */

import { ConfigProvider, Space } from "antd";
import { NextPage } from "next";
import { ReactElement } from "react";
import themeSettings from "@styles/theme.module.scss";
import enUS from "antd/lib/locale/en_US";

const BlankLayout: NextPage<{ children: ReactElement }> = (props) => {
  const { children } = props;

  return (
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
      {children}
    </ConfigProvider>
  );
};

export default BlankLayout;
