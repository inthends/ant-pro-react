import Page from '@/components/Common/Page';
import { Tag, Divider, message, Modal, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import moment from 'moment';
import { InvalidForm } from './Main.service';

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
      content: `您是否要作废${record.billCode}吗？`,
      onOk: () => {
        InvalidForm(record.id)
          .then(() => {
            message.success('作废成功！');
            reload();
          })
          .catch(e => { });
      },
    });
  };
  const columns = [
    {
      title: '单据编号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 150,
      sorter: true,
    },
    {
      title: '来源',
      dataIndex: 'sourceType',
      key: 'sourceType',
      width: 100,
      sorter: true,
    },
    {
      title: '报修区域',
      dataIndex: 'repairArea',
      key: 'repairArea',
      width: 100,
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      align: 'center',
      sorter: true,
      render: (text, record) => {
        switch (text) {
          case 1:
            return <Tag color="#e4aa5b">待派单</Tag>
          case 2:
            return <Tag color="#19d54e">待接单</Tag>
          case 3:
            return <Tag color="#e4aa5b">待开工</Tag>
          case 4:
            return <Tag color="#61c33a">待完成</Tag>
          case 5:
            return <Tag color="#ff5722">待回访</Tag>
          case 6:
            return <Tag color="#5fb878">待检验</Tag>
          case 7:
            return <Tag color="#29cc63">待审核</Tag>
          case 8:
            return <Tag color="#e48f27">已审核</Tag>
          case -1:
            return <Tag color="#d82d2d">已作废</Tag>
          default:
            return '';
        }
      }
    },
    {
      title: '单据日期',
      dataIndex: 'billDate',
      key: 'billDate',
      width: 120,
      sorter: true,
      render: val => moment(val).format('YYYY-MM-DD')
    },

    {
      title: '联系人',
      dataIndex: 'contactName',
      key: 'contactName',
      width: 180,
      sorter: true,
    },
    {
      title: '联系方式',
      dataIndex: 'contactLink',
      key: 'contactLink',
    },
    {
      title: '关联地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 95,
      fixed: 'right',
      render: (text, record) => {

        if (record.status != 5 && record.status != 8) {
          return [
            // <Button
            //   type="primary"
            //   key="modify"
            //   style={{ marginRight: '10px' }}
            //   onClick={() => modify(record)}>
            //   修改
            // </Button>,
            // <Button type="danger" key="delete" onClick={() => doDelete(record)}>
            //   删除
            // </Button>
            <span>
              <a onClick={() => modify(record)} key="modify">修改</a>
              <Divider type="vertical" />
              <a onClick={() => doInvalid(record)} key="invalid">作废</a>
            </span>
          ];
        } else {
          return [<span>
            <a onClick={() => modify(record)} key="modify">查看</a>
            {/* <Divider type="vertical" />
            <a onClick={() => doInvalid(record)} key="invalid">作废</a> */}
          </span>
          ];
        }
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
        scroll={{ x: 1200 }}
        onChange={(pag: PaginationConfig, filters, sorter) => changePage(pag, filters, sorter)}
        loading={loading}
      />
    </Page>
  );
}

export default ListTable;
