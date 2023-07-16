import { useSlugify } from "@/hooks";
import { useHttp } from "@/hooks/http";
import { Alert, Button, Drawer, Form, Input, Select, Space } from "antd";
import { useEffect, useState } from "react";

interface FormModuleProps {
  id?: string;
  title?: string;
  open: boolean;
  onClose: () => void;
  onFinish?: () => void;
}

const ModulesForm: React.FC<FormModuleProps> = (props) => {
  const { post, patch, isLoading, error } = useHttp();
  const { get, isLoading: isLoadingData } = useHttp();
  const {
    id = null,
    title,
    open = false,
    onClose = () => {},
    onFinish = () => {},
  } = props;
  const [form] = Form.useForm();
  const [slugifyId, setSlugifyId] = useSlugify();
  const [formError, setFormError] = useState<string | null>(error);

  useEffect(() => {
    open && form.setFieldValue("id", slugifyId);
  }, [slugifyId]);

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
        await patch(`/modules/${id}`, values);
      } else {
        await post("/modules", values);
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
      if (id) {
        get(`/modules/${id}`).then((res: any) => {
          form.setFieldsValue(res.data);
        });
      }
    }
  }, [open]);

  return (
    <Drawer
      title={title}
      width={460}
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
        layout="vertical"
        form={form}
        onFinish={handleFinish}
        disabled={isLoadingData}
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
          label="ID"
          name="id"
          rules={[{ required: true, message: "Please enter module ID" }]}
        >
          <Input placeholder="Enter module ID" readOnly />
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input
            placeholder="Enter module name"
            onChange={(e) => setSlugifyId(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Application"
          name="applicationId"
          rules={[{ required: true, message: "Please enter application" }]}
        >
          <Select
            placeholder="Select application"
            options={[
              { value: "user-management", label: "User Management" },
              { value: "dashboard", label: "Dashboard" },
            ]}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ModulesForm;
