
import { Tooltip, Spin, Upload, Tag, Divider, PageHeader, List, Tabs, Button, Card, Col, Drawer, Form, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import {
  HtLeasecontractcharge,
  HtLeasecontractchargefee,
  HtLeasecontractchargeincre,
  HtLeasecontractchargefeeoffer,
  LeaseContractDTO,
  ChargeDetailDTO
} from '@/model/models';
import React, { useEffect, useState } from 'react';
import ResultList from './ResultList';
// import AppLog from './AppLog';
import { GetFilesData, GetCharge, GetContractInfo, GetFollowCount } from './Main.service';
import styles from './style.less';
import Follow from './Follow';
const { TabPane } = Tabs;

interface DetailProps {
  visible: boolean;
  id?: string;//合同id
  chargeId?: string;//合同条款id
  closeDrawer(): void;
  form: WrappedFormUtils;
  reload(): void;
}

const Detail = (props: DetailProps) => {
  const { visible, closeDrawer, id, form, chargeId } = props;
  const title = '合同详情';
  //const [industryType, setIndustryType] = useState<any[]>([]); //行业  
  //const [feeitems, setFeeitems] = useState<TreeEntity[]>([]);
  const [infoDetail, setInfoDetail] = useState<LeaseContractDTO>({});
  const [contractCharge, setContractCharge] = useState<HtLeasecontractcharge>({});
  const [chargeFee, setChargeFee] = useState<HtLeasecontractchargefee>({});
  const [chargeIncre, setChargeIncre] = useState<HtLeasecontractchargeincre>({});
  const [chargeOffer, setChargeOffer] = useState<HtLeasecontractchargefeeoffer>({});
  const [depositData, setDepositData] = useState<any[]>([]);//保证金
  const [chargeData, setChargeData] = useState<any[]>([]);//租金
  // const [appData, setAppData] = useState<any[]>([]);//审批记录 
  const [fileList, setFileList] = useState<any[]>([]);
  const [houseList, setHouseList] = useState<any[]>([]);
  const [totalInfo, setTotalInfo] = useState<any>({});//合计信息

  // const close = () => {
  //   closeDrawer();
  // };

  //打开抽屉时初始化
  // useEffect(() => {
  //   // getCommonItems('IndustryType').then(res => {
  //   //   setIndustryType(res || []);
  //   // });
  //   //加载关联收费项目
  //   // GetAllFeeItems().then(res => {
  //   //   setFeeitems(res || []);
  //   // });
  // }, []);

  const [loading, setLoading] = useState<boolean>(false);

  // 打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      if (id) {
        setLoading(true);
        GetContractInfo(id).then((tempInfo) => {
          setInfoDetail(tempInfo.contract);
          setHouseList(tempInfo.houseList);
          setCount(tempInfo.followCount);
          setTotalInfo({
            leasePrice: tempInfo.leasePrice,
            totalDeposit: tempInfo.totalDeposit,
            totalAmount: tempInfo.totalAmount
          });
          //获取条款
          GetCharge(chargeId).then((charge: ChargeDetailDTO) => {
            setContractCharge(charge.contractCharge || {});
            setChargeFee(charge.chargeFee || {});
            setChargeIncre(charge.chargeIncre || {});
            setChargeOffer(charge.chargeFeeOffer || {});
            setDepositData(charge.depositFeeResultList || []);//保证金明细
            setChargeData(charge.chargeFeeResultList || []);//租金明细    
            // setAppData(charge.contractapproveLog || []);//审批记录    
          });

          //附件
          GetFilesData(id).then(res => {
            setFileList(res || []);
          });  
          form.resetFields();
          setLoading(false);
        });
      } else {
        form.resetFields();
        setFileList([]);
      }
    } else {
      form.setFieldsValue({});
    }
  }, [visible]);

  //转换状态
  const GetStatus = (status) => {
    switch (status) {
      case 0:
        return <Tag color="#e4aa5b">新建待修改</Tag>;
      case 1:
        return <Tag color="#e4aa4b">新建待审核</Tag>;
      case 2:
        return <Tag color="#19d54e">变更待修改</Tag>;
      case 3:
        return <Tag color="#19d54e">变更待审核</Tag>;
      case 4:
        return <Tag color="#19d54e">退租待审核</Tag>;
      case 5:
        return <Tag color="#19d54e">作废待审核</Tag>;
      case 6:
        return <Tag color="#19d54e">正常执行</Tag>;
      case 7:
        return <Tag color="#19d54e">到期未处理</Tag>;
      case 8:
        return <Tag color="#19d54e">待执行</Tag>;
      case -1:
        return <Tag color="#d82d2d">已作废</Tag>
      default:
        return '';
    }
  };

  //跟进 
  const [followVisible, setFollowVisible] = useState<boolean>(false);
  const [count, setCount] = useState<string>('0');
  const showFollowDrawer = () => {
    setFollowVisible(true);
  };
  const closeFollowDrawer = () => {
    setFollowVisible(false);
  };

  return (
    <Drawer
      title={title}
      placement="right"
      width={1000}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <Spin tip="数据处理中..." spinning={loading}>
        <PageHeader
          title={null}
          subTitle={
            <div>
              <label style={{ color: '#4494f0', fontSize: '24px' }}>{infoDetail.customer}</label>
            </div>
          }
          //title={GetStatus(infoDetail.status)}
          style={{
            border: '1px solid rgb(235, 237, 240)'
          }}
          extra={[
            <Tooltip title='跟进人'>
              <Button key="1" icon="user"> {infoDetail.follower}</Button>
            </Tooltip>,
            // <Button key="2" icon="edit" onClick={() => modify(id)}>编辑</Button>,
            <Button key="2" icon="message" onClick={showFollowDrawer} >跟进({count})</Button>
          ]}
        // extra={[
        //   <Button key="1">附件</Button>, 
        //   <Button key="2">打印</Button>,
        // ]}
        >
          <Divider dashed />
          <Form layout='vertical'>
            <Row gutter={24}>
              <Col lg={4}>
                <Form.Item label="合同状态" >
                  {GetStatus(infoDetail.status)}
                </Form.Item>
              </Col>
              <Col lg={4}>
                <Form.Item label="合同基础单价" >
                  {totalInfo.leasePrice}
                </Form.Item>
              </Col>
              <Col lg={4}>
                <Form.Item label="租金合计" >
                  {totalInfo.totalAmount}
                </Form.Item>
              </Col>

              <Col lg={4}>
                <Form.Item label="保证金" >
                  {totalInfo.totalDeposit}
                </Form.Item>
              </Col>

              <Col lg={4}>
                <Form.Item label="联系人" >
                  {infoDetail.linkMan}
                </Form.Item>
              </Col>
              <Col lg={4}>
                <Form.Item label="联系电话" >
                  {infoDetail.linkPhone}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </PageHeader>
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
                        <Form.Item label="租赁数量/m²">
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
                  <Card title="滞纳金" className={styles.addcard}>
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
                          dataSource={houseList}
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
                        <Form.Item label="承租方"  >
                          {infoDetail.customer}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="类别">
                          {infoDetail.customerType == '2' ? '单位' : '个人'}
                        </Form.Item>
                      </Col>
                    </Row>
                    {infoDetail.customerType == '2' ? (
                      <Row gutter={24}>
                        <Col lg={12}>
                          <Form.Item label="行业"  >
                            {
                              infoDetail.industry
                            }
                          </Form.Item>
                        </Col>

                        <Col lg={12}>
                          <Form.Item label="法人"  >
                            {infoDetail.legalPerson}
                          </Form.Item>
                        </Col>
                      </Row>) : null}

                    {/* 
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="联系人">
                          {infoDetail.linkMan}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="联系电话">
                          {infoDetail.linkPhone}
                        </Form.Item>
                      </Col>
                    </Row> */}

                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="联系地址"  >
                          {infoDetail.address}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="签订人">
                          {infoDetail.signer}
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
                  <Col lg={8}>
                    <Form.Item label="租赁数量/㎡">
                      {contractCharge.leaseArea}
                    </Form.Item>
                  </Col>
                  <Col lg={8}>
                    <Form.Item label="保证金关联费项">
                      {contractCharge.depositFeeItemName}
                    </Form.Item>
                  </Col>
                  <Col lg={8}>
                    <Form.Item label="保证金数量">
                      {contractCharge.deposit}
                      {contractCharge.depositUnit}
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
              {/* {chargeFeeList ? chargeFeeList.map((k, index) => ( */}

              <Card title='租期条款' className={styles.card}>
                <Row gutter={24}>
                  <Col lg={4}>
                    <Form.Item label="开始时间"  >
                      {String(chargeFee.startDate).substr(0, 10)}
                    </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label="结束时间" >
                      {String(chargeFee.endDate).substr(0, 10)}
                    </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label="费项" >
                      {chargeFee.feeItemName}
                    </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label="合同单价" >
                      {chargeFee.price}
                      {chargeFee.priceUnit}
                    </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label="提前付款时间">
                      ({chargeFee.advancePayTimeUnit})
                        {chargeFee.advancePayTime}天
                      </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label="计费类型">
                      {chargeFee.billType}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  {(chargeFee.priceUnit == '元/m²·天' || chargeFee.priceUnit == '元/天') ?
                    <Col lg={4}>
                      <Form.Item label="天单价换算规则">
                        {chargeFee.dayPriceConvertRule}
                      </Form.Item>
                    </Col>
                    : null}
                  <Col lg={4}>
                    <Form.Item label="年天数">
                      {chargeFee.yearDays}
                    </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label="付款周期（月）" >
                      {chargeFee.payCycle}月一付
                      </Form.Item>
                  </Col>
                  <Col >
                    <Form.Item label="租期划分方式">
                      {chargeFee.rentalPeriodDivided}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              {/* )) : null } */}

              {/* {chargeIncreList ? chargeIncreList.map((k, index) => ( */}
              <Card title='递增率' className={styles.card}>
                <Row gutter={24}>
                  <Col lg={8}>
                    <Form.Item label="递增时间点"  >
                      {chargeIncre.increType}
                    </Form.Item>
                  </Col>
                  <Col lg={8}>
                    <Form.Item label="单价递增" >
                      {chargeIncre.increPrice}
                      {chargeIncre.increPriceUnit}
                    </Form.Item>
                  </Col>
                  <Col lg={8}>
                    <Form.Item label="保证金递增">
                      {chargeIncre.increDeposit}
                      {chargeIncre.increDepositUnit}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              {/* )) : null } */}

              {/* {chargeOfferList ? chargeOfferList.map((k, index) => ( */}
              <Card title='优惠' className={styles.addcard}>
                <Row gutter={24}>
                  <Col lg={5}>
                    <Form.Item label="优惠类型"  >
                      {chargeOffer.rebateType}
                    </Form.Item>
                  </Col>
                  <Col lg={5}>
                    <Form.Item label="开始时间" >
                      {chargeOffer.rebateStartDate}
                    </Form.Item>
                  </Col>
                  <Col lg={5}>
                    <Form.Item label="结束时间">
                      {chargeOffer.rebateEndDate}
                    </Form.Item>
                  </Col>
                  <Col lg={3}>
                    <Form.Item label="开始期数">
                      {chargeOffer.startPeriod}
                    </Form.Item>
                  </Col>
                  <Col lg={3}>
                    <Form.Item label="期长">
                      {chargeOffer.periodLength}
                    </Form.Item>
                  </Col>
                  <Col lg={3}>
                    <Form.Item label="折扣">
                      {chargeOffer.discount}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={24}>
                    <Form.Item label="备注">
                      {chargeOffer.remark}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              {/* )) : null } */}
            </TabPane>
            <TabPane tab="租金明细" key="3">
              <ResultList
                depositData={depositData}
                chargeData={chargeData}
                className={styles.addcard}></ResultList>
            </TabPane>
            {/* <TabPane tab="审批记录" key="4">
            <AppLog appData={appData}></AppLog>
          </TabPane> */}

            <TabPane tab="其他条款" key="4">
              <Card className={styles.addcard}   >
                <Row gutter={24}>
                  <Col lg={24}>
                    <Form.Item label="&nbsp;">
                      {infoDetail.memo}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={24}>
                    <div className="clearfix">
                      <Upload
                        //accept='.doc,.docx,.pdf,image/*' 
                        fileList={fileList}
                        disabled
                        //listType="picture-card"
                        listType='picture'  >
                      </Upload>
                    </div>
                  </Col>
                </Row>
              </Card>
            </TabPane>

          </Tabs>
        </Form>
      </Spin>


      <Follow
        visible={followVisible}
        closeDrawer={closeFollowDrawer}
        id={id}
        reload={() => {
          GetFollowCount(id).then(res => {
            setCount(res);
            // setNewFlow(res.newFollow);
            setLoading(false);
          })
        }}
      />

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
        <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
          关闭
          </Button>
        {/* <Button type="primary">
          确定
          </Button> */}
      </div>
    </Drawer >
  );

};

export default Form.create<DetailProps>()(Detail);

