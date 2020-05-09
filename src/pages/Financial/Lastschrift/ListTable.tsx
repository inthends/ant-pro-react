//账单
import Page from '@/components/Common/Page';
import { Tag, Icon, Menu, Dropdown, message, Modal, Divider, Form, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import moment from 'moment';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { InvalidForm, Export } from './Lastschrift.service';
import styles from './style.less';
import ExportJsonExcel from 'js-export-excel';

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
  showCheck(id?): any;
  closeModify(result?): any;
};

function ListTable(props: ListTableProps) {
  const { onchange, reload, loading, pagination, data, showVerify, showModify, showCheck } = props;
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

  //导出明细
  const doExport = (billId) => {
    //导出
    Export(billId).then((data) => {
      let option: any = {};
      let dataTable: any[] = [];
      if (data) {
        for (let i in data) {
          if (data) {
            let obj = {
              '费项': data[i].feeName,
              '划账金额': data[i].amount,
              '扣款金额': data[i].deductionAmount,
              '物业开户银行': data[i].bank,
              '户名': data[i].name,
              '房号': data[i].code,
              '开户行': data[i].accountBank,
              '账号': data[i].bankAccount,
              '单元全称': data[i].allName,
            }
            dataTable.push(obj);
          }
        }
      }
      option.fileName = '划账单';
      option.datas = [
        {
          sheetData: dataTable,
          sheetName: 'sheet',
          // sheetFilter: ['组织ID', '组织代码', '组织名称'],
          sheetHeader: ['费项', '划账金额', '扣款金额', '物业开户银行', '户名', '房号', '开户行', '账号', '单元全称'],
        }
      ];

      var toExcel = new ExportJsonExcel(option);
      toExcel.saveExcel();
    });
  }

  const editAndDelete = (key: string, currentItem: any) => {
    if (key === "export") {
      doExport(currentItem.billId);
    }
    else if (key === "check") {
      showCheck(currentItem.billId);
    } else if (key === "verify") {
      showVerify(currentItem.billId, true);
    }
  };

  const MoreBtn: React.FC<{
    item: any;
  }> = ({ item }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => editAndDelete(key, item)}>
          <Menu.Item key="export">导出</Menu.Item>
          <Menu.Item key="check">对账</Menu.Item>
          <Menu.Item key="verify">审核</Menu.Item>
        </Menu>}>
      <a>
        更多 <Icon type="down" />
      </a>
    </Dropdown>
  );

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
      width: 100,
      sorter: true,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 70,
      render: (text, record) => {
        switch (text) {
          case 0:
            return <Tag color="#e4aa5b">未对账</Tag>;
          case 1:
            return <Tag color="#19d54e">已对账</Tag>;
          case -1:
            return <Tag color="#e4aa5b">作废</Tag>;
          default:
            return '';
        }
      }
    },
    {
      title: '是否审核',
      dataIndex: 'ifVerify',
      key: 'ifVerify',
      width: 75,
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
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
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
      width: 150,
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
            <span key='span1'>
              <a onClick={() => showModify(record.billId)} key="show">查看</a>
              {/* <Divider type="vertical" />
              <a onClick={() => showVerify(record.billId, false)} key="modify">反审</a> */}
            </span>
          ];
        }
        else {
          if (record.status == -1) {
            //作废，只能查看
            return [<a onClick={() => showModify(record.billId)} key="show">查看</a>]
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
              <span key='span2'>
                {/* <a onClick={() => showModify(record.billId)} key="modify">编辑</a> */}
                <a onClick={() => showModify(record.billId)} key="show">查看</a>
                <Divider type="vertical" />
                <a onClick={() => doInvalid(record)} key="invalid">作废</a>
                <Divider type="vertical" />
                <MoreBtn key="more" item={record} />
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
