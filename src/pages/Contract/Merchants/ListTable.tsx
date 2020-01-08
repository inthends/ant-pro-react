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
  detail(id: string): void;//查看 
  reload(): void;
  modify(id?: string): void;//修改 
};

function ListTable(props: ListTableProps) {
  const { onchange, loading, pagination, data, detail, reload, modify } = props;
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
      title: '客户名称',
      dataIndex: 'customer',
      key: 'customer',
      width: 200,
    },

    {
      title: '跟进人',
      dataIndex: 'follower',
      key: 'follower',
      width: 60,
    },

    {
      title: '来访时间',
      dataIndex: 'visitDate',
      key: 'visitDate',
      width: 100,
      render: val => moment(val).format('YYYY-MM-DD')
    },

    {
      title: '客户状态',
      dataIndex: 'status',
      align: 'center',
      key: 'status',
      width: 80,
      render: (text, record) => {
        switch (text) {
          case 1:
            return <Tag color="#e4aa4b">初次接触</Tag>;
          case 2:
            return <Tag color="#19d54e">潜在客户</Tag>;
          case 3:
            return <Tag color="#19d54e">意向客户</Tag>;
          case 4:
            return <Tag color="#19d54e">成交客户</Tag>;
          case 5:
            return <Tag color="#19d54e">流失客户</Tag>;
          default:
            return '';
        }
      }
    },
    {
      title: '渠道',
      dataIndex: 'visitChannel',
      key: 'visitChannel',
      width: 100
    },
    {
      title: '需求面积段',
      dataIndex: 'demandMinSize',
      key: 'demandMinSize',
      width: 100,
      render: (text, record) => {
        if (text)
          return text + '-' + record['demandMaxSize'] + '㎡';
        else
          return '';
      }
    },

    {
      title: '行业',
      dataIndex: 'industry',
      key: 'industry',
      width: 100
    },
    {
      title: '预计签约时间',
      dataIndex: 'signingDate',
      key: 'signingDate',
      width: 100,
      render: (text, record) => {
        if (text)
          return moment(text).format('YYYY-MM-DD');
        else
          return '';
      }
    },

    {
      title: '操作',
      align: 'center',
      dataIndex: 'operation',
      key: 'operation',
      width: 105,
      render: (text, record) => {
        return [
          <span key='span1'>
            <a onClick={() => modify(record.id)} key="modify">修改</a>
            <Divider type="vertical" key='spilt1' />
            <a onClick={() => detail(record.id)} key="detail">查看</a>
            <Divider type="vertical" key='spilt2' />
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
