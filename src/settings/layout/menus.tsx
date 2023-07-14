import {
  UserOutlined,
  KeyOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import { MenuDataItem } from "@ant-design/pro-components";

const menus: MenuDataItem = [
  {
    path: "/user-management",
    name: "User Management",
    icon: <UserOutlined />,
    component: "@pages/user-management/users",
    routes: [
      {
        path: "/user-management/users",
        name: "Users",
        icon: <UserOutlined />,
        component: "@pages/user-management/users",
      },
      {
        path: "/user-management/roles",
        name: "Roles",
        icon: <KeyOutlined />,
        component: "@pages/user-management/roles",
        key: "user-management:roles",
      },
      {
        path: "/user-management/modules",
        name: "Modules",
        icon: <AppstoreAddOutlined />,
        component: "@pages/user-management/modules",
        key: "user-management:modules",
      },
    ],
  },
];

export default menus;
