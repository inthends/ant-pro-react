//已收列表
import Page from '@/components/Common/Page';
import { Tag, Icon, Menu, Dropdown, Divider, message, Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useState } from 'react';
import moment from 'moment';
import { InvalidForm, RedFlush, CheckRedFlush } from './Main.service';
import styles from './style.less';

interface ChargeListTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  showDetail(billId): void;
  showVertify(id: string, ifVertify: boolean): void;
  reload(): void;
  // getRowSelect(record): void;
  rowSelect(rowSelectedKeys): void;
}

function ChargeListTable(props: ChargeListTableProps) {
  const { onchange, loading, pagination, data, reload, rowSelect, showDetail, showVertify } = props;
  // const changePage = (pagination: PaginationConfig, filters, sorter) => {
  //   onchange(pagination, filters, sorter);
  // };

  const MoreBtn: React.FC<{
    item: any;
  }> = ({ item }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => editAndDelete(key, item)}>
          < Menu.Item key="redflush">冲红</Menu.Item>
          < Menu.Item key="invalid">作废</Menu.Item>
        </Menu >
      }>
      <a>
        更多<Icon type="down" />
      </a>
    </Dropdown >
  );

  const editAndDelete = (key: string, currentItem: any) => {
    if (key === 'redflush') {
      //this.showEditModal(currentItem);  
      //check
      CheckRedFlush(currentItem.billId).then((res) => {

        if (res.flag) {
          Modal.confirm({
            title: '请确认',
            content: `您确定要冲红该收款单${currentItem.billCode}`,
            onOk: () => {
              RedFlush(currentItem.billId).then(() => {
                message.success('冲红成功');
                reload();
              });
            },
          });
        } else {

          Modal.confirm({
            title: '请确认',
            content: `该收款单已经生成付款单${res.billCode}不允许冲红！`,
            onOk: () => {
              //to do
            },
          });

        }

      });

    }
    else if (key === 'invalid') {
      Modal.confirm({
        title: '请确认',
        content: `您是否要作废${currentItem.billCode}？`,
        onOk: () => {
          InvalidForm(currentItem.billId).then(() => {
            message.success('作废成功！');
            reload();
          });
        },
      });
    }
  };

  const columns = [
    {
      title: '收款单号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 180,
      sorter: true,
    },
    {
      title: '收款日期',
      dataIndex: 'billDate',
      key: 'billDate',
      width: 100,
      sorter: true,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: '单元编号',
      dataIndex: 'unitId',
      key: 'unitId',
      width: 150,
      sorter: true,
    },
    {
      title: '业户名称',
      dataIndex: 'customerName',
      key: 'customerName',
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
    },
    {
      title: '费用状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 80,
      render: (text, record) => {
        switch (text) {
          case 0:
            return <Tag color="#e4aa5b">未收</Tag>;
          case 1:
            return <Tag color="#19d54e">已收</Tag>;
          case 2:
            return <Tag color="#19d54e">冲红</Tag>;
          case -1:
            return <Tag color="#e4aa5b">作废</Tag>;
          default:
            return '';
        }
      }
    },
    {
      title: '单据状态',
      dataIndex: 'ifVerify',
      key: 'ifVerify',
      align: 'center',
      width: 80,
      // render: val => val ? '已审核' : '未审核'
      render: (text, record) => {
        switch (text) {
          case 0:
            return <Tag color="#D7443A">待对账</Tag>;
          case 1:
            return <Tag color="#19d54e">已对账</Tag>;
          case 2:
            return <Tag color="#e4aa4b">已送审</Tag>;
          case 3:
            return <Tag color="#19d54e">已审核</Tag>;
          default:
            return '';
        }
      }
    },
    {
      title: '对账日期',
      dataIndex: 'verifyDate',
      key: 'verifyDate',
      width: 160,
      // render: val => val == null || val == "" ? '' : moment(val).format('YYYY-MM-DD')
    }, {
      title: '对账人',
      dataIndex: 'verifyPerson',
      key: 'verifyPerson',
      width: 80
    },
    {
      title: '对账说明',
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
        if (record.status == 1 && record.linkId == null) {
          //更多操作
          return [
            <span key='span1'>
              {!record.ifVerify ? <a onClick={() => showVertify(record.billId, false)} key="approve">对账</a> : <a onClick={() => showVertify(record.billId, true)} key="unapprove">反审</a>}
              <Divider type="vertical" />
              <a onClick={() => showDetail(record.billId)} key="view">查看</a>
              <Divider type="vertical" />
              {record.status == 1 && record.linkId == null ? <MoreBtn key="more" item={record} /> : null}
            </span>
          ];

        } else {
          return [
            <a onClick={() => showDetail(record.billId)} key="view">查看</a>
          ];
        }
      },
    },
  ] as ColumnProps<any>[];
  const [selectedRowKey, setSelectedRowKey] = useState([]);
  const onRow = (record) => {
    return {
      onClick: event => {
        setSelectedRowKey(record.billId);
        // getRowSelect(record);
        //console.log(record);
      }, // 点击行
      // onDoubleClick: event => {
      // },
      // onContextMenu: event => {
      // },
      // onMouseEnter: event => {
      // }, // 鼠标移入行
      // onMouseLeave: event => {
      // },
    };
  }

  const setClassName = (record, index) => {
    if (record.billId === selectedRowKey) {
      return styles.rowSelect;
    } else {
      if (record.status == 2 || record.status == -1) {
        return styles.rowRed
      } else {
        return '';
      }
    }
  };

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    rowSelect(selectedRowKeys);
  };
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Page >
      <Table
        className={styles.chargeListTable}
        bordered={false}
        size="middle"
        dataSource={data}
        columns={columns}
        rowKey={record => record.billId}
        pagination={pagination}
        scroll={{ y: 500, x: 1700 }}
        rowClassName={setClassName} //表格行点击高亮
        loading={loading}
        onRow={onRow}
        onChange={onchange}
        rowSelection={rowSelection}
      />
    </Page>
  );
}

export default ChargeListTable;
