import Page from '@/components/Common/Page';
import { Divider, message, Modal, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import { RemoveForm, GetDetailJson } from './ReciprocatingUnit.service';

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
      content: `您是否要删除${record.fullName}吗`,
      onOk: () => {
        RemoveForm(record.id)
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
      title: '名称',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 200,
      fixed: 'left',
      // sorter: true,
    },
    {
      title: '编号',
      dataIndex: 'enCode',
      key: 'enCode',
      width: 100,
      // sorter: true,
    },
    {
      title: '所属机构',
      dataIndex: 'OrganizeId',
      key: 'OrganizeId',
      width: 100,
      // sorter: true,
    },
    {
      title: '简称',
      dataIndex: 'shortName',
      key: 'shortName',
      width: 80,
      // sorter: true,
    },
    {
      title: '单位性质',
      dataIndex: 'nature',
      key: 'nature',
      width: 80,
      // sorter: true,
    },
    {
      title: '经营范围',
      dataIndex: 'businessScope',
      key: 'businessScope',
      width: 150,
      // sorter: true,
    },
    {
      title: '负责人',
      dataIndex: 'manager',
      key: 'manager',
      width: 80,
      // sorter: true,
    },
    {
      title: '联系电话',
      dataIndex: 'InnerPhone',
      key: 'InnerPhone',
    },
    {
      title: '联系地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 95,
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
            <a onClick={() => doModify(record.id)} key="modify">修改</a>
            <Divider type="vertical" />
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
        rowKey={record => record.id}
        pagination={pagination}
        scroll={{ x: 1150 }}
        onChange={(pag: PaginationConfig, filters, sorter) => changePage(pag, filters, sorter)}
        loading={loading}
      />
    </Page>
  );
}

export default ListTable;
