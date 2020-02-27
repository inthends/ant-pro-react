//计费明细
import Page from '@/components/Common/Page';
import { Form, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
// import { } from './Main.service';
import moment from 'moment';

interface UnitTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  reload(): void;
  form: WrappedFormUtils;
}

function UnitTable(props: UnitTableProps) {
  const { onchange, loading, pagination, data } = props;
  const columns = [
    {
      title: '计费单号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 180,
      sorter: true
    },
    {
      title: '单元编号',
      dataIndex: 'unitId',
      key: 'UnitId',
      width: 150,
      sorter: true
    },
    {
      title: '收费项目',
      dataIndex: 'feeName',
      key: 'feeName',
      width: 150,
      sorter: true,
    },
    {
      title: '应收期间',
      dataIndex: 'period',
      key: 'period',
      width: 100,
      sorter: true,
      render: val => {
        return moment(val).format('YYYY-MM-DD')
      }
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100, 
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price', 
      width: 80
    }, 
    {
      title: '金额',
      key: 'amount',
      dataIndex: 'amount', 
      width: 100
    },
    {
      title: '计费起始日期',
      key: 'beginDate',
      dataIndex: 'beginDate',
      sorter: true,
      width: 120,
      render: val => {
        return moment(val).format('YYYY-MM-DD')
      }
    },
    {
      title: '计费截止日期',
      key: 'endDate',
      dataIndex: 'endDate',
      sorter: true,
      width: 120,
      render: val => {
        return moment(val).format('YYYY-MM-DD')
      }
    },
    {
      title: '周期',
      key: 'cycleValue',
      dataIndex: 'cycleValue', 
      width: 80
    },
    {
      title: '周期单位',
      key: 'cycleType',
      dataIndex: 'cycleType', 
      width: 100
    },
    {
      title: '房屋全称',
      key: 'allName',
      dataIndex: 'allName', 
      width: 320
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',  
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
        scroll={{ y: 500, x: 1700 }}
        loading={loading}
        onChange={onchange}
      />
    </Page>
  );
}

export default Form.create<UnitTableProps>()(UnitTable);

