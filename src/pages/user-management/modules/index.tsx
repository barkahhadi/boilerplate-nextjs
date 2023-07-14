import React from "react";
import DataTable from "@components/DataTable";
import type { DataTableProps } from "@components/DataTable/types";
import { ColumnsType } from "antd/es/table";

const App: React.FC = () => {
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
  ];

  const dataTableConfig: DataTableProps = {
    columns: columns,
    url: "/modules",
    addLabel: "Tambah Modul",
  };

  return (
    <>
      <DataTable {...dataTableConfig} />
    </>
  );
};

export default App;
