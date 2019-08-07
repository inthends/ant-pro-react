//账单
import Page from '@/components/Common/Page';
import { InputNumber, Input, Select, Col, Row, Form, DatePicker, Card, Button, message, Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useState } from 'react';
import moment from 'moment';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import {  } from './Offset.service';
import styles from './style.less';
const { Option } = Select;

interface BillCheckTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  modify(id: string): void;
  reload(): void;
  form: WrappedFormUtils;
}

function BillCheckTable(props: BillCheckTableProps) {
  const { form, onchange, loading, pagination, data, modify, reload } = props;

  const columns = [
    {
      title: '单号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 80,
      sorter: true
    },
    {
      title: '单据日期',
      dataIndex: 'billDate',
      key: 'billDate',
      width: 80,
      sorter: true,
      render: val =>{
        if(val==null){
          return <span></span>
        }else{
          return <span> {moment(val).format('YYYY-MM-DD')} </span>
        }
      }
    },
    {
      title: '业户名称',
      dataIndex: 'custName',
      key: 'custName',
      width: 80,
      sorter: true,
      render: val =>{
        if(val==null){
          return <span></span>
        }else{
          return <span> {val} </span>
        }
      }
    },
    {
      title: '审核状态',
      dataIndex: 'ifVerifyName',
      key: 'ifVerifyName',
      width: 80,
      sorter: true,
      render: val =>{
        if(val==null){
          return <span></span>
        }else{
          return <span> {val} </span>
        }
      }
    },
    {
      title: '审核人',
      dataIndex: 'verifyPerson',
      key: 'verifyPerson',
      width: 85,
      sorter: true,
      render: val =>{
        if(val==null){
          return <span></span>
        }else{
          return <span> {val} </span>
        }
      }
    },
    {
      title: '审核日期',
      dataIndex: 'verifyDate',
      key: 'verifyDate',
      width: 85,
      render: val =>{
        if(val==null){
          return <span></span>
        }else{
          return <span> {moment(val).format('YYYY-MM-DD')} </span>
        }
      }
    },
    {
      title: '审核情况',
      dataIndex: 'verifyMemo',
      key: 'verifyMemo',
      width: 85,
      render: val =>{
        if(val==null){
          return <span></span>
        }else{
          return <span> {val} </span>
        }
      }
    },   {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      width: 85,
      render: val =>{
        if(val==null){
          return <span></span>
        }else{
          return <span> {val} </span>
        }
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      width: 340,
      render: (text, record) => {
        return [
          <Button
            type="primary"
            key="modify"
            style={{ marginRight: '10px' }}
            /*onClick={() => modify(record.billID)}*/
          >
            编辑
          </Button>,
            <Button
            type="primary"
            key="verify"
            style={{ marginRight: '10px' }}
            /*onClick={()=>showVerifyModel(record.billID,true)}*/
          >
            审核
          </Button>,
            <Button
            type="primary"
            key="unverify"
            style={{ marginRight: '10px' }}
            /*onClick={()=>showVerifyModel(record.billID,false)}*/
          >
            取消审核
          </Button>,
          <Button
            type="danger"
            key="delete"
            /*onClick={() => doDelete(record)}*/
          >
            删除
          </Button>,
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
        rowKey="billID"
        pagination={pagination}
        scroll={{ y: 500, x: 1800 }}
        loading={loading}
      />
    </Page>
  );
}

export default Form.create<BillCheckTableProps>()(BillCheckTable);
