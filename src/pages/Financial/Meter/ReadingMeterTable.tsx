//抄表单列表

import Page from '@/components/Common/Page';
import { InputNumber, Input, Select, Col, Row, Form, DatePicker, Card, Button, message, Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useState } from 'react';
import moment from 'moment';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import {  } from './Meter.service';
import styles from './style.less';

interface ReadingMeterTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  reload(): void;
  form: WrappedFormUtils;
}

function ReadingMeterTable(props: ReadingMeterTableProps) {
  const { form, onchange, loading, pagination, data,  reload } = props;

  const columns = [
    {
      title: '单号',
      dataIndex: 'billcode',
      key: 'billcode',
      width: 200,
      sorter: true
    },
    {
      title: '抄表期间',
      dataIndex: 'metercode',
      key: 'metercode',
      width: 200,
      sorter: true
    },
    {
      title: '抄表人',
      dataIndex: 'meterreader',
      key: 'meterreader',
      width: 200,
      sorter: true,
    },
    {
      title: '抄表日期',
      dataIndex: 'readdate',
      key: 'readdate',
      width: 200,
      sorter: true,
      render: val =>{
        if(val==null){
          return <span></span>
        }else{
          return <span> {moment(val).format('YYYY-MM-DD')} </span>
        }
      }
    },
    {
      title: '单元金额合计',
      dataIndex: 'amount',
      key: 'amount',
      width: 200,
      sorter: true,
    },
    {
      title: '单元用量',
      dataIndex: 'total',
      key: 'total',
      sorter: true,
      width: 200
    },
    {
      title: '公共用量',
      dataIndex: 'publictotal',
      sorter: true,
      key: 'publictotal',
      width: 200
    },
    {
      title: '审核状态',
      dataIndex: 'isverifyname',
      key: 'isverifyname',
      sorter: true,
      width: 200
    },
    {
      title: '审核人',
      dataIndex: 'verifyperson',
      key: 'verifyperson',
      sorter: true,
      width: 200
    },
    {
      title: '审核日期',
      dataIndex: 'verifydate',
      key: 'verifydate',
      sorter: true,
      width: 200,
      render: val =>{
        if(val==null){
          return <span></span>
        }else{
          return <span> {moment(val).format('YYYY-MM-DD')} </span>
        }
      }
    },
    {
      title: '审核情况',
      dataIndex: 'verifymemo',
      key: 'verifymemo',
      sorter: true,
      width: 200
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      sorter: true,
      width: 200
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      width: 300,
      render: (text, record) => {
        return [
          <Button
            type="primary"
            key="modify"
            style={{ marginRight: '10px' }}
            onClick={() =>{}}
          >
            编辑
          </Button>,
          <Button
            type="danger"
            key="delete"
            onClick={() => {}}
          >
            删除
          </Button>
        ];
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
        scroll={{ y: 500, x: 2700 }}
        loading={loading}
        onChange={onchange}
      />
    </Page>
  );
}

export default Form.create<ReadingMeterTableProps>()(ReadingMeterTable);

