import Page from '@/components/Common/Page';
import { Tag, Divider, message, Modal, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import { RemoveForm } from './Main.service';

interface ListTableProps {
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  onchange(page: any, filter: any, sort: any): any;
  modify(data: any): void;
  reload(): void;
}

function ListTable(props: ListTableProps) {
  const { onchange, loading, pagination, data, modify, reload } = props;
  const changePage = (pag: PaginationConfig, filters, sorter) => {
    onchange(pag, filters, sorter);
  };
  const doDelete = record => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要删除${record.title}吗`,
      onOk: () => {
        RemoveForm(record.id)
          .then(() => {
            message.success('删除成功');
            reload();
          })
          .catch(e => { });
      },
    });
  };
  const columns = [
    {
      title: '管理处名称',
      dataIndex: 'type',
      key: 'type',
      width: 60,
    },
    {
      title: '楼盘名称',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: '楼栋名称',
      dataIndex: 'estateName',
      key: 'estateName',
      width: 300,
    },
    {
      title: '房屋名称',
      dataIndex: 'clickCounts',
      key: 'clickCounts',
    },
    {
      title: '订单编号',
      dataIndex: 'isPublish',
      key: 'isPublish', 
    },
    {
      title: '订单日期',
      dataIndex: 'createUserName',
      key: 'createUserName'
    },
    {
      title: '订单来源',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true
    },

    {
      title: '订单状态',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true
    },


    {
      title: '订单金额',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true
    },

    {
      title: '收款单编号',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true
    },

    {
      title: '收款单日期',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true
    },


    {
      title: '收款方式',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true
    },

    {
      title: '收款金额',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true
    },

    //动态费项统计列

  ] as ColumnProps<any>[];
  return (
    <Page>
      <Table
        style={{ border: 'none' }}
        bordered={false}
        size="middle"
        dataSource={data}
        columns={columns}
        rowKey={record => record.id}
        pagination={pagination}
        onChange={(pag: PaginationConfig, filters, sorter) => changePage(pag, filters, sorter)}
        loading={loading}
      />
    </Page>
  );
}
export default ListTable;
