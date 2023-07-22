import React, { useRef, useState } from "react";
import DataTable, {
  dataTableAction,
  DataTableProps,
  DataTableRef,
} from "@components/DataTable";
import { ColumnsType } from "antd/es/table";
import { useAppDispatch } from "@store/index";
import { appActions } from "@/store/slice/app";
import OfficeForm from "./form";
import { PageContainer } from "@ant-design/pro-components";
import { Button, Select, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useHttp } from "@/hooks/useHttp";
import { NoticeType } from "antd/es/message/interface";

const OfficePage: React.FC = (props) => {
  const [id, setId] = useState<string>(null);
  const [open, setOpen] = useState<boolean>(false);
  const datatableRef = useRef<DataTableRef>(null);
  const { del } = useHttp();
  const [messageApi, contextHolder] = message.useMessage();

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
      showEdit: true,
      showDelete: true,
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
    <>
      {contextHolder}
      <PageContainer
        title="Offices"
        extra={
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
  );
};

export default OfficePage;
