import Page from "@/components/Common/Page";
import { Tag, Divider, message, Modal, Table } from "antd";
import { ColumnProps, PaginationConfig } from "antd/lib/table";
import React from "react";
import { RemoveForm } from "./Main.service";

interface ListTableProps {
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  show(record: any): void;
  choose(record: any): void;
  onchange(page: any, filter: any, sort: any): any;
  reload(): void;
}

function ListTable(props: ListTableProps) {
  const { onchange, loading, data, show, reload, pagination } = props;
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
  const doView = record => {
    show({ ...record });
  };

  const columns = [
    {
      title: "路线名称",
      dataIndex: "lineName",
      key: "lineName",
      width: 180,
      sorter: true
    },
    {
      title: "路线编号",
      dataIndex: "code",
      key: "code",
      width: 120,
      sorter: true
    },
    {
      title: "所属楼盘",
      dataIndex: "psName",
      key: "psName",
      width: 150
    },
    // {
    //   title: "所属机构",
    //   dataIndex: "orgName",
    //   key: "orgName",
    //   width: 150
    // }, 
    {
      title: "巡检点位",
      dataIndex: "pointName",
      key: "pointName",
      width: 200
    },
    {
      title: "巡检内容",
      dataIndex: "content",
      key: "content",
      width: 150
    },

    {
      title: "巡检角色",
      dataIndex: "roleName",
      key: "roleName",
      width: 150
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 100,
      sorter: true,
      render: val => val == 1 ? <Tag color="#009688">已巡检</Tag> : <Tag color="#e4aa5b">未巡检</Tag>
    },
    {
      title: '点位状态',
      dataIndex: 'pointStatus',
      key: 'pointStatus',
      align: 'center',
      width: 100,
      render: val => val == 1 ? <Tag color="#009688">正常</Tag> : <Tag color="#e4aa5b">异常</Tag>
    },
    {
      title: "计划时间",
      dataIndex: "planTime",
      key: "planTime",
      width: 160,
      sorter: true
    },
    {
      title: "执行时间",
      dataIndex: "excuteTime",
      key: "excuteTime",
      width: 160,
    },
    {
      title: "执行人",
      dataIndex: "excuteUserName",
      key: "excuteUserName",
      width: 100,
    },
    {
      title: "说明",
      dataIndex: "memo",
      key: "memo"
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      align: 'center',
      fixed: 'right',
      width: 95,
      render: (text, record) => {
        return [
          <span key='span'>
            <a onClick={() => doView(record)} key="modify">查看</a>
            <Divider type="vertical" key='divider' />
            <a onClick={() => doDelete(record)} key="delete">作废</a>
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
        scroll={{ x: 1800 }}
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

