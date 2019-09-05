//明细
import Page from '@/components/Common/Page';
import { InputNumber, Input, Select, Col, Row, Form, DatePicker, Card, Button, message, Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useState } from 'react';
import moment from 'moment';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import {  } from './Offset.service';
import styles from './style.less';
const { Option } = Select;

interface BillNoticeTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  reload(): void;
  form: WrappedFormUtils;
}

function BillNoticeTable(props: BillNoticeTableProps) {
  const { form, onchange, loading, pagination, data,  reload } = props;

  const columns = [
    {
      title: '单号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 180,
      sorter: true
    },
    {
      title: '房屋名称',
      dataIndex: 'allName',
      key: 'allName',
      width: 180,
      sorter: true
    },
    {
      title: '付款项目',
      dataIndex: 'payFeeName',
      key: 'payFeeName',
      width: 180,
      sorter: true,
    },
    {
      title: '应付金额',
      dataIndex: 'payAmount',
      key: 'payAmount',
      width: 180,
      sorter: true,
    },
    {
      title: '收费项目',
      dataIndex: 'billFeeName',
      key: 'billFeeName',
      width: 180,
      sorter: true,
    },
    {
      title: '冲抵金额',
      dataIndex: 'billAmount',
      key: 'billAmount',
      sorter: true,
      width: 180
    },
    {
      title: '应付余额',
      dataIndex: 'lastAmount',
      sorter: true,
      key: 'lastAmount',
      width: 180,
      render: val =>{
        if(val==null){
          return <span></span>
        }else{
          return <span> {val} </span>
        }
      }
    },
    {
      title: '计费起始日期',
      dataIndex: 'billBeginDate',
      key: 'billBeginDate',
      sorter: true,
      width: 180,
      render: val =>{
        if(val==null){
          return <span></span>
        }else{
          return <span> {moment(val).format('YYYY-MM-DD')} </span>
        }
      }
    },   {
      title: '计费终止日期',
      dataIndex: 'billEndDate',
      key: 'billEndDate',
      sorter: true,
      width: 180,
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
        rowKey="billID"
        pagination={pagination}
        scroll={{ y: 500, x: 1620 }}
        loading={loading}
      />
    </Page>
  );
}

export default Form.create<BillNoticeTableProps>()(BillNoticeTable);
