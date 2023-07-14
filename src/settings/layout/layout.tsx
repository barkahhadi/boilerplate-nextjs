import { ProLayoutProps } from "@ant-design/pro-components";
import menus from "./menus";

const layoutSettings: ProLayoutProps = {
  fixSiderbar: true,
  layout: "mix",
  siderMenuType: "sub",
  splitMenus: false,
  prefixCls: "bl-pro",
  siderWidth: 260,
  route: {
    routes: menus,
  },
  token: {
    header: {
      colorBgMenuItemSelected: "rgba(0,0,0,0.04)",
      colorBgHeader: "rgba(255,255,255,1)",
    },
    sider: {
      colorMenuBackground: "rgba(255,255,255,1)",
    },
    bgLayout: "rgba(230,230,230,1)",
  },
  menu: {
    collapsedShowGroupTitle: true,
  },
};

export default layoutSettings;
