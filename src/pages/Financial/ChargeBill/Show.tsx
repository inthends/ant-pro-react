//查看收款单
import { Spin, Modal, Button, Card, Table, Col, Drawer, Form, Row } from 'antd';
import { DefaultPagination } from '@/utils/defaultSetting';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetEntityShow, ChargeFeeDetail, Print } from './Main.service';
import moment from 'moment';
import styles from './style.less';

interface ShowProps {
  showVisible: boolean;
  closeShow(): void;
  form: WrappedFormUtils;
  id?: string;
}
const Show = (props: ShowProps) => {
  const { showVisible, closeShow, id, form } = props;
  const title = "查看收款单";
  const [loading, setLoading] = useState<boolean>(false);
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [chargeBillData, setChargeBillData] = useState<any[]>([]);
  const [linkno, setLinkno] = useState<any>('');

  // 打开抽屉时初始化
  useEffect(() => {
    form.resetFields();
    if (showVisible) {
      if (id != null && id != '') {
        setLoading(true);
        GetEntityShow(id).then(res => {
          setInfoDetail(res.entity);
          setLinkno(res.linkno);
          initLoadFeeDetail(res.entity.billId);
          setLoading(false);
        })
      }
      else {
        setInfoDetail({});
        setLoading(false);
      }
    }
  }, [showVisible]);

  const columns = [
    {
      title: '单元编号',
      dataIndex: 'unitId',
      key: 'unitId',
      width: 150,
      sorter: true,
    },
    {
      title: '收费项目',
      dataIndex: 'feeName',
      key: 'feeName',
      width: 100,
      sorter: true,
    },
    {
      title: '应收期间',
      dataIndex: 'period',
      key: 'period',
      width: 120,
      sorter: true,
      render: val => val != null ? moment(val).format('YYYY年MM月') : ''
    },
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
    }, {
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
      title: '计费终止日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
      render: val => val != null ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo'
    }
  ] as ColumnProps<any>[];

  const initLoadFeeDetail = (billid) => {
    const queryJson = { billid: billid };
    const sidx = 'beginDate';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  }

  const load = data => {
    setLoading(true);
    data.sidx = data.sidx || 'billId';
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
  const close = () => {
    closeShow();
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

  const GetStatus = (status) => {
    switch (status) {
      case 0:
        return '未收';
      case 1:
        return '已收';
      case 2:
        return '冲红';
      case -1:
        return '作废';
      default:
        return '';
    }
  };

  return (
    <Drawer
      title={title}
      placement="right"
      width={800}
      onClose={close}
      visible={showVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Spin tip="数据加载中..." spinning={loading}>
        <Card className={styles.card}>
          <Form layout="vertical" >
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item label="收款单号"  >
                  {infoDetail.billCode}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="收款日期" >
                  {infoDetail.billDate}
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="收款人"  >
                  {infoDetail.createUserName}
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="收款编号"  >
                  {infoDetail.payCode}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item label="发票编号"  >
                  {infoDetail.invoiceCdde}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="冲红单号" >
                  {linkno}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="单据状态"   >
                  {GetStatus(infoDetail.status)}
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="审核状态"   >
                  {infoDetail.ifVerify ? '已审核' : '未审核'}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item label="审核人"   >
                  {infoDetail.verifyPerson}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="审核时间"   >
                  {infoDetail.verifyDate}
                </Form.Item>
              </Col>
              <Col span={12} >
                <Form.Item label="审核情况"   >
                  {infoDetail.verifyMemo}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item label="收款金额" style={{ color: "green" }}>
                  {`${infoDetail.payAmountA + infoDetail.payAmountB + infoDetail.payAmountC}元，其中${infoDetail.payTypeA}${infoDetail.payAmountA}元，${infoDetail.payTypeB}${infoDetail.payAmountB}元，${infoDetail.payTypeC}${infoDetail.payAmountC}元`}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item label="备注">
                  {infoDetail.memo}
                </Form.Item>
              </Col>
            </Row>

            <Table
              // title={() => '费用明细'}
              size="middle"
              dataSource={chargeBillData}
              columns={columns}
              rowKey={record => record.billId}
              pagination={pagination}
              scroll={{ y: 500, x: 1300 }}
              loading={loading}
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
        }}
      >
        <Button onClick={close} style={{ marginRight: 8 }}>
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

