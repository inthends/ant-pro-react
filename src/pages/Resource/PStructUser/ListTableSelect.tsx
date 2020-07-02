import Page from '@/components/Common/Page';
import { Modal, message, Divider, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import { CheckRelation, InvalidForm } from './PStructUser.service';

interface ListTableSelectProps {
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  onchange(page: any, filter: any, sort: any): any;
  modify(data: any): void;
  reload(): void;
  Select(object: any): void;
  type: string;
}

function ListTableSelect(props: ListTableSelectProps) {
  const { onchange, loading, pagination, data, modify, reload, Select, type } = props;
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

  const columns = [
    {
      title: '住户名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      sorter: true,
    },
    {
      title: '住户编号',
      dataIndex: 'code',
      key: 'code',
      width: 150,
      sorter: true,
    },
    {
      title: '手机号码',
      dataIndex: 'phoneNum',
      key: 'phoneNum',
      width: 200,
      // sorter: true,
    },
    {
      title: '证件号码',
      dataIndex: 'certificateNO',
      key: 'certificateNO',
      width: 200,
      // sorter: true,
    },
    // {
    //   title: '证件类别',
    //   dataIndex: 'certificateType',
    //   key: 'certificateType',
    //   width: 120,
    //   render: (text, record) => {
    //     switch (text) {
    //       case '1':
    //         return '身份证';
    //       case '2':
    //         return '护照';
    //       default:
    //         return '';
    //     }
    //   },
    // },
    // {
    //   title: '证件号码',
    //   dataIndex: 'certificateNO',
    //   key: 'certificateNO',
    //   width: 200,
    //   // sorter: true,
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
          <span key="span">
            <a onClick={() => modify(record)} key="modify">修改</a>
            <Divider type="vertical" key="divider" />
            <a onClick={() => doInvalid(record)} key="delete">作废</a>
          </span>
        ];
      },
    }
  ] as ColumnProps<any>[];

  //车位选择人
  const parkingColumns = [
    {
      title: '住户名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      sorter: true,
    },
    {
      title: '住户编号',
      dataIndex: 'code',
      key: 'code',
      width: 150,
      sorter: true,
    },
    {
      title: '手机号码',
      dataIndex: 'phoneNum',
      key: 'phoneNum',
      width: 200,
      // sorter: true,
    },
    {
      title: '证件号码',
      dataIndex: 'certificateNO',
      key: 'certificateNO',
      width: 200,
      // sorter: true,
    },
    {
      title: '房屋全称',
      dataIndex: 'allName',
      key: 'allName',
    },
    // {
    //   title: '证件类别',
    //   dataIndex: 'certificateType',
    //   key: 'certificateType',
    //   width: 120,
    //   render: (text, record) => {
    //     switch (text) {
    //       case '1':
    //         return '身份证';
    //       case '2':
    //         return '护照';
    //       default:
    //         return '';
    //     }
    //   },
    // },
    // {
    //   title: '证件号码',
    //   dataIndex: 'certificateNO',
    //   key: 'certificateNO',
    //   width: 200,
    //   // sorter: true,
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
          <span key="span">
            <a onClick={() => modify(record)} key="modify">修改</a>
            <Divider type="vertical" key="divider" />
            <a onClick={() => doInvalid(record)} key="delete">作废</a>
          </span>
        ];
      },
    }
  ] as ColumnProps<any>[];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      Select(selectedRows[0]);
    },
    // getCheckboxProps: record => ({
    //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
    //   name: record.name,
    // }),
  };

  return (
    <Page>
      <Table
        rowSelection={{
          type: 'radio',
          ...rowSelection,
        }}
        style={{ border: 'none' }}
        bordered={false}
        size="middle"
        dataSource={data}
        columns={type == 'room' ? columns : parkingColumns}
        rowKey={record => record.id}
        pagination={pagination}
        scroll={{ y: 500, x: 1300 }}
        onChange={(pag: PaginationConfig, filters, sorter) => changePage(pag, filters, sorter)}
        loading={loading}
      />
    </Page>
  );
}
export default ListTableSelect;
