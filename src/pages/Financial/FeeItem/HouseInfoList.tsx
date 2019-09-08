import Page from '@/components/Common/Page';
import { Divider, message, Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import { RemoveForm } from './Main.service';
import moment from 'moment';

interface HouseInfoListProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  reload(): void;
}

function HouseInfoList(props: HouseInfoListProps) {
  const { onchange, loading, pagination, data } = props;
  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    onchange(pagination, filters, sorter);
  };

  const columns = [
    {
      title: '房屋编号',
      dataIndex: 'code',
      key: 'code',
      width: 140,
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      width: 80,
      sorter: true,
    },
    {
      title: '收费项目',
      dataIndex: 'feeName',
      key: 'feeName',
      width: 80,
      sorter: true,
    },
    {
      title: '单价',
      dataIndex: 'feePrice',
      key: 'feePrice',
      width: 80,
      sorter: true,
    },
    {
      title: '计费周期',
      dataIndex: 'cycleValue',
      key: 'cycleValue',
      width: 80,
      sorter: true,
    },
    {
      title: '周期单位',
      dataIndex: 'cycleType',
      key: 'cycleType',
      width: 80,
      sorter: true,
    },
    {
      title: '计费起始日期',
      dataIndex: 'beginDate',
      key: 'beginDate',
      width: 85,
      render: val =>{
        if(val==null){
          return <span></span>
        }else{
          return <span> {moment(val).format('YYYY-MM-DD')} </span>
        }
      }
    }, {
      title: '计费终止日期',
      dataIndex: 'endDate',
      key: 'endDate',
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
      title: '房屋全称',
      dataIndex: 'allName',
      key: 'allName',
      width: 120,
      sorter: true,
    },
  ] as ColumnProps<any>[];

  return (
    <Page>
      <Table
        key='list'
        style={{ border: 'none' }}
        bordered={false}
        size="middle"
        dataSource={data}
        columns={columns}
        rowKey={record => record.feeItemId}
        pagination={pagination}
        scroll={{ y: 420 }}
        onChange={(pagination: PaginationConfig, filters, sorter) =>
          changePage(pagination, filters, sorter)
        }
        loading={loading}
      />
    </Page>
  );
}
export default HouseInfoList;