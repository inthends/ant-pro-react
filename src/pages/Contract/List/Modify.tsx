
import { Modal,InputNumber, TreeSelect, Tabs, Select, Button, Card, Col, DatePicker, Drawer, Form, Input, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import {
  TreeEntity,
  LeaseContractChargeEntity,
  LeaseContractChargeFeeEntity,
  LeaseContractChargeFeeOfferEntity,
  LeaseContractChargeIncreEntity,
  ChargeFeeResultEntity,
  LeaseContractDTO
} from '@/model/models';
import React, { useEffect, useState } from 'react';
import LeaseTerm from './LeaseTerm';
import IncreasingRate from './IncreasingRate';
import Rebate from './Rebate';
import ResultList from './ResultList';
import moment from 'moment';
import { getResult } from '@/utils/networkUtils';
import { getCommonItems } from '@/services/commonItem';
import { SaveForm, GetQuickPStructsTreeJsonAll, GetAllFeeItems, GetChargeDetail } from './Main.service'; 
import styles from './style.less';

const { Option } = Select;
const { TabPane } = Tabs;

interface ModifyProps {
  modifyVisible: boolean;
  id?: string;
  data?: any;
  closeDrawer(): void;
  form: WrappedFormUtils;
  reload(): void;
}

const Modify = (props: ModifyProps) => {
  const { modifyVisible, closeDrawer, form } = props;
  const { getFieldDecorator } = form;
  const title = '添加合同';
  const [industryType, setIndustryType] = useState<any[]>([]); //行业  
  const [feeitems, setFeeitems] = useState<TreeEntity[]>([]);
  const [depositData, setDepositData] = useState<any[]>([]);//保证金
  const [chargeData, setChargeData] = useState<any[]>([]);//租金
  const [treeData, setTreeData] = useState<TreeEntity[]>([]);
  const [isCal, setIsCal] = useState<boolean>(false);
 
  const [TermJson, setTermJson] = useState<string>();
  const [RateJson, setRateJson] = useState<string>();
  const [RebateJson, setRebateJson] = useState<string>();

  const [DepositResult, setDepositResult] = useState<ChargeFeeResultEntity[]>([]);
  const [ChargeFeeResult, setChargeFeeResult] = useState<ChargeFeeResultEntity[]>([]);

  const close = () => {
    closeDrawer();
  };
 
  //计算租金明细
  const calculation = () => {
    form.validateFields((errors, values) => { 
      if (!errors) { 
        //数据处理  
        //租赁条款     
        let TermJson: LeaseContractChargeFeeEntity[] = [];
        let data: LeaseContractChargeFeeEntity = {};
        //const TermJson=[];
        //const data = {}; 
        //data["FeeItemID"] = values.feeItemID[0];
        data.feeItemID = values.feeItemID[0];
        data.startDate = values.startDate[0];
        data.endDate = values.endDate[0];
        data.price = values.price[0];
        data.priceUnit = values.priceUnit[0];
        data.advancePayTime = values.advancePayTime[0];
        data.advancePayTimeUnit = values.advancePayTimeUnit[0];
        data.billType = values.billType[0];
        if (data.priceUnit == "1" || data.priceUnit == "3") {
          data.dayPriceConvertRule = values.dayPriceConvertRule[0];
        }
        data.yearDays = values.yearDays[0];
        data.payCycle = values.payCycle[0];
        data.rentalPeriodDivided = values.rentalPeriodDivided[0];
        TermJson.push(data);

        //动态添加的租期
        values.LeaseTerms.map(function (k, index, arr) {
          let data: LeaseContractChargeFeeEntity = {};
          data.feeItemID = values.feeItemID[k];
          data.startDate = values.startDate[k];
          data.endDate = values.endDate[k];
          data.price = values.price[k];
          data.priceUnit = values.priceUnit[k];
          data.advancePayTime = values.advancePayTime[k];
          data.advancePayTimeUnit = values.advancePayTimeUnit[k];
          data.billType = values.billType[k];
          if (data.priceUnit == "1" || data.priceUnit == "3") {
            data.dayPriceConvertRule = values.dayPriceConvertRule[k];
          }
          data.yearDays = values.yearDays[k];
          data.payCycle = values.payCycle[k];
          data.rentalPeriodDivided = values.rentalPeriodDivided[k];
          TermJson.push(data);
        });

        //递增率
        let RateJson: LeaseContractChargeIncreEntity[] = [];
        values.IncreasingRates.map(function (k, index, arr) {
          let rate: LeaseContractChargeIncreEntity = {};
          rate.increDate = values.increDate[k];
          rate.increPrice = values.increPrice[k];
          rate.increPriceUnit = values.increPriceUnit[k];
          rate.increDeposit = values.increDeposit[k];
          rate.increDepositUnit = values.increDepositUnit[k];
          RateJson.push(rate);
        });

        //优惠
        let RebateJson: LeaseContractChargeFeeOfferEntity[] = [];
        values.Rebates.map(function (k, index, arr) {
          let rebate: LeaseContractChargeFeeOfferEntity = {};
          rebate.type = values.rebateType[k];
          rebate.startDate = values.rebateStartDate[k];
          rebate.endDate = values.rebateEndDate[k];
          rebate.startPeriod = values.startPeriod[k];
          rebate.periodLength = values.periodLength[k];
          rebate.discount = values.discount[k];
          rebate.remark = values.remark[k];
          RebateJson.push(rebate);
        });

        //let entity = values; 
        let entity: LeaseContractChargeEntity = {};
        //费用条款-基本条款 
        entity.depositFeeItemID = values.depositFeeItemID;
        entity.leaseArea = values.leaseArea;
        entity.deposit = values.deposit;
        entity.depositUnit = values.depositUnit;
        entity.startDate = values.billingDate.format('YYYY-MM-DD');
        entity.endDate = values.contractEndDate.format('YYYY-MM-DD');
        entity.payDate = values.contractStartDate.format('YYYY-MM-DD');

        let strTermJson = JSON.stringify(TermJson);
        setTermJson(strTermJson);

        let strRateJson = JSON.stringify(RateJson);
        setRateJson(strRateJson);

        let strRebateJson = JSON.stringify(RebateJson);
        setRebateJson(strRebateJson);

        GetChargeDetail({
          ...entity,
          leaseContractId: '',
          Precision: values.precision,
          CalcPrecisionMode: values.calcPrecisionMode,
          TermJson: strTermJson,
          RateJson: strRateJson,
          RebateJson: strRebateJson

        }).then(res => {
          setIsCal(true);//计算了租金
          setDepositData(res.depositFeeResultList);//保证金明细
          setChargeData(res.chargeFeeResultList);//租金明细 
          setDepositResult(res.depositFeeResultList);
          setChargeFeeResult(res.chargeFeeResultList);
        });
      }
    });
  };

  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        //是否生成租金明细
        if(!isCal)
        {
          Modal.warning({
            title: '提示',
            content: '请生成租金明细！',
          });
          return;
        }
        //保存合同数据 

        
        let ContractCharge: LeaseContractChargeEntity = {};
        //费用条款-基本条款 
        ContractCharge.depositFeeItemID = values.depositFeeItemID;
        ContractCharge.leaseArea = values.leaseArea;
        ContractCharge.deposit = values.deposit;
        ContractCharge.depositUnit = values.depositUnit;
        ContractCharge.startDate = values.billingDate.format('YYYY-MM-DD');
        ContractCharge.endDate = values.contractEndDate.format('YYYY-MM-DD');
        ContractCharge.payDate = values.contractStartDate.format('YYYY-MM-DD'); 

        let Contract : LeaseContractDTO = {}; 
        Contract.no = values.no;
        Contract.follower = values.follower;
        Contract.leaseSize = values.leaseSize;
        Contract.contractStartDate = values.contractStartDate.format('YYYY-MM-DD');
        Contract.billingDate = values.billingDate.format('YYYY-MM-DD');
        Contract.contractEndDate = values.contractEndDate.format('YYYY-MM-DD');
        Contract.precision = values.precision;
        Contract.calcPrecisionMode = values.calcPrecisionMode;
        Contract.customer = values.customer;
        Contract.industry = values.industry;
        Contract.legalPerson = values.legalPerson;
        Contract.signer = values.signer;
        Contract.customerContact = values.customerContact;
        Contract.lateFee = values.lateFee;
        Contract.lateFeeUnit = values.lateFeeUnit;
        Contract.maxLateFee = values.maxLateFee;
        Contract.maxLateFeeUnit = values.maxLateFeeUnit;  

        SaveForm({
          ...Contract,
          ...ContractCharge,
          keyValue: '', 
          ChargeID: '',
          room:values.room,
          TermJson: TermJson,
          RateJson: RateJson,
          RebateJson: RebateJson,
          DepositResult: JSON.stringify(DepositResult),
          ChargeFeeResult:JSON.stringify(ChargeFeeResult) 
        }).then(res => {  

        }); 
      }
    });
  };

  //打开抽屉时初始化
  useEffect(() => {
    getCommonItems('IndustryType').then(res => {
      setIndustryType(res || []);
    });

    //加载关联收费项目
    GetAllFeeItems().then(res => {
      setFeeitems(res || []);
    });

    // 获取房产树
    GetQuickPStructsTreeJsonAll()
      .then(getResult)
      .then((res: TreeEntity[]) => {
        setTreeData(res || []);
        return res || [];
      });

  }, []);

  // 打开抽屉时初始化
  useEffect(() => {
  }, [modifyVisible]);

  return (
    <Drawer
      title={title}
      placement="right"
      width={1000}
      onClose={close}
      visible={modifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <Tabs defaultActiveKey="1" >
        <TabPane tab="基本信息" key="1">
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={24}>
              <Col span={12}>
                <Card title="基本信息" className={styles.card}>
                  <Row gutter={24}>
                    <Col lg={24}>
                      <Form.Item label="模板选择">
                        {getFieldDecorator('template', {
                        })(<Select placeholder="请选择模板" />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={12}>
                      <Form.Item label="合同编号" required>
                        {getFieldDecorator('no', {
                          rules: [{ required: true, message: '未选择模版时，请输入编号' }],
                        })(<Input placeholder="如不填写系统将自动生成" />)}
                      </Form.Item>
                    </Col>
                    <Col lg={12}>
                      <Form.Item label="跟进人" >
                        {getFieldDecorator('follower', {
                        })(<Select placeholder="请选择跟进人" />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={12}>
                      <Form.Item label="租赁数量（m²)">
                        {getFieldDecorator('leaseSize', {
                          rules: [{ required: true, message: '请输入租赁数量' }],
                        })(<InputNumber placeholder="请输入租赁数量" style={{ width: '100%' }} />)}
                      </Form.Item>
                    </Col>
                    <Col lg={12}>
                      <Form.Item label="合同签订时间" required>
                        {getFieldDecorator('contractStartDate', {
                          initialValue: moment(new Date()),
                          rules: [{ required: true, message: '请选择合同签订时间' }],
                        })(<DatePicker placeholder="请选择合同签订时间" style={{ width: '100%' }} />)}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    <Col lg={12}>
                      <Form.Item label="合同计租时间">
                        {getFieldDecorator('billingDate', {
                          initialValue: moment(new Date()),
                          rules: [{ required: true, message: '请选择合同计租时间' }],
                        })(<DatePicker placeholder="请选择合同计租时间" style={{ width: '100%' }} />)}
                      </Form.Item>
                    </Col>
                    <Col lg={12}>
                      <Form.Item label="合同失效时间" required>
                        {getFieldDecorator('contractEndDate', {
                          initialValue: moment(new Date()).add(1, 'years').add(-1, 'days'),
                          rules: [{ required: true, message: '请选择合同失效时间' }],
                        })(<DatePicker placeholder="请选择合同失效时间" style={{ width: '100%' }} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={12}>
                      <Form.Item label="单价保留小数点">
                        {getFieldDecorator('precision', {
                          initialValue: 2,
                          rules: [{ required: true, message: '请填写保留几位' }],
                        })(<InputNumber placeholder="请填写保留几位" style={{ width: '100%' }} />)}
                      </Form.Item>
                    </Col>
                    <Col lg={12}>
                      <Form.Item label="计算精度">
                        {getFieldDecorator('calcPrecisionMode', {
                          initialValue: "1"
                        })(<Select>
                          <Option value="1" >最终计算结果保留2位</Option>
                          <Option value="2" >每步计算结果保留2位</Option>
                        </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                </Card>
              </Col>
              <Col span={12}>
                <Card title="租赁信息">
                  <Row gutter={24}>
                    <Col lg={24}>
                      <Form.Item label="房源选择" required>
                        {getFieldDecorator('room', {
                          rules: [{ required: true, message: '请选择房源' }],
                        })(
                          <TreeSelect
                            placeholder="请选择房源"
                            allowClear
                            dropdownStyle={{ maxHeight: 300 }}
                            treeData={treeData}
                            treeDataSimpleMode={true}
                            multiple={true}>
                          </TreeSelect>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={12}>
                      <Form.Item label="租客" required>
                        {getFieldDecorator('customer', {
                          rules: [{ required: true, message: '请填写姓名或公司' }],
                        })(<Input placeholder="请填写姓名或公司" />)}
                      </Form.Item>
                    </Col>
                    <Col lg={12}>
                      <Form.Item label="行业" required>
                        {getFieldDecorator('industry', {
                          rules: [{ required: true, message: '请选择行业' }],
                        })(
                          <Select placeholder="请选择行业">
                            {industryType.map(item => (
                              <Option value={item.value} key={item.value}>
                                {item.text}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={12}>
                      <Form.Item label="法人" required>
                        {getFieldDecorator('legalPerson', {
                          rules: [{ required: true, message: '请填写法人' }],
                        })(<Input placeholder="请填写法人" />)}
                      </Form.Item>
                    </Col>
                    <Col lg={12}>
                      <Form.Item label="签订人" required>
                        {getFieldDecorator('signer', {
                          rules: [{ required: true, message: '请输入签订人' }],
                        })(<Input placeholder="请输入签订人" />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={24}>
                      <Form.Item label="租客联系人">
                        {getFieldDecorator('customerContact', {
                          rules: [{ required: true, message: '请输入租客联系人' }],
                        })(<Input placeholder="请输入租客联系人" />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={6}>
                      <Form.Item label="滞纳金比例" >
                        {getFieldDecorator('lateFee', {
                        })(<InputNumber placeholder="请输入" />)}
                      </Form.Item>
                    </Col>
                    <Col lg={6}>
                      <Form.Item label="&nbsp;" >
                        {getFieldDecorator('lateFeeUnit', {
                          initialValue: "1"
                        })(
                          <Select>
                            <Option value="1">%/天</Option>
                          </Select>)}
                      </Form.Item>
                    </Col>
                    <Col lg={7}>
                      <Form.Item label="滞纳金上限" >
                        {getFieldDecorator('maxLateFee', {
                        })(<InputNumber placeholder="请输入" />)}
                      </Form.Item>
                    </Col>
                    <Col lg={5}>
                      <Form.Item label="&nbsp;" >
                        {getFieldDecorator('maxLateFeeUnit', {
                          initialValue: "1"
                        })(<Select>
                          <Option value="1">%</Option>
                        </Select>)}
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Form>
        </TabPane>
        <TabPane tab="费用条款" key="2">
          <Form layout="vertical" hideRequiredMark>
            <Card title="基本条款" className={styles.card} >
              <Row gutter={24}>
                <Col lg={4}>
                  <Form.Item label="租赁数量（㎡）" required>
                    {getFieldDecorator('leaseArea', {
                      initialValue: 200
                    })(<Input readOnly />)}
                  </Form.Item>
                </Col>
                <Col lg={10}>
                  <Form.Item label="保证金关联费项" required>
                    {getFieldDecorator('depositFeeItemID', {
                      rules: [{ required: true, message: '请选择费项' }]
                    })(
                      <Select placeholder="请选择费项">
                        {feeitems.map(item => (
                          <Option value={item.value} key={item.value}>
                            {item.text}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col lg={5}>
                  <Form.Item label="保证金数量" required>
                    {getFieldDecorator('deposit', {
                      initialValue: 1,
                      rules: [{ required: true, message: '请输入保证金数量' }],
                    })(<Input placeholder="请输入保证金数量" />)}
                  </Form.Item>
                </Col>
                <Col lg={5}>
                  <Form.Item label="&nbsp;" >
                    {getFieldDecorator('depositUnit', {
                      initialValue: "1"
                    })(
                      <Select>
                        <Option value="1">月</Option>
                        <Option value="2">元</Option>
                      </Select>)}
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
            <LeaseTerm form={form} feeitems={feeitems}></LeaseTerm>
            <IncreasingRate form={form}></IncreasingRate>
            <Rebate form={form}></Rebate>
            <Button style={{ width: '100%', marginBottom: '10px' }} onClick={calculation}>点击生成租金明细</Button>
            <ResultList
              depositData={depositData}
              chargeData={chargeData}
            ></ResultList>
          </Form>
        </TabPane>
      </Tabs>
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
        <Button onClick={save} type="primary">
          确定
          </Button>
      </div>
    </Drawer>
  );

};

export default Form.create<ModifyProps>()(Modify);

