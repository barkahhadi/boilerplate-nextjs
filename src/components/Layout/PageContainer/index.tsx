import { Col, Layout, Row, theme, Typography } from "antd";
const { Title } = Typography;

interface PageContainerProps {
  title?: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = (props) => {
  const { children = null, title = null, extra = null } = props;
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout.Content
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: 280,
        background: colorBgContainer,
      }}
    >
      {(title || extra) && (
        <Row
          style={{
            marginBottom: 24,
          }}
        >
          <Col span={12}>
            <Title level={4}>{title}</Title>
          </Col>
          <Col span={12}>
            <Row justify="end">
              <Col>{extra}</Col>
            </Row>
          </Col>
        </Row>
      )}

      {children}
    </Layout.Content>
  );
};

export default PageContainer;
