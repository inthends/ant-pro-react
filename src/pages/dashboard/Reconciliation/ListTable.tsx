//对账单
import Page from '@/components/Common/Page';
import {  Form, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form'; 

interface ListTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[]; 
  form: WrappedFormUtils;
}

function ListTable(props: ListTableProps) {
  const { onchange, loading, pagination, data  } = props;

  const columns = [
    {
      title: '费表类型',
      dataIndex: 'meterKind',
      key: 'meterKind',
      width: 100,
      sorter: true
    },
    {
      title: '费表种类',
      dataIndex: 'meterType',
      key: 'meterType',
      width: 100,
      sorter: true
    },
    {
      title: '费表名称',
      dataIndex: 'meterName',
      key: 'meterName',
      width: 200,
      sorter: true,
    },
    {
      title: '倍率',
      dataIndex: 'meterZoom',
      key: 'meterZoom',
      width: 80,
      sorter: true,
    },
    {
      title: '量程',
      dataIndex: 'meterRange',
      key: 'meterRange',
      width: 80,
      sorter: true,
    },
    {
      title: '关联收费项目',
      dataIndex: 'feeItemname',
      key: 'feeItemname',
      sorter: true,
      width: 150
    },
    {
      title: '所属机构',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: true
    }
    
  ] as ColumnProps<any>[];

  return (
    <Page>
      <Table<any>
        bordered={false}
        size="middle"
        columns={columns}
        dataSource={data}
        rowKey="meterid"
        pagination={pagination}
        scroll={{ y: 500  }}
        loading={loading}
        onChange={onchange}
      />
    </Page>
  );
}

export default Form.create<ListTableProps>()(ListTable);

