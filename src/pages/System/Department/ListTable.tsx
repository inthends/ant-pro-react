import Page from '@/components/Common/Page';
import { Divider, message, Modal, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React from 'react';
import { RemoveForm, GetDetailJson } from './Main.service';

interface ListTableProps {
  loading: boolean;
  data: any[];
  onchange(page: any, filter: any, sort: any): any;
  modify(data: any): void;
  reload(): void;
}

function ListTable(props: ListTableProps) {
  const { loading, data, modify, reload } = props;

  const doDelete = record => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要删除 ${record.name} 吗`,
      onOk: () => {
        RemoveForm(record.key)
          .then(() => {
            message.success('删除成功');
            reload();
          })
          .catch(e => { });
      },
    });
  };
  const doModify = id => {
    GetDetailJson(id).then(res => {
      modify(res);
    });
  };
  const columns = [
    {
      title: '部门名称',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 340,
    },
    {
      title: '部门编号',
      dataIndex: 'enCode',
      key: 'enCode',
      width: 200,
    },
    {
      title: '部门简称',
      dataIndex: 'shortName',
      key: 'shortName',
      width: 160,
    },
    {
      title: '联系电话',
      dataIndex: 'telPhone',
      key: 'telPhone',
      width: 160
    },
    {
      title: '备注',
      dataIndex: 'description',
      key: 'description', 
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 90,
      fixed: 'right',
      render: (text, record) => {
        return [
          // <Button
          //   type="primary"
          //   key="modify"
          //   style={{ marginRight: '10px' }}
          //   onClick={() => doModify(record.id)}
          // >
          //   修改
          // </Button>,
          // <Button type="danger" key="delete" onClick={() => doDelete(record)}>
          //   删除
          // </Button>,
          <span>
            <a onClick={() => doModify(record.key)} key="modify">编辑</a>
            <Divider type="vertical" key='divider' />
            <a onClick={() => doDelete(record)} key="delete">删除</a>
          </span>

        ];
      },
    },
  ] as ColumnProps<any>[];
  return (
    <Page>
      <Table
        style={{ border: 'none' }}
        bordered={false}
        size="middle"
        dataSource={data}
        columns={columns}
        rowKey={record => record.key}
        scroll={{ y: 500 }}
        loading={loading}
      />
    </Page>
  );
}

export default ListTable;
