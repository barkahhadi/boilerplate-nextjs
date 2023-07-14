/**
 * Author: Barkah Hadi
 * Description: The blank layout component.
 * Last Modified: 02-06-2023
 *
 * email: barkah.hadi@gmail.com
 */

import { Space } from "antd";
import { NextPage } from "next";
import { ReactElement } from "react";

const BlankLayout: NextPage<{ children: ReactElement }> = (props) => {
  const { children } = props;

  return <>{children}</>;
};

export default BlankLayout;
