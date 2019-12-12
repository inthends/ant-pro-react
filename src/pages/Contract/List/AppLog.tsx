//审批记录，废弃
import { Card, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React from 'react'; 

interface AppLogProps {
  appData: any[];
}

function AppLog(props: AppLogProps) {
  const { appData } = props;
  const columns = [
    {
      title: '审批时间',
      width: 160, 
      dataIndex: 'verifyDate',
      key: 'verifyDate',
    },
    {
      title: '操作类型',
      dataIndex: 'action',
      key: 'action',
      width: 80,
    },
    {
      title: '审核状态',
      dataIndex: 'ifVerify',
      key: 'ifVerify',
      align: 'center',
      width: 100,
      render: val => val ? '通过' : '驳回'
    },
    {
      title: '审批人',
      dataIndex: 'verifyUserName',
      key: 'verifyUserName',
      width: 100,
    },
    {
      title: '审批内容',
      dataIndex: 'verifyMemo',
      key: 'verifyMemo'
    }
  ] as ColumnProps<any>[];

  return (
    <div>
      <Card  >
        <Table
          style={{ border: 'none' }}
          bordered={false}
          size="middle"
          columns={columns}
          dataSource={appData} />
      </Card>
    </div >
  );
}
export default AppLog;
