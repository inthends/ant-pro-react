import Page from '@/components/Common/Page';
import { Divider, message, Modal, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React from 'react';
import { CheckOrg, RemoveForm, GetDetailJson } from './DeviceType.service';
import moment from 'moment';

interface ListTableProps {
  loading: boolean;
  data: any[];
  onchange(page: any, filter: any, sort: any): any;
  modify(data: any): void;
  reload(): void;
}

function TypeListTable(props: ListTableProps) {
  const { loading, data, modify, reload } = props;
  const doDelete = record => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要删除 ${record.fullName} 吗？`,
      onOk: () => {
        //check 
        CheckOrg(record.key).then((res) => { 
          if (res) {
            message.error('存在下级，不允许删除！');
            return;
          }
          RemoveForm(record.key)
            .then(() => {
              message.success('删除成功！');
              reload();
            })
            .catch(e => { });
        })
      },
    });
  };

  const doModify = id => {
    GetDetailJson(id).then(res => {
      //console.log(res)
      modify(res);
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
      width: 100,
      render: val => {
        if (val == null) {
          return '';
        } else {
          return moment(val).format('YYYY-MM-DD');
        }
      }
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
      key: 'description'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 95,
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
        loading={loading}
      />
    </Page>
  );
}

export default ListTable;
