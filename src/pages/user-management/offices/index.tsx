/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Fri Jul 28 2023 7:52:47 PM
 * File: index.tsx
 * Description: Office List
 */

import React, { useRef, useState } from "react";
import DataTable, {
  dataTableAction,
  DataTableProps,
  DataTableRef,
} from "@components/DataTable";
import { ColumnsType } from "antd/es/table";
import OfficeForm from "./form";
import { Button, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useHttp } from "@/hooks/useHttp";
import { NoticeType } from "antd/es/message/interface";
import { useCasl } from "@/hooks/useCasl";
import { Ability } from "@/constants/ability";
import PageContainer from "@/components/Layout/PageContainer";

const OfficePage: React.FC = (props) => {
  const [id, setId] = useState<string>(null);
  const [open, setOpen] = useState<boolean>(false);
  const datatableRef = useRef<DataTableRef>(null);
  const { del } = useHttp();
  const [messageApi, contextHolder] = message.useMessage();
  const { can } = useCasl("user-management:offices");
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
      title: "Name",
      dataIndex: "name",
      sorter: true,
    },
    dataTableAction({
      showEdit: can(Ability.UPDATE),
      showDelete: can(Ability.DELETE),
      onDelete: async (record) => {
        await del(`/offices/${record.id}`);
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
    url: "/offices",
  };

  const showMessage = (message: string, type: NoticeType = "success") => {
    messageApi.open({
      type: type,
      content: message,
    });
  };

  return (
    can(Ability.READ) && (
      <>
        {contextHolder}
        <PageContainer
          title="Offices"
          extra={
            can(Ability.CREATE) && (
              <Button
                type="primary"
                onClick={() => {
                  setId(null);
                  setOpen(true);
                }}
              >
                <PlusCircleOutlined />
                Add New Office
              </Button>
            )
          }
        >
          <OfficeForm
            id={id}
            open={open}
            onClose={() => setOpen(false)}
            onFinish={() => {
              refreshData();
              if (id) {
                showMessage("Record updated successfully!");
              } else {
                showMessage("Record added successfully!");
              }
            }}
            title={id ? "Edit Office" : "Add New Office"}
          />
          <DataTable {...dataTableConfig} ref={datatableRef} />
        </PageContainer>
      </>
    )
  );
};

export default OfficePage;
