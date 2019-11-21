import Page from '@/components/Common/Page';
import { Divider, Form, message, Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import moment from 'moment';
import { WrappedFormUtils } from 'antd/lib/form/Form';
// import VerifyReductionModal from './VerifyReductionModal';
import { InvalidForm } from './Main.service';
import styles from './style.less';

interface ListTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  modify(id: string): void;
  show(id: string): void;
  reload(): void;
  form: WrappedFormUtils;
  verify(id: string, flag: boolean): void;
}

function ListTable(props: ListTableProps) {
  const { onchange, loading, pagination, data, verify, modify, show, reload } = props;
  // const [verifyVisible, setVerifyVisible] = useState<boolean>(false);
  // const [id, setId] = useState<string>('');
  // const [verifyId, setVerifyId] = useState<any>('');
  // const [ifVerifyModal, setIfVerifyModal] = useState<boolean>(false);

  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    onchange(pagination, filters, sorter);
  };
  const doInvalid = record => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要作废${record.billCode}？`,
      onOk: () => {
        InvalidForm(record.billId).then(() => {
          message.success('作废成功！');
          reload();
        });
      },
    });
  };

  const columns = [
    {
      title: '单号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 150,
      sorter: true,
    },
    {
      title: '单据日期',
      dataIndex: 'billDate',
      key: 'billDate',
      width: 100,
      sorter: true,
      render: val => {
        if (val == null) {
          return '';
        } else {
          return moment(val).format('YYYY-MM-DD');
        }
      }
    },
    // {
    //   title: '减免费项',
    //   dataIndex: 'feeName',
    //   key: 'feeName',
    //   width: 150,
    //   sorter: true,
    // },
    {
      title: '经办人',
      dataIndex: 'createUserName',
      key: 'createUserName',
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
      width: 85,
    }, {
      title: '审核日期',
      dataIndex: 'verifyDate',
      key: 'verifyDate',
      width: 100,
      render: val => {
        if (val == null) {
          return '';
        } else {
          return moment(val).format('YYYY-MM-DD');
        }
      }
    }, {
      title: '审核意见',
      dataIndex: 'verifyMemo',
      key: 'verifyMemo'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      align: 'center',
      width: '135px',
      render: (text, record) => {

        if (record.ifVerify) {
          return [
            //     <Button
            //       type="primary"
            //       key="modify"
            //       style={{ marginRight: '10px' }}
            //       onClick={() => modify(record.billId)}
            //     >
            //       查看
            // </Button>,
            //     <Button
            //       type="primary"
            //       key="unverify"
            //       disabled={record.ifVerify == 1 ? false : true}
            //       style={{ marginRight: '10px' }}
            //       onClick={() => showVerifyModel(record.billId, false)}
            //     >
            //       反审
            //     </Button>,
            //     <Button type="danger"
            //       disabled={true}
            //       key="delete" onClick={() => doDelete(record)}>
            //       删除
            //    </Button>, 
            <span>
              <a onClick={() => show(record.billId)} key="modify">查看</a>
              <Divider type="vertical" />
              <a onClick={() => verify(record.billId, false)} key="modify">反审</a>
            </span>
          ];
        } else {

          if (record.status == -1) {
            //作废，只能查看
            return [<a onClick={() => show(record.billId)} key="modify">查看</a>]
          } else {

            return [
              //   <Button
              //     type="primary"
              //     key="modify"
              //     style={{ marginRight: '10px' }}
              //     onClick={() => modify(record.billId)}
              //   >
              //     编辑
              // </Button>,
              //   <Button
              //     type="primary"
              //     key="verify" 
              //     style={{ marginRight: '10px' }}
              //     onClick={() => showVerifyModel(record.billId, true)}
              //   >
              //     审核
              // </Button>,
              //   <Button type="danger"
              //     key="delete" onClick={() => doDelete(record)}>
              //     删除
              // </Button>, 
              <span>
                <a onClick={() => modify(record.billId)} key="modify">编辑</a>
                <Divider type="vertical" />
                <a onClick={() => verify(record.billId, true)} key="verify">审核</a>
                <Divider type="vertical" />
                <a onClick={() => doInvalid(record)} key="invalid">作废</a>
              </span>
            ];
          }
        }
      },
    },
  ] as ColumnProps<any>[];

  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const onSelectChange = (selectedRowKeys, selectedRows) => {
  //   setSelectedRowKeys(selectedRowKeys);
  // };

  // const closeVerifyModel = () => {
  //   setVerifyVisible(false);
  //   reload();
  // };

  // const showVerifyModel = (id, ifVerfy) => {
  //   setVerifyVisible(true);
  //   setVerifyId(id);
  //   setIfVerifyModal(ifVerfy);
  // };

  const getClassName = (record, index) => {
    if (record.status == -1) {
      return styles.rowRed
    } else {
      return '';
    }
  };

  return (
    <Page>
      <Table
        bordered={false}
        size="middle"
        dataSource={data}
        columns={columns}
        rowKey={record => record.unitId}
        pagination={pagination}
        scroll={{ x: 1100, y: 500 }}
        onChange={(pagination: PaginationConfig, filters, sorter) =>
          changePage(pagination, filters, sorter)
        }
        rowClassName={getClassName} //样式
        loading={loading}
      />
    </Page>
  );
}

export default Form.create<ListTableProps>()(ListTable);
