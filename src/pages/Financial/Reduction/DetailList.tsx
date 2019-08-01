import Page from '@/components/Common/Page';
import { InputNumber, Input, Select, Col, Row, Form, DatePicker, Card, Button, message, Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useState } from 'react';
import  moment from 'moment';
import { WrappedFormUtils } from 'antd/lib/form/Form';


import { RemoveForm } from './Main.service';
import styles from './style.less';
const { Option } = Select;

interface DetailListProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  modify(id: string): void;
  reload(): void;
  form: WrappedFormUtils;
}

function DetailList(props: DetailListProps) {
  const { form, onchange, loading, pagination, data, modify, reload } = props;
  const { getFieldDecorator } = form;
  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    onchange(pagination, filters, sorter);
  };

  const columns = [
    {
      title: '单元编号',
      dataIndex: 'billID',
      key: 'billID',
      width: 80,
      sorter: true,
    },
    {
      title: '收费项目',
      dataIndex: 'feeName ',
      key: 'feeName ',
      width: 80,
      sorter: true
    },
    {
      title: '应收时间',
      dataIndex: 'period',
      key: 'period',
      width: 80,
      sorter: true,
      render: val =>{
        if(val==null){
          return <span></span>
        }else{
          return <span> {moment(val).format('YYYY年MM月')} </span>
        }
      }
    },
    {
      title: '计费起始日期',
      dataIndex: 'beginDate',
      key: 'beginDate',
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
      title: '计费终止日期',
      dataIndex: 'endDate',
      key: 'endDate',
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
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 85,
      sorter: true,
    }, {
      title: '减免金额',
      dataIndex: 'reductionAmount',
      key: 'reductionAmount',
      width: 85
    }, {
      title: '减免后金额',
      dataIndex: 'lastAmount',
      key: 'lastAmount',
      width: 85
    }, {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      width: 85
    }
  ] as ColumnProps<any>;

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);

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

  return (
    <Page>
      <Table
        bordered={false}
        size="middle"
        dataSource={data}
        columns={columns}
        rowKey={record => record.unitID}
        pagination={pagination}
        scroll={{ y: 500, x: 1800 }}
        onChange={(pagination: PaginationConfig, filters, sorter) =>
          changePage(pagination, filters, sorter)
        }
        loading={loading}
      />
    </Page>
  );
}

export default Form.create<DetailListProps>()(DetailList);
