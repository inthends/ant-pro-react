//装表列表
import Page from '@/components/Common/Page';
import { InputNumber, Input, Select, Col, Row, Form, DatePicker, Card, Button, message, Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useState } from 'react';
import moment from 'moment';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import {  } from './Meter.service';
import styles from './style.less';

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
      title: '费表编号',
      dataIndex: 'metercode',
      key: 'metercode',
      width: 200,
      sorter: true,
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
      sorter: true,
      width: 200
    },
    {
      title: '所属机构',
      key: 'allname',
      dataIndex: 'allname',
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
        rowKey="unitmeterid"
        pagination={pagination}
        scroll={{ y: 500, x: 1400 }}
        loading={loading}
      />
    </Page>
  );
}

export default Form.create<UnitMeterTableProps>()(UnitMeterTable);

