import Page from '@/components/Common/Page';
import { Menu, Dropdown, Icon, Tag, Divider, message, Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import { RemoveForm } from './Main.service';
import moment from 'moment';

interface ListTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  detail(id: string, chargeId: string): void;//查看
  modify(id: string, chargeId: string): void;//修改
  approve(id: string, chargeId: string): void;//审核
  change(id: string, chargeId: string): void;//变更
  renewal(id: string, chargeId: string): void;//续租
  withdrawal(id: string, chargeId: string): void;//退租
  forward(id: string, chargeId: string): void;//结转
  reload(): void;
};

function ListTable(props: ListTableProps) {
  const { onchange, loading, pagination, data, detail, modify, reload, approve, change, renewal, withdrawal, forward } = props;
  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    onchange(pagination, filters, sorter);
  };
  const doDelete = record => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要作废${record.name}？`,
      onOk: () => {
        RemoveForm(record.id).then(() => {
          message.success('作废成功！');
          reload();
        });
      },
    });
  };

  //合同操作
  const editAndDelete = (key: string, currentItem: any) => {
    if (key === 'renewal') {
      //续租
      renewal(currentItem.id, currentItem.chargeId);
    } else if (key === 'withdrawal') {
      //退租
      withdrawal(currentItem.id, currentItem.chargeId);
    } else if (key === 'forward') {
      //结转 
      forward(currentItem.id, currentItem.chargeId);
    } else if (key === 'invalid') {
    }
  };

  const MoreBtn: React.FC<{
    item: any;
  }> = ({ item }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => editAndDelete(key, item)}>
          <Menu.Item key="forward">结转</Menu.Item>
          <Menu.Item key="change">变更</Menu.Item>
          <Menu.Item key="renewal">续租</Menu.Item>
          <Menu.Item key="withdrawal">退租</Menu.Item>
          <Menu.Item key="invalid">作废</Menu.Item>
        </Menu>}>
      <a>
        操作<Icon type="down" />
      </a>
    </Dropdown>
  );


  const columns = [
    {
      title: '房号',
      dataIndex: 'id',
      key: 'id',
      width: 200,
      render: (text, row, index) => {
        var house = "";
        if (row.houseList) {
          for (var i = 0; i < row.houseList.length; i++) {
            house = house + row.houseList[i].allName + "，";
          }
          return house.slice(0, house.length - 1);
        }
        return "";
      }
    },

    {
      title: '合同编号',
      dataIndex: 'no',
      key: 'no',
      width: 100,
    },

    {
      title: '租客',
      dataIndex: 'customer',
      key: 'customer',
      width: 120,
    },

    {
      title: '开始日',
      dataIndex: 'billingDate',
      key: 'billingDate',
      width: 100,
      render: val => moment(val).format('YYYY-MM-DD')
    },
    {
      title: '合同状态',
      dataIndex: 'status',
      align: 'center',
      key: 'status',
      width: 100,
      render: (text, record) => {
        switch (text) {
          case 0:
            return <Tag color="#e4aa5b">新建</Tag>;
          case 1:
            return <Tag color="#e4aa4b">待审核</Tag>;
          case 2:
            return <Tag color="#19d54e">已审核</Tag>;
          case -1:
            return <Tag color="#d82d2d">已作废</Tag>
          default:
            return '';
        }
      }
    },
    {
      title: '退租日',
      dataIndex: 'contractEndDate',
      key: 'contractEndDate',
      width: 100,
      render: val => moment(val).format('YYYY-MM-DD')
    },

    {
      title: '总计租金',
      dataIndex: 'leaseAmount',
      key: 'leaseAmount',
      width: 100,
    },

    {
      title: '签订日',
      dataIndex: 'contractStartDate',
      key: 'contractStartDate',
      width: 100,
      render: val => moment(val).format('YYYY-MM-DD')
    },

    {
      title: '租赁数(㎡)',
      dataIndex: 'leaseSize',
      key: 'leaseSize',
      width: 100,
    },

    {
      title: '保证金',
      dataIndex: 'leaseDeposit',
      key: 'leaseDeposit',
      width: 100,
    },
    {
      title: '租赁条款单价',
      dataIndex: 'leasePrice',
      key: 'leasePrice',
      width: 100,
      render: (text, record) => {
        return text + ' ' + record.leasePriceUnit;
      }
    },
    {
      title: '是否续租',
      width: 100,
      dataIndex: 'isRenewal',
      key: 'isRenewal',
      align: 'center',
      render: val => val == 1 ? <Tag color="#19d54e">是</Tag> : <Tag color="#e4aa5b">否</Tag>
    },
    {
      title: '签订人',
      dataIndex: 'signer',
      key: 'signer',
      width: 100,
    },
    {
      title: '跟进人',
      dataIndex: 'follower',
      key: 'follower',
      width: 100,
    },
    {
      title: '法人',
      dataIndex: 'legalPerson',
      key: 'legalPerson',
      width: 100,
    },
    {
      title: '行业',
      dataIndex: 'industry',
      key: 'industry',
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'operation',
      key: 'operation',
      width: 140,
      fixed: 'right',
      render: (text, record) => {

        //新建
        if (record.status == 0) {
          return [
            // <Button
            //   type="primary"
            //   key="detail"
            //   style={{ marginRight: '10px' }}
            //   onClick={() => detail(record.id,record.chargeId)}
            // >
            // 查看
            // </Button>,
            // <Button type="danger" key="delete" onClick={() => doDelete(record)}>
            //   删除
            // </Button>, 
            <span>
              <a onClick={() => modify(record.id, record.chargeId)} key="modify">修改</a>
              <Divider type="vertical" key='spilt1' />
              <a onClick={() => detail(record.id, record.chargeId)} key="detail">查看</a>
              <Divider type="vertical" key='spilt2' />
              <a onClick={() => doDelete(record)} key="delete">删除</a>
            </span>
          ];
        } else if (record.status == 1) {
          return [
            <span>
              <a onClick={() => approve(record.id, record.chargeId)} key="modify">审核</a>
              <Divider type="vertical" key='spilt1' />
              <a onClick={() => detail(record.id, record.chargeId)} key="detail">查看</a>
            </span>
          ];
        } else {
          return [
            <span>
              {/* <a onClick={() => change(record.id, record.chargeId)} key="change">变更</a> */}
              <a onClick={() => detail(record.id, record.chargeId)} key="detail">查看</a>
              <Divider type="vertical" key='spilt1' />
              <MoreBtn key="more" item={record} />
            </span>
          ];
        }
      },
    },
  ] as ColumnProps<any>[];
  return (
    <Page>
      <Table
        key='listTable'
        style={{ border: 'none' }}
        bordered={false}
        size="middle"
        dataSource={data}
        columns={columns}
        rowKey={record => record.id}
        pagination={pagination}
        scroll={{ y: 500, x: 2000 }}
        onChange={(pagination: PaginationConfig, filters, sorter) =>
          changePage(pagination, filters, sorter)
        }
        loading={loading}
      />
    </Page>
  );
}

export default ListTable;
