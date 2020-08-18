//快速冲抵
import { notification, Table, Spin, message, Card, Button, Drawer, Form, Row, Col } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { DefaultPagination } from '@/utils/defaultSetting';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import { NotPaymentFeeData, NotChargeFeeData, OffsetBilling } from './Main.service';
import { PrintByUnitId } from '../../System/Template/Main.service';
import moment from 'moment';
import styles from './style.less';

interface OffsetProps {
  visible: boolean;
  close(): void;
  form: WrappedFormUtils;
  unitId?: string;
  showname?: string;
  reload(): void;
}

const Offset = (props: OffsetProps) => {
  const { visible, close, unitId, showname, reload } = props;
  const title = "冲抵";
  const [loading, setLoading] = useState<boolean>(false);

  const [notPaymentLoading, setNotPaymentLoading] = useState<boolean>(false);
  const [notPaymentData, setNotPaymentData] = useState<any[]>([]);
  const [notPaymentPagination, setNotPaymentPagination] = useState<DefaultPagination>(new DefaultPagination());


  const loadNotPaymentData = (paginationConfig?: PaginationConfig, sorter?) => {
    // setNotPaymentSearchParams(Object.assign({}, notPaymentSearchParams, { search: search }));
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: notPaymentPagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: {
        UnitId: unitId
      }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : 'billDate';
    }
    return notPaymentload(searchCondition);
  }

  //未付列表
  const notPaymentload = data => {
    setNotPaymentLoading(true);
    data.sidx = data.sidx || 'billDate';
    data.sord = data.sord || 'asc';
    return NotPaymentFeeData(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setNotPaymentPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setNotPaymentData(res.data);
      setNotPaymentLoading(false);
      return res;
    }).catch(err => {
      setNotPaymentLoading(false);
    });
  };

  //未付
  const initNotPaymentLoadData = () => {
    const queryJson = {
      UnitId: unitId
    };
    const sidx = 'billDate';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = notPaymentPagination;
    return notPaymentload({ pageIndex, pageSize, sidx, sord, total, queryJson });
  };

  // const close = () => {
  //   closeTrans();
  // };

  const columns = [
    {
      title: '应付费项',
      dataIndex: 'feeName',
      key: 'feeName',
      width: 140,
    },
    {
      title: '未付金额',
      dataIndex: 'lastAmount',
      key: 'lastAmount',
      width: 80,
    },
    {
      title: '计费日期',
      dataIndex: 'beginDate',
      key: 'beginDate',
      width: 180,
      render: (text, record) => {
        if (text) {
          return moment(text).format('YYYY-MM-DD') + '至' + moment(record.endDate).format('YYYY-MM-DD');
        } else {
          return '';
        }
      }
    }
  ] as ColumnProps<any>[];


  //应收
  const columnsreceive = [
    {
      title: '收费项目',
      dataIndex: 'feeName',
      key: 'feeName',
      width: 140,
      render: (text, record) => {
        if (record.rmid != null)
          return <span>{text + ' '}<span style={{ color: 'red', fontSize: '4px', verticalAlign: 'super' }}>惠</span></span>;
        else
          return text;
      }
    },
    {
      title: '未收金额',
      dataIndex: 'lastAmount',
      key: 'lastAmount',
      width: 80,
    },
    {
      title: '计费日期',
      dataIndex: 'beginDate',
      key: 'beginDate',
      align: 'center',
      width: 180,
      render: (text, record) => {
        if (text) {
          return moment(text).format('YYYY-MM-DD') + '至' + moment(record.endDate).format('YYYY-MM-DD');
        } else {
          return '';
        }
      }
    }

  ] as ColumnProps<any>[];

  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());

  const loadData = (paginationConfig?: PaginationConfig, sorter?) => {
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: {
        unitId: unitId
      },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : 'billDate';
    }
    return load(searchCondition).then(res => {
      return res;
    });
  };

  const load = data => {
    setLoading(true);
    data.sidx = data.sidx || 'billDate';
    data.sord = data.sord || 'asc';
    return NotChargeFeeData(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setData(res.data);
      setLoading(false);
      return res;
    });
  };

  const initLoadData = () => {
    // setShowCustomerFee(showCustomerFee);
    const queryJson = {
      unitId: unitId,
      showCustomerFee: true
    };

    const sidx = 'billDate';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  // 打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      if (unitId) {
        //加载费用
        initNotPaymentLoadData();
        initLoadData();
      }
    }
  }, [visible]);

  const [selectedMyRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    //提交可用
    if (selectedRowKeys.length > 0 && selectedMyRadioRowKeys.length > 0)
      setSubmitDisabled(false);
    else
      setSubmitDisabled(true);
  }

  const rowSelection = {
    selectedMyRowKeys,
    onChange: onSelectChange,
  };


  const [selectedMyRadioRowKeys, setSelectedRadioRowKeys] = useState([]);
  const onSelectRadioChange = (selectedRowKeys, selectedRows) => {
    setSelectedRadioRowKeys(selectedRowKeys);
    //提交可用
    if (selectedRowKeys.length > 0 && selectedMyRowKeys.length > 0)
      setSubmitDisabled(false);
    else
      setSubmitDisabled(true);
  }
  const rowRadioSelection = {
    selectedMyRadioRowKeys,
    onChange: onSelectRadioChange,
  };

  const save = () => {
    setLoading(true);
    setSubmitDisabled(true);
    var data = {
      payId: selectedMyRadioRowKeys,
      receiveIds: JSON.stringify(selectedMyRowKeys)
    };

    OffsetBilling(data).then(res => {
      //setLoading(false);
      message.success('提交成功');

      if (res.id != '') {
        //弹出打印
        PrintByUnitId(res.id, '冲抵单', unitId).then(res => {
          //window.location.href = res;
          window.open(res);
          //setLoading(false);
        }).catch(e => {
          //message.warn(e);
          notification.warning({
            message: '系统提示',
            description: e
          });

        }).finally(() => {
          setLoading(false);
        });
      }

      reload();
      close();
    });
  }



  const [isSubmitDisabled, setSubmitDisabled] = useState<boolean>(true);

  return (
    <Drawer
      title={title}
      placement="right"
      width={1100}
      onClose={close}
      visible={visible}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <Spin tip="数据处理中..." spinning={loading}>
        <Row>
          <Card className={styles.cardnarrow}>
            <label style={{ color: '#4494f0', fontSize: '24px' }}>{showname}</label>
          </Card>
        </Row>
        <Row gutter={6}>
          <Col span={12}>
            <Card title="未付列表" hoverable >
              <Table
                bordered={false}
                size="middle"
                dataSource={notPaymentData}
                columns={columns}
                rowKey={record => record.billId}
                pagination={notPaymentPagination}
                scroll={{ y: 800 }}
                onChange={(pagination: PaginationConfig, filters, sorter) =>
                  loadNotPaymentData(pagination, sorter)
                }
                loading={notPaymentLoading}
                rowSelection={{
                  type: 'radio',
                  ...rowRadioSelection
                }}
              />
            </Card>
          </Col>

          <Col span={12}>
            <Card title="未收列表" hoverable>
              <Table
                size="middle"
                bordered={false}
                dataSource={data}
                columns={columnsreceive}
                rowKey={record => record.id}
                pagination={pagination}
                scroll={{ y: 800 }}
                onChange={(pagination: PaginationConfig, filters, sorter) =>
                  loadData(pagination, sorter)
                }
                loading={loading}
                rowSelection={{
                  type: 'checkbox',
                  ...rowSelection
                }}
              />
            </Card>
          </Col>
        </Row>

      </Spin>
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={close} style={{ marginRight: 8 }} disabled={loading}>
          取消
        </Button>
        <Button onClick={save} type="primary" disabled={isSubmitDisabled}>
          提交
        </Button>
      </div>
    </Drawer>
  );
};
export default Form.create<OffsetProps>()(Offset);

