import Page from '@/components/Common/Page';
import { Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react'; 
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
      width: 120,
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
      width: 100,
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
      width: 70, 
    },
    {
      title: '周期单位',
      dataIndex: 'cycleType',
      key: 'cycleType',
      width: 70, 
    },
    {
      title: '计费起始日期',
      dataIndex: 'beginDate',
      key: 'beginDate',
      width: 85,
      render: val =>{
        if(val==null){
          return ''
        }else{
          return  moment(val).format('YYYY-MM-DD');
        }
      }
    }, {
      title: '计费终止日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 85,
      render: val =>{
        if(val==null){
          return ''
        }else{
          return  moment(val).format('YYYY-MM-DD');
        }
      }
    },
    {
      title: '房屋全称',
      dataIndex: 'allName',
      key: 'allName',
      width: 180, 
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
