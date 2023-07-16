/*
 * Author: Barkah Hadi
 * Email: barkah.hadi@gmail.com
 * Last Modified: Thu Jul 13 2023 7:56:39 PM
 * File: index.tsx
 * Description: DataTable Component
 */

import React from "react";
import { Button, Popconfirm, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

import { DataTableActionProps } from ".";

export const dataTableAction = (props: DataTableActionProps) => {
  const {
    title = "Action",
    key = "action",
    fixed = true,
    align = "center",
    width = "auto",
    showEdit = false,
    showDelete = false,
    extra = [],
    onEdit = () => {},
    onDelete = () => {},
  } = props;

  let actionWidth: number = 0;
  if (width == "auto") {
    actionWidth = 20;
    if (showEdit) actionWidth += 40;
    if (showDelete) actionWidth += 40;
    if (Array.isArray(extra)) {
      actionWidth += 40 * extra.length;
    }
  }

  const column: ColumnsType = [
    {
      title,
      key,
      fixed: fixed ? "right" : null,
      align: align,
      width: actionWidth,
      render: (_, record) => (
        <Space size="middle">
          {showEdit && (
            <Button
              type="primary"
              ghost
              shape="circle"
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEdit(record)}
            />
          )}
          {showDelete && (
            <Popconfirm
              title="Delete this record?"
              description="You cannot undo this action!"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              placement="left"
              onConfirm={() => onDelete(record)}
            >
              <Button
                danger
                shape="circle"
                icon={<DeleteOutlined />}
                size="small"
              />
            </Popconfirm>
          )}
          {extra}
        </Space>
      ),
    },
  ];

  return column[0];
};
