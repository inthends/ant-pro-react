import Page from '@/components/Common/Page';
import { Divider, message, Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import { RemoveForm } from './Main.service';
import moment from 'moment';

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
      title: '费项名称',
      dataIndex: 'feename',
      key: 'feename',
      width: 140,
      sorter: true,
    },
    {
      title: '费项种类',
      dataIndex: 'feekind',
      key: 'feekind',
      width: 80,
      sorter: true,
    },
    {
      title: '费项类别',
      dataIndex: 'feetype',
      key: 'feetype',
      width: 80,
      sorter: true,
    },
    {
      title: '单价',
      dataIndex: 'feeprice',
      key: 'feeprice',
      width: 80,
      sorter: true,
    },
    {
      title: '计费周期',
      dataIndex: 'cyclevalue',
      key: 'cyclevalue',
      width: 80,
      sorter: true,
    },
    {
      title: '周期单位',
      dataIndex: 'cycletype',
      key: 'cycletype',
      width: 80,
      sorter: true,
    },
    {
      title: '计费起始日期',
      dataIndex: 'begindate',
      key: 'begindate',
      width: 85,
      render: val => <span> {moment(val).format('YYYY-MM-DD')} </span>
    }, {
      title: '计费终止日期',
      dataIndex: 'enddate',
      key: 'enddate',
      width: 85,
      render: val => <span> {moment(val).format('YYYY-MM-DD')} </span>
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align:'center',
      key: 'operation',
      width: 95,
      render: (text, record) => {
        return [
          // <Button
          //   type="primary"
          //   key="modify"
          //   style={{ marginRight: '10px' }}
          //   onClick={() => modify(record.feeitemid)}
          // >
          //   修改
          // </Button>,
          // <Button type="danger" key="delete" onClick={() => doDelete(record)}>
          //   删除
          // </Button>,

          <span>
            <a onClick={() => modify(record.feeitemid)} key="modify">修改</a>
            <Divider type="vertical" />
            <a onClick={() => doDelete(record)} key="delete">删除</a> 
          </span>
        ];
      },
    },
  ] as ColumnProps<any>[];

  return (
    <Page>
      <Table
        style={{ border: 'none' }}
        bordered={false}
        size="middle"
        dataSource={data}
        columns={columns}
        rowKey={record => record.feeitemid}
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

export default ListTable;
