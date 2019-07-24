import Page from '@/components/Common/Page';
import { Button, message, Modal, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import * as moment from 'moment';
import { RemoveForm, GetDetailJson } from './Main.service';

interface ListTableProps {
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  onchange(page: any, filter: any, sort: any): any;
  modify(data: any): void;
  reload(): void;
}

function ListTable(props: ListTableProps) {
  const { onchange, loading, pagination, data, modify, reload } = props;
  const changePage = (pag: PaginationConfig, filters, sorter) => {
    onchange(pag, filters, sorter);
  };
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
      title: '角色名称',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 200, 
    }, {
      title: '角色编号',
      dataIndex: 'enCode',
      key: 'enCode',
      width: 200, 
    },
    
    {
      title: '创建时间',
      dataIndex: 'createDate',
      key: 'createDate',
      width: 150, 
      render: val => <span> {moment(val).format('YYYY-MM-DD HH:mm:ss')} </span>
    },
     
    {
      title: '是否有效',
      dataIndex: 'telphonenum',
      key: 'telphonenum',
      width: 150, 
    },
    
    {
      title: '角色描述',
      dataIndex: 'memo',
      key: 'memo',
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
            onClick={() => doModify(record.RoleId)}
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
        rowKey={record => record.RoleId}
        pagination={pagination} 
        onChange={(pag: PaginationConfig, filters, sorter) => changePage(pag, filters, sorter)}
        loading={loading}
      />
    </Page>
  );
}

export default ListTable;
