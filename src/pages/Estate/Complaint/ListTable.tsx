import Page from '@/components/Common/Page';
import { Tag, Divider, message, Modal, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import moment from 'moment';
import { InvalidForm } from './Main.service';

interface ListTableProps {
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  onchange(page: any, filter: any, sort: any): any;
  modify(data: any): void;
  show(data: any): void;
  reload(): void;
}

function ListTable(props: ListTableProps) {
  const { onchange, loading, pagination, data, modify, reload, show } = props;
  const changePage = (pag: PaginationConfig, filters, sorter) => {
    onchange(pag, filters, sorter);
  };
  const doInvalid = record => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要作废${record.billCode}吗？`,
      onOk: () => {
        InvalidForm(record.id)
          .then(() => {
            message.success('作废成功');
            reload();
          })
          .catch(e => { });
      },
    });
  };
  const columns = [
    {
      title: '投诉单号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 220,
      sorter: true,
    },
    {
      title: '来源',
      dataIndex: 'sourceType',
      key: 'sourceType',
      width: 100,
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      sorter: true,
      render: (text, record) => {
        if (record.isEnable == 0) {
          return <Tag color="#d82d2d">无效投诉</Tag>
        } else {
          switch (text) {
            case 1:
              return <Tag color="#e4aa5b">待处理</Tag>
            case 2:
              return <Tag color="#e2aa5c">待完成</Tag>
            // case 3:
            //   return <Tag color="#e4aa5b">待回访</Tag>
            case 3:
              return <Tag color="#61c33a">待审核</Tag>
            case 4:
              return <Tag color="#40A9FF">已审核</Tag>
            case -1:
              return <Tag color="#40A9FF">已作废</Tag>
            default:
              return '';
          }
        }
      }
    },
    {
      title: '单据日期',
      dataIndex: 'billDate',
      key: 'billDate',
      width: 120,
      sorter: true,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: '联系人',
      dataIndex: 'complaintUser',
      key: 'complaintUser',
      width: 100,
      sorter: true,
    },
    {
      title: '联系方式',
      dataIndex: 'complaintLink',
      key: 'complaintLink',
      width: 100,
    },
    {
      title: '关联地址',
      dataIndex: 'complaintAddress',
      key: 'complaintAddress',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 95,
      fixed: 'right',
      render: (text, record) => {
        if (record.status != 4 && record.status != -1) {
          return [
            // <Button
            //   type="primary"
            //   key="modify"
            //   style={{ marginRight: '10px' }}
            //   onClick={() => modify(record)}>
            //   修改
            // </Button>,
            // <Button type="danger" key="delete" onClick={() => doDelete(record)}>
            //   删除
            // </Button>  
            <span>
              <a onClick={() => modify(record.id)} key="modify">修改</a>
              <Divider type="vertical" key='split' />
              <a onClick={() => doInvalid(record)} key="invalid">作废</a>
            </span>
          ];
        } else {
          return [<a onClick={() => show(record.id)} key="view">查看</a>];
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
        scroll={{ x: 1200 }}
        onChange={(pag: PaginationConfig, filters, sorter) => changePage(pag, filters, sorter)}
        loading={loading}
      />
    </Page>
  );
}

export default ListTable;
