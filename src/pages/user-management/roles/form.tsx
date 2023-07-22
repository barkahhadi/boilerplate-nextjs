/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Mon Jul 17 2023 4:15:37 PM
 * File: form.tsx
 * Description: Form Roles
 */

import { useSlugify } from "@/hooks";
import { useHttp } from "@/hooks/useHttp";
import { Alert, Button, Card, Drawer, Form, Input, Space, Tree } from "antd";
import { useEffect, useState } from "react";
import { Application } from "./types";
import type { DataNode, TreeProps } from "antd/es/tree";

interface FormRoleProps {
  id?: string;
  title?: string;
  open: boolean;
  applicationData?: Application[];
  onClose: () => void;
  onFinish?: () => void;
}

interface AccessData {
  module: string;
  permissions: string[];
}

interface PermissionData {
  application: string;
  access: AccessData[];
}

const RoleForm: React.FC<FormRoleProps> = (props) => {
  const { post, patch, isLoading, error } = useHttp();
  const { get, isLoading: isLoadingData } = useHttp();
  const {
    id = null,
    title,
    open = false,
    onClose = () => {},
    onFinish = () => {},
    applicationData,
  } = props;
  const [form] = Form.useForm();
  const [slugifyId, setSlugifyId] = useSlugify();
  const [formError, setFormError] = useState<string | null>(error);
  const [permissionData, setPermissionData] = useState<any>(null);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

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

  const handleSuccess = () => {
    handleClose();
    onFinish();
  };

  const handleFinish = async (values: any) => {
    if (id) {
      values.permissions = transformCheckedKeysToData(checkedKeys);
      await patch(`/roles/${id}`, values, {
        onSuccess: handleSuccess,
        onError: () => {},
      });
    } else {
      values.permissions = transformCheckedKeysToData(checkedKeys);
      await post("/roles", values, {
        onSuccess: handleSuccess,
        onError: () => {},
      });
    }
  };

  useEffect(() => {
    if (open) {
      setFormError(null);
      form.resetFields();
      if (permissionData == null && applicationData) {
        convertToTreeData(applicationData);
      }

      if (id && permissionData) {
        get(`/roles/${id}`).then((res: any) => {
          form.setFieldsValue(res.data);
          transformDataToCheckedKeys(res.data.permissions);
        });
      } else {
        setCheckedKeys([]);
      }
    }
  }, [open, permissionData]);

  const transformDataToCheckedKeys = (data: PermissionData[]) => {
    if (!data) {
      return;
    }
    const checkedKeys: React.Key[] = [];
    data.forEach((app: PermissionData) => {
      const appIndex = permissionData.findIndex(
        (item: any) => item.key == app.application
      );
      if (appIndex < 0) return;
      app.access.forEach((access: AccessData) => {
        const moduleIndex = permissionData[appIndex].children.findIndex(
          (item: any) => item.key == app.application + ":" + access.module
        );
        if (moduleIndex < 0) return;

        access.permissions.forEach((permission: string) => {
          const permissionIndex = permissionData[appIndex].children[
            moduleIndex
          ].children.findIndex(
            (item: any) =>
              item.key ==
              app.application + ":" + access.module + ":" + permission
          );

          if (permissionIndex < 0) return;
          checkedKeys.push(
            app.application + ":" + access.module + ":" + permission
          );
        });
      });
    });
    setCheckedKeys(checkedKeys);
  };

  const transformCheckedKeysToData = (
    checkedKeys: React.Key[]
  ): PermissionData[] => {
    const permissionData: PermissionData[] = [];
    checkedKeys.forEach((key) => {
      const keys = key.toString().split(":");
      const app = keys[0];
      const module = keys[1];
      const permission = keys[2];

      const appIndex = permissionData.findIndex(
        (item) => item.application == app
      );
      if (appIndex < 0) {
        permissionData.push({
          application: app,
          access: [
            {
              module: module,
              permissions: [permission],
            },
          ],
        });
      } else {
        const moduleIndex = permissionData[appIndex].access.findIndex(
          (item) => item.module == module
        );
        if (moduleIndex < 0) {
          permissionData[appIndex].access.push({
            module: module,
            permissions: [permission],
          });
        } else {
          permissionData[appIndex].access[moduleIndex].permissions.push(
            permission
          );
        }
      }
    });

    return permissionData;
  };

  const onCheck = (checkedKeys: any, info: any) => {
    setCheckedKeys(checkedKeys);
  };

  const convertToTreeData = (data: Application[]) => {
    const treeData: DataNode[] = [];
    data.forEach((app: Application) => {
      treeData.push({
        title: app.name,
        key: app.id,
        children: app.modules.map((module) => {
          return {
            title: module.name,
            key: app.id + ":" + module.id,
            children: module.ability.map((ability) => {
              return {
                title: ability,
                key: app.id + ":" + module.id + ":" + ability,
              };
            }),
          };
        }),
      });
    });
    setPermissionData(treeData);

    return treeData;
  };

  return (
    <Drawer
      title={title}
      width={760}
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
          rules={[{ required: true, message: "Please enter role ID" }]}
        >
          <Input placeholder="Enter role ID" readOnly />
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input
            placeholder="Enter role name"
            onChange={(e) => setSlugifyId(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              max: 200,
              message: "Description must be less than 200 character",
            },
          ]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
      <Card size="small" title="Permissions">
        <Tree
          checkable
          onCheck={onCheck}
          treeData={permissionData}
          checkedKeys={checkedKeys}
        />
      </Card>
    </Drawer>
  );
};

export default RoleForm;
