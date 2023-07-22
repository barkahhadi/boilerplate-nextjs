/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Mon Jul 17 2023 12:27:02 PM
 * File: index.tsx
 * Description: DataTable Component
 */

import type { ColumnsType, TableProps } from "antd/es/table";

export type DatatableOrderType = "asc" | "desc";

export interface DatatableFilterDateBetween {
  start: string;
  end: string;
  column: string;
}

export interface DatatableFilterParams {
  column: string;
  value?: string | number | boolean | string[] | number[];
  operator: string;
}

export interface DatatableParams {
  order?: string;
  orderType?: DatatableOrderType;
  search?: string;
  page?: number;
  perPage?: number;
  filter?: any;
  filterDateBetween?: DatatableFilterDateBetween;
}

export type DataTableProps = {
  key?: string;
  columns: ColumnsType<any>;
  data?: TableProps<any>["dataSource"];
  size?: TableProps<any>["size"];
  loading?: TableProps<any>["loading"] | boolean;
  url?: string;
  search?: boolean;
  scrollWidth?: number;
  extraFilter?: React.ReactNode;
  refresh?: boolean;
  itemPerpage?: number;
  defaultOrder?: {
    column: string;
    type: DatatableOrderType;
  };
};

export type DataTableAction = {
  showAdd?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
} & boolean;

export interface DataTableActionProps {
  title?: string;
  key?: string;
  fixed?: boolean;
  align?: any;
  width?: number | string;
  showEdit?: boolean;
  showDelete?: boolean;
  onEdit?: (record: any) => void;
  onDelete?: (record: any) => void;
  extra?: (record: any) => React.ReactElement;
}

export type DataTableOperator =
  | "eq"
  | "ne"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "like"
  | "notLike"
  | "iLike"
  | "notILike"
  | "in"
  | "notIn"
  | "between"
  | "notBetween"
  | "isNull"
  | "isNotNull";

export { dataTableAction } from "./action";

export type DataTableRef = {
  reload: () => void;
  setFilter: (key: string, value: any, operator?: DataTableOperator) => void;
};

export { DataTable as default } from "./datatable";
