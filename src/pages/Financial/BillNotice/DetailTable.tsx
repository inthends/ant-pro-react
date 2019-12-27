//明细
import Page from '@/components/Common/Page';
import {  Form, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React  from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import moment from 'moment';

interface DetailTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  reload(): void;
  showModify(id?, isedit?): void;
  form: WrappedFormUtils;
  getRowSelect(record): void;
}

function DetailTable(props: DetailTableProps) {
  const { onchange, loading, pagination, data } = props;
  // const [selectedRowKey, setSelectedRowKey] = useState([]);
  const columns = [
    {
      title: '单号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 180,
      sorter: true
    },
    {
      title: '账单日',
      dataIndex: 'billDate',
      key: 'billDate',
      width: 120,
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
      width: 180,
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
      width: 100
    },
    {
      title: '冲抵金额',
      dataIndex: 'offesetAmount',
      key: 'offesetAmount',
      sorter: true,
      width: 100
    },
    {
      title: '减免金额',
      dataIndex: 'reductionAmount',
      key: 'reductionAmount',
      width: 100,
      sorter: true
    },
    {
      title: '计费起始日期',
      dataIndex: 'beginDate',
      key: 'beginDate',
      width: 120,
      sorter: true,
      render: val => {
        return moment(val).format('YYYY-MM-DD');
       }
    }, {
      title: '计费结束日期',
      dataIndex: 'enDate',
      key: 'enDate',
      width: 120,
      sorter: true,
      render: val => {
        return moment(val).format('YYYY-MM-DD');
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
        scroll={{ y: 500, x: 1400 }}
        loading={loading}
        onChange={onchange}
      />
    </Page>
  );
}

export default Form.create<DetailTableProps>()(DetailTable);

