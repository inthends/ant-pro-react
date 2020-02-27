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
  const columns = [
    {
      title: '抄表单号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 180,
      sorter: true
    },
    {
      title: '抄表年月',
      dataIndex: 'belongDate',
      key: 'belongDate',
      width: 100,
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
      width: 120,
      sorter: true,
    },
    {
      title: '上次读数',
      dataIndex: 'lastReading',
      key: 'lastReading',
      width: 100,
      sorter: true,
    },
    {
      title: '本次读数',
      dataIndex: 'nowReading',
      key: 'nowReading',
      sorter: true,
      width: 100
    },
    {
      title: '倍率',
      dataIndex: 'meterZoom',
      sorter: true,
      key: 'meterZoom',
      width: 100
    }, {
      title: '单价',
      dataIndex: 'meterPrice',
      key: 'meterPrice',
      sorter: true,
      width: 100,
      render: val =>{
        return <span>{val}元/度</span>
      }
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      sorter: true,
      width: 100
    },
    {
      title: '安装位置',
      dataIndex: 'allName',
      key: 'allName', 
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
        scroll={{ y: 500, x: 1300 }}
        loading={loading}
        onChange={onchange}
      />
    </Page>
  );
}
export default Form.create<MeterFormsTableProps>()(MeterFormsTable);

