import Page from '@/components/Common/Page';
import { Divider, message, Modal, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import { CheckRelation, RemoveForm, GetDetailJson } from './PStructUser.service';

interface ListTableProps {
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  onchange(page: any, filter: any, sort: any): any;
  modify(data: any): void;
  reload(): void;
}

function ListTable(props: ListTableProps) {
  const { onchange, loading, pagination, data, modify, reload } = props;
  const changePage = (pag: PaginationConfig, filters, sorter) => {
    onchange(pag, filters, sorter);
  };
  const doDelete = record => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要删除${record.name}吗？`,
      onOk: () => {
        //判断是否关联房间
        CheckRelation(record.key).then((res) => {
          if (res) {
            message.error('已经关联房间，不允许删除！');
            return;
          }

          RemoveForm(record.id)
            .then(() => {
              message.success('删除成功！');
              reload();
            })
            .catch(e => { });

        });
      },
    });
  };
  const doModify = id => {
    GetDetailJson(id).then(res => {
      const { customerInfo = {}, relationPC = {} } = res;
      modify({ ...relationPC, ...customerInfo });
    });
  };
  const columns = [
    {
      title: '客户类别',
      dataIndex: 'flag',
      key: 'flag',
      width: 80,
      render: (text, record) => {
        switch (text) {
          case '1':
            return '个人';
          case '2':
            return '单位';
          default:
            return '个人';
        }
      },
    },
    {
      title: '客户编号',
      dataIndex: 'code',
      key: 'code',
      width: 160,
      // sorter: true,
    },
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      // sorter: true,
    },
    {
      title: '手机号码',
      dataIndex: 'telphonenum',
      key: 'telphonenum',
      width: 100,
      // sorter: true,
    },

    // {
    //   title: '联系电话',
    //   dataIndex: 'telphonenum',
    //   key: 'telphonenum',
    //   width: 100,
    //   // sorter: true,
    // },
    // {
    //   title: '简称',
    //   dataIndex: 'shortname',
    //   key: 'shortname',
    //   width: 100,
    //   // sorter: true,
    // },


    {
      title: '证件类别',
      dataIndex: 'certificatetype',
      key: 'certificatetype',
      width: 100,
      render: (text, record) => {
        switch (text) {
          case '1':
            return '身份证';
          case '2':
            return '护照';
          default:
            return '';
        }
      },
    },
    {
      title: '证件号码',
      dataIndex: 'certificateno',
      key: 'certificateno',
      width: 180,
      // sorter: true,
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
      align: 'center',
      width: 95,
      fixed: 'right',
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
          <span key="span">
            <a onClick={() => doModify(record.id)} key="modify">修改</a>
            <Divider type="vertical" key="divider" />
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
        scroll={{ y: 500 }}
        onChange={(pag: PaginationConfig, filters, sorter) => changePage(pag, filters, sorter)}
        loading={loading}
      />
    </Page>
  );
}

export default ListTable;
