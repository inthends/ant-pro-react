import Page from '@/components/Common/Page';
import { Tag,Divider, message, Modal, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import { RemoveForm } from './Main.service';

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
      content: `您是否要删除${record.title}吗`,
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
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },

    {
      title: '所属小区',
      dataIndex: 'estateName',
      key: 'estateName',
      width: 300,
    },
    {
      title: '点击率',
      dataIndex: 'clickCounts',
      key: 'clickCounts',
    },
    {
      title: '是否发布',
      dataIndex: 'isPublish',
      key: 'isPublish',
      render: val => val == 1 ? <Tag color="#19d54e">已发布</Tag> : <Tag color="#e4aa5b">未发布</Tag>
    },
    {
      title: '添加人',
      dataIndex: 'createUserName',
      key: 'createUserName'
    },
    {
      title: '添加时间',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (text, record) => {
        return [
          <span>
            <a onClick={() => modify(record)} key="modify">修改</a>
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
        onChange={(pag: PaginationConfig, filters, sorter) => changePage(pag, filters, sorter)}
        loading={loading}
      />
    </Page>
  );
}
export default ListTable;
