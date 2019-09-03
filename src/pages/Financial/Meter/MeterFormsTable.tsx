//抄表列表
import Page from '@/components/Common/Page';
import {  Form,  Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React  from 'react'; 
import { WrappedFormUtils } from 'antd/lib/form/Form'; 

interface MeterFormsTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  reload(): void;
  form: WrappedFormUtils;
}

function MeterFormsTable(props: MeterFormsTableProps) {
  const {  onchange, loading, pagination, data  } = props;
  debugger
  const columns = [
    {
      title: '单号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 150,
      sorter: true
    },
    {
      title: '抄表期间',
      dataIndex: 'meterDate',
      key: 'meterDate',
      width: 200,
      sorter: true
    },
    {
      title: '表编号',
      dataIndex: 'meterCode',
      key: 'meterCode',
      width: 200,
      sorter: true,
    },
    {
      title: '表名称',
      dataIndex: 'meterName',
      key: 'meterName',
      width: 200,
      sorter: true,
    },
    {
      title: '上次读数',
      dataIndex: 'lastReading',
      key: 'lastReading',
      width: 200,
      sorter: true,
    },
    {
      title: '本次读数',
      dataIndex: 'nowReading',
      key: 'nowReading',
      sorter: true,
      width: 200
    },
    {
      title: '倍率',
      dataIndex: 'meterZoom',
      sorter: true,
      key: 'meterZoom',
      width: 200
    }, {
      title: '金额',
      dataIndex: 'meterPrice',
      key: 'meterPrice',
      sorter: true,
      width: 200,
      render: val =>{
        return <span>{val}元/度</span>
      }
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      sorter: true,
      width: 200
    },
    {
      title: '安装位置',
      dataIndex: 'allName',
      key: 'allName',
      sorter: true,
      width: 200
    }
  ] as ColumnProps<any>[];
  return (
    <Page>
      <Table<any>
        bordered={false}
        size="middle"
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={pagination}
        scroll={{ y: 500, x: 2000 }}
        loading={loading}
        onChange={onchange}
      />
    </Page>
  );
}
export default Form.create<MeterFormsTableProps>()(MeterFormsTable);

