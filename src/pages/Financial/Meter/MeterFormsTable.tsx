//抄表列表
import Page from '@/components/Common/Page';
import { InputNumber, Input, Select, Col, Row, Form, DatePicker, Card, Button, message, Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useState } from 'react';
import moment from 'moment';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import {  } from './Meter.service';
import styles from './style.less';

interface MeterFormsTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  reload(): void;
  form: WrappedFormUtils;
}

function MeterFormsTable(props: MeterFormsTableProps) {
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
      dataIndex: 'meterdate',
      key: 'meterdate',
      width: 200,
      sorter: true
    },
    {
      title: '表编号',
      dataIndex: 'metercode',
      key: 'metercode',
      width: 200,
      sorter: true,
    },
    {
      title: '表名称',
      dataIndex: 'metername',
      key: 'metername',
      width: 200,
      sorter: true,
    },
    {
      title: '上次读数',
      dataIndex: 'lastreading',
      key: 'lastreading',
      width: 200,
      sorter: true,
    },
    {
      title: '本次读数',
      dataIndex: 'nowreading',
      key: 'nowreading',
      sorter: true,
      width: 200
    },
    {
      title: '倍率',
      dataIndex: 'meterzoom',
      sorter: true,
      key: 'meterzoom',
      width: 200
    }, {
      title: '金额',
      dataIndex: 'meterprice',
      key: 'meterprice',
      sorter: true,
      width: 200,
      render: val =>{
        return <span>{val}元/度</span>
      }
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      sorter: true,
      width: 200
    },
    {
      title: '安装位置',
      dataIndex: 'allname',
      key: 'allname',
      sorter: true,
      width: 200
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
        scroll={{ y: 500, x: 2000 }}
        loading={loading}
      />
    </Page>
  );
}

export default Form.create<MeterFormsTableProps>()(MeterFormsTable);

