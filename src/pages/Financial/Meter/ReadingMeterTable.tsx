//抄表单列表
import Page from '@/components/Common/Page';
import { Modal, Form, message, Table, Divider } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useState } from 'react';
import moment from 'moment';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { RemoveReadForm } from './Meter.service';
import styles from './style.less';

interface ReadingMeterTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  reload(): void;
  form: WrappedFormUtils;
  showModify(id?): any;
  getRowSelect(record): void;

  showVertify(id: string, ifVertify: boolean): void;
}

function ReadingMeterTable(props: ReadingMeterTableProps) {
  const { showVertify , onchange, loading, pagination, data, reload, showModify, getRowSelect } = props;

  const doDelete = record => {
    Modal.confirm({
      title: '请确认',
      content: `您确认要删除${record.billCode}吗？`,
      onOk: () => {
        RemoveReadForm(record.billId)
          .then(() => {
            message.success('删除成功');
            reload();
          })
          .catch(e => { });
      },
    });
  };

  const columns = [
    {
      title: '抄表单号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 180,
      sorter: true
    },
    {
      title: '抄表期间',
      dataIndex: 'meterCode',
      key: 'meterCode',
      width: 100,
      sorter: true
    },
    {
      title: '抄表人',
      dataIndex: 'meterReader',
      key: 'meterReader',
      width: 80,
      sorter: true,
    },
    {
      title: '抄表日期',
      dataIndex: 'readDate',
      key: 'readDate',
      width: 100,
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
      title: '单元金额合计',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      sorter: true,
    },
    {
      title: '单元用量',
      dataIndex: 'total',
      key: 'total',
      sorter: true,
      width: 100
    },
    {
      title: '公共用量',
      dataIndex: 'publicTotal',
      sorter: true,
      key: 'publicTotal',
      width: 100
    },
    {
      title: '审核状态',
      dataIndex: 'isverifyName',
      key: 'isverifyName', 
      width: 100
    },
    {
      title: '审核人',
      dataIndex: 'verifyPerson',
      key: 'verifyPerson', 
      width: 80
    },
    {
      title: '审核日期',
      dataIndex: 'verifyDate',
      key: 'verifyDate', 
      width: 100,
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
      width: 100
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
      fixed: 'right',
      width: 150,
      render: (text, record) => {
        return [
          <span>
            <a onClick={() => { showModify(record.billId) }} key="modify">修改</a>
            <Divider type="vertical" />
            {record.ifVerify==0 ? <a onClick={() => showVertify(record.billId, false)} key="delete">审核</a> : <a onClick={() => showVertify(record.billId, true)} key="delete">反审</a>}
            <Divider type="vertical" />  
            {/* <a onClick={() => {
            RemoveReadForm(record.billId).then(res => {
              if (res.code != 0) { reload(); message.success('删除成功');}
            });
          }} key="delete">删除</a> */} 
            <a onClick={() => doDelete(record)} key="delete">删除</a> 
          </span>
        ];
      }
    }
  ] as ColumnProps<any>[];

  const [selectedRowKey, setSelectedRowKey] = useState([]);
  const setClassName = (record, index) => {
    if (record.billid === selectedRowKey) {
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
        setSelectedRowKey(record.billid);
        getRowSelect(record);
      }
    };
  }

  return (
    <Page>
      <Table<any>
        className={styles.readingMeterTable}
        bordered={false}
        size="middle"
        columns={columns}
        dataSource={data}
        rowKey="billid"
        pagination={pagination}
        scroll={{ y: 500, x: 1400 }}
        loading={loading}
        onChange={onchange}
        rowClassName={setClassName} //表格行点击高亮
        onRow={onRow}
      />
    </Page>
  );
}

export default Form.create<ReadingMeterTableProps>()(ReadingMeterTable);

