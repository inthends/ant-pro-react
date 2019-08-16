//费表列表
import Page from '@/components/Common/Page';
import { InputNumber, Input, Select, Col, Row, Form, DatePicker, Card, Button, message, Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useState } from 'react';
import moment from 'moment';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import {  } from './Meter.service';
import styles from './style.less';

interface MeterTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  reload(): void;
  form: WrappedFormUtils;
}

function MeterTable(props: MeterTableProps) {
  const { form, onchange, loading, pagination, data,  reload } = props;

  const columns = [
    {
      title: '费表类型',
      dataIndex: 'meterkind',
      key: 'meterkind',
      width: 200,
      sorter: true
    },
    {
      title: '费表种类',
      dataIndex: 'metertype',
      key: 'metertype',
      width: 200,
      sorter: true
    },
    {
      title: '费表名称',
      dataIndex: 'metername',
      key: 'metername',
      width: 200,
      sorter: true,
    },
    {
      title: '倍率',
      dataIndex: 'meterzoom',
      key: 'meterzoom',
      width: 200,
      sorter: true,
    },
    {
      title: '量程',
      dataIndex: 'meterrange',
      key: 'meterrange',
      width: 200,
      sorter: true,
    },
    {
      title: '关联收费项目',
      dataIndex: 'feeitemname',
      key: 'feeitemname',
      sorter: true,
      width: 200
    },
    {
      title: '所属机构',
      dataIndex: 'fullname',
      key: 'fullname',
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
      },
    },
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
        scroll={{ y: 500, x: 1700 }}
        loading={loading}
      />
    </Page>
  );
}

export default Form.create<MeterTableProps>()(MeterTable);

