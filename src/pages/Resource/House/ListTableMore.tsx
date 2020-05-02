import Page from '@/components/Common/Page';
import { Icon, Menu, Dropdown, Tag, Divider, message, Table, Modal } from 'antd';
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
  type: number;
  showSplit(data: any): void;
}

function ListTableMore(props: ListTableMoreProps) {
  const { type, selectId, onchange, loading, pagination, data, modify, reload,showSplit } = props;
  const changePage = (pag: PaginationConfig, filters, sorter) => {
    onchange(pag, filters, sorter);
  };

  const doInvalid = record => {
    Modal.confirm({
      title: '请确认',
      content: `您确认要作废${record.name}吗？`,
      onOk: () => {
        RemoveForm(record.id).then(() => {
          message.success('作废成功');
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

    // {
    //   title: '业主',
    //   dataIndex: 'ownerName',
    //   key: 'ownerName',
    //   width: 100,
    //   sorter: true,
    // },

    {
      title: '管家',
      dataIndex: 'housekeeperName',
      key: 'housekeeperName',
      width: 100,
      sorter: true,
    },

    {
      title: '联系电话',
      dataIndex: 'phoneNum',
      key: 'phoneNum',
      width: 100,
    },

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
            <a onClick={() => doInvalid(record)} key="delete">作废</a>
          </span>
        ];
      },
    },
  ] as ColumnProps<any>[];

  //更多
  const editAndDelete = (key: string, currentItem: any) => {
    if (key === 'split') {
      showSplit(currentItem);
    } else if (key === 'merge') {
      
    }
  }

  const MoreBtn: React.FC<{
    item: any;
  }> = ({ item }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => editAndDelete(key, item)}>
          < Menu.Item key="split">拆分</Menu.Item>
          < Menu.Item key="merge">合并</Menu.Item>
        </Menu >
      }>
      <a>
        更多<Icon type="down" />
      </a>
    </Dropdown >
  );

  const roomcolumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
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
      width: 180,
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
      width: 150,
      sorter: true,
    },

    {
      title: '住户',
      dataIndex: 'tenantName',
      key: 'tenantName',
      width: 150,
      sorter: true,
    },
    {
      title: '联系电话',
      dataIndex: 'phoneNum',
      key: 'phoneNum',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      width: 60,
      render: (text, record) => {
        switch (text) {
          case 0:
            return <Tag color="#c32c2b">未售</Tag>
          case 1:
            return <Tag color="#cf366f">待交房</Tag>
          case 2:
            return <Tag color="#e97d1c">装修</Tag>
          case 3:
            return <Tag color="#e7ba0d">空置</Tag>
          case 4:
            return <Tag color="#9ac82b">出租</Tag>
          case 5:
            return <Tag color="#566485">自用</Tag>
          case -1:
            return <Tag color="#40A9FF">已作废</Tag>
          default:
            return '';
        }
      }
    },

    {
      title: '全称',
      dataIndex: 'allName',
      key: 'allName',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      fixed: 'right',
      width: 150,
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
            <a onClick={() => doInvalid(record)} key="delete">作废</a>
            <Divider type="vertical" />
            <MoreBtn key="more" item={record} />
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
        columns={type >= 4 ? roomcolumns : columns}
        rowKey={record => record.id}
        pagination={pagination}
        scroll={{ x: 1300 }}
        onChange={(pag: PaginationConfig, filters, sorter) => changePage(pag, filters, sorter)}
        loading={loading}
      />
    </Page>
  );
}
export default ListTableMore;
