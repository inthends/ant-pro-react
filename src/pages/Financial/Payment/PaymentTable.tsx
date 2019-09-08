//付款单列表

import Page from '@/components/Common/Page';
import { Divider, Form, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React,{ useState } from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { RemoveForm,InvalidForm } from './Payment.service';
import  moment from 'moment';
import styles from './style.less';

interface PaymentTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  reload(): void;
  showModify(id?,isedit?): void;
  form: WrappedFormUtils;
  getRowSelect(record):void;
}

function PaymentTable(props: PaymentTableProps) {
  const { onchange, loading, pagination, data, reload, showModify,getRowSelect } = props;
  const [selectedRowKey, setSelectedRowKey] = useState([]);
  const columns = [
    {
      title: '单据类型',
      dataIndex: 'billType',
      key: 'billType',
      width: 150,
      sorter: true
    },{
      title: '单号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 150,
      sorter: true
    },
    {
      title: '账单日',
      dataIndex: 'createDate',
      key: 'createDate',
      width: 150,
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
      title: '房间编号',
      dataIndex: 'unitId',
      key: 'unitId',
      width: 150,
      sorter: true,
    },
    {
      title: '业户名称',
      dataIndex: 'custName',
      key: 'custName',
      width: 150,
      sorter: true,
    },
    {
      title: '交房日期',
      dataIndex: 'handoverDate',
      key: 'handoverDate',
      width: 150,
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
      title: '计费金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 150
    },
    {
      title: '审核状态',
      dataIndex: 'ifVerifyName',
      key: 'ifVerifyName',
      width: 150
    },
    {
      title: '审核人',
      dataIndex: 'verifyPerson',
      key: 'verifyPerson',
      width: 200
    },
    {
      title: '审核时间',
      dataIndex: 'verifyDate',
      key: 'verifyDate',
      width: 150,
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
      title: '审核情况',
      dataIndex: 'verifyMemo',
      key: 'verifyMemo',
      width: 200,
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align:'center',
      width: 95,
      render: (text, record) => {
        return [
          <span>
            <a onClick={() => showModify(record.billId,false)} key="modify">{"查看"}</a>
            <Divider type="vertical" />
            <a onClick={() =>{}} key="vertify">{record.ifVerifyName=="已审核"?"取消审核":"审核"}</a>
            <Divider type="vertical" />
            <a onClick={() => {
              InvalidForm(record.billId).then(res => {
                if (res.code != 0) { reload(); }
              })
            }} key="delete">作废</a>
          </span>
        ];
      },
    },
  ] as ColumnProps<any>[];

  const setClassName=(record,index)=>{
    if(record.billId === selectedRowKey)
    {
      return  styles.rowSelect ;
    }else{
      if(record.status==3)
      {
        return styles.rowFlush
      }else{
        return '';
      }
    }
  }
  const onRow=(record)=>{
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
        scroll={{ y: 500  }}
        loading={loading}
        onChange={onchange}
        rowClassName={setClassName} //表格行点击高亮
        onRow={onRow}
      />
    </Page>
  );
}

export default Form.create<PaymentTableProps>()(PaymentTable);

