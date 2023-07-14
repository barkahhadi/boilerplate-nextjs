import type { ColumnsType, TableProps } from "antd/es/table";

type DatatableOrderType = "asc" | "desc";

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
  filter?: DatatableFilterParams[];
  filterDateBetween?: DatatableFilterDateBetween;
}

export type DataTableAction = {
  showAdd?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
} & boolean;

export type DataTableProps = {
  key?: string;
  columns: ColumnsType<any>;
  data?: TableProps<any>["dataSource"];
  size?: TableProps<any>["size"];
  loading?: TableProps<any>["loading"] | boolean;
  url?: string;
  action?: DataTableAction;
  search?: boolean;
  addLabel?: string;
  onEdit?: (record: any) => void;
  onDelete?: (record: any) => void;
  onAdd?: () => void;
};
