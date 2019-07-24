//已收列表
import Page from '@/components/Common/Page';
import { InputNumber, Input, Select, Col, Row,  DatePicker,  Button, message, Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useState } from 'react';
import * as moment from 'moment'; 

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
}

function ChargeListTable(props: ChargeListTableProps) {
  const { onchange, loading, pagination, data, modify, reload } = props; 
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
      dataIndex: 'feeName',
      key: 'feeName',
      width: 140,
      sorter: true,
    },
    {
      title: '收款日期',
      dataIndex: 'amount',
      key: 'amount',
      width: 80,
      sorter: true,
    },
    {
      title: '房间编号',
      dataIndex: 'reductionAmount',
      key: 'reductionAmount',
      width: 80,
      sorter: true,
    },
    {
      title: '业户名称',
      dataIndex: 'offsetAmount',
      key: 'offsetAmount',
      width: 80,
      sorter: true,
    },
    {
      title: '收款人',
      dataIndex: 'lastAmount',
      key: 'lastAmount',
      width: 80,
      sorter: true,
    },
    {
      title: '收款金额',
      dataIndex: 'begindate',
      key: 'begindate',
      width: 85,
      render: val => <span> {moment(val).format('YYYY-MM-DD')} </span>
    }, {
      title: '收据编号',
      dataIndex: 'enddate',
      key: 'enddate',
      width: 85,
      render: val => <span> {moment(val).format('YYYY-MM-DD')} </span>
    }, {
      title: '审核日期',
      dataIndex: 'billDate',
      key: 'billDate',
      width: 85,
      render: val => <span> {moment(val).format('YYYY-MM-DD')} </span>
    }, {
      title: '审核人',
      dataIndex: 'allname',
      key: 'allname',
      width: 250
    }, 
    {
      title: '状态',
      dataIndex: 'statusName',
      key: 'statusName',
      width: 250
    }, 
    
    {
      title: '审核情况',
      dataIndex: 'verifyMemo',
      key: 'verifyMemo',
      width: 250
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
  ] as ColumnProps<any>;

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [sumEntity, setSumEntity] = useState();
  const [unitID, setUnitID] = useState();
  const [customerName, setCustomerName] = useState();

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    //应收金额
    var sumEntity = {};
    var sumAmount = 0, sumreductionAmount = 0, sumoffsetAmount = 0, sumlastAmount = 0;
    selectedRows.map(item => {
      sumAmount = selectedRows.reduce((sum, row) => { return sum + row.amount; }, 0);
      sumreductionAmount = selectedRows.reduce((sum, row) => { return sum + row.reductionAmount; }, 0);
      sumoffsetAmount = selectedRows.reduce((sum, row) => { return sum + row.offsetAmount; }, 0);
      sumlastAmount = selectedRows.reduce((sum, row) => { return sum + row.lastAmount; }, 0);
    });

    sumEntity['sumAmount'] = sumAmount.toFixed(2);
    sumEntity['sumreductionAmount'] = sumreductionAmount.toFixed(2);
    sumEntity['sumoffsetAmount'] = sumoffsetAmount.toFixed(2);
    sumEntity['sumlastAmount'] = sumlastAmount.toFixed(2);
    setSumEntity(sumEntity);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  //收款
  const charge = () => {
    form.validateFields((errors, values) => {
      if (!errors) {

        Modal.confirm({
          title: '请确认',
          content: `确定要执行收款操作吗？`,
          onOk: () => {
            const newData = { ...values, billDate: values.billDate.format('YYYY-MM-DD') };
            newData.unitID = 'HBL021404';//unitID
            newData.customerName = '徐英婕/徐凯';//customerName;
            Charge({ ...newData, ids: selectedRowKeys }).then(res => {
              message.success('保存成功');
            });
          }
        });
      }
    });
  };

  return (
    <Page> 
      <Table
        bordered={false}
        size="middle"
        dataSource={data}
        columns={columns}
        rowKey={record => record.billID}
        pagination={pagination}
        scroll={{ y: 500, x: 1800 }}
        onChange={(pagination: PaginationConfig, filters, sorter) =>
          changePage(pagination, filters, sorter)
        }
        loading={loading}
        rowSelection={rowSelection}
      />
    </Page>
  );
}

export default ChargeListTable; 
