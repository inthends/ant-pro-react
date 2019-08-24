import Page from '@/components/Common/Page';
import { Divider, Form, message, Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useState } from 'react';
import moment from 'moment';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import VerifyReductionModal from './VerifyReductionModal';
import { RemoveForm } from './Main.service';

interface ListTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  modify(id: string): void;
  reload(): void;
  form: WrappedFormUtils;
}

function ListTable(props: ListTableProps) {
  const { onchange, loading, pagination, data, modify, reload } = props;
  const [verifyVisible, setVerifyVisible] = useState<boolean>(false);
  // const [id, setId] = useState<string>('');
  const [verifyId, setVerifyId] = useState<any>('');
  const [ifVerifyModal, setIfVerifyModal] = useState<boolean>(false);

  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    onchange(pagination, filters, sorter);
  };
  const doDelete = record => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要删除${record.billCode}`,
      onOk: () => {
        RemoveForm(record.billID).then(() => {
          message.success('保存成功');
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
          return <span></span>
        } else {
          return <span> {moment(val).format('YYYY-MM-DD')} </span>
        }
      }
    },
    {
      title: '减免费项',
      dataIndex: 'feeName',
      key: 'feeName',
      width: 150,
      sorter: true,
    },
    {
      title: '经办人',
      dataIndex: 'createUserName',
      key: 'createUserName',
      width: 100,
      sorter: true,
    },
    {
      title: '审核状态',
      dataIndex: 'ifVerifyName',
      key: 'ifVerifyName',
      width: 100,
      sorter: true,
    },
    {
      title: '审核人',
      dataIndex: 'verifyPerson',
      key: 'verifyPerson',
      width: 85,
      sorter: true,
    }, {
      title: '审核日期',
      dataIndex: 'verifyDate',
      key: 'verifyDate',
      width: 100,
      render: val => {
        if (val == null) {
          return <span></span>
        } else {
          return <span>{moment(val).format('YYYY-MM-DD')} </span>
        }
      }
    }, {
      title: '审核情况',
      dataIndex: 'verifyMemo',
      key: 'verifyMemo'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      width: '230px',
      render: (text, record) => {

        if (record.ifVerify) {
          return [
            //     <Button
            //       type="primary"
            //       key="modify"
            //       style={{ marginRight: '10px' }}
            //       onClick={() => modify(record.billID)}
            //     >
            //       查看
            // </Button>,
            //     <Button
            //       type="primary"
            //       key="unverify"
            //       disabled={record.ifVerify == 1 ? false : true}
            //       style={{ marginRight: '10px' }}
            //       onClick={() => showVerifyModel(record.billID, false)}
            //     >
            //       反审
            //     </Button>,
            //     <Button type="danger"
            //       disabled={true}
            //       key="delete" onClick={() => doDelete(record)}>
            //       删除
            //    </Button>, 
            <span>
              <a onClick={() => modify(record.billID)} key="modify">查看</a>
              <Divider type="vertical" />
              <a onClick={() => showVerifyModel(record.billID, false)} key="modify">反审</a> 
            </span> 
          ];
        } else {

          return [
            //   <Button
            //     type="primary"
            //     key="modify"
            //     style={{ marginRight: '10px' }}
            //     onClick={() => modify(record.billID)}
            //   >
            //     编辑
            // </Button>,
            //   <Button
            //     type="primary"
            //     key="verify" 
            //     style={{ marginRight: '10px' }}
            //     onClick={() => showVerifyModel(record.billID, true)}
            //   >
            //     审核
            // </Button>,
            //   <Button type="danger"
            //     key="delete" onClick={() => doDelete(record)}>
            //     删除
            // </Button>,

            <span>
              <a onClick={() => modify(record.billID)} key="modify">编辑</a>
              <Divider type="vertical" />
              <a onClick={() => showVerifyModel(record.billID, true)} key="verify">审核</a>
              <Divider type="vertical" />
              <a onClick={() => doDelete(record)} key="delete">删除</a>
            </span>

          ];
        }
      },
    },
  ] as ColumnProps<any>;

  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const onSelectChange = (selectedRowKeys, selectedRows) => {
  //   setSelectedRowKeys(selectedRowKeys);
  // };

  const closeVerifyModel = () => {
    setVerifyVisible(false);
    reload();
  }
  const showVerifyModel = (id, ifVerfy) => {
    setVerifyVisible(true);
    setVerifyId(id);
    setIfVerifyModal(ifVerfy);
  }
  return (
    <Page>
      <Table
        bordered={false}
        size="middle"
        dataSource={data}
        columns={columns}
        rowKey={record => record.unitID}
        pagination={pagination}
        scroll={{ y: 500, x: 1400 }}
        onChange={(pagination: PaginationConfig, filters, sorter) =>
          changePage(pagination, filters, sorter)
        }
        loading={loading}
      />
      <VerifyReductionModal
        modalVisible={verifyVisible}
        id={verifyId}
        closeModal={closeVerifyModel}
        ifVerifyModal={ifVerifyModal}
      />
    </Page>
  );
}

export default Form.create<ListTableProps>()(ListTable);
