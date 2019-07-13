import Page from '@/components/Common/Page';
import { Button, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';

interface ListTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
}

function ListTable(props: ListTableProps) {
  const { onchange, loading, pagination , data} = props;
  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    onchange(pagination, filters, sorter);
  };

  return (
    <Page>
      <Table
        style={{ border: 'none' }}
        bordered={false}
        size="middle"
        dataSource={data}
        columns={columns}
        rowKey="id"
        pagination={pagination}
        scroll={{ x: 1850 }}
        onChange={(pagination: PaginationConfig, filters, sorter) =>
          changePage(pagination, filters, sorter)
        }
        loading={loading}
      />
    </Page>
  );
}

export default ListTable;
const columns = [
  {
    title: '项目名称',
    dataIndex: 'name',
    key: 'name',
    width: 250,
    fixed: 'left',
    sorter: true,
  },
  {
    title: '总建筑面积',
    dataIndex: 'area',
    key: 'area',
    width: 200,
    sorter: true,
  },
  {
    title: '总房屋数',
    dataIndex: 'roomcount',
    key: 'roomcount',
    width: 200,
    sorter: true,
  },
  {
    title: '入住面积',
    dataIndex: 'checkarea',
    key: 'checkarea',
    width: 200,
    sorter: true,
  },
  {
    title: '空置面积',
    dataIndex: 'area',
    key: 'area2',
    width: 200,
    sorter: true,
  },
  {
    title: '入住房屋数',
    dataIndex: 'checkroom',
    key: 'checkroom',
    width: 200,
    sorter: true,
  },
  {
    title: '空置房屋数',
    dataIndex: 'vacancyroom',
    key: 'vacancyroom',
    sorter: true,
  },
  {
    title: '入驻率',
    dataIndex: 'rate',
    key: 'rate',
    width: 200,
    fixed: 'right',
    render: (text, record) => {
      return ((record.checkroom / record.roomcount) * 100).toFixed(2) + '%';
    },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    width: 200,
    fixed: 'right',
    render: (text, record) => {
      return [
        <Button type="primary" style={{ marginRight: '10px' }}>
          修改
        </Button>,
        <Button type="danger">删除</Button>,
      ];
    },
  },
] as ColumnProps<any>;
