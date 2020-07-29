//通知单
import Page from '@/components/Common/Page';
import {Tag, Modal, message, Divider, Form, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useState } from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { RemoveForm } from './Main.service';
import moment from 'moment';
import styles from './style.less';

interface ListTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  reload(): void;
  showCheckBill(id): void;
  form: WrappedFormUtils;
  getRowSelect(records): void;
}

function ListTable(props: ListTableProps) {
  const { onchange, loading, pagination, data, reload, showCheckBill, getRowSelect } = props;
  // const [selectedRowKey, setSelectedRowKey] = useState([]);

  const doDelete = (record) => {
    Modal.confirm({
      title: '请确认',
      content: `您确认要删除${record.billCode}吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        RemoveForm(record.billId).then(res => {
          message.success('删除成功');
          reload();
        })
      },
    });
  }

  const columns = [
    {
      title: '单号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 220,
      sorter: true,
      fixed:'left'
    },
    // {
    //   title: '单据类型',
    //   dataIndex: 'billType',
    //   key: 'billType',
    //   width: 100,
    //   sorter: true
    // }, 
    {
      title: '单据日期',
      dataIndex: 'createDate',
      key: 'createDate',
      width: 100,
      sorter: true,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: '缴费状态',
      dataIndex: 'isClear',
      key: 'isClear',
      width: 100,
      align: 'center',
      sorter: true,
      render: val => val ? <Tag color="#19d54e">已缴</Tag> : <Tag color="#e4aa5b">未缴</Tag>
    },
    // {
    //   title: '房产编号',
    //   dataIndex: 'unitCode',
    //   key: 'unitCode',
    //   width: 140,
    //   sorter: true,
    // },
    {
      title: '业户名称',
      dataIndex: 'custName',
      key: 'custName',
      width: 200,
      sorter: true,
    },
    {
      title: '账单金额',
      dataIndex: 'allAmount',
      key: 'allAmount', 
      width: 100
    },
    {
      title: '减免金额',
      dataIndex: 'reductionAmount',
      key: 'reductionAmount', 
      width: 100
    },
    {
      title: '冲抵金额',
      dataIndex: 'offsetAmount',
      key: 'offsetAmount', 
      width: 100
    },
    {
      title: '应收金额',
      dataIndex: 'lastAmount',
      key: 'lastAmount', 
      width: 100
    },
    {
      title: '审核状态',
      dataIndex: 'ifVerify',
      key: 'ifVerify',
      align: 'center',
      width: 100,
      render: val => val ? '已审核' : '未审核'
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
      width: 100, 
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },
    // {
    //   title: '审核情况',
    //   dataIndex: 'verifyMemo',
    //   key: 'verifyMemo',
    //   width: 100,
    // },
    // {
    //   title: '交房日期',
    //   dataIndex: 'handoverDate',
    //   key: 'handoverDate',
    //   width: 120, 
    //   render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    // },
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

        if (record.ifVerify == 1) {
          return [
            <span>
              <a onClick={() => showCheckBill(record.billId)} key="show">查看</a>
            </span>
          ];
        } else {
          return [
            <span>
              <a onClick={() => showCheckBill(record.billId)} key="show">查看</a>
              <Divider type="vertical" />
              <a onClick={() => doDelete(record)} key="delete">删除</a>
            </span>
          ];
        }
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
        scroll={{ y: 500, x: 1700 }}
        loading={loading}
        onChange={onchange}
        rowSelection={rowSelection}
      />
    </Page>
  );
}

export default Form.create<ListTableProps>()(ListTable);
