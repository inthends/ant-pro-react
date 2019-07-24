import Page from '@/components/Common/Page';
import { Button, message, Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import { RemoveForm } from './Main.service';
import * as moment from 'moment';

interface ListTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  modify(id: string): void;
  reload(): void;
}

function ListTable(props: ListTableProps) {
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
      title: '房号',
      dataIndex: 'no',
      key: 'no',
      width: 180,  
      render: (text, row, index) => {  
        var house=""; 
        for (var i = 0; i < row.houseList.length; i++) {
          house = house + row.houseList[i].structure + "，";
        }
        return house.slice(0, house.length - 1); 
      }
    },
 
    {
      title: '合同编号',
      dataIndex: 'no',
      key: 'no',
      width: 100, 
    },
  
    {
      title: '租客',
      dataIndex: 'customer',
      key: 'customer', 
      width: 150,
    },

    {
      title: '开始日',
      dataIndex: 'billingDate',
      key: 'billingDate', 
      width: 100,
      render: val => <span> {moment(val).format('YYYY-MM-DD')} </span>
    },
    {
      title: '合同状态',
      dataIndex: 'state',
      key: 'state', 
      width: 100,
    },
    {
      title: '退租日',
      dataIndex: 'contractEndDate',
      key: 'contractEndDate', 
      width: 100,
      render: val => <span> {moment(val).format('YYYY-MM-DD')} </span>
    },

    {
      title: '总计租金',
      dataIndex: 'leasesize',
      key: 'leasesize', 
      width: 100,
    },

    {
      title: '签订日',
      dataIndex: 'contractStartDate',
      key: 'contractStartDate', 
      width: 100,
      render: val => <span> {moment(val).format('YYYY-MM-DD')} </span>
    },


    {
      title: '租赁数(㎡)',
      dataIndex: 'leaseSize',
      key: 'leaseSize', 
      width: 100,
    },

    {
      title: '租赁数押金',
      dataIndex: 'leaseSize',
      key: 'leaseSize', 
      width: 100,
    },

    {
      title: '租赁条款单价',
      dataIndex: 'leaseSize',
      key: 'leaseSize', 
      width: 100,
    },

    {
      title: '是否续租',
      dataIndex: 'leaseSize',
      key: 'leaseSize', 
      width: 100,
    },

    {
      title: '签订人',
      dataIndex: 'leaseSize',
      key: 'leaseSize', 
      width: 100,
    },

    {
      title: '跟进人',
      dataIndex: 'follower',
      key: 'follower',
      width: 100,
    },
 

    {
      title: '法人',
      dataIndex: 'follower',
      key: 'follower',
      width: 100,
    },

    {
      title: '行业',
      dataIndex: 'follower',
      key: 'follower',
      width: 120,
    },
 
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 155, 
      fixed:'right',
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
  return (
    <Page>
      <Table
        style={{ border: 'none' }}
        bordered={false}
        size="middle"
        dataSource={data}
        columns={columns}
        rowKey={record => record.id}
        pagination={pagination}
        scroll={{ y: 500,x:1900 }}
        onChange={(pagination: PaginationConfig, filters, sorter) =>
          changePage(pagination, filters, sorter)
        }
        loading={loading}
      />
    </Page>
  );
}

export default ListTable;
