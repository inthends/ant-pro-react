//账单明细
import Page from '@/components/Common/Page';
import { Form, Table } from 'antd';
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
  const { onchange, loading, pagination, data } = props;

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
      title: '房屋编号',
      dataIndex: 'clickCounts',
      key: 'clickCounts',
    },
    {
      title: '房屋名称',
      dataIndex: 'clickCounts',
      key: 'clickCounts',
    },
    {
      title: '业户名称',
      dataIndex: 'isPublish',
      key: 'isPublish',
    },
    {
      title: '状态',
      dataIndex: 'createUserName',
      key: 'createUserName'
    },
    {
      title: '收费项目',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true
    },

    {
      title: '期间',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true
    },
    {
      title: '应收',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true
    },

    {
      title: '减免',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true
    },

    {
      title: '冲抵',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true
    },

    {
      title: '已收',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true
    },

    {
      title: '未收金额',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true
    },

    {
      title: '账单日期',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true
    },
    {
      title: '收款截止日期',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true
    },
    {
      title: '是否逾期',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true
    },
    {
      title: '费用备注',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true
    }

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
        scroll={{ y: 500 }}
        loading={loading}
        onChange={onchange}
      />
    </Page>
  );
}

export default Form.create<ListTableProps>()(ListTable);

