//计费单列表
import Page from '@/components/Common/Page';
import { message, Dropdown, Menu, Icon, Modal, Divider, Form, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useState } from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { InvalidForm } from './BillingMain.service';
import moment from 'moment';
import styles from './style.less';

interface ListTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  reload(): void;
  showModify(id?, isedit?): void;
  // showVerify(id?, flag?): void;
  showVerify(id?): void;
  showDivide(): void;
  showFee(id?): void;
  form: WrappedFormUtils;
  getRowSelect(record): void;
}

function ListTable(props: ListTableProps) {
  const { onchange, loading, pagination, data, reload, showModify, getRowSelect, showVerify, showDivide, showFee } = props;
  const [selectedRowKey, setSelectedRowKey] = useState([]);
  const MoreBtn: React.FC<{
    item: any;
  }> = ({ item }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => editAndDelete(key, item)}>
          <Menu.Item key="redflush">权责摊销</Menu.Item>
          <Menu.Item key="invalid" disabled={item.billSource == "临时加费" || item.ifVerify}>作废</Menu.Item>
        </Menu>}>
      <a>
        更多<Icon type="down" />
      </a>
    </Dropdown>
  );

  const editAndDelete = (key: string, currentItem: any) => {
    if (key === 'redflush') {
      //this.showEditModal(currentItem);
      showDivide();
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
      title: '单号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 100,
      sorter: true
    },
    {
      title: '单据日期',
      dataIndex: 'billDate',
      key: 'billDate',
      width: 100,
      sorter: true,
      render: val => {
        if (val == null) {
          return ''
        } else {
          return moment(val).format('YYYY-MM-DD');
        }
      }
    },
    {
      title: '计费人',
      dataIndex: 'createUserName',
      key: 'createUserName',
      width: 80,
      sorter: true,
    },
    {
      title: '来源',
      dataIndex: 'billSource',
      key: 'billSource',
      width: 100,
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 60,
      render: val => val == 0 ? '正常' : '作废'
    },
    {
      title: '审核状态',
      dataIndex: 'ifVerify',
      key: 'ifVerify',
      width: 100,
      render: val => val ? '已审核' : '未审核'
    },
    {
      title: '审核人',
      dataIndex: 'verifyPerson',
      key: 'verifyPerson',
      sorter: true,
      width: 80
    },
    {
      title: '审核日期',
      dataIndex: 'verifyDate',
      key: 'verifyDate',
      sorter: true,
      width: 100,
      render: val => {
        if (val == null) {
          return '';
        } else {
          return moment(val).format('YYYY-MM-DD');
        }
      }
    },
    {
      title: '审核情况',
      dataIndex: 'verifyMemo',
      key: 'verifyMemo',
      width: 160,
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
      fixed: 'right',
      width: 150,
      render: (text, record) => {
        // return [
        //   <span>
        //     <a onClick={() => showModify(record.billId, record.ifVerifyName == "已审核" || record.billSource == "水电气生成" ? false : true)} key="modify">{record.ifVerifyName == "已审核" || record.billSource == "水电气生成" ? "查看" : "修改"}</a>
        //     <Divider type="vertical" />
        //     <a onClick={() => {
        //       RemoveForm(record.billId).then(res => {
        //         if (res.code != 0) { reload(); }
        //       })
        //     }} key="delete">删除</a>
        //   </span>
        // ];

        return [
          <span>
            {/* <a onClick={() => showModify(record.billId, record.ifVerifyName == "已审核"
              || record.billSource == "水电气生成" ? false : true)} key="modify">
              {record.ifVerifyName == "已审核" || record.billSource == "水电气生成" ? "查看" : "修改"}</a> */}

            {record.ifVerify ? <a onClick={() => showFee(record.billId)}>查看</a> : <a onClick={() => showModify(record.billId, record.billSource == "水电气生成" ? false : true)}>修改</a>}

            <Divider type="vertical" />
            {!record.ifVerify ? <a onClick={() => showVerify(record.billId)} key="app">审核</a> :
              <a onClick={() => showVerify(record.billId)} key="unapp"  >反审</a>
            }
            <Divider type="vertical" />
            <MoreBtn key="more" item={record} />
          </span>
        ];
      },
    },
  ] as ColumnProps<any>[];

  const setClassName = (record, index) => {
    if (record.billId === selectedRowKey) {
      return styles.rowSelect;
    } else {
      if (record.status == 3) {
        return styles.rowFlush
      } else {
        return '';
      }
    }
  };

  const onRow = (record) => {
    return {
      onClick: event => {
        setSelectedRowKey(record.billId);
        getRowSelect(record);
      }
    };
  }

  return (
    <Page>
      <Table<any>
        className={styles.billingMeterTable}
        bordered={false}
        size="middle"
        columns={columns}
        dataSource={data}
        rowKey="billId"
        pagination={pagination}
        scroll={{ y: 500, x: 1300 }}
        loading={loading}
        onChange={onchange}
        rowClassName={setClassName} //表格行点击高亮
        onRow={onRow}
      />
    </Page>
  );
}

export default Form.create<ListTableProps>()(ListTable);

