//已收列表
import Page from '@/components/Common/Page';
import { Icon, Menu, Dropdown, Divider, message, Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useState } from 'react';
import moment from 'moment';
import { RemoveForm } from './Main.service';
import styles from './style.less';

interface ChargeListTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  showDetail(): void;
  showVertify(id: string, ifVertify: boolean): void;
  reload(): void;
  getRowSelect(record): void;
}

function ChargeListTable(props: ChargeListTableProps) {
  const { onchange, loading, pagination, data, reload, getRowSelect, showDetail, showVertify } = props;
  // const changePage = (pagination: PaginationConfig, filters, sorter) => {
  //   onchange(pagination, filters, sorter);
  // };


  const MoreBtn: React.FC<{
    item: any;
  }> = ({ item }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => editAndDelete(key, item)}>
          <Menu.Item key="redflush">冲红</Menu.Item>
          <Menu.Item key="delete">作废</Menu.Item>
        </Menu>}>
      <a>
        更多<Icon type="down" />
      </a>
    </Dropdown>
  );

  const editAndDelete = (key: string, currentItem: any) => {
    if (key === 'redflush') {
      //this.showEditModal(currentItem);


    }
    else if (key === 'delete') { 
      Modal.confirm({
        title: '请确认',
        content: `您是否要作废${currentItem.billCode}`,
        onOk: () => {
          RemoveForm(currentItem.id).then(() => {
            message.success('作废成功');
            reload();
          });
        },
      }); 
    }
  };

  const columns = [
    {
      title: '收款单编号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 120,
      sorter: true,
    },
    {
      title: '收款日期',
      dataIndex: 'billDate',
      key: 'billDate',
      width: 100,
      sorter: true,
      render: val => <span> {moment(val).format('YYYY-MM-DD')} </span>
    },
    {
      title: '房间编号',
      dataIndex: 'unitID',
      key: 'unitID',
      width: 150,
      sorter: true,
    },
    {
      title: '业户名称',
      dataIndex: 'offsetAmount',
      key: 'offsetAmount',
      width: 150,
      sorter: true,
    },
    {
      title: '收款人',
      dataIndex: 'createUserName',
      key: 'createUserName',
      width: 80,
      sorter: true,
    },
    {
      title: '收款金额',
      dataIndex: 'payAmount',
      key: 'payAmount',
      width: 80,
    }, {
      title: '收据编号',
      dataIndex: 'payCode',
      key: 'payCode',
      width: 80,
    }, {
      title: '审核日期',
      dataIndex: 'verifyDate',
      key: 'verifyDate',
      width: 100,
      render: val => val == null || val == "" ? <span></span> : <span> {moment(val).format('YYYY-MM-DD')} </span>
    }, {
      title: '审核人',
      dataIndex: 'verifyPerson',
      key: 'verifyPerson',
      width: 80
    },
    {
      title: '状态',
      dataIndex: 'statusName',
      key: 'statusName',
      width: 80
    },

    {
      title: '审核情况',
      dataIndex: 'verifyMemo',
      key: 'verifyMemo',
      width: 120
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      align: 'center',
      width: 150,
      render: (text, record) => {
        return [
          <span>
            <a onClick={() => showDetail()} key="view">查看</a>
            <Divider type="vertical" />
            {record.status == 1 ? <a onClick={() => showVertify(record.id, false)} key="delete">审核</a> : <a onClick={() => showVertify(record.id, true)} key="delete">反审</a>}
            <Divider type="vertical" />
            <MoreBtn key="more" item={record} />
          </span>

        ];
      },
    },
  ] as ColumnProps<any>[];

  const [selectedRowKey, setSelectedRowKey] = useState([]);

  const onRow = (record) => {
    return {
      onClick: event => {
        setSelectedRowKey(record.billID);
        getRowSelect(record);
        console.log(record);
      }, // 点击行
      onDoubleClick: event => {

      },
      onContextMenu: event => {

      },
      onMouseEnter: event => {

      }, // 鼠标移入行
      onMouseLeave: event => {

      },
    };
  }

  const setClassName = (record, index) => {
    if (record.billID === selectedRowKey) {
      return styles.rowSelect;
    } else {
      if (record.status == 3) {
        return styles.rowFlush
      } else {
        return '';
      }
    }

  }
  return (
    <Page >
      <Table
        className={styles.chargeListTable}
        bordered={false}
        size="middle"
        dataSource={data}
        columns={columns}
        rowKey={record => record.billID}
        pagination={pagination}
        scroll={{ y: 500, x: 1400 }}
        rowClassName={setClassName} //表格行点击高亮
        loading={loading}
        onRow={onRow}
        onChange={onchange}
      />
    </Page>
  );
}

export default ChargeListTable;
