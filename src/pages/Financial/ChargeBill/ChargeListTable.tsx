//已收列表
import Page from '@/components/Common/Page';
import { InputNumber, Input, Select, Col, Row,  DatePicker,  Button, message, Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useState } from 'react';
import  moment from 'moment';

import { RemoveForm, Charge } from './Main.service';
import styles from './style.less';
const { Option } = Select;

interface ChargeListTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  modify(id: string): void;
  reload(): void;
  getRowSelect(record):void;
}

function ChargeListTable(props: ChargeListTableProps) {
  const { onchange, loading, pagination, data, modify, reload ,getRowSelect} = props;
  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    onchange(pagination, filters, sorter);
  };
  const doDelete = record => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要删除${record.name}`,
      onOk: () => {
        RemoveForm(record.id).then(() => {
          message.success('保存成功');
          reload();
        });
      },
    });
  };
  const columns = [
    {
      title: '收款单编号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 150,
      sorter: true,
    },
    {
      title: '收款日期',
      dataIndex: 'billDate',
      key: 'billDate',
      width: 150,
      sorter: true,
      render: val => <span> {moment(val).format('YYYY-MM-DD')} </span>
    },
    {
      title: '房间编号',
      dataIndex: 'unitID',
      key: 'unitID',
      width: 150,
      sorter: true,
    },
    {
      title: '业户名称',
      dataIndex: 'offsetAmount',
      key: 'offsetAmount',
      width: 150,
      sorter: true,
    },
    {
      title: '收款人',
      dataIndex: 'createUserName',
      key: 'createUserName',
      width: 150,
      sorter: true,
    },
    {
      title: '收款金额',
      dataIndex: 'payAmount',
      key: 'payAmount',
      width: 150,
    }, {
      title: '收据编号',
      dataIndex: 'payCode',
      key: 'payCode',
      width: 150,
    }, {
      title: '审核日期',
      dataIndex: 'verifyDate',
      key: 'verifyDate',
      width: 150,
      render: val =>val==null||val==""?<span></span>: <span> {moment(val).format('YYYY-MM-DD')} </span>
    }, {
      title: '审核人',
      dataIndex: 'verifyPerson',
      key: 'verifyPerson',
      width: 150
    },
    {
      title: '状态',
      dataIndex: 'statusName',
      key: 'statusName',
      width: 150
    },

    {
      title: '审核情况',
      dataIndex: 'verifyMemo',
      key: 'verifyMemo',
      width: 150
    },

    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      width: 200
    }
  ] as ColumnProps<any>[];

  const [selectedRowKey, setSelectedRowKey] = useState([]);

  const  onRow=(record)=>{
    return {
      onClick: event => {
        setSelectedRowKey(record.billID);
        getRowSelect(record);
        console.log(record);
      }, // 点击行
      onDoubleClick: event => {

      },
      onContextMenu: event => {

      },
      onMouseEnter: event => {

      }, // 鼠标移入行
      onMouseLeave: event => {

      },
    };
  }

  const setClassName=(record,index)=>{
    if(record.billID === selectedRowKey)
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
  return (
    <Page >
      <Table
        className={styles.chargeListTable}
        bordered={false}
        size="middle"
        dataSource={data}
        columns={columns}
        rowKey={record => record.billID}
        pagination={pagination}
        scroll={{ y: 500, x: 2005 }}
        rowClassName={setClassName} //表格行点击高亮
        loading={loading}
        onRow={onRow}
        onChange={onchange}
      />
    </Page>
  );
}

export default ChargeListTable;
