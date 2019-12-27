import Page from '@/components/Common/Page';
import { ParkingData } from '@/model/models';
import { Tag, Divider, message, Modal, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import { GetDetailJson, RemoveForm } from './ParkingLot.service';

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
  const doModify = id => {
    GetDetailJson(id).then(res => {
      modify(res);
    });
  };
  const doDelete = record => {
    Modal.confirm({
      title: '请确认',
      content: `您确认要删除${record.name}吗？`,
      onOk: () => {
        RemoveForm(record.id).then(() => {
          message.success('删除成功');
          reload();
        });
      },
    });
  };
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      fixed: 'left',
      sorter: true,
    },
    {
      title: '编号',
      dataIndex: 'code',
      key: 'code',
      width: 150,
      sorter: true,
    },
    {
      title: '建筑面积(㎡)',
      dataIndex: 'area',
      key: 'area',
      width: 120,
      sorter: true,
    },
    {
      title: '计费面积(㎡)',
      dataIndex: 'billarea',
      key: 'billarea',
      width: 120,
      sorter: true,
    },
    {
      title: '车牌号',
      dataIndex: 'carno',
      key: 'carno',
      width: 100,
      sorter: true,
    },
    {
      title: '车位状态',
      dataIndex: 'state',
      key: 'state',
      width: 100,
      sorter: true,
      render: (text, record) => {
        switch (text) {
          case 3:
            return <Tag color="#e4aa5b">空置</Tag>
          case 4:
            return <Tag color="#61c33a">出租</Tag>
          default:
            return '';
        }
      }
    },
    {
      title: '全称',
      dataIndex: 'allname',
      key: 'allname',
      sorter: true,
    },
    {
      title: '操作',
      align: 'center',
      width: 95,
      fixed: 'right',
      render: (text, record) => {
        return [
          // <Button
          //   type="primary"
          //   key="modify"
          //   style={{ marginRight: '10px' }}
          //   onClick={() => doModify(record.id)}
          // >
          //   修改
          // </Button>,
          // <Button type="danger" key="delete" onClick={() => doDelete(record)}>
          //   删除
          // </Button>,
          <span>
            <a onClick={() => doModify(record.id)} key="modify">修改</a>
            <Divider type="vertical" key='split' />
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
