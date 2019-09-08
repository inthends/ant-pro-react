//账单 
import Page from '@/components/Common/Page';
import { Divider, Form, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useState } from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { RemoveForm } from './BillNotice.service';
import moment from 'moment';
import styles from './style.less';

interface BillCheckTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  reload(): void;
  showCheckBill(id): void;
  form: WrappedFormUtils;
  getRowSelect(records): void;
}

function BillCheckTable(props: BillCheckTableProps) {
  const { onchange, loading, pagination, data, reload, showCheckBill, getRowSelect } = props;
  // const [selectedRowKey, setSelectedRowKey] = useState([]);
  const columns = [
    {
      title: '单据类型',
      dataIndex: 'billType',
      key: 'billType',
      width: 100,
      sorter: true
    }, {
      title: '单号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 200,
      sorter: true
    },
    {
      title: '账单日',
      dataIndex: 'createDate',
      key: 'createDate',
      width: 120,
      sorter: true,
      render: val => {
        if (val == null) {
          return <span></span>
        } else {
          return <span> {moment(val).format('YYYY-MM-DD')} </span>
        }
      }
    },
    {
      title: '房间编号',
      dataIndex: 'unitId',
      key: 'unitId',
      width: 100,
      sorter: true,
    },
    {
      title: '业户名称',
      dataIndex: 'custName',
      key: 'custName',
      width: 100,
      sorter: true,
    },
    {
      title: '交房日期',
      dataIndex: 'handoverDate',
      key: 'handoverDate',
      width: 120,
      sorter: true,
      render: val => {
        if (val == null) {
          return <span></span>
        } else {
          return <span> {moment(val).format('YYYY-MM-DD')} </span>
        }
      }
    },
    {
      title: '计费金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100
    },
    {
      title: '审核状态',
      dataIndex: 'ifVerifyName',
      key: 'ifVerifyName',
      width: 100
    },
    {
      title: '审核人',
      dataIndex: 'verifyPerson',
      key: 'verifyPerson',
      width: 100
    },
    {
      title: '审核时间',
      dataIndex: 'verifyDate',
      key: 'verifyDate',
      width: 150,
      sorter: true,
      render: val => {
        if (val == null) {
          return <span></span>
        } else {
          return <span> {moment(val).format('YYYY-MM-DD')} </span>
        }
      }
    },
    {
      title: '审核情况',
      dataIndex: 'verifyMemo',
      key: 'verifyMemo',
      width: 100,
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      fixed: 'right',
      width: 95,
      render: (text, record) => {
        return [
          <span>
            <a onClick={() => showCheckBill(record.billId)} key="show">{"查看"}</a>
            <Divider type="vertical" />
            <a onClick={() => {
              RemoveForm(record.billId).then(res => {
                reload();
              })
            }} key="delete">删除</a>
          </span>
        ];
      },
    },
  ] as ColumnProps<any>[];
  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    getRowSelect(selectedRows);
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };


  return (
    <Page>
      <Table<any>
        className={styles.billingBillCheckTable}
        bordered={false}
        size="middle"
        columns={columns}
        dataSource={data}
        rowKey="billId"
        pagination={pagination}
        scroll={{ y: 500, x: 1400 }}
        loading={loading}
        onChange={onchange}
        rowSelection={rowSelection}
      />
    </Page>
  );
}

export default Form.create<BillCheckTableProps>()(BillCheckTable);
