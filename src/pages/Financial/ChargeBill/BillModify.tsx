//修改收款单
import { message, Input, DatePicker, Select, Divider, PageHeader, Tag, Spin, Button, Card, Table, Col, Drawer, Form, Row } from 'antd';
import { DefaultPagination } from '@/utils/defaultSetting';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetEntityShow, ChargeFeeDetail, SavaReceiveForm } from './Main.service';
import { GetCommonItems } from '@/services/commonItem';
import moment from 'moment';
import styles from './style.less';
import SelectTemplate from './SelectTemplate';
const { Option } = Select;

interface BillModifyProps {
  showVisible: boolean;
  closeShow(): void;
  form: WrappedFormUtils;
  id?: string;
  reload(): void;
}
const BillModify = (props: BillModifyProps) => {
  const { showVisible, closeShow, id, form, reload } = props;
  const title = "修改收款单";
  const { getFieldDecorator } = form;
  const [loading, setLoading] = useState<boolean>(false);
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  // const [chargeBillData, setChargeBillData] = useState<any[]>([]);
  const [chargeBillData, setChargeBillData] = useState<any>();
  const [linkNo, setLinkNo] = useState<any>('');
  //打印
  // const [modalvisible, setModalVisible] = useState<boolean>(false);
  const [banks, setBanks] = useState<any[]>([]); //入账银行
  const [payTypeA, setPayTypeA] = useState<any[]>([]); //收款方式A
  const [payTypeB, setPayTypeB] = useState<any[]>([]); //收款方式B
  const [payTypeC, setPayTypeC] = useState<any[]>([]); //收款方式C
  const [unitNo, setUnitNo] = useState<any>('');
  // 打开抽屉时初始化
  useEffect(() => {

    if (showVisible) {

      //获取开户银行
      GetCommonItems('AccountBank').then(res => {
        setBanks(res || []);
      });

      GetCommonItems('PayTypeA').then(res => {
        setPayTypeA(res || []);
      });

      GetCommonItems('PayTypeB').then(res => {
        setPayTypeB(res || []);
      });

      GetCommonItems('PayTypeC').then(res => {
        setPayTypeC(res || []);
      });

      form.resetFields();

      if (id != null && id != '') {
        // setLoading(true);
        GetEntityShow(id).then(res => {
          setInfoDetail(res.entity);
          setLinkNo(res.linkNo);
          setUnitNo(res.unitNo);
          initLoadFeeDetail(id);
          // setLoading(false);
        })
      }
      else {
        setInfoDetail({});
        // setLoading(false);
      }
    }
  }, [showVisible]);

  //选择模板
  const [modalvisible, setModalVisible] = useState<boolean>(false);

  const showModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  //保存
  const onSave = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        const newData = infoDetail ? { ...infoDetail, ...values } : values;
        newData.billDate = moment(newData.billDate).format('YYYY-MM-DD'),
          SavaReceiveForm({ ...newData }).then(res => {
            message.success('保存成功');
            closeShow();
            reload();
          });
      }
    })
  }

  const initLoadFeeDetail = (billId) => {
    const queryJson = { billId: billId };
    const sidx = 'beginDate';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  }

  const load = data => {
    setLoading(true);
    data.sidx = data.sidx || 'beginDate';
    data.sord = data.sord || 'asc';
    return ChargeFeeDetail(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setChargeBillData(res.data);
      setLoading(false);
      return res;
    });
  };

  //刷新
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
      queryJson: { billId: id },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : 'beginDate';
    }
    return load(searchCondition).then(res => {
      return res;
    });
  };

  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    loadData(pagination, sorter);
  };

  // const close = () => {
  //   closeShow();
  // };

  //const onPrint = () => {
  //打印
  // Modal.confirm({
  //   title: '请确认',
  //   content: `您要打印吗？`, 
  //   onOk: () => {
  //     setLoading(true); 
  //     Print(id).then(res => {
  //       //window.location.href = res;
  //       window.open(res);
  //       setLoading(false);
  //     });
  //   },
  // });
  //弹出选择打印模板  
  //};

  const GetStatus = (status) => {
    switch (status) {
      // case 0:
      //   return <Tag color="#e4aa5b">未收</Tag>;
      case 1:
        return <Tag color="#19d54e">已收</Tag>;
      case 2:
        return <Tag color="#19d54e">冲红</Tag>;
      case -1:
        return <Tag color="#e4aa5b">作废</Tag>;
      default:
        return '';
    }
  };


  const columns = [
    {
      title: '房产编号',
      dataIndex: 'unitCode',
      key: 'unitCode',
      width: 150,
      sorter: true,
    },
    {
      title: '收费项目',
      dataIndex: 'feeName',
      key: 'feeName',
      width: 150,
      sorter: true,
    },
    // {
    //   title: '应收期间',
    //   dataIndex: 'period',
    //   key: 'period',
    //   width: 120,
    //   sorter: true,
    //   render: val => val != null ? moment(val).format('YYYY年MM月') : ''
    // },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      width: 100,
    },
    {
      title: '应收金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
    },

    {
      title: '减免金额',
      dataIndex: 'reductionAmount',
      key: 'reductionAmount',
      width: 80,
    },
    {
      title: '冲抵金额',
      dataIndex: 'offsetAmount',
      key: 'offsetAmount',
      width: 80,
    },
    {
      title: '本次实收金额',
      dataIndex: 'payAmount',
      key: 'payAmount',
      width: 100,
    }, {
      title: '计费起始日期',
      dataIndex: 'beginDate',
      key: 'beginDate',
      width: 120,
      render: val => val != null ? moment(val).format('YYYY-MM-DD') : ''
    }, {
      title: '计费截止日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
      render: val => val != null ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: '单元全称',
      dataIndex: 'allName',
      key: 'allName',
      width: 350
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo'
    }
  ] as ColumnProps<any>[];

  return (
    <Drawer
      title={title}
      placement="right"
      width={950}
      onClose={closeShow}
      visible={showVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <Spin tip="数据处理中..." spinning={loading}>
        <PageHeader
          title={null}
          subTitle={
            <div>
              <label style={{ color: '#4494f0', fontSize: '24px' }}>{infoDetail.billCode}</label>
            </div>
          }
          style={{
            border: '1px solid rgb(235, 237, 240)'
          }}  >
          <Form layout='vertical'>
            <Row gutter={6}>
              <Col span={3}>
                <Form.Item label="状态">
                  {GetStatus(infoDetail.status)}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="收款人">
                  {infoDetail.createUserName}
                </Form.Item>
              </Col>

              <Col span={5}>
                <Form.Item label="业户名称">
                  {infoDetail.customerName}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="房号">
                  {unitNo}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="冲红单号" >
                  {linkNo}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Divider dashed />
          <span style={{ color: "red" }}>
            {`${infoDetail.payAmountA + infoDetail.payAmountB + infoDetail.payAmountC}元，其中${infoDetail.payTypeA}${infoDetail.payAmountA}元，${infoDetail.payTypeB}${infoDetail.payAmountB}元，${infoDetail.payTypeC}${infoDetail.payAmountC}元`}
          </span>
        </PageHeader>
        <Divider dashed />
        <Card className={styles.card}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={24}>
              <Col lg={4}>
                <Form.Item label="收款方式A">
                  {getFieldDecorator('payTypeA', {
                    initialValue: infoDetail.payTypeA ? infoDetail.payTypeA : '支付宝扫码'
                  })(
                    <Select >
                      {payTypeA.map(item => (
                        <Option value={item.value} key={item.key}>
                          {item.title}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={4}>
                <Form.Item label="收款金额">
                  {getFieldDecorator('payAmountA', {
                    initialValue: infoDetail.payAmountA
                  })(<Input readOnly />)}
                </Form.Item>
              </Col>
              <Col lg={4}>
                <Form.Item label="收款方式B">
                  {getFieldDecorator('payTypeB', {
                    initialValue: infoDetail.payTypeB ? infoDetail.payTypeB : '微信扫码'
                  })(
                    <Select>
                      {payTypeB.map(item => (
                        <Option value={item.value} key={item.key}>
                          {item.title}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={4}>
                <Form.Item label="收款金额">
                  {getFieldDecorator('payAmountB', {
                    initialValue: infoDetail.payAmountB
                  })(<Input readOnly />)}
                </Form.Item>
              </Col>
              <Col lg={4}>
                <Form.Item label="收款方式C">
                  {getFieldDecorator('payTypeC', {
                    initialValue: infoDetail.payTypeC ? infoDetail.payTypeC : '现金'
                  })(
                    <Select>
                      {payTypeC.map(item => (
                        <Option value={item.value} key={item.key}>
                          {item.title}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={4}>
                <Form.Item label="收款金额">
                  {getFieldDecorator('payAmountC', {
                    initialValue: infoDetail.payAmountC
                  })(<Input readOnly />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={4}>
                <Form.Item label="收款日期" required>
                  {getFieldDecorator('billDate', {
                    initialValue: moment(infoDetail.billDate),
                    rules: [{ required: true, message: '请选择收款日期' }],
                  })(<DatePicker style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item label="发票编号">
                  {getFieldDecorator('invoiceCode', {
                  })(<Input placeholder="请输入发票编号" />)}
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item label="收据编号">
                  {getFieldDecorator('payCode', {
                  })(<Input placeholder="请输入收据编号" />)}
                </Form.Item>
              </Col>
              <Col lg={4}>
                <Form.Item label="入账银行">
                  {getFieldDecorator('accountBank', {
                  })(<Select placeholder="请选择">
                    {banks.map(item => (
                      <Option value={item.value} key={item.key}>
                        {item.title}
                      </Option>
                    ))}
                  </Select>)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col lg={24}>
                <Form.Item label="备注" >
                  {getFieldDecorator('memo', {
                    initialValue: infoDetail.memo,
                  })(
                    <Input.TextArea rows={2} />
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Table
              // title={() => '费用明细'}
              size="middle"
              dataSource={chargeBillData}
              columns={columns}
              rowKey={record => record.id}
              pagination={pagination}
              scroll={{ y: 500, x: 1700 }}
              loading={loading}
              onChange={(pagination: PaginationConfig, filters, sorter) =>
                changePage(pagination, filters, sorter)
              }
            />
          </Form>
        </Card>
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
          zIndex: 999,
        }}
      >
        <Button onClick={closeShow} style={{ marginRight: 8 }}>
          取消
        </Button>

        <Button onClick={showModal} type="primary" style={{ marginRight: 8 }}>
          打印
        </Button>

        <Button onClick={onSave} type="primary">
          提交
        </Button>

      </div>

      <SelectTemplate
        id={id}
        visible={modalvisible}
        closeModal={closeModal}
        unitId={infoDetail.unitId}
      />
    </Drawer>
  );
};
export default Form.create<BillModifyProps>()(BillModify);

