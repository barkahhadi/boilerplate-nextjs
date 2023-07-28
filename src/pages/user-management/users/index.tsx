import React, { useEffect, useRef, useState } from "react";
import DataTable, {
  dataTableAction,
  DataTableProps,
  DataTableRef,
} from "@components/DataTable";
import { ColumnsType } from "antd/es/table";
import UserForm from "./form";
import UsersFormResetPassword from "./form-reset-password";
import { Button, message, Tooltip } from "antd";
import { PlusCircleOutlined, KeyOutlined } from "@ant-design/icons";
import { useHttp } from "@/hooks/useHttp";
import { NoticeType } from "antd/es/message/interface";
import { useCasl } from "@/hooks/useCasl";
import { Ability } from "@/constants/ability";
import PageContainer from "@/components/Layout/PageContainer";

const UserPage: React.FC = (props) => {
  const [id, setId] = useState<string>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [openFormReset, setOpenFormReset] = useState<boolean>(false);
  const datatableRef = useRef<DataTableRef>(null);
  const { del, get } = useHttp();
  const [messageApi, contextHolder] = message.useMessage();
  const [listRole, setListRole] = useState([]);
  const [listOffice, setListOffice] = useState([]);
  const { can } = useCasl("user-management:users");

  const refreshData = () => {
    datatableRef.current?.reload();
  };

  const columns: ColumnsType = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "Username",
      dataIndex: "username",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "Role",
      dataIndex: "roleName",
      sorter: true,
    },
    {
      title: "Office",
      dataIndex: "officeName",
      sorter: true,
    },
    {
      title: "Active",
      dataIndex: "isActive",
      render: (value) => (value ? "Yes" : "No"),
    },
    dataTableAction({
      showEdit: can(Ability.UPDATE),
      showDelete: can(Ability.DELETE),
      onDelete: async (record) => {
        await del(`/users/${record.id}`);
        refreshData();
        showMessage("Record deleted successfully!");
      },
      onEdit: (record) => {
        setOpen(true);
        setId(record.id);
      },
      extra: (record = null) =>
        can(Ability.RESET_PASSWORD) && (
          <Tooltip placement="topRight" title="Reset Password" arrow={true}>
            <Button
              type="primary"
              ghost
              shape="circle"
              icon={<KeyOutlined />}
              size="small"
              style={{ color: "orange", borderColor: "orange" }}
              onClick={() => {
                if (record) {
                  setId(record.id);
                  setOpenFormReset(true);
                }
              }}
            />
          </Tooltip>
        ),
    }),
  ];

  const dataTableConfig: DataTableProps = {
    columns: columns,
    url: "/users",
  };

  const showMessage = (message: string, type: NoticeType = "success") => {
    messageApi.open({
      type: type,
      content: message,
    });
  };

  const getListRole = async () => {
    await get("/roles/list").then((res: any) => {
      setListRole(res.data);
    });
  };

  const getListOffice = async () => {
    await get("/offices/list").then((res: any) => {
      setListOffice(res.data);
    });
  };

  useEffect(() => {
    getListRole();
    getListOffice();
  }, []);

  return (
    can(Ability.READ) && (
      <>
        {contextHolder}
        <PageContainer
          title="Users"
          extra={
            <Button
              type="primary"
              onClick={() => {
                setId(null);
                setOpen(true);
              }}
            >
              <PlusCircleOutlined />
              Add New User
            </Button>
          }
        >
          <UsersFormResetPassword
            id={id}
            title="Reset Password"
            open={openFormReset}
            onClose={() => setOpenFormReset(false)}
            onFinish={() => {
              showMessage("Password changed successfully!");
            }}
          ></UsersFormResetPassword>
          <UserForm
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
            title={id ? "Edit User" : "Add New User"}
            listRole={listRole}
            listOffice={listOffice}
          />
          <DataTable {...dataTableConfig} ref={datatableRef} />
        </PageContainer>
      </>
    )
  );
};

export default UserPage;
