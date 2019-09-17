
import { Divider, PageHeader, List, Tabs, Button, Card, Col, Drawer, Form, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import {
  LeaseContractChargeEntity,
  LeaseContractChargeFeeEntity,
  LeaseContractChargeIncreEntity,
  LeaseContractChargeFeeOfferEntity,
  LeaseContractDTO,
  ChargeDetailDTO
} from '@/model/models';
import React, { useEffect, useState } from 'react';
import ResultList from './ResultList';
import { GetCharge, GetFormJson } from './Main.service';
import styles from './style.less';


const { TabPane } = Tabs;

interface DetailProps {
  modifyVisible: boolean;
  id?: string;//合同id
  chargeId?: string;//合同条款id
  closeDrawer(): void;
  form: WrappedFormUtils;
  reload(): void;
}

const Detail = (props: DetailProps) => {
  const { modifyVisible, closeDrawer, id, form, chargeId } = props;
  const title = '合同详情';
  //const [industryType, setIndustryType] = useState<any[]>([]); //行业  
  //const [feeitems, setFeeitems] = useState<TreeEntity[]>([]);
  const [infoDetail, setInfoDetail] = useState<LeaseContractDTO>({});
  const [contractCharge, setContractCharge] = useState<LeaseContractChargeEntity>({});
  const [chargeFeeList, setChargeFeeList] = useState<LeaseContractChargeFeeEntity[]>([]);
  const [chargeIncreList, setChargeIncreList] = useState<LeaseContractChargeIncreEntity[]>([]);
  const [chargeOfferList, setChargeOfferList] = useState<LeaseContractChargeFeeOfferEntity[]>([]); 

  const [depositData, setDepositData] = useState<any[]>([]);//保证金
  const [chargeData, setChargeData] = useState<any[]>([]);//租金

  const close = () => {
    closeDrawer();
  };

  //打开抽屉时初始化
  useEffect(() => {
    // getCommonItems('IndustryType').then(res => {
    //   setIndustryType(res || []);
    // });

    //加载关联收费项目
    // GetAllFeeItems().then(res => {
    //   setFeeitems(res || []);
    // });

  }, []);


  // 打开抽屉时初始化
  useEffect(() => {
    if (modifyVisible) {
      if (id) {
        GetFormJson(id).then((tempInfo: LeaseContractDTO) => {
          setInfoDetail(tempInfo);
          //获取条款
          GetCharge(chargeId).then((charge: ChargeDetailDTO) => {
            setContractCharge(charge.contractCharge || {});
            setChargeFeeList(charge.chargeFeeList || []);
            setChargeIncreList(charge.chargeIncreList || []);
            setChargeOfferList(charge.chargeFeeOfferList || []); 
            setDepositData(charge.depositFeeResultList || []);//保证金明细
            setChargeData(charge.chargeFeeResultList || []);//租金明细   

          })
          form.resetFields();
        });
      } else {
        form.resetFields();
      }
    } else {
      form.setFieldsValue({});
    }
  }, [modifyVisible]);

  return (
    <Drawer
      title={title}
      placement="right"
      width={1000}
      onClose={close}
      visible={modifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <PageHeader title={infoDetail.state}
        // extra={[
        //   <Button key="1">附件</Button>, 
        //   <Button key="2">打印</Button>,
        // ]}
      />
      <Divider dashed />
      <Form layout="vertical">
        <Tabs defaultActiveKey="1" >
          <TabPane tab="基本信息" key="1">
            <Row gutter={24}>
              <Col span={12}>
                <Card title="基本信息" className={styles.card}>
                  <Row gutter={24}>
                    <Col lg={12}>
                      <Form.Item label="合同编号">
                        {infoDetail.no}
                      </Form.Item>
                    </Col>
                    <Col lg={12}>
                      <Form.Item label="跟进人" >
                        {infoDetail.follower}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={12}>
                      <Form.Item label="租赁数量（m²)">
                        {infoDetail.leaseSize}
                      </Form.Item>
                    </Col>
                    <Col lg={12}>
                      <Form.Item label="合同签订时间">
                        {String(infoDetail.contractStartDate).substr(0, 10)}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    <Col lg={12}>
                      <Form.Item label="合同计租时间">
                        {String(infoDetail.billingDate).substr(0, 10)}
                      </Form.Item>
                    </Col>
                    <Col lg={12}>
                      <Form.Item label="合同失效时间">
                        {String(infoDetail.contractEndDate).substr(0, 10)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={12}>
                      <Form.Item label="单价保留小数点">
                        {infoDetail.calcPrecision}
                      </Form.Item>
                    </Col>
                    <Col lg={12}>
                      <Form.Item label="计算精度">
                        {infoDetail.calcPrecisionMode == '1' ? '最终计算结果保留2位' : '每步计算结果保留2位'}
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                <Card title="滞纳金" className={styles.card}>
                  <Row gutter={24}>
                    <Col lg={12}>
                      <Form.Item label="滞纳金比例" >
                        {infoDetail.lateFee ? infoDetail.lateFee + '%/天' : '-'}
                      </Form.Item>
                    </Col>
                    <Col lg={12}>
                      <Form.Item label="滞纳金上限" >
                        {infoDetail.maxLateFee ? infoDetail.maxLateFee + '%' : '-'}
                      </Form.Item>
                    </Col>
                  </Row>

                </Card>

              </Col>
              <Col span={12}>
                <Card title="房源信息" className={styles.card}>
                  <Row gutter={24}>
                    <Col lg={24}>
                      <List  
                        dataSource={infoDetail.houseList}
                        renderItem={item =>
                          <List.Item  >
                            <List.Item.Meta title={item.allName} />
                            <div>{item.area}㎡</div>
                          </List.Item>
                        }
                      />
                    </Col>
                  </Row>
                </Card>

                <Card title="租客信息" className={styles.card}>
                  <Row gutter={24}>
                    <Col lg={12}>
                      <Form.Item label="租客"  >
                        {infoDetail.customer}
                      </Form.Item>
                    </Col>
                    <Col lg={12}>
                      <Form.Item label="行业"  >
                        {
                          infoDetail.industry
                        }
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={12}>
                      <Form.Item label="法人"  >
                        {infoDetail.legalPerson}
                      </Form.Item>
                    </Col>
                    <Col lg={12}>
                      <Form.Item label="签订人">
                        {infoDetail.signer}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={24}>
                      <Form.Item label="租客联系人">
                        {infoDetail.customerContact}
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="租赁条款" key="2">
            <Card title="基本条款" className={styles.card} >
              <Row gutter={24}>
                <Col lg={7}>
                  <Form.Item label="租赁数量（㎡）">
                    {contractCharge.leaseArea}
                  </Form.Item>
                </Col>
                <Col lg={10}>
                  <Form.Item label="保证金关联费项">
                    {contractCharge.depositFeeItemId}
                  </Form.Item>
                </Col>
                <Col lg={7}>
                  <Form.Item label="保证金数量">
                    {contractCharge.deposit}
                    {contractCharge.depositUnit == '1' ? '月' : '元'}
                  </Form.Item>
                </Col>
                {/* <Col lg={4}>
                  <Form.Item label="保证金金额" >
                    {getFieldDecorator('totalDeposit', {
                    })(<Input readOnly />)}
                  </Form.Item>
                </Col> */}
              </Row>
            </Card>
            {
              chargeFeeList ? chargeFeeList.map((k, index) => (
                <Card title={'租期条款' + (index + 1)} className={styles.card}>
                  <Row gutter={24}>
                    <Col lg={4}>
                      <Form.Item label="开始时间"  >
                        {String(k.startDate).substr(0, 10)}
                      </Form.Item>
                    </Col>
                    <Col lg={4}>
                      <Form.Item label="结束时间" >
                        {String(k.endDate).substr(0, 10)}
                      </Form.Item>
                    </Col>
                    <Col lg={4}>
                      <Form.Item label="提前付款时间">
                        ({k.advancePayTimeUnit})
                        {k.advancePayTime}天
                      </Form.Item>
                    </Col>
                    <Col lg={4}>
                      <Form.Item label="合同单价" >
                        {k.price}
                        {k.priceUnit}
                      </Form.Item>
                    </Col>
                    <Col lg={4}>
                      <Form.Item label="关联费项" >
                        {k.feeItemName}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={4}>
                      <Form.Item label="计费类型">
                        {k.billType}
                      </Form.Item>
                    </Col>
                    <Col lg={4}>
                      <Form.Item label="租期划分方式">
                        {k.rentalPeriodDivided}
                      </Form.Item>
                    </Col>
                    <Col lg={4}>
                      <Form.Item label="天单价换算规则">
                        {k.dayPriceConvertRule}
                      </Form.Item>
                    </Col>
                    <Col lg={4}>
                      <Form.Item label="年天数">
                        {k.yearDays}
                      </Form.Item>
                    </Col>
                    <Col lg={4}>
                      <Form.Item label="付款周期（月）" >
                        {k.payCycle}月一付
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              )) : null
            }

            {chargeIncreList ? chargeIncreList.map((k, index) => (
              <Card title={'递增率' + (index + 1)} className={styles.card}>
                <Row gutter={24}>
                  <Col lg={8}>
                    <Form.Item label="递增时间点"  >
                      {String(k.increDate).substr(0, 10)}
                    </Form.Item>
                  </Col>
                  <Col lg={8}>
                    <Form.Item label="单价递增" >
                      {k.increPrice}
                      {k.increPriceUnit}
                    </Form.Item>
                  </Col>
                  <Col lg={8}>
                    <Form.Item label="保证金递增">
                      {k.increDeposit}
                      {k.increDepositUnit}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            )) : null
            }

            {chargeOfferList ? chargeOfferList.map((k, index) => (
              <Card title={'优惠' + (index + 1)} className={styles.card}>
                <Row gutter={24}>
                  <Col lg={4}>
                    <Form.Item label="优惠类型"  >
                      {k.type}
                    </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label="开始时间" >
                      {k.startDate}
                    </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label="结束时间">
                      {k.endDate}
                    </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label="开始期数">
                      {k.startPeriod}
                    </Form.Item>
                  </Col>

                  <Col lg={4}>
                    <Form.Item label="期长">
                      {k.periodLength}
                    </Form.Item>
                  </Col>

                  <Col lg={4}>
                    <Form.Item label="折扣">
                      {k.discount}
                    </Form.Item>
                  </Col>

                  <Col lg={4}>
                    <Form.Item label="备注">
                      {k.remark}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            )) : null
            }

          </TabPane>
          <TabPane tab="租金明细" key="3">

          <ResultList
              depositData={depositData}
              chargeData={chargeData}
            ></ResultList>

          </TabPane>
        </Tabs>
      </Form>
      <div
        style={{
          position: 'absolute',
          zIndex: 999,
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
          取消
          </Button>
        <Button type="primary">
          确定
          </Button>
      </div>
    </Drawer>
  );

};

export default Form.create<DetailProps>()(Detail);

