//查看付款单
import { Modal,Card, Button, Col, Drawer, Form, Row, Table } from 'antd';
import { DefaultPagination } from '@/utils/defaultSetting';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { Print, GetEntity, PaymentFeeDetail } from './Payment.service';
import styles from './style.less';
import moment from 'moment';
interface ShowProps {
  visible: boolean;
  closeDrawer(): void;
  form: WrappedFormUtils;
  id?: string;
  organizeId?: string;
  // reload(): void;
}

const Show = (props: ShowProps) => {
  const { visible, closeDrawer, form, id } = props;
  const title = '查看付款单';
  const [loading, setLoading] = useState<boolean>(false);
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

  const onPrint = () => {
    //打印
    Modal.confirm({
      title: '请确认',
      content: `您是否要打印吗？`,
      onOk: () => {
        setLoading(true);
        Print(id).then(res => {
          //window.location.href = res;
          window.open(res);
          setLoading(false);
        });
      },
    });
  };

  const columns = [
    {
      title: '房产编号',
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
      visible={visible}
      style={{ height: 'calc(100vh-50px)' }}
      bodyStyle={{ background: '#f6f7fb', height: 'calc(100vh -55px)' }}
    >
      <Card className={styles.card}>
        <Form layout="vertical" >
          {/* <Spin tip="数据处理中..." spinning={loading}> */}
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
          {/* </Spin> */}
        </Form>
      </Card>
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          // zIndex: 999,
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
        <Button onClick={onPrint} type="primary">
          打印
        </Button>
      </div>
    </Drawer>
  );
};

export default Form.create<ShowProps>()(Show);

