import Page from "@/components/Common/Page";
import { Divider, message, Modal, Table } from "antd";
import { ColumnProps, PaginationConfig } from "antd/lib/table";
import React from "react";
import { RemoveForm } from "./WechatMenu.service";

interface ListTableProps {
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  modify(record: any): void;
  // choose(record: any): void;
  onchange(page: any, filter: any, sort: any): any;
  reload(): void;
  setData(data: any[]): void;
}

function ListTable(props: ListTableProps) {
  const { onchange, loading, data, modify, reload, pagination } = props;
  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    onchange(pagination, filters, sorter);
  };
  const doDelete = record => {
    Modal.confirm({
      title: "请确认",
      content: `您确认要删除${record.fullName}吗？`,
      onOk: () => {
        RemoveForm(record.ruleId)
          .then(() => {
            message.success("删除成功");
            reload();
          }).catch(e => { });
      }
    });
  };

  const doModify = record => {
    modify({ ...record });
  };

  const columns = [
    {
      title: "菜单名称",
      dataIndex: "enCode",
      key: "enCode",
      width: 100,
    },
    {
      title: "菜单类型",
      dataIndex: "fullName",
      key: "fullName",
      width: 150
    },
    {
      title: "系统功能",
      dataIndex: "orgName",
      key: "orgName",
      width: 150
    },
    {
      title: "排序号",
      dataIndex: "currentNumber",
      key: "currentNumber",
      width: 200
    },
    {
      title: "创建用户",
      dataIndex: "createUserName",
      key: "createUserName",
      width: 100
    },
    {
      title: "创建时间",
      dataIndex: "createDate",
      key: "createDate",
      width: 160
    },
    // {
    //   title: "有效",
    //   dataIndex: "enabledMark",
    //   key: "enabledMark",
    //   width: 100,
    //   render: (text: any, record, index) => {
    //     return (
    //       <Switch
    //         size="small"
    //         checked={text === ENABLEDMARKS.正常}
    //         checkedChildren={ENABLEDMARKS[ENABLEDMARKS.正常]}
    //         unCheckedChildren={ENABLEDMARKS[ENABLEDMARKS.禁用]}
    //         onClick={() => toggleDisabled(record)}
    //       />
    //     );
    //   }
    // },
   
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      align: 'center',
      width: 60,
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
        rowKey={record => record.ruleId}
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