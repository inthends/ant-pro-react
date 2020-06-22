import Page from "@/components/Common/Page";
import { Tag, Divider, message, Modal, Table } from "antd";
import { ColumnProps, PaginationConfig } from "antd/lib/table";
import React from "react";
import { RemoveForm } from "./Main.service";

interface ListTableProps {
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  modify(record: any): void;
  choose(record: any): void;
  onchange(page: any, filter: any, sort: any): any;
  reload(): void;
}

function ListTable(props: ListTableProps) {
  const { onchange,loading, data, modify, reload, pagination } = props;

  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    onchange(pagination, filters, sorter);
  };

  const doDelete = record => {
    Modal.confirm({
      title: "请确认",
      content: `您确认要删除${record.templateName}吗？`,
      onOk: () => {
        RemoveForm(record.id)
          .then(() => {
            message.success("删除成功");
            reload();
          })
          .catch(e => { });
      }
    });
  };

  const doModify = record => {
    modify({ ...record });
  };

  const columns = [
    {
      title: "模板名称",
      dataIndex: "templateName",
      key: "templateName", 
      width: 250,
    },
    // {
    //   title: "文件名称",
    //   dataIndex: "fileName",
    //   key: "fileName",
    //   width: 250
    // },

    {
      title: '固定表格',
      dataIndex: 'fixTable',
      key: 'fixTable',
      width: 100,
      render: val => val == 1 ? <Tag color="#19d54e">是</Tag> : <Tag color="#e4aa5b">否</Tag>
    },

    {
      title: "表格行数",
      dataIndex: "rowNumbers",
      key: "rowNumbers",
      width: 100
    },
    {
      title: "创建人",
      dataIndex: "createUserName",
      key: "createUserName",
      width: 80
    },
    {
      title: "创建时间",
      dataIndex: "createDate",
      key: "createDate",
      width: 120
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      align: 'center',
      width: 70,
      render: (text, record) => {
        return [
          <span>
            <a onClick={() => doModify(record)} key="modify">编辑</a>
            <Divider type="vertical" key='divider' />
            <a onClick={() => doDelete(record)} key="delete">删除</a>
          </span>
        ];
      }
    }
  ] as ColumnProps<any>[];
  return (
    <Page>
      <Table
        style={{ border: "none" }}
        bordered={false}
        size="middle"
        dataSource={data}
        columns={columns}
        rowKey={record => record.id}
        scroll={{ y: 500 }}
        loading={loading}
        pagination={pagination}
        onChange={(pagination: PaginationConfig, filters, sorter) =>
          changePage(pagination, filters, sorter)
        }
      />
    </Page>
  );
}

export default ListTable;

