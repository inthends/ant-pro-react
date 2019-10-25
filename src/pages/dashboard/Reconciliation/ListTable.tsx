//对账单
import Page from '@/components/Common/Page';
import {  Form, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form'; 

interface ListTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[]; 
  form: WrappedFormUtils;
}

function ListTable(props: ListTableProps) {
  const { onchange, loading, pagination, data  } = props;

  const columns = [
    {
      title: '管理处名称',
      dataIndex: 'type',
      key: 'type',
      width: 60,
    },
    {
      title: '楼盘名称',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: '楼栋名称',
      dataIndex: 'estateName',
      key: 'estateName',
      width: 300,
    },
    {
      title: '房屋名称',
      dataIndex: 'clickCounts',
      key: 'clickCounts',
    },
    {
      title: '订单编号',
      dataIndex: 'isPublish',
      key: 'isPublish', 
    },
    {
      title: '订单日期',
      dataIndex: 'createUserName',
      key: 'createUserName'
    },
    {
      title: '订单来源',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true
    },

    {
      title: '订单状态',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true
    },


    {
      title: '订单金额',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true
    },

    {
      title: '收款单编号',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true
    },

    {
      title: '收款单日期',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true
    },
 
    {
      title: '收款方式',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true
    },

    {
      title: '收款金额',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true
    },

    //动态费项统计列

  ] as ColumnProps<any>[];

  return (
    <Page>
      <Table<any>
        bordered={false}
        size="middle"
        columns={columns}
        dataSource={data}
        rowKey="meterid"
        pagination={pagination}
        scroll={{ y: 500  }}
        loading={loading}
        onChange={onchange}
      />
    </Page>
  );
}

export default Form.create<ListTableProps>()(ListTable);

