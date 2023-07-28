/**
 * Author: Barkah Hadi
 * Description: The sidebar component.
 * Last Modified: 02-06-2023
 *
 * email: barkah.hadi@gmail.com
 */

import { Button, Layout, Menu, MenuProps, Image } from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { useEffect, useState } from "react";
import menus, { MenuItem } from "@settings/layout/menus";
import { useCasl } from "@/hooks/useCasl";
import { useRouter } from "next/router";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

type CanFunction = (action: string, module: string) => boolean;
const filterMenu = (can: CanFunction, menuListItem: MenuItem[]): ItemType[] => {
  return menuListItem
    .map((menu: MenuItem): ItemType => {
      let menuItem: ItemType = {
        key: menu.key,
        icon: menu.icon,
        label: menu.name,
        children: null,
      };

      if (menu.children) {
        const childMenu = filterMenu(can, menu.children);
        menuItem.children =
          childMenu.length > 0 ? filterMenu(can, menu.children) : null;
        return menuItem;
      } else if (menu.useCasl) {
        const enable: boolean = can("read", menu.key);
        return enable ? menuItem : null;
      } else {
        return menuItem;
      }
    })
    .filter((menu: ItemType) => menu !== null);
};

const findSelectedKeys = (
  menu: MenuItem[],
  pathname: string
): MenuItem | null => {
  let selectedMenu: MenuItem = null;
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].path === pathname) {
      selectedMenu = menu[i];
      break;
    } else if (menu[i].children) {
      selectedMenu = findSelectedKeys(menu[i].children, pathname);
      if (selectedMenu) {
        break;
      }
    }
  }
  return selectedMenu;
};

const findOpenedKeys = (
  menu: MenuItem[],
  pathname: string
): string[] | null => {
  let openedKeys: string[] = [];
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].path === pathname) {
      openedKeys = [menu[i].key];
      break;
    } else if (menu[i].children) {
      const childKeys = findOpenedKeys(menu[i].children, pathname);
      if (childKeys) {
        openedKeys = [menu[i].key, ...childKeys];
        break;
      }
    }
  }
  return openedKeys.length > 0 ? openedKeys : null;
};

const findPath = (menu: MenuItem[], key: string): string | null => {
  let path: string = null;
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].key === key) {
      path = menu[i].path;
      break;
    } else if (menu[i].children) {
      path = findPath(menu[i].children, key);
      if (path) {
        break;
      }
    }
  }
  return path;
};

const Sidebar: React.FC = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const { can } = useCasl();
  const [current, setCurrent] = useState(null);
  const [openedKeys, setOpenedKeys] = useState([]);
  const [collapsedWidth, setCollapsedWidth] = useState(65);
  const [isBroken, setIsBroken] = useState(false);
  const caslMenu = filterMenu(can, menus);
  const router = useRouter();

  useEffect(() => {
    const currentPath = router.pathname;
    const selectedMenu = findSelectedKeys(menus, currentPath);
    if (selectedMenu !== null) {
      setCurrent(selectedMenu.key);
    }
    const openedKeys = findOpenedKeys(menus, currentPath);
    if (openedKeys !== null) {
      setOpenedKeys(openedKeys);
    }
  }, []);

  const handleOnClick = (e: any) => {
    const key = e.key.toString();
    setCurrent(e.key.toString());
    const path = findPath(menus, key);
    if (path) {
      router.push(path);
    }
    if (isBroken) {
      setCollapsed(true);
    }
  };

  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    setOpenedKeys(keys);
  };

  return (
    <Layout.Sider
      collapsible
      collapsed={collapsed}
      breakpoint="lg"
      collapsedWidth={collapsedWidth}
      onBreakpoint={(broken) => {
        setIsBroken(broken);
        if (broken) {
          setCollapsedWidth(0);
          setCollapsed(true);
        } else {
          setCollapsedWidth(65);
          setCollapsed(false);
        }
      }}
      onCollapse={(c, t) => {
        setCollapsed(!!c);
      }}
      width={260}
      trigger={
        <Button
          type="default"
          shape="default"
          size="small"
          className="btn-trigger"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => {
            setCollapsed(!collapsed);
          }}
        />
      }
      zeroWidthTriggerStyle={{
        top: 0,
      }}
    >
      <div
        className="app-logo"
        style={{
          marginBottom: "12px",
          textAlign: collapsed ? "center" : "left",
        }}
      >
        {collapsed ? (
          <Image
            src="/images/app-logo/logo-dark.png"
            width={65}
            preview={false}
            alt="logo"
            style={{
              padding: "10px",
            }}
          />
        ) : (
          <Image
            src="/images/app-logo/logo-text-dark.png"
            width={140}
            preview={false}
            alt="logo"
            style={{
              padding: "12px 10px",
            }}
          />
        )}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        onClick={handleOnClick}
        openKeys={openedKeys}
        onOpenChange={onOpenChange}
        selectedKeys={[current]}
        items={caslMenu}
      />
    </Layout.Sider>
  );
};

export default Sidebar;
