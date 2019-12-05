import Page from '@/components/Common/Page';
import { Divider, message, Modal, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import { CheckRole, RemoveForm } from './FlowTask.service';

interface ListTableProps {
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  modify(record: any): void;
  onchange(page: any, filter: any, sort: any): any;
  reload(): void;
}

function ListTable(props: ListTableProps) {
  const { onchange, loading, data, modify, reload, pagination } = props;
  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    onchange(pagination, filters, sorter);
  };
  const doDelete = record => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要删除 ${record.fullName} 吗？`,
      onOk: () => {
        CheckRole(record.roleId).then((res) => {
          if (res) {
            message.error('包含用户，不允许删除！');
            return;
          }
          RemoveForm(record.roleId)
            .then(() => {
              message.success('删除成功！');
              reload();
            })
            .catch(e => { });
        })
      },
    });
  };

  const doModify = record => {
    modify({ ...record });
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'enCode',
      key: 'enCode',
      width: 100,
    },
    {
      title: '流程',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 100,
    },
    {
      title: '步骤',
      dataIndex: 'createDate',
      key: 'createDate',
      width: 120,
    },
    {
      title: '发送人',
      dataIndex: 'description',
      key: 'description',
      width: 200,
    },
    {
      title: '接收时间',
      dataIndex: 'description',
      key: 'description',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'description',
      key: 'description',
      width: 200,
    },

    {
      title: '备注',
      dataIndex: 'description',
      key: 'description',
      width: 200,
    },

    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 140,
      render: (text, record) => {
        return [
          <span key='span'>
            <a
              type="link"
              key="modify"
              onClick={() => doModify(record)}
            >
              修改
          </a>
            <Divider type="vertical" key='divider1' />

            <Divider type="vertical" key='divider3' />
            <a key="delete" type="link" onClick={() => doDelete(record)}>
              删除
          </a>
          </span>
        ];
      },
    },
  ] as ColumnProps<any>[];

  return (
    <Page>
      <Table
        key='list'
        style={{ border: 'none' }}
        bordered={false}
        size="middle"
        dataSource={data}
        columns={columns}
        rowKey={record => record.roleId}
        scroll={{ y: 500 }}
        loading={loading}
        pagination={pagination}
        onChange={(pagination: PaginationConfig, filters, sorter) =>
          changePage(pagination, filters, sorter)
        }
      />
    </Page>
  );
}

export default ListTable;

enum ENABLEDMARKS {
  正常 = 1,
  禁用 = 0,
}
