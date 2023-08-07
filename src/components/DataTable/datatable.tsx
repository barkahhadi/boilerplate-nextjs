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
import { useHttp } from "@/hooks/useHttp";
import { ReloadOutlined } from "@ant-design/icons";
const { Search } = Input;
const { Text } = Typography;

interface FilterAction {
  type: "set_filter" | "remove_filter" | "remove_all_filter";
  key?: string;
  operator?: DataTableOperator;
  value?: any;
}

export const DataTable = forwardRef<DataTableRef, DataTableProps>(
  (props, ref) => {
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
      itemPerpage = 10,
      defaultOrder = null,
    } = props;

    const { isLoading, get } = useHttp();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(itemPerpage);
    const [searchVal, setSearchVal] = useState("");
    const [total, setTotal] = useState(0);
    // const [isClient, setIsClient] = useState(false);
    const [order, setOrder] = useState(
      (defaultOrder && defaultOrder.column) || null
    );
    const [orderType, setOrderType] = useState(
      (defaultOrder && defaultOrder.type) || null
    );
    const [filter, dispatchFilter] = useReducer(
      (state: any, action: FilterAction) => {
        if (action.type == "set_filter" && action.key && action.value) {
          return {
            ...state,
            [action.key]: {
              [action.operator || "eq"]: action.value,
            },
          };
        } else if (action.type == "remove_filter" && action.key) {
          const copyFilter = { ...state };
          if (copyFilter[action.key]) {
            delete copyFilter[action.key];
          }
          return copyFilter;
        } else if (action.type == "remove_all_filter") {
          return {};
        }
      },
      {}
    );

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

    if (columns.length > 0) {
      columns = columns.filter((column) => column !== null);
    }

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
        if (queryFilter.length > 0) {
          queryArr.push(queryFilter.join("&"));
        }
      }

      return "?" + queryArr.join("&");
    };

    const setFilter = (
      key: string,
      value: any,
      operator: DataTableOperator = "eq"
    ) => {
      if (value) {
        dispatchFilter({
          type: "set_filter",
          key: key,
          operator: operator,
          value: value,
        });
      } else {
        dispatchFilter({
          type: "remove_filter",
          key: key,
        });
      }
    };

    const removeAllFilter = () => {
      dispatchFilter({
        type: "remove_all_filter",
      });
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
        if (
          typeof response.data.data != "undefined" &&
          response.data.total != "undefined"
        ) {
          dispatchDataSource({
            type: "add_key",
            data: response.data.data,
          });

          setTotal(response.data.total);
          if (response.data.data.length == 0 && page > 1) {
            setPage(page - 1);
          }
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

    const onChange: TableProps<typeof columns>["onChange"] = (
      pagination,
      filters,
      sorter
    ) => {
      if (isLoading) return;
      if (sorter && !Array.isArray(sorter)) {
        setOrder(sorter.field as string);
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
      removeAllFilter,
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
