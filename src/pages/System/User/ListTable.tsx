import Page from '@/components/Common/Page';
import { JcAccount } from '@/model/jcAccount';
import { message, Modal, Divider, Switch, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import { DisabledToggle, ResetPwd } from './User.service';

interface ListTableProps {
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  modify(record: any): void;
  onchange(page: any, filter: any, sort: any): any;
  reload(): void;
  setData(data: any[]): void;
}

function ListTable(props: ListTableProps) {
  const { onchange, loading, data, modify, pagination, setData } = props;
  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    onchange(pagination, filters, sorter);
  };
  // const doDelete = record => {
  //   Modal.confirm({
  //     title: '请确认',
  //     content: `您是否要删除 ${record.name} 吗`,
  //     onOk: () => {
  //       RemoveForm(record.id)
  //         .then(() => {
  //           message.success('删除成功');
  //           reload();
  //         })
  //         .catch(e => { });
  //     },
  //   });
  // };


  //重置密码
  const resetPwd = id => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要重置密码吗？`,
      onOk: () => {
        ResetPwd(id)
          .then(() => {
            message.success('密码已经重置，默认密码111111');
          })
          .catch(e => { });
      },
    });
  };
 
  const doModify = record => {
    modify({ ...record });
  };

  const columns = [
    // {
    //   title: '类别',
    //   dataIndex: 'accountType',
    //   key: 'accountType',
    //   width: 100,
    //   fixed: 'left',
    //   render: (text: any) => {
    //     return ACCOUNTTYPES[text];
    //   },
    // },
    {
      title: '用户名',
      dataIndex: 'account',
      key: 'account',
      width: 150,
    },
    {
      title: '显示名',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    // {
    //   title: '编号',
    //   dataIndex: 'customerCode',
    //   key: 'customerCode',
    //   width: 100,
    // },
    {
      title: '状态',
      dataIndex: 'enabledMark',
      key: 'enabledMark',
      width: 100,
      render: (text: any, record, index) => {
        return (
          <Switch
            size="small"
            checked={text === ENABLEDMARKS.正常}
            checkedChildren={ENABLEDMARKS[ENABLEDMARKS.正常]}
            unCheckedChildren={ENABLEDMARKS[ENABLEDMARKS.禁用]}
            onClick={() => {
              DisabledToggle(record.id, text === ENABLEDMARKS.正常).then(() => {
                const state = text === ENABLEDMARKS.正常 ? ENABLEDMARKS.禁用 : ENABLEDMARKS.正常;
                record.enabledMark = state;
                data.splice(index, 1, { ...record });
                setData([...data]);
              });
            }}
          />
        );
      },
    },
    // {
    //   title: '账户有效期',
    //   dataIndex: 'expDate',
    //   key: 'expDate',
    //   width: 120,
    // },
    {
      title: '账户动态',
      dataIndex: 'userOnLine',
      key: 'userOnLine',
      width: 100,
      render: (text: any) => {
        return USERONLINES[text];
      },
    },
    {
      title: '登录次数',
      dataIndex: 'logOnCount',
      key: 'logOnCount',
      width: 100,
    },

    {
      title: '最后一次登录时间',
      dataIndex: 'lastVisit',
      key: 'lastVisit',
      width: 150,
    },

    {
      title: '备注',
      dataIndex: 'description',
      key: 'description',
      width: 200
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return [
          // <Button
          //   type="primary"
          //   key="modify"
          //   style={{ marginRight: '10px' }}
          //   onClick={() => doModify(record)}
          // >
          //   修改
          // </Button>,
          // <Button type="danger" key="delete" onClick={() => doDelete(record)}>
          //   删除
          // </Button>,

          <span>
            <a onClick={() => doModify(record)} key="modify">编辑</a>
            <Divider type="vertical" key='divider' />
            <a onClick={() => resetPwd(record.id)} key="delete">重置密码</a>
          </span>

        ];
      },
    },
  ] as ColumnProps<JcAccount>[];
  return (
    <Page>
      <Table
        style={{ border: 'none' }}
        bordered={false}
        size="middle"
        dataSource={data}
        columns={columns}
        rowKey={record => record.id}
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

// enum ACCOUNTTYPES {
//   系统初始账户 = 1,
//   员工账户 = 2,
//   客户账户 = 3,
//   供应商账户 = 4,
//   其他 = 5,
// }

enum ENABLEDMARKS {
  正常 = 1,
  禁用 = 0,
}
enum USERONLINES {
  离线 = 0,
  上线 = 1,
  下线 = 2,
}
