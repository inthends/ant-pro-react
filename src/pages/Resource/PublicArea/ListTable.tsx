import Page from '@/components/Common/Page';
import { Button, message, Modal, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import { RemoveForm } from './PublicArea.service';

interface ListTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  modify(data: string): void;
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
        RemoveForm(record.pCode).then(() => {
          message.success('保存成功');
          reload();
        });
      },
    });
  };
  const columns = [
    {
      title: '公区名称',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      fixed: 'left',
      sorter: true,
    },
    {
      title: '公区编号',
      dataIndex: 'enCode',
      key: 'enCode',
      width: 150,
      sorter: true,
    },
    {
      title: '房产全称',
      dataIndex: 'psAllName',
      key: 'psAllName',
      width: 300,
      sorter: true,
    },
    {
      title: '位置描述',
      dataIndex: 'otherCode',
      key: 'otherCode',
      width: 200,
      sorter: true,
    },
    {
      title: '是否审核',
      dataIndex: 'auditMark',
      key: 'auditMark',
      width: 200,
      sorter: true,
      render: (text: any) => {
        switch (text) {
          case 1:
            return '是';
          case 0:
            return '否';
          default:
            return null;
        }
      },
    },
    {
      title: '审核人',
      dataIndex: 'auditman',
      key: 'auditman',
      width: 150,
      sorter: true,
    },
    {
      title: '审核日期',
      dataIndex: 'auditdate',
      key: 'auditdate',
      width: 200,
      sorter: true,
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
      width: 200,
      fixed: 'right',
      render: (text, record) => {
        return [
          <Button
            type="primary"
            key="modify"
            style={{ marginRight: '10px' }}
            onClick={() => modify(record)}
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
        rowKey={record => record.pCode}
        pagination={pagination}
        scroll={{ x: 1850 }}
        onChange={(pagination: PaginationConfig, filters, sorter) =>
          changePage(pagination, filters, sorter)
        }
        loading={loading}
      />
    </Page>
  );
}

export default ListTable;
