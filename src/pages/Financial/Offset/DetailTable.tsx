//明细
import Page from '@/components/Common/Page';
import { Form, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import moment from 'moment';
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
  const { loading, pagination, data } = props;
  const getClassName = (record, index) => {
    if (record.status == -1) {
      return styles.rowRed
    } else {
      return '';
    }
  };
  const columns = [
    {
      title: '冲抵单号',
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
      width: 120,
      sorter: true,
    },
    {
      title: '应付金额',
      dataIndex: 'payAmount',
      key: 'payAmount',
      width: 100, 
    },
    {
      title: '收费项目',
      dataIndex: 'billFeeName',
      key: 'billFeeName',
      width: 100,
      sorter: true,
    },
    {
      title: '冲抵金额',
      dataIndex: 'billAmount',
      key: 'billAmount', 
      width: 100
    },
    {
      title: '应付余额',
      dataIndex: 'lastAmount', 
      key: 'lastAmount',
      width: 100,
      // render: val => {
      //   if (val == null) {
      //     return <span></span>
      //   } else {
      //     return <span> {val} </span>
      //   }
      // }
    },
    {
      title: '计费起始日期',
      dataIndex: 'billBeginDate',
      key: 'billBeginDate', 
      width: 120,
      render: val => {
        if (val == null) {
          return ''
        } else {
          return moment(val).format('YYYY-MM-DD');
        }
      }
    }, {
      title: '计费终止日期',
      dataIndex: 'billEndDate',
      key: 'billEndDate', 
      width: 120,
      render: val => {
        if (val == null) {
          return '';
        } else {
          return moment(val).format('YYYY-MM-DD');
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
        rowKey="billId"
        pagination={pagination}
        scroll={{ y: 500, x: 1100 }}
        loading={loading}
        rowClassName={getClassName} //样式
      />
    </Page>
  );
}

export default Form.create<DetailTableProps>()(DetailTable);
