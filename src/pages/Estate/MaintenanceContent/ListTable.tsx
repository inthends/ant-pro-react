import Page from "@/components/Common/Page";
import { Divider, message, Modal, Table } from "antd";
import { ColumnProps, PaginationConfig } from "antd/lib/table";
import React from "react";
import { RemoveForm } from "./Main.service";

interface ListTableProps {
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  modify(record: any): void;
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
      title: "类别",
      dataIndex: "typeName",
      key: "typeName",
      width: 100
    },
    {
      title: "编号",
      dataIndex: "code",
      key: "code",
      width: 100,
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: 200
    },
    // {
    //   title: "所属机构",
    //   dataIndex: "orgName",
    //   key: "orgName",
    //   width: 150
    // },
    {
      title: "作业标准",
      dataIndex: "standard",
      key: "standard",
      width: 150
    },
    {
      title: "作业要点",
      dataIndex: "essentials",
      key: "essentials",
      width: 200
    },
    // {
    //   title: "单位",
    //   dataIndex: "unit",
    //   key: "unit",
    //   width: 80
    // },
    // {
    //   title: "频次",
    //   dataIndex: "frequency",
    //   key: "frequency",
    //   width: 80
    // },
    {
      title: "说明",
      dataIndex: "memo",
      key: "memo"
    },
    {
      title: "操作",
      // dataIndex: "operation",
      key: "operation",
      align: 'center',
      fixed: 'right',
      width: 95,
      render: (text, record) => {
        return [
          <span key='span'>
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
        scroll={{ y: 500, x: 1100 }}
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

