import Page from '@/components/Common/Page';
import { Divider, message, Modal, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import { CheckRelation, InvalidForm } from './PStructUser.service';

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

  const doInvalid = record => {
    Modal.confirm({
      title: '请确认',
      content: `您确认要作废${record.name}吗？`,
      onOk: () => {
        //判断是否关联房间
        CheckRelation(record.id).then((res) => {
          if (res) {
            message.error('已经关联房间，不允许作废');
            return;
          }
          InvalidForm(record.id)
            .then(() => {
              message.success('作废成功');
              reload();
            })
            .catch(e => { });

        });
      },
    });
  };

  // const doModify = id => {
  //   GetDetailJson(id).then(res => {
  //     const { customerInfo = {}, relationPC = {} } = res;
  //     modify({ ...relationPC, ...customerInfo });
  //   });
  // };

  const columns = [
    {
      title: '住户名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      sorter: true
    },
    {
      title: '住户类别',
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
      title: '住户编号',
      dataIndex: 'code',
      key: 'code',
      width: 160,
      sorter: true,
    },
    {
      title: '手机号码',
      dataIndex: 'phoneNum',
      key: 'phoneNum',
      width: 200,
      // sorter: true,
    },

    // {
    //   title: '联系电话',
    //   dataIndex: 'telphonenum',
    //   key: 'telphonenum',
    //   width: 100,
    //   // sorter: true,
    // },

    {
      title: '电子邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 100,
    },


    {
      title: '证件类别',
      dataIndex: 'certificateType',
      key: 'certificateType',
      width: 120,
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
      dataIndex: 'certificateNO',
      key: 'certificateNO',
      width: 200,
      // sorter: true,
    },
    // {
    //   title: '住址',
    //   dataIndex: 'allName',
    //   key: 'allName',
    // },
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
            <a onClick={() => modify(record)} key="modify">修改</a>
            <Divider type="vertical" key="divider" />
            <a onClick={() => doInvalid(record)} key="delete">作废</a>
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
        // scroll={{  x: 1500 }}
        onChange={(pag: PaginationConfig, filters, sorter) => changePage(pag, filters, sorter)}
        loading={loading}
      />
    </Page>
  );
}

export default ListTable;
