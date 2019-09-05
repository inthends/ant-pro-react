//计费明细
//装表列表
import Page from '@/components/Common/Page';
import {  Form, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useState } from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import {  } from './BillingMain.service';
import styles from './style.less';
import  moment from 'moment';

interface UnitMeterTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  reload(): void;
  form: WrappedFormUtils;
}

function UnitMeterTable(props: UnitMeterTableProps) {
  const { form, onchange, loading, pagination, data,  reload } = props;

  const columns = [
    {
      title: '计费单号',
      dataIndex: 'billID',
      key: 'billID',
      width: 150,
      sorter: true
    },
    {
      title: '单元编号',
      dataIndex: 'unitID',
      key: 'UnitID',
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
      width: 150,
      sorter: true,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 150,
      sorter: true,
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      sorter: true,
      width: 150
    },
    {
      title: '周期',
      key: 'cycleValue',
      dataIndex: 'cycleValue',
      sorter: true,
      width: 150
    },
    {
      title: '周期单位',
      key: 'cycleType',
      dataIndex: 'cycleType',
      sorter: true,
      width: 150
    },
    {
      title: '金额',
      key: 'amount',
      dataIndex: 'amount',
      sorter: true,
      width: 150
    },
    {
      title: '起始日期',
      key: 'beginDate',
      dataIndex: 'beginDate',
      sorter: true,
      width: 200,
      render: val =>{
        if(val==null){
          return <span></span>
        }else{
          return <span> {moment(val).format('YYYY-MM-DD')} </span>
        }
      }
    }, {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      width: 200,
      sorter: true
    },
    {
      title: '终止日期',
      key: 'endDate',
      dataIndex: 'endDate',
      sorter: true,
      width: 200,
      render: val =>{
        if(val==null){
          return <span></span>
        }else{
          return <span> {moment(val).format('YYYY-MM-DD')} </span>
        }
      }
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
        scroll={{ y: 500 }}
        loading={loading}
        onChange={onchange}
      />
    </Page>
  );
}

export default Form.create<UnitMeterTableProps>()(UnitMeterTable);

