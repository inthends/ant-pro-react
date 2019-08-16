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
  rowSelect(status:number):void;
}

function ChargeListTable(props: ChargeListTableProps) {
  const { onchange, loading, pagination, data, modify, reload,rowSelect } = props;
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
      dataIndex: 'organizeId',
      key: 'organizeId',
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
      render: val => <span> {moment(val).format('YYYY-MM-DD')} </span>
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
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      width: 155,
      render: (text, record) => {
        return [
          <Button
            type="primary"
            key="modify"
            style={{ marginRight: '10px' }}
            onClick={() => modify(record.id)}
          >
            修改
          </Button>,
          <Button type="danger" key="delete" onClick={() => doDelete(record)}>
            删除
          </Button>,
        ];
      },
    },
  ] as ColumnProps<any>[];

  const [selectedRowKey, setSelectedRowKey] = useState([]);

  const [sumEntity, setSumEntity] = useState();
  const [unitID, setUnitID] = useState();
  const [customerName, setCustomerName] = useState();

  const  onRow=(record)=>{
    return {
      onClick: event => {
        setSelectedRowKey(record.billID);
        rowSelect(record.status)
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
    //record代表表格行的内容，index代表行索引
    //判断索引相等时添加行的高亮样式
    return record.billID === selectedRowKey? styles.rowSelect : "";
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
      />
    </Page>
  );
}

export default ChargeListTable;
