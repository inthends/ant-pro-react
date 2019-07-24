import Page from '@/components/Common/Page';
import { Button, message, Modal, Table } from 'antd';
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
  const {loading,  data, modify, reload } = props;   

  const doDelete = record => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要删除 ${record.name} 吗`,
      onOk: () => {
        RemoveForm(record.id)
          .then(() => {
            message.success('删除成功');
            reload();
          })
          .catch(e => {});
      },
    });
  };
  const doModify = id => {
    GetDetailJson(id).then(res => {
      const { customerInfo = {}, relationPC = {} } = res;
      modify({ ...relationPC, ...customerInfo });
    });
  };
  const columns = [
    {
      title: '机构名称',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 250, 
    },
    {
      title: '机构编号',
      dataIndex: 'enCode',
      key: 'enCode',
      width: 200, 
    },
    {
      title: '成立时间',
      dataIndex: 'foundedTime',
      key: 'foundedTime',
      width: 150, 
    },
    {
      title: '负责人',
      dataIndex: 'manager',
      key: 'manager',
      width: 100
    },
    {
      title: '联系电话',
      dataIndex: 'telPhone',
      key: 'telPhone',
      width: 150, 
    },
    {
      title: '备注',
      dataIndex: 'description',
      key: 'description',
      width: 300
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 155,
      fixed: 'right',
      render: (text, record) => {
        return [
          <Button
            type="primary"
            key="modify"
            style={{ marginRight: '10px' }}
            onClick={() => doModify(record.id)}
          >
            修改
          </Button>,
          <Button type="danger" key="delete" onClick={() => doDelete(record)}>
            删除
          </Button>,
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
        rowKey={record => record.id} 
        scroll={{y:500}} 
        loading={loading}
      />
    </Page>
  );
}

export default ListTable;
