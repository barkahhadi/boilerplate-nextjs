/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Thu Jul 13 2023 7:56:39 PM
 * File: index.tsx
 * Description: DataTable Component
 */

import React from "react";
import { Button, Popconfirm, Space, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

import { DataTableActionProps } from ".";

export const dataTableAction = (
  props: DataTableActionProps
): unknown | null => {
  // return null;
  const {
    title = "Action",
    key = "action",
    fixed = true,
    align = "center",
    width = "auto",
    showEdit = false,
    showDelete = false,
    extra = null,
    onEdit = () => {},
    onDelete = () => {},
  } = props;

  let actionWidth: number = 0;
  if (showEdit || showDelete) actionWidth += 80;
  if (extra) {
    const extraProps = extra({}).props?.children;
    if (extraProps) {
      if (Array.isArray(extraProps)) {
        actionWidth += 40 * extraProps.length;
      } else {
        actionWidth += 40;
      }
    }
  }
  if (width !== "auto" && typeof width == "number") actionWidth = width;

  if (actionWidth === 0) return null;

  const column: ColumnsType = [
    {
      title,
      key,
      fixed: fixed ? "right" : null,
      align: align,
      width: actionWidth,
      render: (_, record) => (
        <Space size="middle">
          {extra && extra(record)}
          {showEdit && (
            <Tooltip placement="topRight" title="Edit Item" arrow={true}>
              <Button
                type="primary"
                ghost
                shape="circle"
                icon={<EditOutlined />}
                size="small"
                onClick={() => onEdit(record)}
              />
            </Tooltip>
          )}
          {showDelete && (
            <Popconfirm
              title="Delete this record?"
              description="You cannot undo this action!"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              placement="left"
              onConfirm={() => onDelete(record)}
            >
              <Tooltip placement="topRight" title="Delete Item" arrow={true}>
                <Button
                  danger
                  shape="circle"
                  icon={<DeleteOutlined />}
                  size="small"
                />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return column[0];
};
