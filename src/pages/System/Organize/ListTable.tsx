import Page from '@/components/Common/Page';
import { Divider, message, Modal, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React from 'react';
import { CheckOrg, RemoveForm, GetDetailJson } from './Organize.service';
import moment from 'moment';

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
      content: `您确认要作废${record.fullName}吗？`,
      onOk: () => {
        //check 
        CheckOrg(record.key).then((res) => {
          if (res) {
            message.error('存在下级，不允许作废');
            return;
          }
          RemoveForm(record.key)
            .then(() => {
              message.success('作废成功');
              reload();
            })
            .catch(e => { });
        })
      },
    });
  };

  const doModify = id => {
    //获取机构详情
    GetDetailJson(id).then(res => {
      //console.log(res)
      //多选值处理
      // if (res.dispatchRoleA) {
      //   res.dispatchRoleA = res.dispatchRoleA.split(',');
      // }
      // if (res.dispatchRoleB) {
      //   res.dispatchRoleB = res.dispatchRoleB.split(',');
      // }
      // if (res.dispatchRoleC) {
      //   res.dispatchRoleC = res.dispatchRoleC.split(',');
      // }
      
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
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
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
            <a onClick={() => doDelete(record)} key="delete">作废</a>
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
