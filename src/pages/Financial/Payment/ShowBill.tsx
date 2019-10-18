//查看付款单
import { Card, Button, Col, DatePicker, Drawer, Form, Row, Spin, Input, Table } from 'antd';
import { DefaultPagination } from '@/utils/defaultSetting';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { GetEntity, PaymentFeeDetail } from './Payment.service';
import './style.less';
import moment from 'moment';

const { TextArea } = Input;

interface ShowBillProps {
  visible: boolean;
  closeDrawer(): void;
  form: WrappedFormUtils;
  id?: string;
  organizeId?: string;
  // reload(): void;
}

const ShowBill = (props: ShowBillProps) => {
  const { visible, closeDrawer, form, id } = props;
  const title = '查看付款单';
  const [loading, setLoading] = useState<boolean>(false);
  const { getFieldDecorator } = form;
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [data, setData] = useState<any>();
  const [pagination, setPagination] = useState<DefaultPagination>(new DefaultPagination());

  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (id) {
        GetEntity(id).then(res => {
          setInfoDetail(res);
          setLoading(false);
        }).then(() => {
          initPaymentFeeDetail();
        }).catch(() => {
          setLoading(false);
        });
      } else {
        form.resetFields();
        setInfoDetail({});
        setLoading(false);
      }
    }
  }, [visible]);

  const close = () => {
    closeDrawer();
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
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
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

  const columns = [
    {
      title: '单元编号',
      dataIndex: 'code',
      key: 'code',
      width: 120
    },
    {
      title: '付款项目',
      dataIndex: 'feeName',
      key: 'feeName',
      width: 120
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
      title: '计费终止日期',
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
      visible={visible}
      style={{ height: 'calc(100vh-50px)' }}
      bodyStyle={{ background: '#f6f7fb', height: 'calc(100vh -50px)' }}
    >
      <Card  >
        <Form layout="vertical" hideRequiredMark>
          <Spin tip="数据加载中..." spinning={loading}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item required label="付款单号">
                  {infoDetail.billCode}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required label="付款日期"  >
                  {infoDetail.billDate}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required label="经办人"  >
                  {infoDetail.createUserName}

                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item required label="本次付款"   >
                  {infoDetail.payAmount}

                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required label="付款方式"  >
                  {infoDetail.payType}

                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required label="审核人"   >
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
                scroll={{ y: 500, x: 1000 }}
                loading={loading}
                onChange={(pagination: PaginationConfig, filters, sorter) =>
                  initPaymentFeeDetail(pagination, sorter)
                }
              />
            </Row>
          </Spin>
        </Form>
      </Card>
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          zIndex: 999,
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button style={{ marginRight: 8 }}
          onClick={() => closeDrawer()}
        >
          关闭
        </Button>
      </div>
    </Drawer>
  );
};

export default Form.create<ShowBillProps>()(ShowBill);

