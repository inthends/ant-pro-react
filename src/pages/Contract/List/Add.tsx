
import { message, AutoComplete, Modal, InputNumber, TreeSelect, Tabs, Select, Button, Card, Col, DatePicker, Drawer, Form, Input, Row } from 'antd';
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
import { getCommonItems, GetUserList } from '@/services/commonItem';
import { SaveForm, GetAllFeeItems, GetChargeDetail } from './Main.service';
import styles from './style.less';

const { Option } = Select;
const { TabPane } = Tabs;

interface AddProps {
  visible: boolean;
  id?: string;
  data?: any;
  treeData: any[];
  closeDrawer(): void;
  form: WrappedFormUtils;
  reload(): void;
}

const Add = (props: AddProps) => {
  const title = '添加合同';
  const { visible, closeDrawer, form, reload, treeData } = props;
  const { getFieldDecorator } = form;
  const [industryType, setIndustryType] = useState<any[]>([]); //行业  
  const [feeitems, setFeeitems] = useState<TreeEntity[]>([]);
  //租金计算结果
  const [depositData, setDepositData] = useState<ChargeFeeResultEntity[]>([]);//保证金
  const [chargeData, setChargeData] = useState<ChargeFeeResultEntity[]>([]);//租金 
  // const [treeData, setTreeData] = useState<any[]>([]);
  const [isCal, setIsCal] = useState<boolean>(false);
  const [TermJson, setTermJson] = useState<string>();
  const [RateJson, setRateJson] = useState<string>();
  const [RebateJson, setRebateJson] = useState<string>();
  const [userSource, setUserSource] = useState<any[]>([]);

  // const [DepositResult, setDepositResult] = useState<ChargeFeeResultEntity[]>([]);
  // const [ChargeFeeResult, setChargeFeeResult] = useState<ChargeFeeResultEntity[]>([]);

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
        //data["FeeItemId"] = values.feeItemId[0];
        data.feeItemId = values.feeItemId[0];
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
          data.feeItemId = values.feeItemId[k];
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
        entity.depositFeeItemId = values.depositFeeItemId;
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
          LeaseContractId: '',
          CalcPrecision: values.calcPrecision,
          CalcPrecisionMode: values.calcPrecisionMode,
          TermJson: strTermJson,
          RateJson: strRateJson,
          RebateJson: strRebateJson

        }).then(res => {
          setIsCal(true);//计算了租金
          setDepositData(res.depositFeeResultList);//保证金明细
          setChargeData(res.chargeFeeResultList);//租金明细  
          // setDepositResult(res.depositFeeResultList);
          // setChargeFeeResult(res.chargeFeeResultList);
        });
      }
    });
  };

  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        //是否生成租金明细
        if (!isCal) {
          Modal.warning({
            title: '提示',
            content: '请生成租金明细！',
            okText: '确认'
          });
          return;
        }
        //保存合同数据
        let ContractCharge: LeaseContractChargeEntity = {};
        //费用条款-基本条款 
        ContractCharge.depositFeeItemId = values.depositFeeItemId;
        ContractCharge.leaseArea = values.leaseArea;
        ContractCharge.deposit = values.deposit;
        ContractCharge.depositUnit = values.depositUnit;
        ContractCharge.startDate = values.billingDate.format('YYYY-MM-DD');
        ContractCharge.endDate = values.contractEndDate.format('YYYY-MM-DD');
        ContractCharge.payDate = values.contractStartDate.format('YYYY-MM-DD');

        let Contract: LeaseContractDTO = {};
        Contract.no = values.no;
        Contract.follower = values.follower;
        Contract.followerId = values.followerId;
        Contract.leaseSize = values.leaseSize;
        Contract.contractStartDate = values.contractStartDate.format('YYYY-MM-DD');
        Contract.billingDate = values.billingDate.format('YYYY-MM-DD');
        Contract.contractEndDate = values.contractEndDate.format('YYYY-MM-DD');
        Contract.calcPrecision = values.calcPrecision;
        Contract.calcPrecisionMode = values.calcPrecisionMode;
        Contract.customer = values.customer;
        Contract.customerId = values.customerId;
        Contract.industry = values.industry;
        //Contract.industryId = values.industryId;
        Contract.legalPerson = values.legalPerson;
        Contract.signer = values.signer;
        Contract.signerId = values.signerId;
        Contract.customerContact = values.customerContact;
        Contract.customerContactId = values.customerContactId;
        Contract.lateFee = values.lateFee;
        Contract.lateFeeUnit = values.lateFeeUnit;
        Contract.maxLateFee = values.maxLateFee;
        Contract.maxLateFeeUnit = values.maxLateFeeUnit;

        SaveForm({
          ...Contract,
          ...ContractCharge,
          keyValue: '',
          ChargeId: '',
          room: values.room,
          TermJson: TermJson,
          RateJson: RateJson,
          RebateJson: RebateJson,
          // DepositResult: JSON.stringify(DepositResult),
          // ChargeFeeResult:JSON.stringify(ChargeFeeResult) 
          DepositResult: JSON.stringify(depositData),
          ChargeFeeResult: JSON.stringify(chargeData)

        }).then(res => {
          message.success('保存成功');
          closeDrawer();
          reload();
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

    //获取房产树
    // GetQuickSimpleTreeAllForContract()
    //   .then(getResult)
    //   .then((res: TreeEntity[]) => {
    //     setTreeData(res || []);
    //     return res || [];
    //   });
  }, []);

  // 打开抽屉时初始化
  useEffect(() => {
  }, [visible]);

  const handleSearch = value => {
    if (value == '')
      return;
    GetUserList(value, '员工').then(res => {
      setUserSource(res || []);
    })
  };

  const userList = userSource.map
    (item => <Option key={item.id} value={item.name}>{item.name}</Option>);

  const onFollowerSelect = (value, option) => {
    form.setFieldsValue({ followerId: option.key });
  };

  const onSignerSelect = (value, option) => {
    form.setFieldsValue({ signerId: option.key });
  };

  const onRoomChange = (value, label, extra) => {
    //选择房源,计算面积
    //["101 158.67㎡", "102 156.21㎡"] 
    let area = 0;
    label.forEach((val, idx, arr) => {
      area += parseFloat(val.split(' ')[1].replace('㎡', ''));
    });
    form.setFieldsValue({ leaseSize: area.toFixed(2) });
    form.setFieldsValue({ leaseArea: area.toFixed(2) });
  };

  // const onIndustrySelect = (value, option) => { 
  //   //设置行业名称
  //   form.setFieldsValue({ industry: option.props.children });
  // };


  return (
    <Drawer
      title={title}
      placement="right"
      width={1000}
      onClose={close}
      visible={visible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <Form layout="vertical" hideRequiredMark>
        <Tabs defaultActiveKey="1" >
          <TabPane tab="基本信息" key="1">
            <Row gutter={24}>
              <Col span={12}>
                <Card title="基本信息" className={styles.addcard}>
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
                        })(
                          <AutoComplete
                            dataSource={userList}
                            onSearch={handleSearch}
                            placeholder="请输入跟进人"
                            onSelect={onFollowerSelect}
                          />
                        )}
                        {getFieldDecorator('followerId', {
                        })(
                          <input type='hidden' />
                        )}
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
                        {getFieldDecorator('calcPrecision', {
                          initialValue: 2,
                          rules: [{ required: true, message: '请填写保留几位' }],
                        })(<InputNumber placeholder="请填写保留几位" style={{ width: '100%' }} />)}
                      </Form.Item>
                    </Col>
                    <Col lg={12}>
                      <Form.Item label="计算精度">
                        {getFieldDecorator('calcPrecisionMode', {
                          initialValue: "最终计算结果保留2位"
                        })(<Select>
                          <Option value="最终计算结果保留2位" >最终计算结果保留2位</Option>
                          <Option value="每步计算结果保留2位" >每步计算结果保留2位</Option>
                        </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="租赁信息" className={styles.addcard}>
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
                            onChange={onRoomChange}
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
                        {getFieldDecorator('industryId', {
                          rules: [{ required: true, message: '请选择行业' }],
                        })(
                          <Select placeholder="请选择行业"
                            // onSelect={onIndustrySelect}
                          >
                            {/* {industryType.map(item => (
                              <Option value={item.value} key={item.key}>
                                {item.title}
                              </Option>
                            ))} */}

                            {industryType.map(item => (
                              <Option value={item.title} key={item.title}>
                                {item.title}
                              </Option>
                            ))}

                          </Select>
                        )}
                        {getFieldDecorator('industry', {
                        })(
                          <input type='hidden' />
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
                        })(
                          <AutoComplete
                            dataSource={userList}
                            onSearch={handleSearch}
                            placeholder="请输入签订人"
                            onSelect={onSignerSelect}
                          />
                        )}
                        {getFieldDecorator('signerId', {
                        })(
                          <input type='hidden' />
                        )}
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
                          initialValue: "%/天"
                        })(
                          <Select>
                            <Option value="%/天">%/天</Option>
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
                          initialValue: "%"
                        })(<Select>
                          <Option value="%">%</Option>
                        </Select>)}
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

          </TabPane>
          <TabPane tab="费用条款" key="2">
            <Card title="基本条款" className={styles.card} >
              <Row gutter={24}>
                <Col lg={4}>
                  <Form.Item label="租赁数量（㎡）" required>
                    {getFieldDecorator('leaseArea', {
                    })(<Input readOnly />)}
                  </Form.Item>
                </Col>
                <Col lg={10}>
                  <Form.Item label="保证金关联费项" required>
                    {getFieldDecorator('depositFeeItemId', {
                      rules: [{ required: true, message: '请选择费项' }]
                    })(
                      <Select placeholder="请选择费项">
                        {feeitems.map(item => (
                          <Option value={item.key} key={item.key}>
                            {item.title}
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
                      initialValue: "月"
                    })(
                      <Select>
                        <Option value="月">月</Option>
                        <Option value="元">元</Option>
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
        <Button onClick={save} type="primary">
          确定
          </Button>
      </div>
    </Drawer>
  );

};

export default Form.create<AddProps>()(Add);

