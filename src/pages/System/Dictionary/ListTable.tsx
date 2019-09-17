import Page from "@/components/Common/Page";
import { Divider, message, Modal, Switch, Table } from "antd";
import { ColumnProps, PaginationConfig } from "antd/lib/table";
import React from "react";
import { SaveForm, RemoveForm } from "./Dictionary.service";

interface ListTableProps {
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  modify(record: any): void;
  choose(record: any): void;
  onchange(page: any, filter: any, sort: any): any;
  reload(): void;
  setData(data: any[]): void;
}

function ListTable(props: ListTableProps) {
  const { loading, data, modify, reload, pagination, setData } = props;
  const doDelete = record => {
    Modal.confirm({
      title: "请确认",
      content: `您是否要删除 ${record.fullName} 吗`,
      onOk: () => {
        RemoveForm(record.roleId)
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
  const toggleDisabled = record => {
    record.enabledMark = record.enabledMark === 0 ? 1 : 0;
    let keyValue = record.roleId;
    SaveForm({ ...record, keyValue }).then(() => {
      setData([...data]);
    });
  };
  const columns = [
    {
      title: "词典名称",
      dataIndex: "itemName",
      key: "itemName",
      width: 100,
    },
    {
      title: "词典值",
      dataIndex: "itemValue",
      key: "itemValue",
      width: 100
    },
    {
      title: "简拼",
      dataIndex: "simpleSpelling",
      key: "simpleSpelling",
      width: 100
    },
    {
      title: "排序",
      dataIndex: "sortCode",
      key: "sortCode",
      width: 80
    },
    {
      title: "默认",
      dataIndex: "isDefault",
      key: "isDefault",
      width: 80
    },
    {
      title: "有效",
      dataIndex: "enabledMark",
      key: "enabledMark",
      width: 100,
      render: (text: any, record, index) => {
        return (
          <Switch
            size="small"
            checked={text === ENABLEDMARKS.正常}
            checkedChildren={ENABLEDMARKS[ENABLEDMARKS.正常]}
            unCheckedChildren={ENABLEDMARKS[ENABLEDMARKS.禁用]}
            onClick={() => toggleDisabled(record)}
          />
        );
      }
    },
    {
      title: "备注",
      dataIndex: "description",
      key: "description",
      width: 100,
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      width: 85,
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

enum ENABLEDMARKS {
  正常 = 1,
  禁用 = 0
}
