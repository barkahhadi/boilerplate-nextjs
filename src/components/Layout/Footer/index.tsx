/**
 * Author: Barkah Hadi
 * Description: The footer component.
 * Last Modified: 02-06-2023
 *
 * email: barkah.hadi@gmail.com
 */

import { Col, Layout, Row } from "antd";
import DateTime from "./datetime";
import themeSettings from "@styles/theme.module.scss";

const Header: React.FC = () => {
  return (
    <Layout.Footer
      style={{
        textAlign: "center",
        bottom: 0,
        padding: "7px 18px",
        background: themeSettings.bgFooterColor,
      }}
    >
      <Row justify="space-between" gutter={2}>
        <Col style={{ color: "#ffffff" }}>
          Boilerplate ©2023 Created by Barkah Hadi. Email: barkah.hadi@gmail.com
        </Col>
        <Col xs={0} lg={12} style={{ textAlign: "right", color: "#ffffff" }}>
          <DateTime />
        </Col>
      </Row>
    </Layout.Footer>
  );
};

export default Header;
