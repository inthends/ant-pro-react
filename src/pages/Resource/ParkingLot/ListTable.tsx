import Page from '@/components/Common/Page';
import { ParkingData } from '@/model/models';
import { Button, message, Modal, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import { GetDetailJson, RemoveForm } from './ParkingLot.service';

interface ListTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  modify(data: ParkingData): void;
  reload(): void;
}

function ListTable(props: ListTableProps) {
  const { onchange, loading, pagination, data, modify, reload } = props;
  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    onchange(pagination, filters, sorter);
  };
  const doModify = id => {
    GetDetailJson(id).then(res => {
      modify(res);
    });
  };
  const doDelete = record => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要删除${record.name}吗`,
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
      title: '车位名称',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      fixed: 'left',
      sorter: true,
    },
    {
      title: '车位编号',
      dataIndex: 'code',
      key: 'code',
      width: 150,
      sorter: true,
    },
    {
      title: '建筑面积(㎡)',
      dataIndex: 'area',
      key: 'area',
      width: 300,
      sorter: true,
    },
    {
      title: '计费面积(㎡)',
      dataIndex: 'chargingarea',
      key: 'chargingarea',
      width: 200,
      sorter: true,
    },
    {
      title: '车牌号',
      dataIndex: 'carno',
      key: 'carno',
      width: 200,
      sorter: true,
    },
    {
      title: '车位状态',
      dataIndex: 'state',
      key: 'state',
      width: 150,
      sorter: true,
    },
    {
      title: '全称',
      dataIndex: 'auditdate',
      key: 'auditdate',
      sorter: true,
    },
    {
      title: '操作',
      dataIndex: 'allname',
      key: 'allname',
      width: 200,
      fixed: 'right',
      render: (text, record) => {
        return [
          <Button
            type="primary"
            key="modify"
            style={{ marginRight: '10px' }}
            onClick={() => doModify(record.id)}
          >
            修改
          </Button>,
          <Button type="danger" key="delete" onClick={() => doDelete(record)}>
            删除
          </Button>,
        ];
      },
    },
  ] as ColumnProps<any>;
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
        scroll={{ x: 1750 }}
        onChange={(pagination: PaginationConfig, filters, sorter) =>
          changePage(pagination, filters, sorter)
        }
        loading={loading}
      />
    </Page>
  );
}

export default ListTable;
