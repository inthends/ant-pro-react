
import { Spin, message, InputNumber, TreeSelect, Tabs, Select, Button, Card, Col, DatePicker, Drawer, Form, Input, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import {
  TreeEntity, HtLeasecontractcharge, HtLeasecontractchargefee,
  HtLeasecontractchargefeeoffer,
  HtLeasecontractchargeincre,
  HtChargefeeresult,
  LeaseContractDTO
} from '@/model/models';
import React, { useEffect, useState } from 'react';
import LeaseTerm from './LeaseTerm';
import IncreasingRate from './IncreasingRate';
import Rebate from './Rebate';
import ResultList from './ResultList';
import moment from 'moment';
import { getCommonItems, GetUserList } from '@/services/commonItem';
import { SaveForm, GetFeeItemsByUnitId, GetChargeDetail } from './Main.service';
import { GetOrgTreeSimple, GetAsynChildBuildingsSimple } from '@/services/commonItem';
import styles from './style.less';

const { Option } = Select;
const { TabPane } = Tabs;

interface AddProps {
  visible: boolean;
  id?: string;
  data?: any;
  // treeData: any[];
  closeDrawer(): void;
  form: WrappedFormUtils;
  reload(): void;
};

const Add = (props: AddProps) => {
  const title = '添加合同';
  const { visible, closeDrawer, form, reload } = props;
  const { getFieldDecorator } = form;
  const [industryType, setIndustryType] = useState<any[]>([]); //行业  
  const [feeItems, setFeeItems] = useState<TreeEntity[]>([]);
  //租金计算结果
  const [depositData, setDepositData] = useState<HtChargefeeresult[]>([]);//保证金
  const [chargeData, setChargeData] = useState<HtChargefeeresult[]>([]);//租金 
  const [treeData, setTreeData] = useState<any[]>([]);
  const [isCal, setIsCal] = useState<boolean>(false);
  const [TermJson, setTermJson] = useState<string>();
  const [RateJson, setRateJson] = useState<string>();
  const [RebateJson, setRebateJson] = useState<string>();
  const [userSource, setUserSource] = useState<any[]>([]);

  // const [DepositResult, setDepositResult] = useState<HtChargefeeresult[]>([]);
  // const [ChargeFeeResult, setChargeFeeResult] = useState<HtChargefeeresult[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  // const [billUnitId, setBillUnitId] = useState<string>();//计费房屋Id 
  // const close = () => {
  //   closeDrawer();
  // };

  //计算租金明细
  const calculation = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        //租赁条款     
        setLoading(true);
        let TermJson: HtLeasecontractchargefee[] = [];
        let data: HtLeasecontractchargefee = {};
        //const TermJson=[];
        //const data = {}; 
        //data["FeeItemId"] = values.feeItemId[0];
        data.feeItemId = values.feeItemId[0];
        data.feeItemName = values.feeItemName[0];
        data.startDate = values.startDate[0];
        data.endDate = values.endDate[0];
        data.price = values.price[0];
        data.priceUnit = values.priceUnit[0];
        data.advancePayTime = values.advancePayTime[0];
        data.advancePayTimeUnit = values.advancePayTimeUnit[0];
        data.billType = values.billType[0];
        if (data.priceUnit == "元/m²·天" || data.priceUnit == "元/天") {
          data.dayPriceConvertRule = values.dayPriceConvertRule[0];
        }
        data.yearDays = values.yearDays[0];
        data.payCycle = values.payCycle[0];
        data.rentalPeriodDivided = values.rentalPeriodDivided[0];
        TermJson.push(data);

        //动态添加的租期
        values.LeaseTerms.map(function (k, index, arr) {
          let data: HtLeasecontractchargefee = {};
          data.feeItemId = values.feeItemId[k];
          data.feeItemName = values.feeItemName[k];
          data.startDate = values.startDate[k];
          data.endDate = values.endDate[k];
          data.price = values.price[k];
          data.priceUnit = values.priceUnit[k];
          data.advancePayTime = values.advancePayTime[k];
          data.advancePayTimeUnit = values.advancePayTimeUnit[k];
          data.billType = values.billType[k];
          if (data.priceUnit == "元/m²·天" || data.priceUnit == "元/天") {
            data.dayPriceConvertRule = values.dayPriceConvertRule[k];
          }
          data.yearDays = values.yearDays[k];
          data.payCycle = values.payCycle[k];
          data.rentalPeriodDivided = values.rentalPeriodDivided[k];
          TermJson.push(data);
        });

        //递增率
        let RateJson: HtLeasecontractchargeincre[] = [];
        values.IncreasingRates.map(function (k, index, arr) {
          let rate: HtLeasecontractchargeincre = {};
          rate.increDate = values.increDate[k];
          rate.increPrice = values.increPrice[k];
          rate.increPriceUnit = values.increPriceUnit[k];
          rate.increDeposit = values.increDeposit[k];
          rate.increDepositUnit = values.increDepositUnit[k];
          RateJson.push(rate);
        });

        //优惠
        let RebateJson: HtLeasecontractchargefeeoffer[] = [];
        values.Rebates.map(function (k, index, arr) {
          let rebate: HtLeasecontractchargefeeoffer = {};
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
        let entity: HtLeasecontractcharge = {};
        //费用条款-基本条款 
        entity.depositFeeItemId = values.depositFeeItemId;
        entity.depositFeeItemName = values.depositFeeItemName;
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
          BillUnitId: values.billUnitId,//计费单元id
          LeaseContractId: '',
          CalcPrecision: values.calcPrecision,
          CalcPrecisionMode: values.calcPrecisionMode,
          TermJson: strTermJson,
          RateJson: strRateJson,
          RebateJson: strRebateJson
        }).then(res => {
          setIsCal(true);//计算租金
          setDepositData(res.depositFeeResultList);//保证金明细
          setChargeData(res.chargeFeeResultList);//租金明细  
          // setDepositResult(res.depositFeeResultList);
          // setChargeFeeResult(res.chargeFeeResultList); 
          setLoading(false);
        });
      }
    });
  };

  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        //是否生成租金明细
        if (!isCal) {
          // Modal.warning({
          //   title: '提示',
          //   content: '请生成租金明细！',
          //   okText: '确认'
          // }); 
          message.warning('请生成租金明细！');
          return;
        }
        setLoading(true);
        //保存合同数据
        let ContractCharge: HtLeasecontractcharge = {};
        //费用条款-基本条款 
        ContractCharge.depositFeeItemId = values.depositFeeItemId;
        ContractCharge.depositFeeItemName = values.depositFeeItemName;
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
        Contract.billUnitId = values.billUnitId;

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
          setLoading(false);
          message.success('保存成功');
          closeDrawer();
          reload();
        });
      }
    });
  };

  //打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      getCommonItems('IndustryType').then(res => {
        setIndustryType(res || []);
      });

      // //加载关联收费项目
      // GetAllFeeItems().then(res => {
      //   setFeeitems(res || []);
      // });

      //获取房产树
      GetOrgTreeSimple().then((res: any[]) => {
        setTreeData(res || []);
      });

      GetUserList('', '员工').then(res => {
        setUserSource(res || []);
      })
    }
  }, [visible]);

  // 打开抽屉时初始化
  // useEffect(() => {
  // }, [visible]);

  // const handleSearch = value => {
  //   if (value == '')
  //     return;
  //   GetUserList(value, '员工').then(res => {
  //     setUserSource(res || []);
  //   })
  // };

  // const userList = userSource.map
  //   (item => <Option key={item.id} value={item.name}>{item.name}</Option>);

  const onFollowerSelect = (value, option) => {
    form.setFieldsValue({ followerId: option.key });
  };

  // const onFollowerChange = (value) => { 
  //   //验证值
  //   const len = userSource.indexOf(value);
  //   if (len < 0) {
  //     message.warning('用户不存在');
  //   } 
  // };

  const onSignerSelect = (value, option) => {
    form.setFieldsValue({ signerId: option.key });
  };

  //选择房屋
  const onRoomChange = (value, label, extra) => {
    //多个房屋的时候，默认获取第一个房屋作为计费单元
    if (value.length == 0) {
      // setBillUnitId('');
      form.setFieldsValue({ billUnitId: '' });
      setFeeItems([]);
    } else {
      form.setFieldsValue({ billUnitId: value[0] });
      // setBillUnitId(value[0]);
      //加载房屋费项
      //加载关联收费项目
      GetFeeItemsByUnitId(value[0]).then(res => {
        setFeeItems(res || []);
      });
    }

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


  //异步加载
  const onLoadData = treeNode =>
    new Promise<any>(resolve => {
      if (treeNode.props.children && treeNode.props.children.length > 0 && treeNode.props.type != 'D') {
        resolve();
        return;
      }
      setTimeout(() => {
        GetAsynChildBuildingsSimple(treeNode.props.eventKey, treeNode.props.type).then((res: any[]) => {
          // treeNode.props.children = res || [];
          let newtree = treeData.concat(res);
          // setTreeData([...treeData]);
          setTreeData(newtree);
        });
        resolve();
      }, 50);
    });


  //保证金单位切换
  const changeFeeItem = (value, option) => {
    //const changeFeeItem = e => {
    form.setFieldsValue({ depositFeeItemName: option.props.children });
  };

  //结束日期控制
  const disabledEndDate = (current) => {
    return current < moment(form.getFieldValue('billingDate'));
  };

  //起始日期控制
  const disabledStartDate = (current) => {
    return current < moment(form.getFieldValue('contractEndDate'));
  };

  return (
    <Drawer
      title={title}
      placement="right"
      width={1050}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <Form layout="vertical" hideRequiredMark>
        <Spin tip="数据处理中..." spinning={loading}>
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

                          {/* {getFieldDecorator('follower', {
                          })(
                            <AutoComplete
                              dataSource={userList}
                              onSearch={handleSearch}
                              placeholder="请输入跟进人"
                              onSelect={onFollowerSelect}
                              // onChange={onFollowerChange}
                            />
                          )} */}

                          {getFieldDecorator('follower', {
                          })(
                            <Select
                              showSearch
                              // onSearch={handleSearch}
                              // optionFilterProp="children"
                              onSelect={onFollowerSelect}
                            >
                              {userSource.map(item => (
                                <Option key={item.id} value={item.name}>
                                  {item.name}
                                </Option>
                              ))}
                            </Select>
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
                        <Form.Item label="租赁数量/㎡">
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
                          })(<DatePicker placeholder="请选择合同计租时间"
                            disabledDate={disabledStartDate}
                            style={{ width: '100%' }} />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="合同失效时间" required>
                          {getFieldDecorator('contractEndDate', {
                            initialValue: moment(new Date()).add(1, 'years').add(-1, 'days'),
                            rules: [{ required: true, message: '请选择合同失效时间' }],
                          })(<DatePicker placeholder="请选择合同失效时间"
                            disabledDate={disabledEndDate}
                            style={{ width: '100%' }} />)}
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
                              loadData={onLoadData}
                              treeDataSimpleMode={true}
                              onChange={onRoomChange}
                              multiple={true}>
                            </TreeSelect>
                          )}
                          <span style={{ marginLeft: 8, color: "green" }}>多个房屋的时候，默认获取第一个房屋作为计费单元</span>

                          {getFieldDecorator('billUnitId', {
                          })(
                            <input type='hidden' />
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
                            <Select placeholder="请选择行业"
                            // onSelect={onIndustrySelect}
                            >
                              {/* {industryType.map(item => (
                              <Option value={item.value} key={item.key}>
                                {item.title}
                              </Option>
                            ))} */}

                              {industryType.map(item => (
                                <Option value={item.value} key={item.key}>
                                  {item.title}
                                </Option>
                              ))}

                            </Select>
                          )}

                          {/* {getFieldDecorator('industry', {
                          })(
                            <input type='hidden' />
                          )} */}

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
                          {/* {getFieldDecorator('signer', {
                            rules: [{ required: true, message: '请输入签订人' }],
                          })(
                            <AutoComplete
                              dataSource={userList}
                              onSearch={handleSearch}
                              placeholder="请输入签订人"
                              onSelect={onSignerSelect}
                            />
                          )} */}

                          {getFieldDecorator('signer', {
                          })(
                            <Select
                              showSearch
                              onSelect={onSignerSelect}
                            >
                              {userSource.map(item => (
                                <Option key={item.id} value={item.name}>
                                  {item.name}
                                </Option>
                              ))}
                            </Select>
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
                      <Col lg={7}>
                        <Form.Item label="滞纳金比例" >
                          {getFieldDecorator('lateFee', {
                          })(<InputNumber placeholder="请输入" style={{ width: '120px' }} />)}
                        </Form.Item>
                      </Col>
                      <Col lg={5}>
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
                          })(<InputNumber placeholder="请输入" style={{ width: '120px' }} />)}
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
                        <Select placeholder="请选择费项"
                          onChange={changeFeeItem}
                        >
                          {feeItems.map(item => (
                            <Option value={item.value} key={item.key}>
                              {item.title}
                            </Option>
                          ))}
                        </Select>
                      )}

                      {getFieldDecorator('depositFeeItemName', {
                      })(
                        <input type='hidden' />
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
              <LeaseTerm form={form} feeItems={feeItems}></LeaseTerm>
              <IncreasingRate form={form}></IncreasingRate>
              <Rebate form={form}></Rebate>
              <Button style={{ width: '100%', marginBottom: '10px' }} onClick={calculation}>点击生成租金明细</Button>
              <ResultList
                depositData={depositData}
                chargeData={chargeData}
                className={styles.addcard}
              ></ResultList>
            </TabPane>
          </Tabs>
        </Spin>
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
        <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
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

