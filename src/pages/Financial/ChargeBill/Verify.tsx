//收款单审核
import { Divider, PageHeader, Spin, Tag, message, Card, Button, Col, Drawer, Form, Input, Row, Table } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetEntityShow, ChargeFeeDetail, CheckBill } from './Main.service';
import { DefaultPagination } from '@/utils/defaultSetting';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import styles from './style.less';
import moment from 'moment';

interface VerifyProps {
  verifyVisible: boolean;
  closeVerify(): void;
  form: WrappedFormUtils;
  id?: string;
  ifVerify: boolean;
  reload(): void;
}

const Verify = (props: VerifyProps) => {
  const { verifyVisible, closeVerify, id, form, ifVerify, reload } = props;
  const { getFieldDecorator } = form;
  const title = ifVerify ? "收款单取消审核" : "收款单审核";
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [chargeBillData, setChargeBillData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [linkNo, setLinkNo] = useState<any>('');
  const [unitNo, setUnitNo] = useState<any>('');
  // 打开抽屉时初始化
  useEffect(() => {
    form.resetFields();
    if (verifyVisible) {
      if (id != null && id != '') {
        //setLoading(true);
        GetEntityShow(id).then(res => {
          setInfoDetail(res.entity);
          setUnitNo(res.unitNo);
          setLinkNo(res.linkNo);
          initLoadFeeDetail(id);
          //setLoading(false);
        })
      }
      else {
        setInfoDetail({});
        setLoading(false);
      }
    }
  }, [verifyVisible]);

  // const close = () => {
  //   closeVerify();
  // };

  //收款单对账
  const audit = () => {
    form.validateFields((errors, values) => {
      // console.log(values, infoDetail); 
      var newData = Object.assign({}, infoDetail,
        {
          // verifyPerson: localStorage.getItem('userid'),
          // verifyDate: moment(new Date).format('YYYY-MM-DD'),
          verifyMemo: values.verifyMemo,
          keyvalue: infoDetail.billId,
          //billDate: moment(values.billDate).format('YYYY-MM-DD'),
          //status: ifVerify ? 1 : 2//，已收未审核1，已审核2，已冲红3
          check: !ifVerify
        });

      CheckBill(newData).then(res => {
        message.success('提交成功');
        reload();
        closeVerify();
      });
    });
  };

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

  const GetVerifyStatus = (status) => {
    switch (status) {
      case 0:
        return <Tag color="#D7443A">待审核</Tag>;
      case 1:
        return <Tag color="#19d54e">已审核</Tag>;
      case 2:
        return <Tag color="#e4aa4b">已送审</Tag>;
      case 3:
        return <Tag color="#19d54e">已复核</Tag>;
      default:
        return '';
    }
  };

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
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'beginDate';
    }
    return load(searchCondition).then(res => {
      return res;
    });
  };

  //翻页
  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    loadData(pagination, sorter);
  };

  const columns = [
    {
      title: '房产编号',
      dataIndex: 'unitCode',
      key: '房产编号',
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
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    }, {
      title: '计费截止日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
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
      key: 'memo',
    }
  ] as ColumnProps<any>[];

  return (
    <Drawer
      title={title}
      placement="right"
      width={850}
      onClose={closeVerify}
      visible={verifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <Spin tip="数据处理中..." spinning={loading}>
        <PageHeader
          ghost={false} 
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
              <Col span={2}>
                <Form.Item label="状态"   >
                  {GetStatus(infoDetail.status)}
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="收款日期" >
                  {String(infoDetail.billDate).substr(0, 10)}
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item label="收款人"  >
                  {infoDetail.createUserName}
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item label="业户名称">
                  {infoDetail.customerName}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="房产编号">
                  {unitNo}
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item label="发票编号"  >
                  {infoDetail.invoiceCode}
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item label="收据编号">
                  {infoDetail.payCode}
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
        <Card className={styles.card}  hoverable>
          <Form layout="vertical">
            <Row gutter={24}>
              <Col span={4}>
                <Form.Item label="审核状态"   >
                  {/* {infoDetail.ifVerify ? '已审核' : '未审核'} */}
                  {GetVerifyStatus(infoDetail.ifVerify)}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="审核人">
                  {infoDetail.verifyPerson}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="审核时间">
                  {infoDetail.verifyDate}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="入账银行" >
                  {infoDetail.accountBank}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="冲红单号" >
                  {linkNo}
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
              rowKey={record => record.id}
              pagination={pagination}
              scroll={{ y: 500, x: 1700 }}
              loading={loading}
              onChange={(pagination: PaginationConfig, filters, sorter) =>
                changePage(pagination, filters, sorter)
              }
            />
            {!ifVerify ?
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item label="审核说明" >
                    {getFieldDecorator('verifyMemo', {
                      initialValue: infoDetail.verifyMemo,
                    })(
                      <Input.TextArea rows={5} style={{ width: '100%' }} />
                    )}
                  </Form.Item>
                </Col>
              </Row> : null
            }
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
        <Button onClick={closeVerify} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button onClick={audit}
         disabled={loading} 
        type="primary">
          提交
        </Button>
      </div>
    </Drawer>
  );
};
export default Form.create<VerifyProps>()(Verify);

