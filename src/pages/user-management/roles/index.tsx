/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Mon Jul 17 2023 4:15:01 PM
 * File: index.tsx
 * Description: Roles DataTable
 */

import React, { useEffect, useRef, useState } from "react";
import DataTable, {
  dataTableAction,
  DataTableProps,
  DataTableRef,
} from "@components/DataTable";
import { ColumnsType } from "antd/es/table";
import RoleForm from "./form";
import { PageContainer } from "@ant-design/pro-components";
import { Button, Select, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useHttp } from "@/hooks/useHttp";
import { NoticeType } from "antd/es/message/interface";
import { Application } from "./types";

const RolePage: React.FC = (props) => {
  const [id, setId] = useState<string>(null);
  const [open, setOpen] = useState<boolean>(false);
  const datatableRef = useRef<DataTableRef>(null);
  const { del } = useHttp();
  const [messageApi, contextHolder] = message.useMessage();
  const { get } = useHttp();
  const [applicationData, setApplicationData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data } = await get("/roles/applications");
      setApplicationData(data);
    })();
  }, []);

  const refreshData = () => {
    datatableRef.current?.reload();
  };

  const columns: ColumnsType = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: true,
    },
    {
      title: "Role Name",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      sorter: true,
    },
    dataTableAction({
      showEdit: true,
      showDelete: true,
      onDelete: async (record) => {
        await del(`/roles/${record.id}`);
        refreshData();
        showMessage("Record deleted successfully!");
      },
      onEdit: (record) => {
        setOpen(true);
        setId(record.id);
      },
    }),
  ];

  const dataTableConfig: DataTableProps = {
    columns: columns,
    url: "/roles",
    defaultOrder: {
      column: "createdAt",
      type: "asc",
    },
  };

  const showMessage = (message: string, type: NoticeType = "success") => {
    messageApi.open({
      type: type,
      content: message,
    });
  };

  return (
    <>
      {contextHolder}
      <PageContainer
        title="Role Management"
        extra={
          <Button
            type="primary"
            onClick={() => {
              setId(null);
              setOpen(true);
            }}
          >
            <PlusCircleOutlined />
            New Role
          </Button>
        }
      >
        <RoleForm
          id={id}
          open={open}
          applicationData={applicationData}
          onClose={() => setOpen(false)}
          onFinish={() => {
            refreshData();
            if (id) {
              showMessage("Record updated successfully!");
            } else {
              showMessage("Record added successfully!");
            }
          }}
          title={id ? "Edit Role" : "New Role"}
        />
        <DataTable {...dataTableConfig} ref={datatableRef} />
      </PageContainer>
    </>
  );
};

export default RolePage;
