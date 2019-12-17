import Page from '@/components/Common/Page';
import { Tag,Divider, message, Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import { RemoveForm } from './House.service';

interface ListTableMoreProps {
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  selectId: string;
  modify(id: string): void;
  onchange(page: any, filter: any, sort: any): any;
  reload(id, type): void;
}

function ListTableMore(props: ListTableMoreProps) {
  const { selectId, onchange, loading, pagination, data, modify, reload } = props;
  const changePage = (pag: PaginationConfig, filters, sorter) => {
    onchange(pag, filters, sorter);
  };

  const doDelete = record => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要删除${record.name}吗`,
      onOk: () => {
        RemoveForm(record.id).then(() => {
          message.success('删除成功');
          reload(selectId, '');
        });
      },
    });
  };

  const refresh = (id, type) => {
    reload(id, type);
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      fixed: 'left',
      sorter: true,
      render: (text, record) => {
        return record.type == 5 ? text : <a onClick={() => refresh(record.id, record.type)} key="refresh">{record.name}</a>
      }
    },
    {
      title: '编号',
      dataIndex: 'code',
      key: 'code',
      width: 150,
      sorter: true,
    },
    {
      title: '建筑面积',
      dataIndex: 'area',
      key: 'area',
      width: 100,
      sorter: true,
    },

    {
      title: '业主',
      dataIndex: 'ownerName',
      key: 'ownerName',
      width: 100,
      sorter: true,
    },

    {
      title: '租户',
      dataIndex: 'tenantName',
      key: 'tenantName',
      width: 100,
      sorter: true,
    },
    {
      title: '联系电话',
      dataIndex: 'phoneNum',
      key: 'phoneNum',
      width: 100,
    },

    
    // {
    //   title: '状态',
    //   dataIndex: 'state',
    //   key: 'state', 
    //   width: 60, 
    //   sorter: true,
    //   render: (text, record) => { 
    //     switch (text) {
    //       case 0:
    //         return <Tag color="#c32c2b">未售</Tag>
    //       case 1:
    //         return <Tag color="#cf366f">待交房</Tag>
    //       case 2:
    //         return <Tag color="#e97d1c">装修</Tag>
    //       case 3:
    //         return <Tag color="#566485">空置</Tag>
    //       case 4:
    //         return <Tag color="#9ac82b">出租</Tag>
    //       case 5:
    //         return <Tag color="#e7ba0d">自用</Tag>
    //       case -1:
    //         return <Tag color="#40A9FF">已作废</Tag>
    //       default:
    //         return '';
    //     }
    //   }
    // },

    {
      title: '全称',
      dataIndex: 'allName',
      key: 'allName',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      width: 95,
      render: (text, record) => {
        return [
          // <Button
          //   type="primary"
          //   key="modify"
          //   style={{ marginRight: '10px' }}
          //   onClick={() => modify(record)} >
          //   修改
          // </Button>,
          // <Button type="danger" key="delete" onClick={() => doDelete(record)}>
          //   删除
          // </Button>,
          <span key='buttons'>
            <a onClick={() => modify(record)} key="modify">修改</a>
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
        scroll={{ x: 1100 }}
        onChange={(pag: PaginationConfig, filters, sorter) => changePage(pag, filters, sorter)}
        loading={loading}
      />
    </Page>
  );
}
export default ListTableMore;
