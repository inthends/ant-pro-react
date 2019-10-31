//付款单列表

import Page from '@/components/Common/Page';
import { Modal, Divider, Form, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useState } from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { InvalidForm } from './Payment.service';
import moment from 'moment';
import styles from './style.less';

interface PaymentTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  reload(): void;
  showBill(id?): void;
  form: WrappedFormUtils;
  getRowSelect(record): void;
  showVerify(id?): void;
}

function PaymentTable(props: PaymentTableProps) {
  const { onchange, loading, pagination, data, reload, showBill, getRowSelect, showVerify } = props;
  const [selectedRowKey, setSelectedRowKey] = useState([]);
  const columns = [
    {
      title: '付款单编号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 150,
      sorter: true,
    },
    {
      title: '付款日期',
      dataIndex: 'billDate',
      key: 'billDate',
      width: 120,
      sorter: true,
      render: val => {
        if (val == null) {
          return ''
        } else {
          return moment(val).format('YYYY-MM-DD');
        }
      }
    },
    {
      title: '经办人',
      dataIndex: 'createUserName',
      key: 'createUserName',
      width: 80,
      sorter: true,

    },
    {
      title: '金额',
      dataIndex: 'payAmount',
      key: 'payAmount',
      width: 100
    },
    {
      title: '审核日期',
      dataIndex: 'verifyDate',
      key: 'verifyDate',
      width: 120,
      render: val => {
        if (val == null) {
          return ''
        } else {
          return moment(val).format('YYYY-MM-DD');
        }
      }
    },
    {
      title: '审核人',
      dataIndex: 'verifyPerson',
      key: 'verifyPerson',
      width: 80
    },
    {
      title: '状态',
      dataIndex: 'statusName',
      key: 'statusName',
      width: 80,
      sorter: true
    },
    {
      title: '审核情况',
      dataIndex: 'verifyMemo',
      key: 'verifyMemo',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 150,
      render: (text, record) => {
        return [
          <span>
            <a onClick={() => showBill(record.billId)} key="modify">{"查看"}</a>
            <Divider type="vertical" /> 
            {record.status == 0 ? <a onClick={() => showVerify(record.billId)} key="app">审核</a> :
              <a onClick={() => showVerify(record.billId)} key="unapp"  >反审</a>
            }
            <Divider type="vertical" /> 
            <a onClick={() => {
              Modal.confirm({
                title: '请确认',
                content: `您是否要作废${record.billCode}`,
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                  InvalidForm(record.billId).then(res => {
                    if (res.code != 0) { reload(); }
                  });
                }
              });
            }} key="delete">作废</a>
          </span>
        ];
      },
    },
  ] as ColumnProps<any>[];

  // const editAndDelete = (key: string, currentItem: any) => {
  //   if (key === 'edit') {
  //     //this.showEditModal(currentItem);
  //   }
  //   else if (key === 'delete') {
  //     Modal.confirm({
  //       title: '删除任务',
  //       content: '确定删除该任务吗？',
  //       okText: '确认',
  //       cancelText: '取消',
  //       //onOk: () => this.deleteItem(currentItem.id),
  //     });
  //   }
  // };


  const setClassName = (record, index) => {
    if (record.billId === selectedRowKey) {
      return styles.rowSelect;
    } else {
      if (record.status == 3) {
        return styles.rowFlush
      } else {
        return '';
      }
    }
  }
  const onRow = (record) => {
    return {
      onClick: event => {
        setSelectedRowKey(record.billId);
        getRowSelect(record);
      }
    };
  }

  return (
    <Page>
      <Table<any>
        className={styles.billingPaymentTable}
        bordered={false}
        size="middle"
        columns={columns}
        dataSource={data}
        rowKey="billId"
        pagination={pagination}
        scroll={{ y: 500 }}
        loading={loading}
        onChange={onchange}
        rowClassName={setClassName} //表格行点击高亮
        onRow={onRow}
      />
    </Page>
  );
}

export default Form.create<PaymentTableProps>()(PaymentTable);

