import Page from '@/components/Common/Page';
import { Divider, message, Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import { RemoveForm } from './Main.service';
import moment from 'moment';

interface ListTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  modify(id: string): void;
  reload(): void;
};

function ListTable(props: ListTableProps) {
  const { onchange, loading, pagination, data, modify, reload } = props;
  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    onchange(pagination, filters, sorter);
  };
  const doDelete = record => {
    Modal.confirm({
      title: '请确认',
      content: `您确认要删除${record.feeName}吗？`,
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        RemoveForm(record.feeItemId).then(() => {
          message.success('删除成功');
          reload();
        });
      },
    });
  };
  const columns = [
    {
      title: '费项名称',
      dataIndex: 'feeName',
      key: 'feeName',
      width: 140,
      sorter: true,
    },
    {
      title: '费项种类',
      dataIndex: 'feeKind',
      key: 'feeKind',
      width: 80,
      sorter: true,
    },
    {
      title: '费项类别',
      dataIndex: 'feeType',
      key: 'feeType',
      width: 80,
      sorter: true,
    },
    // {
    //   title: '编码',
    //   dataIndex: 'feeCode',
    //   key: 'feeCode',
    //   width: 100,
    //   sorter: true,
    // },
    {
      title: '单价',
      dataIndex: 'feePrice',
      key: 'feePrice',
      width: 80,
      sorter: true,
    },
    {
      title: '计费周期',
      dataIndex: 'cycleValue',
      key: 'cycleValue',
      width: 80, 
    },
    {
      title: '周期单位',
      dataIndex: 'cycleType',
      key: 'cycleType',
      width: 80, 
    },
    {
      title: '计费起始日期',
      dataIndex: 'beginDate',
      key: 'beginDate',
      width: 85,
      render: val => {
        if (val == null) {
          return '';
        } else {
          return moment(val).format('YYYY-MM-DD');
        }
      }
    }, {
      title: '计费截止日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 85,
      render: val => {
        if (val == null) {
          return '';
        } else {
          return moment(val).format('YYYY-MM-DD');
        }
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      key: 'operation',
      width: 80,
      render: (text, record) => {
        return [
          <span key='buttons'>
            <a onClick={() => modify(record.feeItemId)} key="modify">修改</a>
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
        key='list'
        style={{ border: 'none' }}
        bordered={false}
        size="middle"
        dataSource={data}
        columns={columns}
        rowKey={record => record.feeItemId}
        pagination={pagination}
        scroll={{ y: 420 }}
        onChange={(pagination: PaginationConfig, filters, sorter) =>
          changePage(pagination, filters, sorter)
        }
        loading={loading}
      />
    </Page>
  );
}
export default ListTable;
