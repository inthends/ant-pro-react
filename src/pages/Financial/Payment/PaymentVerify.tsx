import { Card, Button, Col, Drawer, Form, Row, Input, Table } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { DefaultPagination } from '@/utils/defaultSetting';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import { Audit, GetEntity, PaymentFeeDetail } from './Payment.service';
// import './style.less';
import styles from './style.less';
import moment from 'moment';

interface PaymentVerifyProps {
  verifyVisible: boolean;
  ifVerify: boolean;
  closeVerify(result?): void;
  form: WrappedFormUtils;
  id?: string;
  reload(): void;
}

const PaymentVerify = (props: PaymentVerifyProps) => {
  const { verifyVisible, closeVerify, form, id, ifVerify, reload } = props;
  const title = ifVerify ? '付款单审核' : '付款单取消审核';
  // const [loading, setLoading] = useState<boolean>(false);
  const { getFieldDecorator } = form;
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false); 
  const [pagination, setPagination] = useState<DefaultPagination>(new DefaultPagination());

  useEffect(() => {
    if (verifyVisible) {
      form.resetFields();
      if (id != null && id != '') {
        //setLoading(true);
        GetEntity(id).then(res => {
          setInfoDetail(res);
          //setLoading(false); 
          initPaymentFeeDetail(); 
        })
      } else {
        setInfoDetail({});
        //setLoading(false);
      }
    }
  }, [verifyVisible]);

  const close = () => {
    closeVerify(false);
  };

  const initPaymentFeeDetail = (paginationConfig?: PaginationConfig, sorter?) => {
    //setMeterSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { billid: id }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : 'billid';
    }

    return load(searchCondition).then(res => {
      return res;
    });
  }

  const load = data => {
    setLoading(true);
    data.sidx = data.sidx || 'billid';
    data.sord = data.sord || 'asc';
    return PaymentFeeDetail(data).then(res => {
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
    }).catch(() => {
      setLoading(false);
    });
  };

  const onSave = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        // let newData = {
        //   keyValue: id,
        //   entity: {
        //     billId: id,
        //     // verifyDate: ifVerify ? moment(new Date()).format('YYYY-MM-DD HH:mm:ss') : moment(values.verifyDate).format('YYYY-MM-DD HH:mm:ss'),
        //     verifyMemo: values.verifyMemo,
        //     billCode: infoDetail.billCode,
        //     billDate: moment(values.billDate).format('YYYY-MM-DD'),
        //     status: ifVerify ? 1 : 0,//-1 已作废  0未审核  1已审核
        //     payAmount: infoDetail.payAmount,
        //     createDate: moment(infoDetail.createDate).format('YYYY-MM-DD'),
        //     payType: infoDetail.payType,
        //     organizeId: infoDetail.organizeId,
        //     createUserId: infoDetail.createUserId,
        //     createUserName: infoDetail.createUserName
        //   }
        // };

        const newData = infoDetail ? { ...infoDetail, ...values } : values;
        newData.keyValue = infoDetail.billId;
        newData.ifVerify = ifVerify; 
        Audit(newData).then(() => {
          closeVerify(true);
          reload();
        });
      }
    });
  };

  const columns = [
    {
      title: '单元编号',
      dataIndex: 'code',
      key: 'code',
      width: 160
    },
    {
      title: '付款项目',
      dataIndex: 'feeName',
      key: 'feeName',
      width: 160
    },
    {
      title: '应付期间',
      dataIndex: 'period',
      key: 'period',
      width: 120,
      render: val => {
        if (val == null) {
          return ''
        } else {
          return moment(val).format('YYYY-MM-DD');
        }
      }
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      width: 80
    },
    {
      title: '应付金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 80
    },
    {
      title: '本次付款',
      dataIndex: 'payAmount',
      key: 'payAmount',
      width: 80
    },
    {
      title: '计费起始日期',
      dataIndex: 'beginDate',
      key: 'beginDate',
      width: 120,
      render: val => {
        if (val == null) {
          return ''
        } else {
          return moment(val).format('YYYY-MM-DD');
        }
      }
    },
    {
      title: '计费截止日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
      render: val => {
        if (val == null) {
          return ''
        } else {
          return moment(val).format('YYYY-MM-DD');
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
    <Drawer
      title={title}
      placement="right"
      width={700}
      onClose={close}
      visible={verifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Card className={styles.card}>
        <Form layout="vertical" hideRequiredMark>
          {/* <Row gutter={24}>
            <Col span={8}>
              <Form.Item required label="单号">
                {getFieldDecorator('billCode', {
                  initialValue: infoDetail.billCode,
                })(
                  <Input disabled={true} placeholder="自动获取单号" />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item required label="账单日期"  >
                {getFieldDecorator('billDate', {
                  initialValue: infoDetail.billDate == null ? moment(new Date()) : moment(infoDetail.billDate),
                  rules: [{ required: true, message: '请选择账单日期' }],
                })(
                  <DatePicker disabled={true} style={{ width: '100%' }} />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item required label="经办人">
                {getFieldDecorator('createUserName', {
                  initialValue: infoDetail.createUserName,
                })(
                  <Input disabled={true} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item required label="本次付款"   >
                {getFieldDecorator('payAmount', {
                  initialValue: infoDetail.payAmount,
                })(
                  <Input disabled={true}></Input>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item required label="审核日期"   >
                {getFieldDecorator('verifyDate', {
                  initialValue: infoDetail.billDate == null ? moment(new Date()) : moment(infoDetail.billDate),
                })(
                  <DatePicker disabled={true} style={{ width: '100%' }} />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item required label="审核人"  >
                {getFieldDecorator('verifyPerson', {
                  initialValue: infoDetail.verifyPerson,
                })(
                  <Input disabled={true} />
                )}
              </Form.Item>
            </Col>
          </Row> */}


          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="付款单号">
                {infoDetail.billCode}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="付款日期"  >
                {String(infoDetail.billDate).substr(0, 10)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="经办人"  >
                {infoDetail.createUserName}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="本次付款"   >
                {infoDetail.payAmount}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="付款方式"  >
                {infoDetail.payType}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="审核人"   >
                {infoDetail.verifyPerson}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="备注"  >
                {infoDetail.memo}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Table<any>
              bordered={false}
              size="middle"
              columns={columns}
              dataSource={data}
              rowKey="billId"
              pagination={pagination}
              scroll={{ y: 500, x: 1100 }}
              loading={loading}
              onChange={(pagination: PaginationConfig, filters, sorter) =>
                initPaymentFeeDetail(pagination, sorter)
              }
            />
          </Row>

          <Row>
            <Col span={24}>
              <Form.Item label="审核情况"  >
                {getFieldDecorator('verifyMemo', {
                  initialValue: infoDetail.verifyMemo
                })(
                  <Input.TextArea rows={5} placeholder="请输入审核情况" />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
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
        <Button style={{ marginRight: 8 }}
          onClick={() => closeVerify()}
        >
          取消
            </Button>
        <Button type="primary"
          onClick={() => onSave()}
        >
          提交
        </Button>
      </div>

    </Drawer>
  );
};

export default Form.create<PaymentVerifyProps>()(PaymentVerify);

