//费表列表
import Page from '@/components/Common/Page';
import { Divider, Form, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { RemoveForm } from './Meter.service';

interface MeterTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  reload(): void;
  showModify(id?): void;
  form: WrappedFormUtils;
}

function MeterTable(props: MeterTableProps) {
  const { onchange, loading, pagination, data, reload, showModify } = props;

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
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align:'center',
      width: 95,
      render: (text, record) => {
        return [
          // <Button
          //   type="primary"
          //   key="modify"
          //   style={{ marginRight: '10px' }}
          //   onClick={() => {
          //     showModify(record.meterid);
          //   }}
          // >
          //   编辑
          // </Button>,
          // <Button
          //   type="danger"
          //   key="delete"
          //   onClick={() => {
          //     Modal.confirm({
          //       title: '请确认',
          //       content: `您是否确定删除？`,
          //       onOk: () => {
          //         RemoveForm(record.meterid).then(res => {
          //           if (res.code != 0) {
          //             reload();
          //           }
          //         })
          //       },
          //     });
          //   }}
          // >
          //   删除
          // </Button>

          <span>
            <a onClick={() => showModify(record.meterID)} key="modify">修改</a>
            <Divider type="vertical" />
            <a onClick={() => {
              RemoveForm(record.meterID).then(res => {
                if (res.code != 0) { reload(); }
              })

            }} key="delete">删除</a>
          </span>

        ];
      },
    },
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

export default Form.create<MeterTableProps>()(MeterTable);

