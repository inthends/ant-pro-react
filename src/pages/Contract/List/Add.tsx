
import { Upload, Icon, AutoComplete, Spin, message, InputNumber, TreeSelect, Tabs, Select, Button, Card, Col, DatePicker, Drawer, Form, Input, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import {
  TreeEntity, HtLeasecontractcharge, HtLeasecontractchargefee,
  HtLeasecontractchargefeeoffer, HtLeasecontractchargeincre,
  HtChargefeeresult, htLeasecontract
} from '@/model/models';
import React, { useEffect, useState } from 'react';
// import LeaseTerm from './LeaseTerm';
// import IncreasingRate from './IncreasingRate';
// import Rebate from './Rebate';
import ResultList from './ResultList';
import moment from 'moment';
import { getCommonItems, GetUserList } from '@/services/commonItem';
import { RemoveFile, SaveForm, GetFeeItemsByUnitId, GetChargeDetail } from './Main.service';
import { GetOrgTreeSimple, GetAsynChildBuildingsSimple } from '@/services/commonItem';
import styles from './style.less';
import { GetCustomerInfo, CheckContractCustomer, GetContractCustomerList } from '../../Resource/PStructUser/PStructUser.service';
import QuickModify from '../../Resource/PStructUser/QuickModify';
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

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

  const [chargefee, setChargefee] = useState<HtLeasecontractchargefee>({});
  const [chargeincre, setChargeincre] = useState<HtLeasecontractchargeincre>();
  const [chargefeeoffer, setChargefeeoffer] = useState<HtLeasecontractchargefeeoffer>({});

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
        // let TermJson: HtLeasecontractchargefee[] = [];
        // let data: HtLeasecontractchargefee = {};
        //const TermJson=[];
        //const data = {}; 
        //data["FeeItemId"] = values.feeItemId[0];
        let mychargefee: HtLeasecontractchargefee = {};
        mychargefee.feeItemId = values.feeItemId;
        mychargefee.feeItemName = values.feeItemName;
        mychargefee.startDate = values.startDate.format('YYYY-MM-DD');;
        mychargefee.endDate = values.endDate.format('YYYY-MM-DD');;
        mychargefee.price = values.price;
        mychargefee.priceUnit = values.priceUnit;
        mychargefee.advancePayTime = values.advancePayTime;
        mychargefee.advancePayTimeUnit = values.advancePayTimeUnit;
        mychargefee.billType = values.billType;
        if (mychargefee.priceUnit == "元/m²·天" || mychargefee.priceUnit == "元/天") {
          mychargefee.dayPriceConvertRule = values.dayPriceConvertRule;
        }
        mychargefee.yearDays = values.yearDays;
        mychargefee.payCycle = values.payCycle;
        mychargefee.rentalPeriodDivided = values.rentalPeriodDivided;
        //TermJson.push(data);

        //动态添加的租期
        // values.LeaseTerms.map(function (k, index, arr) {
        //   let data: HtLeasecontractchargefee = {};
        //   data.feeItemId = values.feeItemId[k];
        //   data.feeItemName = values.feeItemName[k];
        //   data.startDate = values.startDate[k];
        //   data.endDate = values.endDate[k];
        //   data.price = values.price[k];
        //   data.priceUnit = values.priceUnit[k];
        //   data.advancePayTime = values.advancePayTime[k];
        //   data.advancePayTimeUnit = values.advancePayTimeUnit[k];
        //   data.billType = values.billType[k];
        //   if (data.priceUnit == "元/m²·天" || data.priceUnit == "元/天") {
        //     data.dayPriceConvertRule = values.dayPriceConvertRule[k];
        //   }
        //   data.yearDays = values.yearDays[k];
        //   data.payCycle = values.payCycle[k];
        //   data.rentalPeriodDivided = values.rentalPeriodDivided[k];
        //   TermJson.push(data);
        // });

        //递增率
        // let RateJson: HtLeasecontractchargeincre[] = [];
        // values.IncreasingRates.map(function (k, index, arr) {
        //   let rate: HtLeasecontractchargeincre = {};
        //   rate.increDate = values.increDate[k];
        //   rate.increPrice = values.increPrice[k];
        //   rate.increPriceUnit = values.increPriceUnit[k];
        //   rate.increDeposit = values.increDeposit[k];
        //   rate.increDepositUnit = values.increDepositUnit[k];
        //   RateJson.push(rate);
        // });

        // let RateJson: HtLeasecontractchargeincre[] = [];
        let mychargeincre: HtLeasecontractchargeincre = {};
        mychargeincre.increType = values.increType;
        mychargeincre.increPrice = values.increPrice;
        mychargeincre.increPriceUnit = values.increPriceUnit;
        mychargeincre.increDeposit = values.increDeposit;
        mychargeincre.increDepositUnit = values.increDepositUnit;
        // RateJson.push(rate);

        //优惠
        // values.Rebates.map(function (k, index, arr) {
        //   let rebate: HtLeasecontractchargefeeoffer = {};
        //   rebate.type = values.rebateType[k];
        //   rebate.startDate = values.rebateStartDate[k];
        //   rebate.endDate = values.rebateEndDate[k];
        //   rebate.startPeriod = values.startPeriod[k];
        //   rebate.periodLength = values.periodLength[k];
        //   rebate.discount = values.discount[k];
        //   rebate.remark = values.remark[k];
        //   RebateJson.push(rebate);
        // });

        // let RebateJson: HtLeasecontractchargefeeoffer[] = [];
        let mychargefeeoffer: HtLeasecontractchargefeeoffer = {};
        mychargefeeoffer.rebateType = values.rebateType;
        if (values.rebateStartDate != undefined)
          mychargefeeoffer.rebateStartDate = values.rebateStartDate.format('YYYY-MM-DD');
        if (values.rebateEndDate != undefined)
          mychargefeeoffer.rebateEndDate = values.rebateEndDate.format('YYYY-MM-DD');
        mychargefeeoffer.startPeriod = values.startPeriod;
        mychargefeeoffer.periodLength = values.periodLength;
        mychargefeeoffer.discount = values.discount;
        mychargefeeoffer.remark = values.remark;
        // RebateJson.push(rebate);
        //let entity = values; 

        let entity: HtLeasecontractcharge = {};
        //费用条款-基本条款 
        entity.depositFeeItemId = values.depositFeeItemId;
        entity.depositFeeItemName = values.depositFeeItemName;
        entity.leaseArea = values.leaseArea;
        entity.deposit = values.deposit;
        entity.depositUnit = values.depositUnit;
        // entity.startDate = values.billingDate.format('YYYY-MM-DD');
        // entity.endDate = values.contractEndDate.format('YYYY-MM-DD');
        entity.calcPrecision = values.calcPrecision;
        entity.lateFee = values.lateFee;
        entity.lateMethod = values.lateMethod;
        if (values.lateDate != null)
          entity.lateDate = values.lateDate.format('YYYY-MM-DD');
        entity.propertyFee = values.propertyFee;

        // let strTermJson = JSON.stringify(TermJson);
        setChargefee(mychargefee);
        // let strRateJson = JSON.stringify(RateJson);
        setChargeincre(mychargeincre);
        // let strRebateJson = JSON.stringify(RebateJson);
        setChargefeeoffer(mychargefeeoffer);

        GetChargeDetail({
          ...entity,
          ...mychargefee,
          ...mychargeincre,
          ...mychargefeeoffer,
          BillUnitId: values.billUnitId,//计费单元id
          //LeaseContractId: '',
          startDate: values.startDate.format('YYYY-MM-DD'),
          endDate: values.endDate.format('YYYY-MM-DD')
          // CalcPrecision: values.calcPrecision,
          // CalcPrecisionMode: values.calcPrecisionMode,
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
        // ContractCharge.startDate = values.billingDate.format('YYYY-MM-DD');
        // ContractCharge.endDate = values.contractEndDate.format('YYYY-MM-DD');
        // ContractCharge.payDate = values.contractStartDate.format('YYYY-MM-DD');

        ContractCharge.calcPrecision = values.calcPrecision;
        ContractCharge.lateFee = values.lateFee;
        ContractCharge.lateMethod = values.lateMethod;
        if (values.lateDate != null)
          ContractCharge.lateDate = values.lateDate.format('YYYY-MM-DD');
        ContractCharge.propertyFee = values.propertyFee;

        let Contract: htLeasecontract = {};
        Contract.no = values.no;
        Contract.follower = values.follower;
        Contract.followerId = values.followerId;
        Contract.leaseSize = values.leaseSize;
        Contract.signingDate = values.signingDate.format('YYYY-MM-DD');
        Contract.startDate = values.startDate.format('YYYY-MM-DD');
        Contract.endDate = values.endDate.format('YYYY-MM-DD');
        // Contract.calcPrecision = values.calcPrecision;
        // Contract.calcPrecisionMode = values.calcPrecisionMode;
        Contract.customer = values.customer;
        Contract.customerId = values.customerId;
        Contract.customerType = values.customerType;
        Contract.industry = values.industry;
        //Contract.industryId = values.industryId;
        Contract.legalPerson = values.legalPerson;
        Contract.linkMan = values.linkMan;
        Contract.linkPhone = values.linkPhone;
        Contract.address = values.address;
        Contract.signer = values.signer;
        Contract.signerId = values.signerId;
        // Contract.lateFee = values.lateFee;
        // Contract.lateFeeUnit = values.lateFeeUnit;
        // Contract.maxLateFee = values.maxLateFee;
        // Contract.maxLateFeeUnit = values.maxLateFeeUnit;
        Contract.billUnitId = values.billUnitId;
        Contract.organizeId = organizeId;
        Contract.memo = values.memo;
        SaveForm({
          ...Contract,
          ...ContractCharge,
          ...chargefee,
          ...chargeincre,
          ...chargefeeoffer,
          keyValue: '',
          ChargeId: '',
          room: values.room,
          // DepositResult: JSON.stringify(DepositResult),
          // ChargeFeeResult:JSON.stringify(ChargeFeeResult) 
          DepositResult: JSON.stringify(depositData),
          ChargeFeeResult: JSON.stringify(chargeData)
        }).then(res => {
          message.success('保存成功');
          closeDrawer();
          reload();
          setLoading(false);
        });
      }
    });
  };

  //打开抽屉时初始化
  useEffect(() => {
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
    });

    //渠道
    getCommonItems('VisitChannel').then(res => {
      setChannel(res || []);
    });

  }, []);

  const [channel, setChannel] = useState<any[]>([]);//渠道

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
      setOrganizeId('');
      setFeeItems([]);
    } else {
      form.setFieldsValue({ billUnitId: value[0] });
      //机构Id
      setOrganizeId(extra.triggerNode.props.organizeId);
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

  //验证用户
  const checkExist = (rule, value, callback) => {
    if (value == undefined || value == '') {
      callback();//'承租方不能为空');
    }
    else {
      CheckContractCustomer(value).then(res => {
        if (res)
          callback('承租方不存在，请先新增');
        else
          callback();
      })
    }
  };

  const [organizeId, setOrganizeId] = useState<string>('');//所属机构id
  const [userList, setUserList] = useState<any[]>([]);
  const [customerVisible, setCustomerVisible] = useState<boolean>(false);
  const [customer, setCustomer] = useState<any>();

  //承租方
  const customerSearch = value => {
    if (value == '') {
      setUserList([]);
    }
    else {
      setUserList([]);
      GetContractCustomerList(value).then(res => {
        // setUserSource(res || []); 
        const list = res.map(item =>
          <Option key={item.id}
            value={item.name.trim()}>{item.name.trim()}
            <span className={styles.phoneNum}>{item.phoneNum}</span>
          </Option>
        ).concat([
          <Option disabled key="all" className={styles.addCustomer}>
            <a onClick={() => showCustomerDrawer('')}>
              新增承租方
            </a>
          </Option>]);//新增 
        setUserList(list);
      })
    }
  };

  const onCustomerSelect = (value, option) => {
    //props.children[1].props.children
    form.setFieldsValue({ customerId: option.key });
    GetCustomerInfo(option.key).then(res => {
      form.setFieldsValue({ customerType: res.type });
      form.setFieldsValue({ linkMan: res.linkMan });
      form.setFieldsValue({ linkPhone: res.phoneNum });
      form.setFieldsValue({ industry: res.industry });
      form.setFieldsValue({ legalPerson: res.legal });
      form.setFieldsValue({ address: res.address });
    })
  };

  const closeCustomerDrawer = () => {
    setCustomerVisible(false);
  };

  const showCustomerDrawer = (customerId) => {
    if (customerId != '') {
      GetCustomerInfo(customerId).then(res => {
        setCustomer(res);
        setCustomerVisible(true);
      })
    } else {
      setCustomerVisible(true);
    }
  };

  const [priceUnit, setPriceUnit] = useState<string>("元/m²·天");//单价单位
  //单位切换
  const changeUnit = value => {
    setPriceUnit(value);
  };

  //动态条款里面选择费项
  const changeFee = (value, option) => {
    form.setFieldsValue({ feeItemName: option.props.children });
  };


  //附件上传
  const [fileList, setFileList] = useState<any[]>([]);
  // const uploadButton = (
  //   <div>
  //     <Icon type="plus" />
  //     <div className="ant-upload-text">点击上传附件</div>
  //   </div>
  // );

  //重新设置state
  const handleChange = ({ fileList }) => setFileList([...fileList]);
  const handleRemove = (file) => {
    const fileid = file.fileid || file.response.fileid;
    RemoveFile(fileid).then(res => {
    });
  };

  return (
    <Drawer
      title={title}
      placement="right"
      width={1050}
      onClose={closeDrawer}
      visible={visible}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <Form layout="vertical" hideRequiredMark>
        <Spin tip="数据处理中..." spinning={loading}>
          <Tabs defaultActiveKey="1" >
            <TabPane tab="基本信息" key="1">
              <Row gutter={24}>
                <Col span={12}>
                  <Card title="基本信息" className={styles.addcard}>
                    {/* <Row gutter={24}>
                      <Col lg={24}>
                        <Form.Item label="模板选择">
                          {getFieldDecorator('template', {
                          })(<Select placeholder="请选择模板" />)}
                        </Form.Item>
                      </Col>
                    </Row> */}

                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="合同编号" required>
                          {getFieldDecorator('no', {
                            rules: [{ required: true, message: '请输入合同编号' }],
                          })(<Input placeholder="请输入合同编号" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="合同面积(㎡)">
                          {getFieldDecorator('leaseSize', {
                            rules: [{ required: true, message: '请输入合同面积' }],
                          })(<Input placeholder="自动获取房屋的计费面积" readOnly />)}
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="起始日期">
                          {getFieldDecorator('startDate', {
                            initialValue: moment(new Date()),
                            rules: [{ required: true, message: '请选择起始日期' }],
                          })(<DatePicker placeholder="请选择起始日期"
                            disabledDate={disabledStartDate}
                            style={{ width: '100%' }} />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="终止日期" required>
                          {getFieldDecorator('endDate', {
                            initialValue: moment(new Date()).add(1, 'years').add(-1, 'days'),
                            rules: [{ required: true, message: '请选择终止日期' }],
                          })(<DatePicker placeholder="请选择终止日期"
                            disabledDate={disabledEndDate}
                            style={{ width: '100%' }} />)}
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="经营主体" required>
                          {getFieldDecorator('businessEntity', {
                            rules: [{ required: true, message: '请输入经营主体' }],
                          })(<Input placeholder="请输入经营主体" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="付款方式">
                          {getFieldDecorator('payType', {
                            rules: [{ required: true, message: '请输入付款方式' }],
                          })(<Input placeholder="请输入付款方式" />)}
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="签订人">
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
                          {getFieldDecorator('signer', {
                          })(
                            <Select
                              showSearch
                              // onSearch={handleSearch}
                              // optionFilterProp="children"
                              placeholder="请选择签约人"
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
                      <Col lg={12}>
                        <Form.Item label="签约日期" required>
                          {getFieldDecorator('signingDate', {
                            initialValue: moment(new Date()),
                            rules: [{ required: true, message: '请选择签约日期' }],
                          })(<DatePicker placeholder="请选择签约日期" style={{ width: '100%' }} />)}
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="渠道" required>
                          {getFieldDecorator('channelType', {
                            rules: [{ required: true, message: '请选择渠道' }],
                          })(
                            <Select placeholder="请选择渠道"  >
                              {channel.map(item => (
                                <Option value={item.value} key={item.key}>
                                  {item.title}
                                </Option>
                              ))}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="招商人">
                          {getFieldDecorator('follower', {
                          })(
                            <Select
                              showSearch
                              placeholder="请选择招商人"
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
                      <Col span={24}>
                        <Form.Item label="备注">
                          {getFieldDecorator('memo', {
                          })(
                            <TextArea rows={3} placeholder="请输入备注" />
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
                        <Form.Item label={<div>房源选择(<a>多个房屋的时候，默认获取第一个房屋作为计费单元</a>)</div>} required>
                          {getFieldDecorator('room', {
                            rules: [{ required: true, message: '请选择房源' }],
                          })(
                            <TreeSelect
                              placeholder="请选择房源"
                              allowClear
                              dropdownStyle={{ maxHeight: 330 }}
                              treeData={treeData}
                              loadData={onLoadData}
                              treeDataSimpleMode={true}
                              onChange={onRoomChange}
                              multiple={true}>
                            </TreeSelect>
                          )}
                          {/* <span style={{ marginLeft: 8, color: "blue" }}>多个房屋的时候，默认获取第一个房屋作为计费单元</span> */}
                          {getFieldDecorator('billUnitId', {
                          })(
                            <input type='hidden' />
                          )}

                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={24}>

                        {/* <Form.Item label="承租方" required>
                          {getFieldDecorator('customer', {
                            rules: [{ required: true, message: '请填写姓名或公司' }],
                          })(<Input placeholder="请填写姓名或公司" />)}
                        </Form.Item> */}
                        <Form.Item label='承租方' required>
                          {getFieldDecorator('customer', {
                            rules: [{
                              required: true,
                              message: '请输入承租方'
                            },
                            { validator: checkExist }]
                          })(
                            <AutoComplete
                              dropdownClassName={styles.searchdropdown}
                              optionLabelProp="value"
                              dropdownMatchSelectWidth={false}
                              dataSource={userList}
                              onSearch={customerSearch}
                              placeholder="请输入承租方"
                              onSelect={onCustomerSelect}
                              disabled={organizeId == '' ? true : false}
                            />
                          )}
                          {getFieldDecorator('customerId', {
                            initialValue: ''
                          })(
                            <input type='hidden' />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="联系人" required>
                          {getFieldDecorator('linkMan', {
                            rules: [{ required: true, message: '请输入联系人' }],
                          })(<Input placeholder="请输入联系人"
                            disabled={form.getFieldValue('customerId') == '' ? true : false}
                          />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="类别" required>
                          {getFieldDecorator('customerType', {
                            rules: [{ required: true, message: '请选择类别' }],
                          })(
                            <Select disabled placeholder="自动带出">
                              <Option value="1" key="1">个人</Option>
                              <Option value="2" key="2">单位</Option>
                            </Select>,
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    {form.getFieldValue('type') === '2' ? (
                      <Row gutter={24}>
                        <Col lg={12}>
                          <Form.Item label="行业" required>
                            {getFieldDecorator('industry', {
                              rules: [{ required: true, message: '请选择行业' }],
                            })(
                              <Select placeholder="请选择行业"
                                disabled={form.getFieldValue('customerId') != '' ? false : true}
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
                        <Col lg={12}>
                          <Form.Item label="法人" required>
                            {getFieldDecorator('legalPerson', {
                              rules: [{ required: true, message: '请输入法人' }],
                            })(<Input placeholder="请输入法人" disabled={form.getFieldValue('customerId') != '' ? false : true} />)}
                          </Form.Item>
                        </Col>
                      </Row>) : null
                    }
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="联系电话" required>
                          {getFieldDecorator('linkPhone', {
                            rules: [{ required: true, message: '请输入联系电话' }],
                          })(<Input placeholder="请输入联系电话"
                            disabled={form.getFieldValue('customerId') != '' ? false : true} />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="联系地址" required>
                          {getFieldDecorator('address', {
                            rules: [{ required: true, message: '请输入联系地址' }],
                          })(<Input placeholder="请输入联系地址" disabled={form.getFieldValue('customerId') != '' ? false : true} />)}
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
                  <Col lg={5}>
                    <Form.Item label="合同面积(㎡)" required>
                      {getFieldDecorator('leaseArea', {
                        rules: [{ required: true, message: '请输入合同面积' }]
                      })(<Input readOnly placeholder='自动获取' />)}
                    </Form.Item>
                  </Col>
                  <Col lg={10}>
                    <Form.Item label="保证金费项" required>
                      {getFieldDecorator('depositFeeItemId', {
                        rules: [{ required: true, message: '请选择保证金费项' }]
                      })(
                        <Select placeholder="请选择保证金费项"
                          onChange={changeFeeItem}  >
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
                  <Col lg={6}>
                    <Form.Item label="保证金数量" required>
                      {getFieldDecorator('deposit', {
                        initialValue: 1,
                        rules: [{ required: true, message: '请输入保证金数量' }],
                      })(<InputNumber placeholder="请输入保证金数量" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                  <Col lg={3}>
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
                <Row gutter={24}>
                  <Col lg={5}>
                    <Form.Item label="小数位数">
                      {getFieldDecorator('calcPrecision', {
                        initialValue: 2,
                        rules: [{ required: true, message: '请选择小数位数' }],
                      })(<Select>
                        <Option value={0}>0</Option>
                        <Option value={1}>1</Option>
                        <Option value={2}>2</Option>
                      </Select>)}
                    </Form.Item>
                  </Col>
                  {/* <Col lg={5}>
                    <Form.Item label="计算精度">
                      {getFieldDecorator('calcPrecisionMode', {
                        initialValue: "最终计算结果保留2位"
                      })(<Select>
                        <Option value="最终计算结果保留2位" >最终计算结果保留2位</Option>
                        <Option value="每步计算结果保留2位" >每步计算结果保留2位</Option>
                      </Select>
                      )}
                    </Form.Item>
                  </Col> */}
                  <Col lg={4}>
                    <Form.Item label="滞纳金比例(‰)" >
                      {getFieldDecorator('lateFee', {
                        initialValue: 3
                      })(<InputNumber placeholder="请输入滞纳金比例" style={{ width: '120px' }} />)}
                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="滞纳金起算日期" >
                      {getFieldDecorator('lateDate', {
                        rules: [{ required: true, message: '请选择滞纳金起算日期' }],
                      })(<DatePicker placeholder="请选择滞纳金起算日期" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>

                  <Col lg={6}>
                    <Form.Item label="滞纳金算法" >
                      {getFieldDecorator('lateMethod', {
                        initialValue: "固定滞纳金率按天计算"
                      })(<Select>
                        <Option value="固定滞纳金率按天计算" >固定滞纳金率按天计算</Option>
                      </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={3}>
                    <Form.Item label="物业费单价" >
                      {getFieldDecorator('PropertyFee', {
                      })(<InputNumber placeholder="请输入" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>

                  {/* <Col lg={4}>
                    <Form.Item label="&nbsp;" >
                      {getFieldDecorator('lateFeeUnit', {
                        initialValue: "%/天"
                      })(
                        <Select>
                          <Option value="%/天">%/天</Option>
                        </Select>)}
                    </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label="滞纳金上限" >
                      {getFieldDecorator('maxLateFee', {
                      })(<InputNumber placeholder="请输入滞纳金上限" style={{ width: '120px' }} />)}
                    </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label="&nbsp;" >
                      {getFieldDecorator('maxLateFeeUnit', {
                        initialValue: "%"
                      })(<Select>
                        <Option value="%">%</Option>
                      </Select>)}
                    </Form.Item>
                  </Col> */}
                </Row>
              </Card>

              {/* <LeaseTerm form={form} feeItems={feeItems}></LeaseTerm>
              <IncreasingRate form={form}></IncreasingRate>
              <Rebate form={form}></Rebate> */}

              {/* 修改为单个租期条款 */}

              <Card title="租期条款" className={styles.card}  >
                <Row gutter={24}>
                  <Col lg={4}>
                    <Form.Item label="开始时间" required >
                      {getFieldDecorator('startDate', {
                        initialValue: moment(new Date()),
                        rules: [{ required: true, message: '请选择开始时间' }],
                      })(<DatePicker disabled placeholder='请选择开始时间' />)}
                    </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label="结束时间" required>
                      {getFieldDecorator('endDate', {
                        initialValue: moment(new Date()).add(1, 'years').add(-1, 'days'),
                        rules: [{ required: true, message: '请选择结束时间' }],
                      })(<DatePicker disabled placeholder='请选择结束时间' />)}
                    </Form.Item>
                  </Col>
                  <Col lg={8}>
                    <Form.Item label="费项" required>
                      {getFieldDecorator('feeItemId', {
                        rules: [{ required: true, message: '请选择费项' }]
                      })(
                        <Select placeholder="请选择费项"
                          onChange={(value, option) => changeFee(value, option)} >
                          {feeItems.map(item => (
                            <Option value={item.value} key={item.key}>
                              {item.title}
                            </Option>
                          ))}
                        </Select>
                      )}
                      {getFieldDecorator('feeItemName', {
                      })(
                        <input type='hidden' />
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label='合同单价' required>
                      {getFieldDecorator('price', {
                        rules: [{ required: true, message: '请输入合同单价' }],
                      })(<InputNumber placeholder="请输入合同单价" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label="&nbsp;">
                      {getFieldDecorator('priceUnit', {
                        initialValue: '元/m²·天'
                      })(
                        <Select onChange={changeUnit}>
                          <Option value="元/m²·月">元/m²·月</Option>
                          <Option value="元/m²·天">元/m²·天</Option>
                          <Option value="元/月">元/月</Option>
                          <Option value="元/天">元/天</Option>
                        </Select>)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={4}>
                    <Form.Item label="提前付款时间" required>
                      {getFieldDecorator('advancePayTime', {
                        initialValue: 1,
                        rules: [{ required: true, message: '请输入提前付款时间' }],
                      })(<InputNumber placeholder="请输入" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label="&nbsp;">
                      {getFieldDecorator('advancePayTimeUnit', {
                        initialValue: '工作日'
                      })(
                        <Select>
                          <Option value="工作日">工作日</Option>
                          <Option value="自然日">自然日</Option>
                          <Option value="指定日期">指定日期</Option>
                        </Select>)}
                    </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label="计费类型">
                      {getFieldDecorator('billType', {
                        initialValue: '按月计费'
                      })(
                        <Select>
                          <Option value="按实际天数计费">按实际天数计费</Option>
                          <Option value="按月计费">按月计费</Option>
                        </Select>)}
                    </Form.Item>
                  </Col>
                  {
                    (priceUnit == "元/m²·天" || priceUnit == "元/天") ?
                      <Col lg={4}>
                        <Form.Item label="天单价换算规则">
                          {getFieldDecorator('dayPriceConvertRule', {
                            initialValue: '按年换算',
                          })(
                            <Select>
                              <Option value="按自然月换算">按自然月换算</Option>
                              <Option value="按年换算" >按年换算</Option>
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      : null}

                  <Col lg={4}>
                    <Form.Item label="年天数" required>
                      {getFieldDecorator('yearDays', {
                        initialValue: 365,
                        rules: [{ required: true, message: '请输入年天数' }],
                      })(<InputNumber placeholder="请输入年天数" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label="付款周期（月）" required>
                      {getFieldDecorator('payCycle', {
                        initialValue: 1,
                        rules: [{ required: true, message: '请输入付款周期' }]
                      })(
                        <InputNumber placeholder="请输入付款周期" style={{ width: '100%' }} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={8}>
                    <Form.Item label="租期划分方式">
                      {getFieldDecorator('rentalPeriodDivided', {
                        initialValue: '按起始日划分'
                      })(
                        <Select  >
                          <Option value="按起始日划分">按起始日划分</Option>
                          <Option value="次月按自然月划分(仅一月一付有效)">次月按自然月划分(仅一月一付有效)</Option>
                          <Option value="按自然月划分(首月非整自然月划入第一期)">按自然月划分(首月非整自然月划入第一期)</Option>
                          <Option value="按自然月划分(首月非整自然月算一个月)">按自然月划分(首月非整自然月算一个月)</Option>
                        </Select>)}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              <Card title="递增率" className={styles.card} >
                <Row gutter={24}>
                  <Col lg={6}>
                    <Form.Item label="递增类型">
                      {getFieldDecorator('increType', {
                      })(
                        <Select placeholder="请选择递增类型" allowClear>
                          <Option value="三个月后递增">三个月后开始递增</Option>
                          <Option value="半年后递增">半年后递增</Option>
                          <Option value="一年后递增">一年后递增</Option>
                          <Option value="两年后递增">两年后递增</Option>
                          <Option value="三年后递增">三年后递增</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="单价递增" required>
                      {getFieldDecorator('increPrice', {
                        rules: [{ required: form.getFieldValue('increType'), message: '请输入递增率' }],
                      })(
                        <InputNumber placeholder="请输入递增率" style={{ width: '100%' }}
                          disabled={!form.getFieldValue('increType')}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={3}>
                    <Form.Item label="&nbsp;">
                      {getFieldDecorator('increPriceUnit', {
                        rules: [{ required: form.getFieldValue('increType'), message: '请选择单位' }],
                      })(
                        <Select placeholder="请选择" allowClear
                          disabled={!form.getFieldValue('increType')}
                        >
                          <Option value="%">%</Option>
                          <Option value="元" >元</Option>
                        </Select>)}
                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="保证金递增" required>
                      {getFieldDecorator('increDeposit', {
                        rules: [{ required: form.getFieldValue('increType'), message: '请输入递增率' }],
                      })(<InputNumber placeholder="请输入递增率" style={{ width: '100%' }}
                        disabled={!form.getFieldValue('increType')}
                      />)}
                    </Form.Item>
                  </Col>
                  <Col lg={3}>
                    <Form.Item label="&nbsp;">
                      {getFieldDecorator('increDepositUnit', {
                        rules: [{ required: form.getFieldValue('increType'), message: '请选择单位' }],
                      })(
                        <Select
                          placeholder="请选择" allowClear
                          disabled={!form.getFieldValue('increType')}>
                          <Option value="%">%</Option>
                          <Option value="元" >元</Option>
                        </Select>)}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              <Card title="免租期" className={styles.card} >
                <Row gutter={24}>
                  {/* <Col lg={5}>
                    <Form.Item label="优惠类型" required>
                      {getFieldDecorator('rebateType', {
                      })(<Select placeholder="请选择优惠类型"
                        allowClear
                      >
                        <Option value="免租期">免租期</Option>
                        <Option value="装修期">装修期</Option>
                        <Option value="单价折扣">单价折扣</Option>
                        <Option value="减免金额">减免金额</Option>
                        <Option value="单价减免">单价减免</Option>
                      </Select>)}
                    </Form.Item>
                  </Col> */}
                  <Col lg={5}>
                    <Form.Item label="开始时间" >
                      {getFieldDecorator('rebateStartDate', {
                        rules: [{ required: form.getFieldValue('rebateType'), message: '请选择开始时间' }],
                      })(<DatePicker placeholder="请选择开始时间"
                        disabled={!form.getFieldValue('rebateType')}
                      />)}
                    </Form.Item>
                  </Col>
                  <Col lg={5}>
                    <Form.Item label="结束时间" >
                      {getFieldDecorator('rebateEndDate', {
                        rules: [{ required: form.getFieldValue('rebateType'), message: '请选择结束时间' }],
                      })(<DatePicker placeholder="请选择结束时间" disabled={!form.getFieldValue('rebateType')} />)}
                    </Form.Item>
                  </Col>
                  {/* <Col lg={3}>
                    <Form.Item label="开始期数" >
                      {getFieldDecorator('startPeriod', {
                        rules: [{ required: form.getFieldValue('rebateType'), message: '请输入' }],
                      })(<InputNumber placeholder="请输入" style={{ width: '100%' }} disabled={!form.getFieldValue('rebateType')} />)}
                    </Form.Item>
                  </Col>
                  <Col lg={3}>
                    <Form.Item label="期长" >
                      {getFieldDecorator('periodLength', {
                        rules: [{ required: form.getFieldValue('rebateType'), message: '请输入期长' }],
                      })(<InputNumber placeholder="请输入期长" style={{ width: '100%' }} disabled={!form.getFieldValue('rebateType')} />)}
                    </Form.Item>
                  </Col>
                  <Col lg={3}>
                    <Form.Item label="折扣" >
                      {getFieldDecorator('discount', {
                        rules: [{ required: form.getFieldValue('rebateType'), message: '请输入折扣' }],
                      })(<InputNumber placeholder="请输入折扣" style={{ width: '100%' }} disabled={!form.getFieldValue('rebateType')} />)}
                    </Form.Item>
                  </Col> */}
                </Row>

                <Row gutter={24}>
                  <Col lg={24}>
                    <Form.Item label="备注" >
                      {getFieldDecorator('remark', {
                        //rules: [{ required: true, message: '请输入备注' }],
                      })(<TextArea placeholder="请输入备注" rows={3} />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Button style={{ width: '100%', marginBottom: '10px' }} onClick={calculation}>点击生成租金明细</Button>
              <ResultList
                depositData={depositData}
                chargeData={chargeData}
                className={styles.addcard}
              ></ResultList>
            </TabPane>

            <TabPane tab="其他条款" key="3">
              <Row gutter={24}>
                <Col lg={24}>
                  <Form.Item label="&nbsp;">
                    {getFieldDecorator('memo', {
                    })(
                      <TextArea rows={10} placeholder="请输入" />
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col lg={24}>
                  <div className="clearfix">
                    <Upload
                      // accept='.doc,.docx,.pdf,image/*'
                      action={process.env.basePath + '/Contract/Upload'}
                      fileList={fileList}
                      listType='picture'
                      onChange={handleChange}
                      onRemove={handleRemove}>
                      {/* {uploadButton} */}

                      <Button>
                        <Icon type="upload" />上传附件
                      </Button>

                    </Upload>
                  </div>
                </Col>
              </Row>
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

      <QuickModify
        modifyVisible={customerVisible}
        closeDrawer={closeCustomerDrawer}
        data={customer}
        organizeId={organizeId}
        // type={type}
        reload={(customerId) => {
          GetCustomerInfo(customerId).then(res => {
            //防止旧数据缓存，清空下拉
            setUserList([]);
            form.setFieldsValue({ ownerName: res.name });
            form.setFieldsValue({ ownerId: customerId });
            form.setFieldsValue({ ownerPhone: res.phoneNum });
          });
        }
        }
      />

    </Drawer>
  );
};

export default Form.create<AddProps>()(Add);

