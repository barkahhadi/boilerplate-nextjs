import { useHttp } from "@/hooks/useHttp";
import { Alert, Button, Drawer, Form, Input, Space } from "antd";
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

const UsersFormResetPassword: React.FC<FormModuleProps> = (props) => {
  const { patch, isLoading, error } = useHttp();
  const { isLoading: isLoadingData } = useHttp();
  const {
    id = null,
    title,
    open = false,
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

  const handleFinish = async (values: any) => {
    try {
      if (id) {
        await patch(`/users/change-password/${id}`, values);
      }
      handleClose();
      onFinish();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (open) {
      setFormError(null);
      form.resetFields();
    }
  }, [open]);

  return (
    can(Ability.RESET_PASSWORD) && (
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
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
        >
          {formError && (
            <Alert
              message={formError}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          <Form.Item name="password" label="New Password">
            <Input.Password placeholder="Enter New Password" />
          </Form.Item>
          <Form.Item name="confirmNewPassword" label="Confirm New Password">
            <Input.Password placeholder="Confirm New Password" />
          </Form.Item>
        </Form>
      </Drawer>
    )
  );
};

export default UsersFormResetPassword;
