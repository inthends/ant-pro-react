//明细
import Page from '@/components/Common/Page';
import { Divider, Form, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useState } from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import moment from 'moment';

interface BillNoticeTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  reload(): void;
  showModify(id?, isedit?): void;
  form: WrappedFormUtils;
  getRowSelect(record): void;
}

function BillNoticeTable(props: BillNoticeTableProps) {
  const { onchange, loading, pagination, data, reload, showModify, getRowSelect } = props;
  // const [selectedRowKey, setSelectedRowKey] = useState([]);
  const columns = [
    {
      title: '单号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 150,
      sorter: true
    },
    {
      title: '账单日',
      dataIndex: 'billDate',
      key: 'billDate',
      width: 150,
      sorter: true,
      render: val => {
       return moment(val).format('YYYY-MM-DD');
      }
    },
    {
      title: '业户名称',
      dataIndex: 'custName',
      key: 'custName',
      width: 150,
      sorter: true,
    },
    {
      title: '房屋名称',
      dataIndex: 'allName',
      key: 'allName',
      width: 150,
      sorter: true,
    },
    {
      title: '收费项目',
      dataIndex: 'feeName',
      key: 'feeName',
      width: 150,
      sorter: true,
    },
    {
      title: '计费金额',
      dataIndex: 'amount',
      key: 'amount',
      sorter: true,
      width: 150
    },
    {
      title: '冲抵金额',
      dataIndex: 'offesetAmount',
      key: 'offesetAmount',
      sorter: true,
      width: 150,
      render: val => {
        if (val == null) {
          return <span></span>
        } else {
          return <span> {moment(val).format('YYYY-MM-DD')} </span>
        }
      }
    },
    {
      title: '减免金额',
      dataIndex: 'reductionAmount',
      key: 'reductionAmount',
      width: 200,
      sorter: true
    },
    {
      title: '计费起始日期',
      dataIndex: 'beginDate',
      key: 'beginDate',
      width: 200,
      sorter: true
    }, {
      title: '计费结束日期',
      dataIndex: 'enDate',
      key: 'enDate',
      width: 200,
      sorter: true
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
        onChange={onchange}
      />
    </Page>
  );
}

export default Form.create<BillNoticeTableProps>()(BillNoticeTable);

