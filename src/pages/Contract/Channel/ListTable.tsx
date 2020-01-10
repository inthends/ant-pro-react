import Page from '@/components/Common/Page';
import { Tag, Divider, message, Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import { RemoveForm } from './Main.service';
import moment from 'moment';

interface ListTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  reload(): void;
  modify(id?: string): void;//修改 
};

function ListTable(props: ListTableProps) {
  const { onchange, loading, pagination, data, reload, modify } = props;
  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    onchange(pagination, filters, sorter);
  };
  const doDelete = record => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要作废${record.name}？`,
      onOk: () => {
        RemoveForm(record.id).then(() => {
          message.success('作废成功');
          reload();
        });
      },
    });
  };

  const columns = [
    {
      title: '联系人',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },

    {
      title: '联系方式',
      dataIndex: 'telephone',
      key: 'telephone',
      width: 100,
    },

    {
      title: '公司',
      dataIndex: 'company',
      key: 'company',
      width: 100,
    },

    {
      title: '商圈',
      dataIndex: 'tradingArea', 
      key: 'tradingArea',
      width: 100,
    },
    {
      title: '渠道类型',
      dataIndex: 'channelType',
      key: 'channelType',
      width: 100
    },
    // {
    //   title: '带看量',
    //   dataIndex: 'demandMinSize',
    //   key: 'demandMinSize',
    //   width: 100,
    // },
    // {
    //   title: '最新带看时间',
    //   dataIndex: 'visitDate',
    //   key: 'visitDate',
    //   width: 100,
    //   render: val => moment(val).format('YYYY-MM-DD')
    // }, 
    {
      title: '操作',
      align: 'center',
      dataIndex: 'operation',
      key: 'operation',
      width: 95,
      render: (text, record) => {
        return [
          <span key='span1'>
            <a onClick={() => modify(record.id)} key="modify">修改</a>
            <Divider type="vertical" key='spilt1' />
            <a onClick={() => doDelete(record)} key="delete">删除</a>
          </span>
        ];
      },
    },
  ] as ColumnProps<any>[];
  return (
    <Page>
      <Table
        key='listTable'
        style={{ border: 'none' }}
        bordered={false}
        size="middle"
        dataSource={data}
        columns={columns}
        rowKey={record => record.id}
        pagination={pagination}
        scroll={{ y: 500 }}
        onChange={(pagination: PaginationConfig, filters, sorter) =>
          changePage(pagination, filters, sorter)
        }
        loading={loading}
      />
    </Page>
  );
}

export default ListTable;
