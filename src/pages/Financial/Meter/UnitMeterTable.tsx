//装表列表
import Page from '@/components/Common/Page';
import { Form,  Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react'; 
import { WrappedFormUtils } from 'antd/lib/form/Form';
import {  } from './Meter.service'; 
interface UnitMeterTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  reload(): void;
  form: WrappedFormUtils;
}

function UnitMeterTable(props: UnitMeterTableProps) {
  const {   onchange, loading, pagination, data } = props;

  const columns = [
    {
      title: '费表类型',
      dataIndex: 'meterKind',
      key: 'meterKind',
      width: 200,
      sorter: true
    },
    {
      title: '费表种类',
      dataIndex: 'meterType',
      key: 'meterType',
      width: 200,
      sorter: true
    },
    {
      title: '费表编号',
      dataIndex: 'meterCode',
      key: 'meterCode',
      width: 200,
      sorter: true,
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
      width: 200,
      sorter: true,
    },
    {
      title: '量程',
      dataIndex: 'meterRange',
      key: 'meterRange',
      sorter: true,
      width: 200
    },
    {
      title: '所属机构',
      key: 'allName',
      dataIndex: 'allName',
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
        rowKey="unitmeterid"
        pagination={pagination}
        scroll={{ y: 500, x: 1400 }}
        loading={loading}
        onChange={onchange}
      />
    </Page>
  );
}
export default Form.create<UnitMeterTableProps>()(UnitMeterTable);

