import Page from '@/components/Common/Page';
import { Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';

interface ListTableProps {
  loading: boolean;
  pagination: PaginationConfig;
  onchange(page: any, filter: any, sort: any): any;
  reload(): void;
  data: any[];
  view(flowId: string, id: string, instanceId: string): void;//审核退租 
}

function ListTable(props: ListTableProps) {
  const { onchange, loading, pagination, view, data } = props;
  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    onchange(pagination, filters, sorter);
  };

  //作废
  // const doDelete = record => {
  //   Modal.confirm({
  //     title: '请确认',
  //     content: `您是否要作废 ${record.fullName} 吗？`,
  //     onOk: () => {
  //       RemoveForm(record.roleId)
  //         .then(() => {
  //           message.success('作废成功');
  //           reload();
  //         })
  //     }
  //   });
  // };

  const doHandle = record => {
    view(record.flowId, record.id, record.instanceId);
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 250,
    },
    {
      title: '流程',
      dataIndex: 'flowName',
      key: 'flowName',
      width: 150,
    },
    {
      title: '步骤',
      dataIndex: 'stepName',
      key: 'stepName',
      width: 120,
    },
    {
      title: '发送人',
      dataIndex: 'senderName',
      key: 'senderName',
      width: 200,
    },
    {
      title: '接收时间',
      dataIndex: 'receiveTime',
      key: 'receiveTime',
      width: 160,
    },
    {
      title: '完成时间',
      dataIndex: 'completedTime',
      key: 'completedTime',
      width: 160,
    },
    {
      title: '备注',
      dataIndex: 'note',
      key: 'note'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 65,
      render: (text, record) => {
        return [
          <span key='span'>
            <a
              type="link"
              key="modify"
              onClick={() => doHandle(record)}
            >
              查看
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


