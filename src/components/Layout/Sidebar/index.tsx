/**
 * Author: Barkah Hadi
 * Description: The sidebar component.
 * Last Modified: 02-06-2023
 *
 * email: barkah.hadi@gmail.com
 */

import { Menu } from "antd";
import { MenuItemType } from "antd/es/menu/hooks/useItems";
import { useMemo } from "react";
import { UserOutlined } from "@ant-design/icons";

const Sidebar: React.FC = () => {
  const menuItems: MenuItemType[] = useMemo(() => {
    return [
      {
        key: "1",
        icon: <UserOutlined />,
        label: "nav 1",
      },
    ];
  }, []);

  return (
    <Menu
      theme="light"
      mode="vertical"
      defaultSelectedKeys={["1"]}
      style={{ border: 0 }}
      items={menuItems}
    />
  );
};

export default Sidebar;
