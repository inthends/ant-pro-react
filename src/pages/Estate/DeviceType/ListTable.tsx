import Page from '@/components/Common/Page';
import { Divider, message, Modal, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React, { useState } from 'react';
import { CheckType, RemoveForm, GetDetailJson } from './DeviceType.service'; 
import styles from './style.less';
interface ListTableProps {
  loading: boolean;
  data: any[];
  onchange(page: any, filter: any, sort: any): any;
  modify(data: any): void;
  reload(): void;
}

function ListTable(props: ListTableProps) {
  const { loading, data, modify, reload } = props; 
  const [selectedRowKey, setSelectedRowKey] = useState([]);
  const doDelete = record => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要删除 ${record.fullName} 吗？`,
      onOk: () => {
        //check 
        CheckType(record.key).then((res) => { 
          if (res) {
            message.error('存在下级，不允许删除！');
            return;
          }
          RemoveForm(record.key)
            .then(() => {
              message.success('删除成功');
              reload();
            })
            .catch(e => { });
        })
      },
    });
  };

  const doModify = id => {
    GetDetailJson(id).then(res => {
      //console.log(res)
      modify(res);
    });
  };

  const setClassName = (record, index) => { 
    if (record.key === selectedRowKey) {
      return styles.rowSelect;
    }
  };

  const onRow = (record) => {
    return {
      onClick: event => {
        //if (record.type == 'Department' || record.type == 'D') {
        setSelectedRowKey(record.key);
        //}
        //getRowSelect(record);
      }
    };
  }

  const columns = [
    {
      title: '类别编号',
      dataIndex: 'enCode',
      key: 'enCode',
      width: 200,
    },
    {
      title: '类别名称',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 250,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 95,
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
            <a onClick={() => doModify(record.key)} key="modify">编辑</a>
            <Divider type="vertical" key='divider' />
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
        rowKey={record => record.key}
        loading={loading}
        onRow={onRow}
        rowClassName={setClassName} //表格行点击高亮
      />
    </Page>
  );
}
export default ListTable;
