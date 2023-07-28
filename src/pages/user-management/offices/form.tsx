/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Fri Jul 28 2023 7:52:34 PM
 * File: form.tsx
 * Description: Office Forms
 */

import { useHttp } from "@/hooks/useHttp";
import {
  Alert,
  Button,
  Drawer,
  Form,
  Input,
  Space,
  Switch,
  InputNumber,
} from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useCasl } from "@/hooks/useCasl";
import { Ability } from "@/constants/ability";

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
  const [formError, setFormError] = useState<string | null>(error);
  const { can } = useCasl("user-management:offices");

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
      await patch(`/offices/${id}`, values, {
        onSuccess: handleSuccess,
        onError: () => {},
      });
    } else {
      await post("/offices", values, {
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
        get(`/offices/${id}`).then((res: any) => {
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
          colon={true}
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
            label="ID"
            name="id"
            rules={[{ required: true, message: "Please enter Office ID" }]}
          >
            <Input placeholder="Enter office ID" />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter office name" }]}
          >
            <Input placeholder="Enter office name" />
          </Form.Item>
          <Form.Item label="LatLng" style={{ marginBottom: 0 }}>
            <Form.Item
              name="latitude"
              style={{ display: "inline-block", width: "calc(50% - 12px)" }}
            >
              <InputNumber placeholder="Latitude" style={{ width: "100%" }} />
            </Form.Item>
            <span
              style={{
                display: "inline-block",
                width: "24px",
                lineHeight: "32px",
                textAlign: "center",
              }}
            >
              -
            </span>
            <Form.Item
              name="longitude"
              style={{ display: "inline-block", width: "calc(50% - 12px)" }}
            >
              <InputNumber placeholder="Longitude" style={{ width: "100%" }} />
            </Form.Item>
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
        </Form>
      </Drawer>
    )
  );
};

export default ModulesForm;
