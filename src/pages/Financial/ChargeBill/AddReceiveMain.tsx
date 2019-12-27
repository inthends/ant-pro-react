//添加收款单
import { message, Tag, Input, Button, Icon, Table, Spin, Form, Row, Col, DatePicker, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import moment from 'moment';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { DefaultPagination } from '@/utils/defaultSetting';
import styles from './style.less';
import { GetUnSubmitChargeList, SaveSubmitDetail } from './Main.service';
const { Search } = Input;
interface AddReceiveMainProps {
  visible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  // rowSelect(rowSelectedKeys): void;
  mainId?: string;
  reload(): void;
}

const AddReceiveMain = (props: AddReceiveMainProps) => {
  const { visible, closeModal, reload, mainId } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [dataCharge, setChargeData] = useState<any[]>([]);
  const [loadingCharge, setLoadingCharge] = useState<boolean>(false);
  const [chargedSearchParams, setChargedSearchParams] = useState<any>({});
  const [paginationCharge, setPaginationCharge] = useState<PaginationConfig>(new DefaultPagination());
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);

  useEffect(() => {
    if (visible) {
      initChargeLoadData();
    }
  }, [visible])

  const onOk = () => {

    if (selectedRowKeys.length == 0) {
      message.warning('请选择收款单！');
      return;
    }

    setLoading(true);
    let newData = {
      mainId: mainId,
      ids: JSON.stringify(selectedRowKeys)
    };

    SaveSubmitDetail(newData).then((res) => {
      message.success('保存成功');
      setLoading(false);
      reload();
      closeModal();
    })
  };

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };


  //已收款
  const loadChargeData = (paginationConfig?: PaginationConfig, sorter?) => {
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: paginationCharge.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: {
        keyword: chargedSearchParams.search ? chargedSearchParams.search : '',
        StartDate: chargedSearchParams.startDate ? chargedSearchParams.startDate : '',
        EndDate: chargedSearchParams.endDate ? chargedSearchParams.endDate : ''
      },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billCode';
    }
    return loadCharge(searchCondition).then(res => {
      return res;
    });
  };

  const loadCharge = data => {
    setLoadingCharge(true);
    data.sidx = data.sidx || 'billCode';
    data.sord = data.sord || 'desc';
    return GetUnSubmitChargeList(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPaginationCharge(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setChargeData(res.data);
      setLoadingCharge(false);
      return res;
    });
  };

  const initChargeLoadData = () => {
    const queryJson = {
      keyword: chargedSearchParams.search ? chargedSearchParams.search : '',
      StartDate: chargedSearchParams.startDate ? chargedSearchParams.startDate : '',
      EndDate: chargedSearchParams.endDate ? chargedSearchParams.endDate : ''
    };
    const sidx = 'billCode';
    const sord = 'desc';
    const { current: pageIndex, pageSize, total } = paginationCharge;
    return loadCharge({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
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
      render: val => moment(val).format('YYYY-MM-DD')
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 60,
      render: (text, record) => {
        switch (text) {
          case 1:
            return <Tag color="#e4aa4b">已收</Tag>;
          case 2:
            return <Tag color="#19d54e">冲红</Tag>;
          default:
            return '';
        }
      }
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo'
    }
  ] as ColumnProps<any>[];

  return (
    <Modal
      title="添加收款单"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={() => onOk()}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='900px' >
      <Spin tip="数据处理中..." spinning={loading}>
        <Row>
          <Col lg={24} >
            <div style={{ marginBottom: '15px' }}>

              <DatePicker
                placeholder='收款日期起'
                onChange={(date, dateStr) => {
                  var params = Object.assign({}, chargedSearchParams, { startDate: dateStr });
                  setChargedSearchParams(params);
                }} style={{ marginRight: '5px', width: '150px' }} />
              至
              <DatePicker
                placeholder='收款日期至'
                onChange={(date, dateStr) => {
                  var params = Object.assign({}, chargedSearchParams, { endDate: dateStr });
                  setChargedSearchParams(params);
                }} style={{ marginLeft: '5px', marginRight: '5px', width: '150px' }} />
              <Search
                className="search-input"
                placeholder="请输入收款单号"
                style={{ width: 200 }}
                onChange={e => {
                  var params = Object.assign({}, chargedSearchParams, { search: e.target.value });
                  setChargedSearchParams(params);
                }}
              />
              <Button type="primary" style={{ marginLeft: '3px' }}
                onClick={() => {
                  initChargeLoadData();
                }}
              >
                <Icon type="search" />
                搜索
              </Button>
            </div>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col lg={24}>
            <Table
              className={styles.chargeListTable}
              bordered={false}
              size="middle"
              dataSource={dataCharge}
              columns={columns}
              rowKey={record => record.billId}
              pagination={paginationCharge}
              scroll={{ y: 500, x: 1200 }}
              loading={loadingCharge}
              onChange={(paginationConfig, filters, sorter) =>
                loadChargeData(paginationConfig, sorter)
              }
              rowSelection={rowSelection}
            />
          </Col>
        </Row>
      </Spin>
    </Modal >
  );
};

//export default AddReductionItem; 
export default Form.create<AddReceiveMainProps>()(AddReceiveMain);
