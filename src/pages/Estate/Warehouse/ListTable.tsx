import Page from '@/components/Common/Page';
import { Divider, Tag, message, Modal, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import moment from 'moment';
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
      content: `您是否要删除${record.billCode}吗`,
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
      title: '业务类型',
      dataIndex: 'billType',
      key: 'billType',
      width: 100,
      sorter: true,
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 100,
      sorter: true,
    },
    {
      title: '单据状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      sorter: true,
      render: (text, record) => {
        switch (text) {
          case 1:
            return <Tag color="#e4aa5b">待处理</Tag>;
          case 2:
            return <Tag color="#19d54e">待完成</Tag>;
          case 3:
            return <Tag color="#5FB878">待评价</Tag>;
          case 4:
            return <Tag color="#009688">已评价</Tag>;
          default:
            return '';
        }
      }
    },
    {
      title: '单据编号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 150,
      sorter: true,
    },
    {
      title: '单据日期',
      dataIndex: 'billDate',
      key: 'billDate',
      width: 120,
      sorter: true,
      render: val => <span> {moment(val).format('YYYY-MM-DD')} </span>
    },
    {
      title: '联系地点',
      dataIndex: 'address',
      key: 'address',
      width: 200,
      sorter: true,
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
      key: 'contactName',
      width: 100,
      sorter: true,
    },
    {
      title: '联系方式',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      width: 100,
      sorter: true,
    },
    {
      title: '是否回复',
      dataIndex: 'isApply',
      key: 'isApply',
      width: 100,
      render: (text, record) => {
        if (text == 0)
          return <Tag color="#e4aa5b">未回复</Tag>;
        else
          return <Tag color="#009688">已回复</Tag>;
      }
    },
    {
      title: '关联单号',
      dataIndex: 'businessCode',
      key: 'businessCode',
      width: 150,
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 95,
      fixed: 'right',
      render: (text, record) => {
        //新增
        if (record.status == 1) {
          return [
            //   <Button
            //     type="primary"
            //     key="modify"
            //     style={{ marginRight: '10px' }}
            //     onClick={() => modify(record)}
            //   > 修改  </Button>,
            //   <Button type="danger" key="delete" onClick={() => doDelete(record)}>
            //     删除
            // </Button>,
            <span>
              <a onClick={() => modify(record)} key="modify">修改</a>
              <Divider type="vertical" />
              <a onClick={() => doDelete(record)} key="delete">删除</a>
            </span>
          ];
        } else {

          return [
            //   <Button
            //     type="primary"
            //     key="modify"
            //     style={{ marginRight: '10px' }}
            //     onClick={() => modify(record)}
            //   >
            //     查看
            // </Button>,
            //   <Button type="danger" key="delete" disabled={true} >
            //     删除
            // </Button>, 
            <a onClick={() => modify(record)} key="modify">查看</a>
          ];
        }
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
        rowKey={record => record.id}
        pagination={pagination}
        scroll={{ x: 1500 }}
        onChange={(pag: PaginationConfig, filters, sorter) => changePage(pag, filters, sorter)}
        loading={loading}
      />
    </Page>
  );
}

export default ListTable;
