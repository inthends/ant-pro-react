import Page from '@/components/Common/Page';
import { Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
// import { RemoveForm } from './FlowTask.service';

interface ListTableProps {
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  onchange(page: any, filter: any, sort: any): any;
  reload(): void;
  // roomcheck(code: string, id: string, instanceId: string): void;//验房
  // billcheck(code: string, id: string, instanceId: string): void;//结算
  // approve(code: string, id: string, instanceId: string): void;//审核退租
  // submit(code: string, id: string, instanceId: string): void;//重新发起 
  apartmentApprove(code: string, id: string, instanceId: string): void;//入住申请
  apartmentSubmit(id: string, instanceId: string): void;//重新发起
}

function ListTable(props: ListTableProps) {
  const { onchange, loading, data, pagination, apartmentApprove, apartmentSubmit } = props;
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
    //判断步骤
    // if (record.stepName == '验房') {
    //   roomcheck(record.flowId, record.id, record.instanceId);

    // } else if (record.stepName == '财务结算') {

    //   billcheck(record.flowId, record.id, record.instanceId);
    // }
    // else if (record.stepName == '开始') {
    //   //resubmit
    //   submit(record.flowId, record.id, record.instanceId);
    // }
    // else {
    //   approve(record.flowId, record.id, record.instanceId);
    // }

    switch (record.code) {

      // case '验房':
      //   roomcheck(record.flowId, record.id, record.instanceId);
      //   break;
      // case '财务结算':
      //   billcheck(record.flowId, record.id, record.instanceId);
      //   break;
      // case '开始':
      //   submit(record.flowId, record.id, record.instanceId);
      //   break;

      case '1001':
        switch (record.stepName) {
          case '招商部工作人员':
          case '招商部领导':
            apartmentApprove(record.code, record.id, record.instanceId);
            break;
          case '开始':
            apartmentSubmit(record.id,record.instanceId);
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }

  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
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
    // {
    //   title: '状态',
    //   dataIndex: 'status',
    //   key: 'status',
    //   width: 60,

    // }, 
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
      width: 60,
      render: (text, record) => {
        return [
          <span key='span'>
            <a
              type="link"
              key="modify"
              onClick={() => doHandle(record)}
            >
              处理
          </a>
            {/* <Divider type="vertical" key='divider3' />
            <a key="delete" type="link" onClick={() => doDelete(record)}>
              作废
          </a> */}
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


