//废弃，跟审批查看共用一个
import { Icon, Tooltip, Spin, Upload, Tag, Divider, PageHeader, List, Tabs, Button, Card, Col, Drawer, Form, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import {
  HtLeasecontractcharge,
  HtLeasecontractchargefee,
  htLeasecontract,
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
  const [infoDetail, setInfoDetail] = useState<htLeasecontract>({});
  const [contractCharge, setContractCharge] = useState<HtLeasecontractcharge>({});
  const [chargeFeeList, setChargeFeeList] = useState<HtLeasecontractchargefee[]>([]);
  // const [chargeIncre, setChargeIncre] = useState<HtLeasecontractchargeincre>({});
  // const [chargeOffer, setChargeOffer] = useState<HtLeasecontractchargefeeoffer>({});
  // const [depositData, setDepositData] = useState<any[]>([]);//保证金
  const [chargeData, setChargeData] = useState<any[]>([]);//租金
  // const [propertyData, setPropertyData] = useState<any[]>([]);//物业费 
  // const [appData, setAppData] = useState<any[]>([]);//审批记录 
  const [fileList, setFileList] = useState<any[]>([]);
  const [houseList, setHouseList] = useState<any[]>([]);
  const [totalInfo, setTotalInfo] = useState<any>({});//合计信息

  // const close = () => {
  //   closeDrawer();
  // };

  //打开抽屉时初始化
  // useEffect(() => {
  //   // GetCommonItems('IndustryType').then(res => {
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
            // leasePrice: tempInfo.leasePrice,
            // totalDeposit: tempInfo.totalDeposit,
            totalAmount: tempInfo.totalAmount,
            // totalPropertyAmount: tempInfo.totalPropertyAmount
          });
          //获取条款
          GetCharge(chargeId).then((charge: ChargeDetailDTO) => {
            setContractCharge(charge.contractCharge || {});
            setChargeFeeList(charge.chargeFeeList || []);
            // setChargeIncre(charge.chargeIncre || {});
            // setChargeOffer(charge.chargeFeeOffer || {});
            // setDepositData(charge.depositFeeResultList || []);//保证金明细
            setChargeData(charge.chargeFeeResultList || []);//租金明细  
            // setPropertyData(charge.propertyFeeResultList || []);//物业费明细   
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

  const GetScaleDispose = (status) => {
    if (status == 1)
      return "四舍五入";
    else if (status == 2)
      return "直接舍去";
    else
      return "有数进一";
  }

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
          ghost={false} 
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
          {GetStatus(infoDetail.status)}
      合同摘要 【合同期间
      {String(infoDetail.startDate).substr(0, 10)}
      到{String(infoDetail.endDate).substr(0, 10)}，
      租赁数为{infoDetail.leaseSize}㎡。
      付款周期{chargeFeeList.length>0?chargeFeeList[0].payCycle:''}月一付，
      总金额{totalInfo.totalAmount}】
          {/* <Form layout='vertical'>
            <Row gutter={24}>
              <Col lg={4}>
                <Form.Item label="合同状态" >
                  {GetStatus(infoDetail.status)}
                </Form.Item>
              </Col>
              <Col lg={5}>
                <Form.Item label="合同单价" >
                  {totalInfo.leasePrice}
                </Form.Item>
              </Col>
              <Col lg={5}>
                <Form.Item label="总租金" >
                  {totalInfo.totalAmount}
                </Form.Item>
              </Col>
              <Col lg={5}>
                <Form.Item label="联系人" >
                  {infoDetail.linkMan}
                </Form.Item>
              </Col>
              <Col lg={5}>
                <Form.Item label="联系电话" >
                  {infoDetail.linkPhone}
                </Form.Item>
              </Col>
            </Row>
          </Form> */}
        </PageHeader>
        <Divider dashed />
        <Form layout="vertical">
          <Tabs defaultActiveKey="1" >
            <TabPane tab="基本信息" key="1">
              <Row gutter={24}>
                <Col span={12}>
                  <Card title="基本信息" className={styles.addcard} hoverable >
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="合同编号">
                          {infoDetail.no}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="合同面积(㎡)">
                          {infoDetail.leaseSize}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="起始日期">
                          {String(infoDetail.startDate).substr(0, 10)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="终止日期">
                          {String(infoDetail.endDate).substr(0, 10)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="经营主体">
                          {infoDetail.businessEntity}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="付款方式">
                          {infoDetail.payType}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="签约人">
                          {infoDetail.signer}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="签约日期">
                          {String(infoDetail.signingDate).substr(0, 10)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="跟进人">
                          {infoDetail.follower}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="渠道">
                          {infoDetail.channelType}
                        </Form.Item>
                      </Col>
                    </Row>
                    {/* <Row gutter={24}>
                      <Col span={24}>
                        <Form.Item label="备注">
                          {infoDetail.memo}
                        </Form.Item>
                      </Col>
                    </Row> */}
                  </Card>
                  {/* <Card title="滞纳金" className={styles.addcard} hoverable>
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
                  </Card> */}
                </Col>
                <Col span={12}>
                  <Card title="房源信息" className={styles.card} hoverable>
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
                  <Card title="租客信息" className={styles.addcard} hoverable>
                    <Row gutter={24}>
                      <Col lg={24}>
                        <Form.Item label="承租方"  >
                          {infoDetail.customer}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="联系人">
                          {infoDetail.linkMan}
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
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="联系电话">
                          {infoDetail.linkPhone}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="联系地址"  >
                          {infoDetail.address}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="费用条款" key="2">
              <Card title="基本条款" className={styles.card} hoverable>
                <Row gutter={24}>
                  <Col lg={6}>
                    <Form.Item label="合同面积(㎡)">
                      {contractCharge.leaseArea}
                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="滞纳金比例(‰)" >
                      {contractCharge.lateFee}
                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="滞纳金起算日期" >
                      {contractCharge.lateDate == null ? '' : String(contractCharge.lateDate).substr(0, 10)}
                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="滞纳金算法" >
                      {contractCharge.lateMethod}
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col lg={6}>
                    <Form.Item label="中间每一步计算结果保留">
                      {contractCharge.midResultScale}
                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="对最后一位">
                      {GetScaleDispose(contractCharge.midScaleDispose)}

                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="最终结果保留小数位数">
                      {contractCharge.lastResultScale}
                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="对最后一位">
                      {GetScaleDispose(contractCharge.lastScaleDispose)}
                    </Form.Item>
                  </Col>
                </Row> 
              </Card>
              {
                chargeFeeList ? chargeFeeList.map((k, index) => (
                  <Card title={'费用条款' + (index + 1)} className={styles.addcard} hoverable>
                    <Row gutter={24}>
                      <Col lg={4}>
                        <Form.Item label="开始时间"  >
                          {String(k.chargeStartDate).substr(0, 10)}
                        </Form.Item>
                      </Col>
                      <Col lg={4}>
                        <Form.Item label="结束时间" >
                          {String(k.chargeEndDate).substr(0, 10)}
                        </Form.Item>
                      </Col>
                      <Col lg={4}>
                        <Form.Item label="关联费项" >
                          {k.feeItemName}
                        </Form.Item>
                      </Col>

                      <Col lg={4}>
                        <Form.Item label="单价" >
                          {k.price}
                          {k.priceUnit}
                        </Form.Item>
                      </Col>
                      <Col lg={4}>
                        <Form.Item label={<div>计费类型 <Tooltip
                          overlayStyle={{ maxWidth: 'none' }}
                          title={<span>
                            1、天单价=实际输入天单价 或者 月单价*12/年天数 或者 月单价/自然月天数<br />
            2、月单价=实际输入月单价 或者 天单价*年天数/12<br />
            3、总价=（月单价*月数*面积）+（天单价*实际天数*面积）<br />
            4、以天记租时没有月数，即套用公式3计算，其中月数为0计算<br />
            5、以月记租时，整月按公式3第一项计算，余下的天数按照公式3的第二项计算</span>}>
                          <Icon type="question-circle" /></Tooltip></div>}>
                          {k.billType}
                        </Form.Item>
                      </Col>

                      <Col lg={4}>
                        <Form.Item label={<div>天单价换算规则 <Tooltip
                          overlayStyle={{ maxWidth: 'none' }}
                          title={
                            <span>
                              按年换算：天单价=月单价*12/年天数<br />
              按自然月换算：天单价=月单价/自然月的天数
            </span>}>
                          <Icon type="question-circle" />
                        </Tooltip></div>}>
                          {k.dayPriceConvertRule}
                        </Form.Item>
                      </Col>

                      <Col lg={4}>
                        <Form.Item label={<div>年天数 <Tooltip title="指一年按多少天来计算">
                          <Icon type="question-circle" /></Tooltip></div>}>
                          {k.yearDays}
                        </Form.Item>
                      </Col>

                      <Col lg={4}>
                        <Form.Item label="付款周期（月）" >
                          {k.payCycle}月一付
                      </Form.Item>
                      </Col>

                      <Col lg={4}>
                        <Form.Item label="提前付款时间">
                          ({k.advancePayTimeUnit})
                        {k.advancePayTime}天
                      </Form.Item>
                      </Col>
                      <Col lg={6}>
                        <Form.Item label={<div>租期划分方式 <Tooltip
                          overlayStyle={{ maxWidth: 'none' }}
                          title={<span>
                            按起始日划分<br />
              按自然月划分(首月非整自然月划入第一期)<br />
              按自然月划分(首月非整自然月算一个月)
            </span>}>
                          <Icon type="question-circle" />
                        </Tooltip></div>}>
                          {k.rentalPeriodDivided}
                        </Form.Item>
                      </Col>

                      <Col lg={4}>
                        <Form.Item label="递增时间点">
                          {k.increStartDate ? String(k.increStartDate).substr(0, 10) : ''}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={4}>
                        <Form.Item label="递增间隔（月）">
                          {k.increGap}
                        </Form.Item>
                      </Col>

                      <Col lg={4}>
                        <Form.Item label="单价递增" >
                          {k.increPrice}
                          {k.increPriceUnit}
                        </Form.Item>
                      </Col>
                      <Col lg={4}>
                        <Form.Item label="免租期开始" >
                          {k.rebateStartDate ? String(k.rebateStartDate).substr(0, 10) : ''}
                        </Form.Item>
                      </Col>
                      <Col lg={4}>
                        <Form.Item label="免租期结束" >
                          {k.rebateEndDate ? String(k.rebateEndDate).substr(0, 10) : ''}
                        </Form.Item>
                      </Col>
                      <Col lg={6}>
                        <Form.Item label="优惠备注" >
                          {k.rebateRemark}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                )) : null
              }

            </TabPane>
            <TabPane tab="租金明细" key="3">
              <ResultList
                chargeData={chargeData}
                className={styles.addcard}></ResultList>
            </TabPane>
            {/* <TabPane tab="审批记录" key="4">
            <AppLog appData={appData}></AppLog>
          </TabPane> */}

            <TabPane tab="其他条款" key="4">
              <Card className={styles.addcard} hoverable  >
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

