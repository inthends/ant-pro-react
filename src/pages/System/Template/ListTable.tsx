import Page from "@/components/Common/Page";
import { Divider, message, Modal,  Table } from "antd";
import { ColumnProps, PaginationConfig } from "antd/lib/table";
import React from "react";
import { RemoveForm } from "./Template.service";

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
  const { loading, data, modify, reload, pagination } = props;
  const doDelete = record => {
    Modal.confirm({
      title: "请确认",
      content: `您是否要删除 ${record.templateName} 吗`,
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
      width: 200,
    },
    {
      title: "文件名称",
      dataIndex: "fileName",
      key: "fileName",
      width: 200
    },
    {
      title: "创建人",
      dataIndex: "createUserName",
      key: "createUserName",
      width: 100
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
        rowKey={record => record.roleId}
        scroll={{ y: 500 }}
        loading={loading}
        pagination={pagination}
      />
    </Page>
  );
}

export default ListTable;

 