import {
  UserOutlined,
  KeyOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";

export interface MenuItem {
  key: string;
  path?: string;
  name: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  useCasl?: boolean;
}

const menus: MenuItem[] = [
  {
    key: "user-management",
    name: "User Management",
    icon: <UserOutlined />,
    children: [
      {
        path: "/user-management/users",
        name: "Users",
        icon: <UserOutlined />,
        key: "user-management:users",
        useCasl: true,
      },
      {
        path: "/user-management/roles",
        name: "Roles",
        icon: <KeyOutlined />,
        key: "user-management:roles",
        useCasl: true,
      },
      {
        path: "/user-management/offices",
        name: "Offices",
        icon: <AppstoreAddOutlined />,
        key: "user-management:offices",
        useCasl: true,
      },
    ],
  },
];

export default menus;
