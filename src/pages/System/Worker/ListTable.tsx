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
      title: "工号",
      dataIndex: "code",
      key: "code",
      width: 100,
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: 100
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
      title: "手机",
      dataIndex: "phoneNum",
      key: "phoneNum",
      width: 100
    },
    {
      title: "电话",
      dataIndex: "telPhoneNum",
      key: "telPhoneNum",
      width: 100
    },


    {
      title: "职位",
      dataIndex: "dutyName",
      key: "dutyName",
      width: 100
    },
    {
      title: "岗位",
      dataIndex: "postName",
      key: "postName",
      width: 100
    },

    {
      title: "备注",
      dataIndex: "description",
      key: "description",
      width: 100
    }, 
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      width: 80,
      render: (text, record) => {
        return [
          <span>
            <a onClick={() => doModify(record)} key="modify">编辑</a>
            <Divider type="vertical" key='divider'/>
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

