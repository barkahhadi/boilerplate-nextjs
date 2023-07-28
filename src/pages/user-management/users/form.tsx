import { useHttp } from "@/hooks/useHttp";
import {
  Alert,
  Button,
  Drawer,
  Form,
  Input,
  Space,
  Switch,
  Select,
  Divider,
} from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useCasl } from "@/hooks/useCasl";
import { Ability } from "@/constants/ability";

interface FormModuleProps {
  id?: string;
  title?: string;
  open: boolean;
  listRole?: any[];
  listOffice?: any[];
  onClose: () => void;
  onFinish?: () => void;
}

const UsersForm: React.FC<FormModuleProps> = (props) => {
  const { post, patch, isLoading, error } = useHttp();
  const { get, isLoading: isLoadingData } = useHttp();
  const {
    id = null,
    title,
    open = false,
    listRole = [],
    listOffice = [],
    onClose = () => {},
    onFinish = () => {},
  } = props;
  const [form] = Form.useForm();
  const [formError, setFormError] = useState<string | null>(error);
  const { can } = useCasl("user-management:users");

  useEffect(() => {
    setFormError(error);
  }, [error]);

  const handleClose = () => {
    open && form.resetFields();
    setFormError(null);
    onClose();
  };

  const handleSuccess = () => {
    handleClose();
    onFinish();
  };

  const handleFinish = async (values: any) => {
    if (id) {
      await patch(`/users/${id}`, values, {
        onSuccess: handleSuccess,
        onError: () => {},
      });
    } else {
      await post("/users", values, {
        onSuccess: handleSuccess,
        onError: () => {},
      });
    }
  };

  useEffect(() => {
    if (open) {
      setFormError(null);
      form.resetFields();
      if (id) {
        get(`/users/${id}`).then((res: any) => {
          form.setFieldsValue(res.data);
        });
      }
    }
  }, [open]);

  return (
    can(Ability.CREATE_OR_UPDATE) && (
      <Drawer
        title={title}
        width={600}
        onClose={handleClose}
        open={open}
        closable={false}
        extra={
          <Space>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              disabled={isLoadingData}
              loading={isLoading}
            >
              Submit
            </Button>
          </Space>
        }
      >
        <Form
          layout="horizontal"
          form={form}
          onFinish={handleFinish}
          disabled={isLoadingData}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          {formError && (
            <Alert
              message={formError}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter office name" }]}
          >
            <Input placeholder="Enter office name" />
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter Username" }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>
          {!id && (
            <>
              <Form.Item name="password" label="Password">
                <Input.Password placeholder="Enter Password" />
              </Form.Item>
            </>
          )}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter Email",
              },
              {
                pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Please enter valid email",
              },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input
              addonBefore={<PhoneOutlined />}
              placeholder="Enter office phone"
            />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input.TextArea placeholder="Enter office address" />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Divider />
          <Form.Item name="roleId" label="Role">
            <Select placeholder="Select Role" allowClear>
              {listRole.map((item: any) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="officeId" label="Office">
            <Select placeholder="Select Office" allowClear>
              {listOffice.map((item: any) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Drawer>
    )
  );
};

export default UsersForm;
