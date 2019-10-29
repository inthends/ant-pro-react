//账单明细
import Page from '@/components/Common/Page';
import { Form, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import moment from 'moment';

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
      dataIndex: '管理处',
      key: '管理处',
      width: 100,
    },
    {
      title: '楼盘名称',
      dataIndex: '楼盘',
      key: '楼盘',
      width: 100,
    },
    {
      title: '楼栋名称',
      dataIndex: '楼栋',
      key: '楼栋',
      width: 80,
    },
    {
      title: '房屋编号',
      dataIndex: '房屋编号',
      key: '房屋编号',
      width: 120,
    },
    {
      title: '房屋名称',
      dataIndex: '房屋',
      key: '房屋',
      width: 80,
    },
    {
      title: '业户名称',
      dataIndex: '客户名称',
      key: '客户名称',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: '是否审核',
      key: '是否审核',
      width: 60,
    },
    {
      title: '收费项目',
      dataIndex: '收费项目',
      key: '收费项目',
      width: 100,
      sorter: true
    },

    {
      title: '期间',
      dataIndex: '计费起始日期',
      key: '计费起始日期',
      width: 100,
      align: 'center',
      render: (text, record) => {
        if (text != null) {
          return moment(text).format('YYYY-MM-DD') + '至' + moment(record['计费终止日期']).format('YYYY-MM-DD');
        }
        else
          return '';
      },
    },
    {
      title: '应收',
      dataIndex: '应收',
      key: '应收',
      width: 100,
      sorter: true
    },

    {
      title: '减免',
      dataIndex: 'createDate',
      key: 'createDate',
      width: 100,
      sorter: true
    },

    {
      title: '冲抵',
      dataIndex: 'createDate',
      key: 'createDate',
      width: 100,
      sorter: true
    },

    {
      title: '已收',
      dataIndex: 'createDate',
      key: 'createDate',
      width: 100,
      sorter: true
    },

    {
      title: '未收金额',
      dataIndex: 'createDate',
      key: 'createDate',
      width: 100,
      sorter: true
    },

    {
      title: '账单日期',
      dataIndex: '账单日',
      key: '账单日',
      width: 100,
      sorter: true
    },
    {
      title: '收款截止日期',
      dataIndex: 'createDate',
      key: 'createDate',
      width: 120,
      sorter: true
    },
    {
      title: '是否逾期',
      dataIndex: 'createDate',
      key: 'createDate',
      width: 100,
      sorter: true
    },
    {
      title: '费用备注',
      dataIndex: '备注',
      key: '备注',
      width: 100,
    }
  ] as ColumnProps<any>[];

  return (
    <Page>
      <Table<any>
        bordered={false}
        size="middle"
        columns={columns}
        dataSource={data}
        rowKey="feeId"
        pagination={pagination}
        scroll={{ y: 500, x: 1800 }}
        loading={loading}
        onChange={onchange}
      />
    </Page>
  );
}

export default Form.create<ListTableProps>()(ListTable);

