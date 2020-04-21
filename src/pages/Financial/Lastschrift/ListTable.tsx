//账单
import Page from '@/components/Common/Page';
import { message, Modal, Divider, Form, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import moment from 'moment';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { InvalidForm } from './Offset.service';
import styles from './style.less';

interface ListTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  // modify(id: string): void;
  reload(): void;
  form: WrappedFormUtils;
  // deleteData(id): void;
  showVerify(id?, ifVerify?): any;
  closeVerify(result?): any;
  showModify(id?): any;
  closeModify(result?): any;
};


function ListTable(props: ListTableProps) {
  const { onchange, reload, loading, pagination, data, showVerify, showModify } = props;
  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    onchange(pagination, filters, sorter);
  };
  const doInvalid = record => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要作废${record.billCode}？`,
      onOk: () => {
        InvalidForm(record.billId).then(() => {
          message.success('作废成功');
          reload();
        });
      },
    });
  };

  const getClassName = (record, index) => {
    if (record.status == -1) {
      return styles.rowRed
    } else {
      return '';
    }
  };

  const columns = [
    {
      title: '划账单号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 180,
      sorter: true
    },
    {
      title: '单据日期',
      dataIndex: 'billDate',
      key: 'billDate',
      width: 120,
      sorter: true,
      render: val => {
        if (val == null) {
          return '';
        } else {
          return moment(val).format('YYYY-MM-DD');
        }
      }
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
      title: '是否审核',
      dataIndex: 'ifVerify',
      key: 'ifVerify',
      width: 100, 
      render: val => val ? '已审核' : '未审核'
    },
    {
      title: '审核人',
      dataIndex: 'verifyPerson',
      key: 'verifyPerson',
      width: 80,
    },
    {
      title: '审核日期',
      dataIndex: 'verifyDate',
      key: 'verifyDate',
      width: 120,
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
      width: 100
    }, {
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
      width: 155,
      render: (text, record) => {
        if (record.ifVerify) {
          return [
            // <Button
            //   type="primary"
            //   key="modify"
            //   style={{ marginRight: '10px' }}
            //   onClick={() => showModify(record.billId)}  >
            //   查看
            // </Button>,
            // <Button
            //   type="primary"
            //   key="verify"
            //   style={{ marginRight: '10px' }}
            //   onClick={() => showVerify(record.billId, false)}
            // >
            //   反审
            // </Button>,
            // <Button
            //   type="danger"
            //   key="delete"
            //   disabled={true}>
            //   删除
            // </Button>
            <span>
              <a onClick={() => showModify(record.billId)} key="modify">查看</a>
              <Divider type="vertical" />
              <a onClick={() => showVerify(record.billId, false)} key="modify">反审</a>
            </span>
          ];
        }
        else {

          if (record.status == -1) {
            //作废，只能查看
            return [<a onClick={() => showModify(record.billId)} key="modify">查看</a>]
          } else { 
            return [
              //   <Button
              //     type="primary"
              //     key="modify"
              //     style={{ marginRight: '10px' }}
              //     onClick={() => showModify(record.billId)} >
              //     编辑
              //   </Button>,
              //   <Button
              //     type="primary"
              //     key="verify"
              //     style={{ marginRight: '10px' }}
              //     onClick={() => showVerify(record.billId, true)}   >
              //     审核
              //     </Button>,
              //      <Button type="danger"
              //      key="delete" onClick={() =>  deleteData(record.billId)}>
              //      删除
              //  </Button>,  
              <span>
                {/* <a onClick={() => showModify(record.billId)} key="modify">编辑</a> */}
                <a onClick={() => showModify(record.billId)} key="modify">查看</a>
                <Divider type="vertical" />
                <a onClick={() => showVerify(record.billId, true)} key="verify">审核</a>
                <Divider type="vertical" />
                <a onClick={() => doInvalid(record)} key="invalid">作废</a>
              </span> 
            ];
          }
        }
      }
    }
  ] as ColumnProps<any>[];

  return (
    <Page>
      <Table
        bordered={false}
        size="middle"
        columns={columns}
        dataSource={data}
        rowKey="billId"
        pagination={pagination}
        scroll={{ x: 1100, y: 500 }}
        rowClassName={getClassName} //样式
        loading={loading}
        onChange={(pagination: PaginationConfig, filters, sorter) =>
          changePage(pagination, filters, sorter)
        }
      />
    </Page>
  );
}
export default Form.create<ListTableProps>()(ListTable);
