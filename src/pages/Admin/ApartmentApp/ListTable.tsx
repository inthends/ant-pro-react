import Page from "@/components/Common/Page";
import { Divider, message, Modal, Tag, Table } from "antd";
import { ColumnProps, PaginationConfig } from "antd/lib/table";
import React from "react";
import { InvalidForm } from "./ApartmentApp.service";
// import moment from 'moment';

interface ListTableProps {
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  modify(record: any): void;
  view(id: any): void;
  // choose(record: any): void;
  onchange(page: any, filter: any, sort: any): any;
  reload(): void;
  setData(data: any[]): void;
}

function ListTable(props: ListTableProps) {
  const { onchange, loading, data, modify, pagination, reload, view } = props;
  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    onchange(pagination, filters, sorter);
  };

  const doInvalid = record => {
    Modal.confirm({
      title: "请确认",
      content: `您确认要作废${record.title}吗？`,
      onOk: () => {
        InvalidForm(record.id)
          .then(() => {
            message.success("作废成功");
            reload();
          }).catch(e => { });
      }
    });
  };

  const doModify = id => {
    modify(id);
  };

  const doView = id => {
    view(id);
  };
  

  const columns = [

    {
      title: "标题",
      dataIndex: "title",
      key: "title",
      width: 300,
    },

    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 120,
      render: (text, record) => {
        switch (text) {
          case 0:
            return <Tag color="#e4aa5b">待提交</Tag>;
          case 1:
            return <Tag color="#61c33a">审批中</Tag>;
          case 2:
            return <Tag color="#19d54e">已通过</Tag>;
          case -1:
            return <Tag color="#d82d2d">已作废</Tag>;
          default:
            return '';
        }
      }
    },
    {
      title: "申请人",
      dataIndex: "createUserName",
      key: "createUserName",
      width: 200
    },
    {
      title: "申请日期",
      dataIndex: "createDate",
      key: "createDate",
      width: 160,
      sorter: true,
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      align: 'center',
      fixed: 'right',
      width: 100,
      render: (text, record) => {
        if (record.status == 0) {
          return [
            <span><a onClick={() => doModify(record.id)} key="app">编辑</a>
              <Divider type="vertical" key='spilt2' />
              <a onClick={() => doInvalid(record)} key="delete">作废</a>
            </span>
          ];
        } else {
          return <a onClick={() => doView(record.id)} key="unapp">查看</a>;
        }
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