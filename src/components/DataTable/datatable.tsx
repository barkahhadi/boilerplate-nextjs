/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Thu Jul 13 2023 7:56:39 PM
 * File: index.tsx
 * Description: DataTable Component
 */

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
  useState,
} from "react";
import { Space, Table, Input, Typography, Button } from "antd";
import type { TableProps } from "antd/es/table";
import type {
  DataTableProps,
  DatatableParams,
  DataTableRef,
  DataTableOperator,
} from ".";
import { useHttp } from "@/hooks/http";
import { ReloadOutlined } from "@ant-design/icons";
const { Search } = Input;
const { Text } = Typography;
interface FilterItem {
  column: string;
  operator: string;
  value: string;
}

export const DataTable = forwardRef<DataTableRef, DataTableProps>(
  (props, ref) => {
    const { error, isLoading, get } = useHttp();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchVal, setSearchVal] = useState("");
    const [total, setTotal] = useState(0);
    const [order, setOrder] = useState(null);
    const [orderType, setOrderType] = useState(null);
    const [filter, setFilterState] = useState(null);

    let {
      key = "id",
      columns = [],
      data,
      size = "small",
      url = null,
      search = true,
      scrollWidth = 1000,
      extraFilter = [],
      refresh = true,
    } = props;

    const [dataSource, dispatchDataSource] = useReducer(
      (_: any, action: any) => {
        if (action.type == "add_key") {
          return (
            action.data &&
            action.data.map((item: any) => {
              item.key = item[key];
              return item;
            })
          );
        }
      },
      data
    );

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

      if (params.filter) {
        var queryFilter: string[] = [];
        for (var filterColumn in params.filter) {
          for (var filterOperator in params.filter[filterColumn]) {
            queryFilter.push(
              `filter[${filterColumn}][${filterOperator}]=${params.filter[filterColumn][filterOperator]}`
            );
          }
        }

        queryArr.push(queryFilter.join("&"));
      }

      return "?" + queryArr.join("&");
    };

    const setFilter = (
      key: string,
      value: any,
      operator: DataTableOperator = "eq"
    ) => {
      if (value) {
        setFilterState({
          ...filter,
          [key]: {
            [operator]: value,
          },
        });
      } else {
        const copyFilter = { ...filter };
        if (copyFilter[key]) {
          delete copyFilter[key];
        }

        setFilterState(copyFilter);
      }
    };

    const reload = async () => {
      if (isLoading) return;
      const params: DatatableParams = {
        page: page,
        perPage: perPage,
        order: order,
        orderType: orderType,
        search: searchVal,
        filter: filter,
      };

      const queryString = buildQueryString(params);

      const response = await get(url + queryString);
      if (response) {
        dispatchDataSource({
          type: "add_key",
          data: response.data.data,
        });

        setTotal(response.data.total);
        if (response.data.data.length == 0 && page > 1) {
          setPage(page - 1);
        }
      }
    };

    const onSearch = (value: string) => {
      if (isLoading) return;
      setPage(1);
      setSearchVal(value);
    };

    useEffect(() => {
      reload();
    }, [searchVal, order, orderType, page, perPage, filter]);

    useEffect(() => {
      if (url) {
        reload();
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

    useImperativeHandle(ref, () => ({
      reload,
      setFilter,
    }));

    return (
      <>
        <Space
          direction="horizontal"
          style={{ width: "100%", justifyContent: "start", marginBottom: 16 }}
        >
          {search && (
            <Search
              placeholder="Search"
              allowClear
              onSearch={onSearch}
              onReset={() => onSearch("")}
              style={{ maxWidth: 400, width: "100%" }}
            />
          )}
          {extraFilter}
          {refresh && (
            <Button
              icon={<ReloadOutlined />}
              onClick={() => reload()}
              loading={isLoading}
            />
          )}
        </Space>
        <Table
          pagination={{
            current: page,
            pageSize: perPage,
            total: total,
            defaultPageSize: perPage,
            showSizeChanger: true,
          }}
          scroll={{ x: scrollWidth }}
          columns={columns}
          dataSource={dataSource}
          size={size}
          loading={isLoading}
          onChange={onChange}
          footer={() => (
            <div style={{ textAlign: "right" }}>
              <Text type="secondary">
                Row {(page - 1) * perPage + 1} to{" "}
                {Math.min(page * perPage, total)} from {total} data
              </Text>
            </div>
          )}
        />
      </>
    );
  }
);
