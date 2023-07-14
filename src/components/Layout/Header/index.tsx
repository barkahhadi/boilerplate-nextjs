/**
 * Author: Barkah Hadi
 * Description: The header component.
 * Last Modified: 02-06-2023
 *
 * email: barkah.hadi@gmail.com
 */

import { ReactElement } from "react";
import { Layout, Button } from "antd";

import classes from "./index.module.scss";

const Header: React.FC<{ children: ReactElement }> = ({ children }) => {
  return (
    <>
      <Layout.Header className={classes.header}>{children}</Layout.Header>
    </>
  );
};

export default Header;
