import Page from "@/components/Common/Page";
import { Divider, message, Modal, Table } from "antd";
import { ColumnProps, PaginationConfig } from "antd/lib/table";
import React from "react";
import { RemoveForm } from "./Worker.service";

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
  const { onchange, loading, data, modify, reload, pagination } = props;
  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    onchange(pagination, filters, sorter);
  };
  const doDelete = record => {
    Modal.confirm({
      title: "请确认",
      content: `您确认要删除${record.name}吗？`,
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
      title: "工号",
      dataIndex: "code",
      key: "code",
      sorter: true,
      width: 150,
    },
    {
      title: "名称",
      dataIndex: "name",
      sorter: true,
      key: "name",
      width: 150
    },
    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
      width: 60,
      render: (value, record) => {
        if (value == 1)
          return '男';
        else
          return '女';
      }
    },
    {
      title: "联系电话",
      dataIndex: "phoneNum",
      key: "phoneNum",
      width: 100
    },
    // {
    //   title: "电话",
    //   dataIndex: "telPhoneNum",
    //   key: "telPhoneNum",
    //   width: 100
    // },  
   
    {
      title: "办公室",
      dataIndex: "deptName",
      key: "deptName",
      width: 150
    },
    {
      title: "所属机构",
      dataIndex: "orgName",
      key: "orgName", 
    },
    // {
    //   title: "备注",
    //   dataIndex: "description",
    //   key: "description",
    //   width: 100
    // },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      width: 95,
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

