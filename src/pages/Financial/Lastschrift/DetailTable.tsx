//明细
import Page from '@/components/Common/Page';
import {Tag, Form, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react'; 
import { WrappedFormUtils } from 'antd/lib/form/Form';
import styles from './style.less';
interface DetailTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  reload(): void;
  form: WrappedFormUtils;
};

function DetailTable(props: DetailTableProps) {
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
      title: '划账单号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 180,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 80,
      render: (text, record) => {
        switch (text) {
          case 0:
            return <Tag color="#e4aa5b">未扣款</Tag>;
          case 1:
            return <Tag color="#19d54e">已扣款</Tag>; 
          case -1:
            return <Tag color="#e4aa5b">作废</Tag>;
          default:
            return '';
        }
      }
    }, 
    {
      title: '划账费项',
      dataIndex: 'feeName',
      key: 'feeName',
      width: 100,
    },
    {
      title: '划账金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
    },
    {
      title: '扣款金额',
      dataIndex: 'deductionAmount',
      key: 'deductionAmount',
      width: 100,
    },
    {
      title: '户名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '房号',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: '开户银行',
      dataIndex: 'accountBank',
      key: 'accountBank',
      width: 120,
    },
    {
      title: '账号',
      dataIndex: 'bankAccount',
      key: 'bankAccount',
      width: 120,
    }, 
    
    {
      title: '单元全称',
      dataIndex: 'allName',
      key: 'allName',
    }
  ] as ColumnProps<any>[];

  return (
    <Page>
      <Table<any>
        bordered={false}
        size="middle"
        columns={columns}
        dataSource={data}
        // rowKey="billId"
        rowKey={record => record.id}
        pagination={pagination}
        scroll={{ y: 500, x: 1300 }}
        loading={loading}
        rowClassName={getClassName} //样式
        onChange={(pagination: PaginationConfig, filters, sorter) =>
          changePage(pagination, filters, sorter)
        }
      />
    </Page>
  );
}

export default Form.create<DetailTableProps>()(DetailTable);
