//查看收款单
import { Tag, Spin, Button, Card, Table, Col, Drawer, Form, Row } from 'antd';
import { DefaultPagination } from '@/utils/defaultSetting';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetEntityShow, ChargeFeeDetail } from './Main.service';
import moment from 'moment';
import styles from './style.less';
import SelectTemplate from './SelectTemplate';

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
  // const [chargeBillData, setChargeBillData] = useState<any[]>([]);
  const [chargeBillData, setChargeBillData] = useState<any>();
  const [linkno, setLinkno] = useState<any>('');
  //选择模板
  const [modalvisible, setModalVisible] = useState<boolean>(false);

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

  const showModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

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
    data.sidx = data.sidx || 'c';
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
      case 0:
        return <Tag color="#e4aa5b">未收</Tag>;
      case 1:
        return <Tag color="#86db47">已收</Tag>;
      case 2:
        return <Tag color="#19d54e">冲红</Tag>;
      case -1:
        return <Tag color="#19d54e">作废</Tag>;
      default:
        return '';
    }
  };

  const GetVerifyStatus = (status) => {
    switch (status) {
      case 0:
        return <Tag color="#e4aa5b">待处理</Tag>;
      case 1:
        return <Tag color="#e4aa4b">已送审</Tag>;
      case 2:
        return <Tag color="#19d54e">已审核</Tag>;
      default:
        return '';
    }
  };


  return (
    <Drawer
      title={title}
      placement="right"
      width={800}
      onClose={closeShow}
      visible={showVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Spin tip="数据处理中..." spinning={loading}>
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
                <Form.Item label="付款编号"  >
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
                  {/* {infoDetail.ifVerify ? '已审核' : '未审核'} */}
                  {GetVerifyStatus(infoDetail.ifVerify)}
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
                <Form.Item label="收款金额" style={{ color: "red" }}>
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
              rowKey={record => record.id}
              pagination={pagination}
              scroll={{ y: 500, x: 1100 }}
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
          zIndex: 999,
        }}
      >
        <Button onClick={closeShow} style={{ marginRight: 8 }}>
          关闭
        </Button>
        <Button onClick={showModal} type="primary">
          打印
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
export default Form.create<ShowProps>()(Show);

