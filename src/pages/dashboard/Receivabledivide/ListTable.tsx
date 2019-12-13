//应收权责摊销明细
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
      title: '房屋全称',
      dataIndex: 'allName',
      key: 'allName',
      width: 240,
    },
    {
      title: '住户',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 100,
    },
    {
      title: '计费单号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 180,
    },
    {
      title: '单据日期',
      dataIndex: 'bBillDate',
      key: 'bBillDate',
      width: 80,
      render: val => moment(val).format('YYYY-MM-DD')
    },
    {
      title: '计费来源',
      dataIndex: 'billSource',
      key: 'billSource',
      width: 80,
    },
    {
      title: '收费项目',
      dataIndex: 'feeName',
      key: 'feeName',
      width: 100, 
    },
    {
      title: '拆分前计费期间',
      dataIndex: 'bBeginDate',
      key: 'bBeginDate',
      width: 200,
      align: 'center',
      render: (text, record) => {
        if (text != null) {
          return moment(text).format('YYYY-MM-DD') + '至' + moment(record.bEndDate).format('YYYY-MM-DD');
        }
        else
          return '';
      },
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      width: 80,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      sorter: true
    },
    {
      title: '折前月度应收',
      dataIndex: 'preDiscountAmount',
      key: 'preDiscountAmount',
      width: 100,
    },

    {
      title: '折后月度应收(含税)',
      dataIndex: 'aftDiscountAmount',
      key: 'aftDiscountAmount',
      width: 120,
    },

    {
      title: '折后月度应收(税后)',
      dataIndex: 'aftTaxAmount',
      key: 'aftTaxAmount',
      width: 120,
    },

    {
      title: '折后月度已收合计(含税)',
      dataIndex: 'payAmount',
      key: 'payAmount',
      width: 140,
    },

    {
      title: '折后月度已收合计(税后)',
      dataIndex: 'aftTaxPayAmount',
      key: 'aftTaxPayAmount',
      width: 140,
    },

    {
      title: '计费起始日期',
      dataIndex: 'beginDate',
      key: 'beginDate',
      width: 100,
      render: val => moment(val).format('YYYY-MM-DD')
    },

    {
      title: '计费终止日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 100,
      render: val => moment(val).format('YYYY-MM-DD')
    }

  ] as ColumnProps<any>[];

  return (
    <Page>
      <Table<any>
        bordered={false}
        size="middle"
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={pagination}
        scroll={{ y: 500, x: 2400 }}
        loading={loading}
        onChange={onchange}
      />
    </Page>
  );
}

export default Form.create<ListTableProps>()(ListTable);

