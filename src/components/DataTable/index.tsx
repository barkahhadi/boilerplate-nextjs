/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Thu Jul 13 2023 7:56:39 PM
 * File: index.tsx
 * Description: DataTable Component
 */

import React, { useEffect, useReducer, useState } from "react";
import { Button, Row, Space, Table, Input, Col } from "antd";
import type { TableProps } from "antd/es/table";
import type { DataTableProps, DatatableParams } from "./types";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useHttp } from "@/hooks/http";
import { SorterResult } from "antd/es/table/interface";
const { Search } = Input;

const DataTable: React.FC<DataTableProps> = (props) => {
  const { error, isLoading, get } = useHttp();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchVal, setSearchVal] = useState("");
  const [total, setTotal] = useState(0);
  const [order, setOrder] = useState(null);
  const [orderType, setOrderType] = useState(null);

  let {
    key = "id",
    columns = [],
    data,
    size = "small",
    url = null,
    action = {
      showAdd: true,
      showEdit: true,
      showDelete: true,
    },
    search = true,
    addLabel = "Tambah",
    onEdit = () => {},
    onDelete = () => {},
    onAdd = () => {},
  } = props;

  const [dataSource, dispatchDataSource] = useReducer((_: any, action: any) => {
    if (action.type == "add_key") {
      return (
        action.data &&
        action.data.map((item: any) => {
          item.key = item[key];
          return item;
        })
      );
    }
  }, data);

  const buildQueryString = (params: DatatableParams) => {
    let queryArr: string[] = [];
    if (params.page) {
      queryArr.push(`page=${params.page}`);
    }
    if (params.perPage) {
      queryArr.push(`perPage=${params.perPage}`);
    }
    if (params.order && params.orderType) {
      queryArr.push(`order=${params.order}&orderType=${params.orderType}`);
    }
    if (params.search) {
      queryArr.push(`search=${params.search}`);
    }
    // if (params.filter) {
    //   params.filter.forEach((filter) => {
    //     query += `filter[]=${filter.column}&filter[]=${filter.operator}&filter[]=${filter.value}&`;
    //   });
    // }
    // if (params.filterDateBetween) {
    //   query += `filterDateBetween[]=${params.filterDateBetween.column}&filterDateBetween[]=${params.filterDateBetween.start}&filterDateBetween[]=${params.filterDateBetween.end}&`;
    // }
    return "?" + queryArr.join("&");
  };

  const loadData = async () => {
    if (isLoading) return;
    const params: DatatableParams = {
      page: page,
      perPage: perPage,
      order: order,
      orderType: orderType,
      search: searchVal,
    };

    const queryString = buildQueryString(params);

    const response = await get({
      url: url + queryString,
    });
    if (response !== false) {
      dispatchDataSource({
        type: "add_key",
        data: response.data.data,
      });
      setTotal(response.data.total);
    }
  };

  const onSearch = (value: string) => {
    if (isLoading) return;
    setSearchVal(value);
  };

  if (action !== false) {
    columns = [
      ...columns,
      {
        title: "Action",
        key: "action",
        fixed: "right",
        align: "center",
        width: 200,
        render: (_, record) => (
          <Space size="middle">
            {action.showEdit && (
              <Button
                type="primary"
                ghost
                shape="circle"
                icon={<EditOutlined />}
                size="small"
                onClick={() => onEdit(record)}
              />
            )}
            {action.showDelete && (
              <Button
                danger
                shape="circle"
                icon={<DeleteOutlined />}
                size="small"
                onClick={() => onDelete(record)}
              />
            )}
          </Space>
        ),
      },
    ];
  }

  useEffect(() => {
    loadData();
  }, [searchVal, order, orderType, page, perPage]);

  useEffect(() => {
    if (url) {
      loadData();
    }
  }, []);

  const onChange: TableProps<typeof columns>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    if (isLoading) return;
    if (sorter && !Array.isArray(sorter)) {
      setOrder(sorter.field);
      setOrderType(sorter.order == "ascend" ? "asc" : "desc");
    }

    if (pagination) {
      setPage(pagination.current || 1);
      setPerPage(pagination.pageSize || 10);
    }
  };

  return (
    <>
      <Row>
        <Col span={8}>
          <Space
            direction="horizontal"
            style={{ width: "100%", justifyContent: "start" }}
          >
            {search && (
              <Search
                placeholder="Pencarian"
                allowClear
                onSearch={onSearch}
                onReset={() => onSearch("")}
                style={{ width: 260 }}
              />
            )}
          </Space>
        </Col>
        <Col span={16}>
          <Space
            direction="horizontal"
            style={{ width: "100%", justifyContent: "end", marginBottom: 10 }}
          >
            {action.showAdd && (
              <Button type="primary" onClick={onAdd}>
                <PlusCircleOutlined />
                {addLabel}
              </Button>
            )}
          </Space>
        </Col>
      </Row>
      <Table
        pagination={{
          current: page,
          pageSize: perPage,
          total: total,
          defaultPageSize: perPage,
          showSizeChanger: true,
        }}
        columns={columns}
        dataSource={dataSource}
        size={size}
        loading={isLoading}
        onChange={onChange}
      />
    </>
  );
};

export default DataTable;
