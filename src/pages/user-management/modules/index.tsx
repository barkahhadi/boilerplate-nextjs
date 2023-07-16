import React, { useEffect, useRef, useState } from "react";
import DataTable, {
  dataTableAction,
  DataTableProps,
  DataTableRef,
} from "@components/DataTable";
import { ColumnsType } from "antd/es/table";
import { useAppDispatch } from "@store/index";
import { appActions } from "@/store/slice/app";
import ModulesForm from "./form";
import { PageContainer } from "@ant-design/pro-components";
import { Button, Select, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useHttp } from "@/hooks/http";
import { NoticeType } from "antd/es/message/interface";

export async function getStaticProps() {
  return { props: { title: "HomePage" } };
}

const ModulesPage: React.FC = (props) => {
  const [id, setId] = useState<string>(null);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const datatableRef = useRef<DataTableRef>(null);
  const { del } = useHttp();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    dispatch(appActions.setTitle("Modules"));
    dispatch(appActions.setSubtitle("Modules Subtitle"));
    return () => {
      dispatch(appActions.setTitle(""));
      dispatch(appActions.setSubtitle(""));
    };
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
      title: "Application",
      dataIndex: "applicationName",
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
        await del(`/modules/${record.id}`);
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
    url: "/modules",
    extraFilter: (
      <Select
        allowClear
        placeholder="Select application"
        onChange={(val) => {
          datatableRef.current?.setFilter("applicationId", val);
        }}
        options={[
          { value: "user-management", label: "User Management" },
          { value: "dashboard", label: "Dashboard" },
        ]}
      />
    ),
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
        title="Modules"
        extra={
          <Button
            type="primary"
            onClick={() => {
              setId(null);
              setOpen(true);
            }}
          >
            <PlusCircleOutlined />
            Add Module
          </Button>
        }
      >
        <ModulesForm
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
          title="Add Module"
        />
        <DataTable {...dataTableConfig} ref={datatableRef} />
      </PageContainer>
    </>
  );
};

export default ModulesPage;
