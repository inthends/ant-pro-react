import Page from "@/components/Common/Page";
import { Tag, Divider, message, Modal, Table } from "antd";
import { ColumnProps, PaginationConfig } from "antd/lib/table";
import React from "react";
import moment from 'moment';
import { RemoveDetailForm } from "./Main.service";

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
      content: `您确认要删除${record.name}吗`,
      onOk: () => {
        RemoveDetailForm(record.id)
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
      title: "所属机构",
      dataIndex: "organizeName",
      key: "organizeName",
      width: 150,
    },
    {
      title: "设备类别",
      dataIndex: "typeName",
      key: "typeName",
      width: 150
    },
    {
      title: "设备名称",
      dataIndex: "name",
      key: "name",
      width: 150
    },
    {
      title: "设备编号",
      dataIndex: "code",
      key: "code",
      width: 100
    },
    {
      title: "规格型号",
      dataIndex: "modelNo",
      key: "modelNo",
      width: 100
    },
    {
      title: "品牌",
      dataIndex: "brand",
      key: "brand",
      width: 100
    },
    // {
    //   title: "位置",
    //   dataIndex: "isDefault",
    //   key: "isDefault",
    //   width: 80
    // },
    {
      title: "位置描述",
      dataIndex: "pSMemo",
      key: "pSMemo",
      width: 100
    },
    {
      title: "投用日期",
      dataIndex: "useDate",
      key: "useDate",
      width: 100,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 80,
      render: (text, record) => {
        switch (text) {
          case 1:
            return <Tag color="#e4aa5b">正常运行</Tag>;
          case 2:
            return <Tag color="#e4aa4b">停用</Tag>;
          case 3:
            return <Tag color="#19d54e">报废</Tag>;
          case 4:
            return <Tag color="#009688">闲置</Tag>;
          default:
            return '';
        }
      }
    },
    {
      title: "附加说明",
      dataIndex: "description",
      key: "description"
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      fixed: 'right',
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
        scroll={{ x: 1500, y: 500 }}
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


