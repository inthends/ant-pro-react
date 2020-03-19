import Page from '@/components/Common/Page';
import { Form, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import moment from 'moment';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import styles from './style.less';

interface DetailListProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  reload(): void;
  form: WrappedFormUtils;
}

function DetailList(props: DetailListProps) {
  const { onchange, loading, pagination, data } = props;
  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    onchange(pagination, filters, sorter);
  };

  const getClassName = (record, index) => {
    if (record.status == -1) {
      return styles.rowRed
    } else {
      return '';
    }
  };

  const columns = [
    {
      title: '减免单号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 180, 
    },
    {
      title: '单元编号',
      dataIndex: 'unitId',
      key: 'unitId',
      width: 140, 
    },
    {
      title: '收费项目',
      dataIndex: 'feeName',
      key: 'feeName',
      width: 100, 
    },
    {
      title: '应收期间',
      dataIndex: 'period',
      key: 'period',
      width: 100, 
      render: val => {
        if (val == null) {
          return '';
        } else {
          return moment(val).format('YYYY年MM月');
        }
      }
    },
    {
      title: '计费起始日期',
      dataIndex: 'beginDate',
      key: 'beginDate',
      width: 120, 
      render: val => {
        if (val == null) {
          return '';
        } else {
          return moment(val).format('YYYY-MM-DD');
        }
      }
    },
    {
      title: '计费截止日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120, 
      render: val => {
        if (val == null) {
          return '';
        } else {
          return moment(val).format('YYYY-MM-DD');
        }
      }
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 80, 
    }, {
      title: '减免金额',
      dataIndex: 'reductionAmount',
      key: 'reductionAmount',
      width: 80
    }, {
      title: '减免后金额',
      dataIndex: 'lastAmount',
      key: 'lastAmount',
      width: 100
    }, 
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 60,
      render: val => val == 0 ? '正常' : '作废'
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo', 
    }
  ] as ColumnProps<any>[];

  return (
    <Page>
      <Table
        bordered={false}
        size="middle"
        dataSource={data}
        rowClassName={getClassName} //样式
        columns={columns}
        rowKey={record => record.id}
        pagination={pagination}
        scroll={{ x: 1300, y: 500 }}
        onChange={(pagination: PaginationConfig, filters, sorter) =>
          changePage(pagination, filters, sorter)
        }
        loading={loading}
      />
    </Page>
  );
}

export default Form.create<DetailListProps>()(DetailList);
