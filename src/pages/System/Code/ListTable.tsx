import Page from "@/components/Common/Page";
import { Button, message, Modal, Switch, Table } from "antd";
import { ColumnProps, PaginationConfig } from "antd/lib/table";
import React from "react";
import { SaveForm, RemoveForm } from "./Code.service";

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
  const { loading, data, modify, reload, pagination, setData, choose } = props;

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
          .catch(e => {});
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
      title: "角色编号",
      dataIndex: "enCode",
      key: "enCode",
      width: 150,
      fixed: "left"
    },
    {
      title: "角色名称",
      dataIndex: "fullName",
      key: "fullName",
      fixed: "left",
      width: 150
    },
    {
      title: "创建时间",
      dataIndex: "createDate",
      key: "createDate",
      width: 250
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
      title: "角色描述",
      dataIndex: "description",
      key: "description"
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      width: 400,
      fixed: "right",
      render: (text, record) => {
        return [
          <Button
            key="choose"
            style={{ marginRight: "10px" }}
            onClick={() => choose(record)}
          >
            角色成员
          </Button>,
          <Button
            type="primary"
            key="modify"
            style={{ marginRight: "10px" }}
            onClick={() => doModify(record)}
          >
            修改
          </Button>,
          <Button type="danger" key="delete" onClick={() => doDelete(record)}>
            删除
          </Button>
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
        scroll={{ x: 1350, y: 500 }}
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
