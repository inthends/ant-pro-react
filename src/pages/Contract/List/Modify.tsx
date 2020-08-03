//修改合同
import { Tooltip, Upload, Icon, Tag, Spin, Divider, PageHeader, AutoComplete, InputNumber, message, Tabs, Select, Button, Card, Col, DatePicker, Drawer, Form, Input, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { HtLeasecontractchargefee, ChargeFeeDetailDTO, HtLeasecontractcharge, htLeasecontract, ChargeDetailDTO } from '@/model/models';
import React, { useEffect, useState } from 'react';
import ResultList from './ResultList';
import {
  RemoveFile, GetFilesData, SubmitForm, SaveForm,
  GetChargeByChargeId, GetContractInfo, GetModifyChargeDetail, GetFollowCount, ReSubmitForm
} from './Main.service';
import { GetCommonItems, GetUserList } from '@/services/commonItem';
import { GetCustomerInfo, CheckContractCustomer, GetContractCustomerList } from '../../Resource/PStructUser/PStructUser.service';
import moment from 'moment';
import styles from './style.less';
import LeaseTermModify from './LeaseTermModify';
// import IncreasingRateModify from './IncreasingRateModify';
// import RebateModify from './RebateModify';
import QuickModify from '../../Resource/PStructUser/QuickModify';
import Follow from './Follow';
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface ModifyProps {

  isReSubmit: boolean;
  instanceId?: string;//实例id
  taskId?: string;//任务id

  visible: boolean;
  // id?: string;//合同id
  // chargeId?: string;//合同条款id

  closeDrawer(): void;
  form: WrappedFormUtils;
  reload(): void;
  // treeData: any[];
  // choose(): void;
};

const Modify = (props: ModifyProps) => {
  const title = '合同详情';
  const { taskId, instanceId, isReSubmit, visible, form, closeDrawer, reload } = props;
  const { getFieldDecorator } = form;
  //const [industryType, setIndustryType] = useState<any[]>([]); //行业  
  //const [feeitems, setFeeitems] = useState<TreeEntity[]>([]);
  const [infoDetail, setInfoDetail] = useState<htLeasecontract>({});
  const [contractCharge, setContractCharge] = useState<HtLeasecontractcharge>({});
  const [chargeFeeList, setChargeFeeList] = useState<ChargeFeeDetailDTO[]>([]);


  // const [chargefee, setChargefee] = useState<HtLeasecontractchargefee>({});
  // const [chargeincre, setChargeincre] = useState<HtLeasecontractchargeincre>({});
  // const [chargefeeoffer, setChargefeeoffer] = useState<HtLeasecontractchargefeeoffer>({}); 
  // const [chargeFeeList, setChargeFeeList] = useState<HtLeasecontractchargefee[]>([]);
  // const [depositData, setDepositData] = useState<any[]>([]);//保证金
  const [chargeData, setChargeData] = useState<any[]>([]);//租金 
  // const [propertyData, setPropertyData] = useState<any[]>([]);//物业费
  const [chargeId, setChargeId] = useState<any>();

  const [industryType, setIndustryType] = useState<any[]>([]); //行业 
  // const [feeItems, setFeeItems] = useState<TreeEntity[]>([]);
  const [isCal, setIsCal] = useState<boolean>(false);
  const [TermJson, setTermJson] = useState<string>();
  // const [RateJson, setRateJson] = useState<string>();
  // const [RebateJson, setRebateJson] = useState<string>();
  const [userSource, setUserSource] = useState<any[]>([]);
  // const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // const [treeData, setTreeData] = useState<any[]>([]);
  const [channel, setChannel] = useState<any[]>([]);//渠道
  // const [houseList, setHouseList] = useState<any[]>([]);//房屋列表

  // const close = () => {
  //   closeDrawer();
  // };

  //打开抽屉时初始化
  useEffect(() => {
    GetCommonItems('IndustryType').then(res => {
      setIndustryType(res || []);
    });

    //加载关联收费项目
    // GetAllFeeItems().then(res => {
    //   setFeeitems(res || []);
    // });

    //获取房产树
    // GetOrgTreeSimple().then((res: any[]) => {
    //   setTreeData(res || []);
    // });

    GetUserList('', '员工').then(res => {
      setUserSource(res || []);
    });

    //渠道
    GetCommonItems('VisitChannel').then(res => {
      setChannel(res || []);
    });

  }, []);

  // 打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      if (instanceId) {
        setLoading(true);
        GetContractInfo(instanceId).then((tempInfo) => {
          //处理一下房间
          // let rooms: any[] = [];
          // if (tempInfo != null && tempInfo.houseList != null) {
          //   tempInfo.houseList.forEach(item => {
          //     rooms.push(item.roomId);
          //   });
          //   setRooms(rooms);
          // }

          //加载费项
          // GetFeeItemsByUnitId(tempInfo.contract.billUnitId).then(res => {
          //   setFeeItems(res || []);
          // });

          setInfoDetail(tempInfo.contract);
          // setHouseList(tempInfo.houseList);
          setCount(tempInfo.followCount);
          setChargeId(tempInfo.chargeId);//条款Id

          //获取条款
          GetChargeByChargeId(tempInfo.chargeId).then((charge: ChargeDetailDTO) => {
            setContractCharge(charge.contractCharge || {});
            setChargeFeeList(charge.chargeFeeList || []); 
            setChargeData(charge.chargeFeeResultList || []);//租金明细  
          });

          //附件
          GetFilesData(instanceId).then(res => {
            setFileList(res || []);
          });

          //合计信息
          setTotalInfo({
            // leasePrice: tempInfo.leasePrice,
            // totalDeposit: tempInfo.totalDeposit,
            totalArea: tempInfo.totalArea,
            totalAmount: tempInfo.totalAmount,
            // totalPropertyAmount: tempInfo.totalPropertyAmount
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

  // const handleSearch = value => {
  //   if (value == '')
  //     return;
  //   GetUserList(value, '员工').then(res => {
  //     setUserSource(res || []);
  //   })
  // };

  // const userList = userSource.map(item => <Option key={item.id} value={item.name}>{item.name}</Option>);

  const onFollowerSelect = (value, option) => {
    form.setFieldsValue({ followerId: option.key });
  };

  const onSignerSelect = (value, option) => {
    form.setFieldsValue({ signerId: option.key });
    //设置管理机构
    form.setFieldsValue({ organizeId: option.props.organizeId });
  };

  // const onRoomChange = (value, label, extra) => {
  //   //多个房屋的时候，默认获取第一个房屋作为计费单元
  //   if (value.length == 0) {
  //     form.setFieldsValue({ billUnitId: '' });
  //     // setOrganizeId(''); 
  //     form.setFieldsValue({ organizeId: '' });
  //     setFeeItems([]);
  //   } else {
  //     form.setFieldsValue({ billUnitId: value[0] });
  //     //机构Id
  //     // setOrganizeId(extra.triggerNode.props.organizeId); 
  //     form.setFieldsValue({ organizeId: extra.triggerNode.props.organizeId });
  //     //加载房屋费项
  //     //加载关联收费项目
  //     GetFeeItemsByUnitId(value[0]).then(res => {
  //       setFeeItems(res || []);
  //     });
  //   }

  //   //选择房源,计算面积
  //   //["101 158.67㎡", "102 156.21㎡"]
  //   let area = 0;
  //   label.forEach((val, idx, arr) => {
  //     area += parseFloat(val.split(' ')[1].replace('㎡', ''));
  //   });
  //   form.setFieldsValue({ leaseSize: area.toFixed(2) });
  //   form.setFieldsValue({ leaseArea: area.toFixed(2) });
  //   setIsCal(false);
  // };

  // const onIndustrySelect = (value, option) => {
  //   //设置行业名称
  //   form.setFieldsValue({ industry: option.props.children });
  // };

  //计算租金明细
  const calculation = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        setLoading(true);
        //租赁条款     
        // let TermJson: HtLeasecontractchargefee[] = [];
        let TermJson: ChargeFeeDetailDTO[] = [];
        //动态添加的租期
        values.LeaseTerms.map(function (k, index, arr) {
          let charge: ChargeFeeDetailDTO = {
            rooms: [],
            feeItems: [],
            chargeFee: {}
          };

          let mychargefee: HtLeasecontractchargefee = {};

          // data.feeItemId = k.feeItemId;
          // data.feeItemName = k.feeItemName;
          // data.startDate = k.startDate;
          // data.endDate = k.endDate;
          // data.price = k.price;  
          // data.priceUnit = k.priceUnit;
          // data.advancePayTime = k.advancePayTime;
          // data.advancePayTimeUnit = k.advancePayTimeUnit;
          // data.billType = k.billType;
          // if (data.priceUnit == "元/m²·天" || data.priceUnit == "元/天") {
          //   data.dayPriceConvertRule = k.dayPriceConvertRule;
          // }
          // data.yearDays = k.yearDays;
          // data.payCycle = k.payCycle;
          // data.rentalPeriodDivided = k.rentalPeriodDivided;
          mychargefee.feeItemId = values.feeItemId[index];
          mychargefee.feeItemName = values.feeItemName[index];
          mychargefee.chargeStartDate = values.chargeStartDate[index].format('YYYY-MM-DD');
          mychargefee.chargeEndDate = values.chargeEndDate[index].format('YYYY-MM-DD');
          mychargefee.price = values.price[index];
          mychargefee.priceUnit = values.priceUnit[index];
          mychargefee.advancePayTime = values.advancePayTime[index];
          mychargefee.advancePayTimeUnit = values.advancePayTimeUnit[index];
          mychargefee.billType = values.billType[index];
          if (mychargefee.priceUnit == "元/m²·天" || mychargefee.priceUnit == "元/天") {
            mychargefee.dayPriceConvertRule = values.dayPriceConvertRule[index];
          }
          mychargefee.yearDays = values.yearDays[index];
          mychargefee.payCycle = values.payCycle[index];
          mychargefee.rentalPeriodDivided = values.rentalPeriodDivided[index];
          //递增率 
          mychargefee.increStartDate = values.increStartDate[index] ? values.increStartDate[index].format('YYYY-MM-DD') : null;
          mychargefee.increGap = values.increGap[index];//? values.increEndDate[index].format('YYYY-MM-DD') : null;
          mychargefee.increPrice = values.increPrice[index];
          mychargefee.increPriceUnit = values.increPriceUnit[index];
          //优惠
          // mychargefee.rebateType = values.rebateType[index];
          mychargefee.rebateStartDate = values.rebateStartDate[index] ? values.rebateStartDate[index].format('YYYY-MM-DD') : null;
          mychargefee.rebateEndDate = values.rebateEndDate[index] ? values.rebateEndDate[index].format('YYYY-MM-DD') : null;
          // mychargefee.startPeriod = values.startPeriod[index];
          // mychargefee.periodLength = values.periodLength[index];
          // mychargefee.discount = values.discount[index];
          mychargefee.rebateRemark = values.rebateRemark[index];
          charge.chargeFee = mychargefee;
          //添加房屋  
          charge.rooms = values.rooms[index];
          TermJson.push(charge);
        });

        //递增率
        // let RateJson: HtLeasecontractchargeincre[] = [];
        // values.IncreasingRates.map(function (k, index, arr) {
        // let mychargeincre: HtLeasecontractchargeincre = {};
        // mychargeincre.increType = values.increType;
        // mychargeincre.increPrice = values.increPrice;
        // mychargeincre.increPriceUnit = values.increPriceUnit;
        // mychargeincre.increDeposit = values.increDeposit;
        // mychargeincre.increDepositUnit = values.increDepositUnit;
        //   RateJson.push(rate);
        // });

        //优惠
        // let RebateJson: HtLeasecontractchargefeeoffer[] = [];
        // values.Rebates.map(function (k, index, arr) {
        // let mychargefeeoffer: HtLeasecontractchargefeeoffer = {};
        // mychargefeeoffer.rebateType = values.rebateType;
        // if (values.rebateStartDate != '')
        //   mychargefeeoffer.rebateStartDate = values.rebateStartDate.format('YYYY-MM-DD');
        // if (values.rebateEndDate != '')
        //   mychargefeeoffer.rebateEndDate = values.rebateEndDate.format('YYYY-MM-DD');
        // mychargefeeoffer.startPeriod = values.startPeriod;
        // mychargefeeoffer.periodLength = values.periodLength;
        // mychargefeeoffer.discount = values.discount;
        // mychargefeeoffer.remark = values.remark;
        //   RebateJson.push(rebate);
        // });

        //let entity = values; 
        let entity: HtLeasecontractcharge = {};
        //费用条款-基本条款 
        // entity.depositFeeItemId = values.depositFeeItemId;
        // entity.depositFeeItemName = values.depositFeeItemName;
        // entity.leaseArea = values.leaseArea;
        // entity.deposit = values.deposit;
        // entity.depositUnit = values.depositUnit;
        // entity.startDate = values.billingDate.format('YYYY-MM-DD');
        // entity.endDate = values.contractEndDate.format('YYYY-MM-DD');
        // entity.payDate = values.contractStartDate.format('YYYY-MM-DD');

        //精度处理
        entity.midResultScale = values.midResultScale;
        entity.midScaleDispose = values.midScaleDispose;
        entity.lastResultScale = values.lastResultScale;
        entity.lastScaleDispose = values.lastScaleDispose;

        entity.lateStartDateNum = values.lateStartDateNum;
        entity.lateStartDateBase = values.lateStartDateBase;
        entity.lateStartDateFixed = values.lateStartDateFixed;
        entity.lateStartDateUnit = values.lateStartDateUnit;
        entity.lateFee = values.lateFee;
        entity.lateMethod = values.lateMethod;
        // if (values.lateDate != null)
        //   entity.lateDate = values.lateDate.format('YYYY-MM-DD');
        // entity.propertyFeeId = values.propertyFeeId;
        // entity.propertyFeeName = values.propertyFeeName;

        let strTermJson = JSON.stringify(TermJson);
        setTermJson(strTermJson);
        // setChargefee(mychargefee);
        // let strRateJson = JSON.stringify(RateJson);
        //setChargeincre(mychargeincre);
        // let strRebateJson = JSON.stringify(RebateJson);
        // setChargefeeoffer(mychargefeeoffer);

        GetModifyChargeDetail({
          ...entity,
          // ...mychargefee,
          //...mychargeincre,
          // ...mychargefeeoffer,
          // leaseContractId: '',
          // billUnitId: values.billUnitId,//计费单元id
          termJson: strTermJson
          // LeaseContractId: '',
          // CalcPrecision: values.calcPrecision,
          // CalcPrecisionMode: values.calcPrecisionMode
          // startDate: values.startDate.format('YYYY-MM-DD'),
          // endDate: values.endDate.format('YYYY-MM-DD')
        }).then(tempInfo => {
          setIsCal(true);//计算了租金
          // setDepositData(tempInfo.dataInfo.depositFeeResultList);//保证金明细
          setChargeData(tempInfo.dataInfo.chargeFeeResultList);//租金明细  
          // setPropertyData(tempInfo.dataInfo.propertyFeeResultList);//物业费   
          // setDepositResult(res.depositFeeResultList);
          // setChargeFeeResult(res.chargeFeeResultList);  
          //合计信息
          setTotalInfo({
            // leasePrice: tempInfo.leasePrice,
            // totalDeposit: tempInfo.totalDeposit,
            totalArea: tempInfo.totalArea,
            totalAmount: tempInfo.totalAmount,
            // totalPropertyAmount: tempInfo.totalPropertyAmount
          });
          setLoading(false);
        });
      }
    });
  };


  //提交审核
  const submit = () => {
    //弹出选人
    //choose();
    //save(); 
    //发起审批
    form.validateFields((errors, values) => {
      if (!errors) {
        //是否生成租金明细
        if (!isCal) {
          // Modal.warning({
          //   title: '提示',
          //   content: '请生成租金明细！',
          // });
          message.warning('请生成租金明细');
          return;
        }

        setLoading(true);

        //保存合同数据
        let ContractCharge: HtLeasecontractcharge = {};
        //费用条款-基本条款 
        // ContractCharge.depositFeeItemId = values.depositFeeItemId;
        // ContractCharge.depositFeeItemName = values.depositFeeItemName;
        // ContractCharge.leaseArea = values.leaseArea;
        // ContractCharge.deposit = values.deposit;
        // ContractCharge.depositUnit = values.depositUnit;
        // ContractCharge.startDate = values.billingDate.format('YYYY-MM-DD');
        // ContractCharge.endDate = values.contractEndDate.format('YYYY-MM-DD');
        // ContractCharge.payDate = values.contractStartDate.format('YYYY-MM-DD');

        // ContractCharge.calcPrecision = values.calcPrecision;
        ContractCharge.lateStartDateNum = values.lateStartDateNum;
        ContractCharge.lateStartDateBase = values.lateStartDateBase;
        ContractCharge.lateStartDateFixed = values.lateStartDateFixed;
        ContractCharge.lateStartDateUnit = values.lateStartDateUnit;
        ContractCharge.lateFee = values.lateFee;
        ContractCharge.lateMethod = values.lateMethod;
        // if (values.lateDate != null)
        //   ContractCharge.lateDate = values.lateDate.format('YYYY-MM-DD');
        // ContractCharge.propertyFeeId = values.propertyFeeId;
        // ContractCharge.propertyFeeName = values.propertyFeeName;

        //合同信息
        let Contract: htLeasecontract = {};
        Contract.id = instanceId;
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
        // Contract.billUnitId = values.billUnitId;
        Contract.organizeId = values.organizeId;
        Contract.memo = values.memo;
        SubmitForm({
          ...Contract,
          ...ContractCharge,
          // ...chargefee,
          // ...chargeincre,
          // ...chargefeeoffer,
          keyvalue: instanceId,
          chargeId: chargeId,
          // room: values.room,
          termJson: TermJson,
          // RateJson: RateJson,
          // RebateJson: RebateJson,
          // DepositResult: JSON.stringify(depositData),
          ChargeFeeResult: JSON.stringify(chargeData),
          // PropertyFeeResult: JSON.stringify(propertyData)
        }).then(res => {
          if (res.flag) {
            setLoading(false);
            message.success('提交成功');
            closeDrawer();
            // reload(); 
            //刷新页面
            location.reload();
          } else {
            message.warning(res.message);
            setLoading(false);
          }
        });
      }
    });
  };

  //重新提交
  const resubmit = () => {
    //弹出选人
    //choose();
    //save(); 
    //发起审批
    form.validateFields((errors, values) => {
      if (!errors) {
        //是否生成租金明细
        if (!isCal) {
          // Modal.warning({
          //   title: '提示',
          //   content: '请生成租金明细！',
          // });
          message.warning('请生成租金明细');
          return;
        }

        setLoading(true);

        //保存合同数据
        let ContractCharge: HtLeasecontractcharge = {};
        //费用条款-基本条款 
        // ContractCharge.depositFeeItemId = values.depositFeeItemId;
        // ContractCharge.depositFeeItemName = values.depositFeeItemName;
        // ContractCharge.leaseArea = values.leaseArea;
        // ContractCharge.deposit = values.deposit;
        // ContractCharge.depositUnit = values.depositUnit;
        // ContractCharge.startDate = values.billingDate.format('YYYY-MM-DD');
        // ContractCharge.endDate = values.contractEndDate.format('YYYY-MM-DD');
        // ContractCharge.payDate = values.contractStartDate.format('YYYY-MM-DD'); 
        // ContractCharge.calcPrecision = values.calcPrecision;
        ContractCharge.lateStartDateNum = values.lateStartDateNum;
        ContractCharge.lateStartDateBase = values.lateStartDateBase;
        ContractCharge.lateStartDateFixed = values.lateStartDateFixed;
        ContractCharge.lateStartDateUnit = values.lateStartDateUnit;
        ContractCharge.lateFee = values.lateFee;
        ContractCharge.lateMethod = values.lateMethod;
        // if (values.lateDate != null)
        //   ContractCharge.lateDate = values.lateDate.format('YYYY-MM-DD');
        // ContractCharge.propertyFeeId = values.propertyFeeId;
        // ContractCharge.propertyFeeName = values.propertyFeeName;

        //合同信息
        let Contract: htLeasecontract = {};
        Contract.id = instanceId;
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
        // Contract.billUnitId = values.billUnitId;
        Contract.organizeId = values.organizeId;
        Contract.memo = values.memo;
        ReSubmitForm({
          ...Contract,
          ...ContractCharge,
          // ...chargefee,
          // ...chargeincre,
          // ...chargefeeoffer,
          keyvalue: instanceId,
          chargeId: chargeId,
          // room: values.room,
          termJson: TermJson,
          // RateJson: RateJson,
          // RebateJson: RebateJson,
          // DepositResult: JSON.stringify(depositData),
          ChargeFeeResult: JSON.stringify(chargeData),
          taskId: taskId
          // PropertyFeeResult: JSON.stringify(propertyData)
        }).then(res => {
          if (res.flag) {
            setLoading(false);
            message.success('提交成功');
            closeDrawer();
            // reload();
            //刷新页面
            location.reload();
          } else {
            message.warning(res.message);
            setLoading(false);
          }
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
          // });
          message.warning('请生成租金明细');
          return;
        }
        setLoading(true);
        //保存合同数据 
        //合同信息
        let Contract: htLeasecontract = {};
        Contract.id = instanceId;
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
        // Contract.billUnitId = values.billUnitId;
        Contract.organizeId = values.organizeId;
        Contract.memo = values.memo;
        let ContractCharge: HtLeasecontractcharge = {};
        //费用条款-基本条款 
        // ContractCharge.depositFeeItemId = values.depositFeeItemId;
        // ContractCharge.depositFeeItemName = values.depositFeeItemName;
        ContractCharge.leaseArea = values.leaseArea;
        // ContractCharge.deposit = values.deposit;
        // ContractCharge.depositUnit = values.depositUnit;
        // ContractCharge.startDate = values.billingDate.format('YYYY-MM-DD');
        // ContractCharge.endDate = values.contractEndDate.format('YYYY-MM-DD');
        // ContractCharge.payDate = values.contractStartDate.format('YYYY-MM-DD'); 
        // ContractCharge.calcPrecision = values.calcPrecision;
        ContractCharge.lateStartDateNum = values.lateStartDateNum;
        ContractCharge.lateStartDateBase = values.lateStartDateBase;
        ContractCharge.lateStartDateFixed = values.lateStartDateFixed;
        ContractCharge.lateStartDateUnit = values.lateStartDateUnit;
        ContractCharge.lateFee = values.lateFee;
        ContractCharge.lateMethod = values.lateMethod;
        // if (values.lateDate != null)
        //   ContractCharge.lateDate = values.lateDate.format('YYYY-MM-DD');
        // ContractCharge.propertyFeeId = values.propertyFeeId;
        // ContractCharge.propertyFeeName = values.propertyFeeName;
        SaveForm({
          ...Contract,
          ...ContractCharge,
          // ...chargefee,
          // ...chargeincre,
          // ...chargefeeoffer,
          keyvalue: instanceId,
          chargeId: chargeId,
          room: values.room,
          termJson: TermJson,
          // RateJson: RateJson,
          // RebateJson: RebateJson,
          // DepositResult: JSON.stringify(depositData),
          ChargeFeeResult: JSON.stringify(chargeData),
          // PropertyFeeResult: JSON.stringify(propertyData)
        }).then(res => {
          message.success('保存成功');
          closeDrawer();
          reload();
          setLoading(false);
        });
      }
    });
  };

  //异步加载房间，提高速度
  // const onLoadData = treeNode =>
  //   new Promise<any>(resolve => {
  //     if (treeNode.props.children && treeNode.props.children.length > 0 && treeNode.props.type != 'D') {
  //       resolve();
  //       return;
  //     }
  //     setTimeout(() => {
  //       GetAsynChildBuildingsSimple(treeNode.props.eventKey, treeNode.props.type).then((res: any[]) => {
  //         // treeNode.props.children = res || [];
  //         let newtree = treeData.concat(res);
  //         // setTreeData([...treeData]);
  //         setTreeData(newtree);
  //       });
  //       resolve();
  //     }, 50);
  //   });


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

  //保证金单位切换
  // const changeFeeItem = (value, option) => {
  //   form.setFieldsValue({ depositFeeItemName: option.props.children });
  // };

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

  // const [organizeId, setOrganizeId] = useState<string>('');//所属机构id
  const [userList, setUserList] = useState<any[]>([]);
  const [customerVisible, setCustomerVisible] = useState<boolean>(false);
  const [customer, setCustomer] = useState<any>();

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


  //跟进 
  const [totalInfo, setTotalInfo] = useState<any>({});//合计信息
  const [followVisible, setFollowVisible] = useState<boolean>(false);
  const [count, setCount] = useState<string>('0');
  const showFollowDrawer = () => {
    setFollowVisible(true);
  };
  const closeFollowDrawer = () => {
    setFollowVisible(false);
  };

  //结束日期控制
  const disabledEndDate = (current) => {
    return current && current.isBefore(moment(form.getFieldValue('startDate')), 'day');
  };

  //起始日期控制
  // const disabledStartDate = (current) => {
  //   return current && current.isAfter(moment(form.getFieldValue('endDate')), 'day');
  // };

  const [lateFixedDisabled, setLateFixedDisabled] = useState<boolean>(true);

  return (
    <Drawer
      title={title}
      placement="right"
      width={1050}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <PageHeader
        ghost={false}
        title={null}
        subTitle={
          <div>
            <label style={{ color: '#4494f0', fontSize: '24px' }}>{infoDetail.no}</label>
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
      合同摘要【合同期间
      {form.getFieldValue('startDate') ? moment(form.getFieldValue('startDate')).format('YYYY-MM-DD') : ''}
      到{form.getFieldValue('endDate') ? moment(form.getFieldValue('endDate')).format('YYYY-MM-DD') : ''}，
      租赁数为<a>{totalInfo.totalArea}㎡</a>，
      总金额<a>{totalInfo.totalAmount}</a>】
      </PageHeader>
      <Divider dashed />
      <Form layout="vertical" hideRequiredMark>
        <Spin tip="数据处理中..." spinning={loading}>
          <Tabs defaultActiveKey="1" >
            <TabPane tab="基本信息" key="1">
              <Row gutter={24}>
                <Col span={12}>
                  <Card title="基本信息" className={styles.addcard} hoverable>
                    <Row gutter={24}>
                      <Col lg={24}>
                        <Form.Item label="合同编号" required>
                          {getFieldDecorator('no', {
                            initialValue: infoDetail.no,
                            rules: [{ required: true, message: '请输入合同编号' }],
                          })(<Input placeholder="请输入合同编号" />)}
                        </Form.Item>
                      </Col>
                      {/* <Col lg={12}>
                        <Form.Item label="合同面积(㎡)">
                          {getFieldDecorator('leaseSize', {
                            initialValue: infoDetail.leaseSize,
                            //rules: [{ required: true, message: '请输入租赁数量' }],
                          })(<Input placeholder="自动获取房屋的计费面积" readOnly />)}
                        </Form.Item>
                      </Col> */}
                    </Row>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="起始日期" required>
                          {getFieldDecorator('startDate', {
                            initialValue: infoDetail.startDate
                              ? moment(new Date(infoDetail.startDate))
                              : moment(new Date()),
                            rules: [{ required: true, message: '请选择起始日期' }],
                          })(<DatePicker placeholder="请选择起始日期" style={{ width: '100%' }}
                          // disabledDate={disabledStartDate}
                          />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="终止日期" required>
                          {getFieldDecorator('endDate', {
                            initialValue: infoDetail.endDate
                              ? moment(new Date(infoDetail.endDate))
                              : moment(new Date()).add(1, 'years').add(-1, 'days'),
                            rules: [{ required: true, message: '请选择终止日期' }],
                          })(<DatePicker placeholder="请选择终止日期"
                            style={{ width: '100%' }}
                            disabledDate={disabledEndDate}
                          />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    {/* <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="单价保留小数点">
                          {getFieldDecorator('calcPrecision', {
                            initialValue: infoDetail.calcPrecision ? infoDetail.calcPrecision : 2,
                            rules: [{ required: true, message: '请填写保留几位' }],
                          })(<InputNumber placeholder="请填写保留几位" style={{ width: '100%' }} />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="计算精度">
                          {getFieldDecorator('calcPrecisionMode', {
                            initialValue: infoDetail.calcPrecisionMode ? infoDetail.calcPrecisionMode : "最终计算结果保留2位"
                          })(<Select>
                            <Option value="最终计算结果保留2位" >最终计算结果保留2位</Option>
                            <Option value="每步计算结果保留2位" >每步计算结果保留2位</Option>
                          </Select>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={7}>
                        <Form.Item label="滞纳金比例" >
                          {getFieldDecorator('lateFee', {
                            initialValue: infoDetail.lateFee
                          })(<InputNumber placeholder="请输入" style={{ width: '120px' }} />)}
                        </Form.Item>
                      </Col>
                      <Col lg={5}>
                        <Form.Item label="&nbsp;" >
                          {getFieldDecorator('lateFeeUnit', {
                            initialValue: infoDetail.lateFeeUnit ? infoDetail.lateFeeUnit : "%/天"
                          })(
                            <Select>
                              <Option value="%/天">%/天</Option>
                            </Select>)}
                        </Form.Item>
                      </Col>
                      <Col lg={7}>
                        <Form.Item label="滞纳金上限" >
                          {getFieldDecorator('maxLateFee', {
                            initialValue: infoDetail.maxLateFee
                          })(<InputNumber placeholder="请输入" style={{ width: '120px' }} />)}
                        </Form.Item>
                      </Col>
                      <Col lg={5}>
                        <Form.Item label="&nbsp;" >
                          {getFieldDecorator('maxLateFeeUnit', {
                            initialValue: infoDetail.maxLateFeeUnit ? infoDetail.maxLateFeeUnit : "%"
                          })(<Select>
                            <Option value="%">%</Option>
                          </Select>)}
                        </Form.Item>
                      </Col>
                    </Row>  */}

                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="签约人">
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
                            initialValue: infoDetail.signer
                          })(
                            <Select
                              showSearch
                              // onSearch={handleSearch}
                              // optionFilterProp="children"
                              placeholder="请选择签约人"
                              onSelect={onSignerSelect}>
                              {userSource.map(item => (
                                <Option key={item.id} value={item.name}
                                  {...item}
                                >
                                  {item.name}
                                </Option>
                              ))}
                            </Select>
                          )}
                          {getFieldDecorator('signerId', {
                            initialValue: infoDetail.signerId
                          })(
                            <input type='hidden' />
                          )}
                          {getFieldDecorator('organizeId', {
                            initialValue: infoDetail.organizeId
                          })(
                            <input type='hidden' />
                          )}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="签约日期" required>
                          {getFieldDecorator('signingDate', {
                            initialValue: infoDetail.signingDate
                              ? moment(new Date(infoDetail.signingDate))
                              : moment(new Date()),
                            rules: [{ required: true, message: '请选择签约日期' }],
                          })(<DatePicker placeholder="请选择签约日期" style={{ width: '100%' }} />)}
                        </Form.Item>
                      </Col>
                    </Row> 
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="跟进人" >
                          {/* {getFieldDecorator('follower', {
                            initialValue: infoDetail.follower
                          })(
                            <AutoComplete
                              dataSource={userList}
                              onSearch={handleSearch}
                              placeholder="请输入跟进人"
                              onSelect={onFollowerSelect}
                            />
                          )} */}
                          {getFieldDecorator('follower', {
                            initialValue: infoDetail.follower
                          })(
                            <Select
                              showSearch
                              // onSearch={handleSearch}
                              // optionFilterProp="children"
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
                            initialValue: infoDetail.followerId
                          })(
                            <input type='hidden' />
                          )}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="渠道"  >
                          {getFieldDecorator('channelType', {
                            initialValue: infoDetail.channelType
                            // rules: [{ required: true, message: '请选择渠道' }],
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
                    </Row>
                    {/* <Row gutter={24}>
                      <Col span={24}>
                        <Form.Item label="备注">
                          {getFieldDecorator('memo', {
                            initialValue: infoDetail.memo
                          })(
                            <TextArea rows={3} placeholder="请输入备注" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row> */}
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="租赁信息" className={styles.addcard} hoverable>
                    {/* <Row gutter={24}>
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
                    <Row gutter={24}>
                      <Col lg={24}>
                        <Form.Item label={<div>房源选择(<a>多个房屋的时候，默认获取第一个房屋作为计费单元</a>)</div>} required>
                          {getFieldDecorator('room', {
                            initialValue: rooms,
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
                          {getFieldDecorator('billUnitId', {
                            initialValue: infoDetail.billUnitId
                          })(
                            <input type='hidden' />
                          )}  
                        </Form.Item>
                      </Col>
                    </Row>  */}

                    <Row gutter={24}>
                      <Col lg={24}>
                        <Form.Item label="承租方" required>
                          {getFieldDecorator('customer', {
                            initialValue: infoDetail.customer,
                            rules: [{
                              required: true,
                              message: '请输入承租方'
                            },
                            { validator: checkExist }]
                          })(<AutoComplete
                            dropdownClassName={styles.searchdropdown}
                            optionLabelProp="value"
                            dropdownMatchSelectWidth={false}
                            dataSource={userList}
                            onSearch={customerSearch}
                            placeholder="请输入承租方"
                            onSelect={onCustomerSelect}
                            disabled={form.getFieldValue('organizeId') == '' ? true : false}
                          />)}

                          {getFieldDecorator('customerId', {
                            initialValue: infoDetail.customerId,
                          })(
                            <input type='hidden' />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="联系人">
                          {getFieldDecorator('linkMan', {
                            initialValue: infoDetail.linkMan,
                            rules: [{ required: true, message: '请输入联系人' }],
                          })(<Input placeholder="请输入联系人"
                            disabled={form.getFieldValue('customerId') == '' ? true : false}
                          />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="类别" required>
                          {getFieldDecorator('customerType', {
                            initialValue: infoDetail.customerType,
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
                              initialValue: infoDetail.industry,
                              rules: [{ required: true, message: '请选择行业' }],
                            })(
                              <Select placeholder="请选择行业"
                                disabled={form.getFieldValue('customerId') == '' ? true : false}
                              // onSelect={onIndustrySelect}
                              >
                                {industryType.map(item => (
                                  <Option value={item.value} key={item.key}>
                                    {item.title}
                                  </Option>
                                ))}
                              </Select>
                            )}
                            {/* {getFieldDecorator('industry', {
                            initialValue: infoDetail.industry
                          })(
                            <input type='hidden' />
                          )} */}
                          </Form.Item>
                        </Col>
                        <Col lg={12}>
                          <Form.Item label="法人" required>
                            {getFieldDecorator('legalPerson', {
                              initialValue: infoDetail.legalPerson,
                              rules: [{ required: true, message: '请填写法人' }],
                            })(<Input placeholder="请填写法人"
                              disabled={form.getFieldValue('customerId') == '' ? true : false}
                            />)}
                          </Form.Item>
                        </Col>
                      </Row>) : null}
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="联系电话">
                          {getFieldDecorator('linkPhone', {
                            initialValue: infoDetail.linkPhone,
                            rules: [{ required: true, message: '请输入联系电话' }],
                          })(<Input placeholder="请输入联系电话"
                            disabled={form.getFieldValue('customerId') == '' ? true : false} />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="联系地址" required>
                          {getFieldDecorator('address', {
                            initialValue: infoDetail.address,
                            rules: [{ required: true, message: '请输入联系地址' }],
                          })(<Input placeholder="请输入联系地址" disabled={form.getFieldValue('customerId') == '' ? true : false} />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="经营主体" >
                          {getFieldDecorator('businessEntity', {
                            initialValue: infoDetail.businessEntity
                            // rules: [{ required: true, message: '请输入经营主体' }],
                          })(<Input placeholder="请输入经营主体" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="付款方式">
                          {getFieldDecorator('payType', {
                            initialValue: infoDetail.payType
                            // rules: [{ required: true, message: '请输入付款方式' }],
                          })(<Input placeholder="请输入付款方式" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="费用条款" key="2">
              <Card title="基本条款" className={styles.card} hoverable >
                <Row gutter={12}>
                  {/* <Col lg={6}>
                    <Form.Item label="合同面积(㎡)" required>
                      {getFieldDecorator('leaseArea', {
                        initialValue: contractCharge.leaseArea
                      })(<Input placeholder='自动获取房屋的计费面积' />)}
                    </Form.Item>
                  </Col> */}

                  <Col lg={6}>
                    <Form.Item label="滞纳金起算日 距">
                      {getFieldDecorator('lateStartDateBase', {
                        initialValue: contractCharge.lateStartDateBase ? contractCharge.lateStartDateBase : null,
                        // rules: [{ required: true, message: '请选择滞纳金起算日' }],
                      })(
                        <Select allowClear placeholder="==选择滞纳金起算日==">
                          {/* <Option value={1}>同一季度费用,每季度首月</Option> */}
                          <Option value={2}>计费起始日期</Option>
                          <Option value={3}>计费截止日期</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={3}>
                    <Form.Item label="&nbsp;">
                      {getFieldDecorator('lateStartDateNum', {
                        initialValue: contractCharge.lateStartDateNum ? contractCharge.lateStartDateNum : null,
                        rules: [{ required: form.getFieldValue('lateStartDateBase'), message: '请输入数字' }],
                      })(
                        <InputNumber style={{ width: '100%' }} precision={0} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={3} >
                    <Form.Item label="&nbsp;">
                      {getFieldDecorator('lateStartDateUnit', {
                        initialValue: contractCharge.lateStartDateUnit ? contractCharge.lateStartDateUnit : null,
                        rules: [{ required: form.getFieldValue('lateStartDateBase'), message: '请选择' }],
                      })(
                        <Select allowClear placeholder="==选择==" onChange={value => {
                          if (value == 1) {
                            setLateFixedDisabled(true);
                          } else {
                            setLateFixedDisabled(false);
                          }
                        }}>
                          <Option value={1}>天</Option>
                          <Option value={2}>月</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={3}>
                    <Form.Item label="&nbsp;">
                      {getFieldDecorator('lateStartDateFixed', {
                        initialValue: contractCharge.lateStartDateFixed ? contractCharge.lateStartDateFixed : null,
                      })(
                        <Select
                          allowClear
                          disabled={lateFixedDisabled}>
                          <Option key="1">1日</Option>
                          <Option key="2">2日</Option>
                          <Option key="3">3日</Option>
                          <Option key="4">4日</Option>
                          <Option key="5">5日</Option>
                          <Option key="6">6日</Option>
                          <Option key="7">7日</Option>
                          <Option key="8">8日</Option>
                          <Option key="9">9日</Option>
                          <Option key="10">10日</Option>
                          <Option key="11">11日</Option>
                          <Option key="12">12日</Option>
                          <Option key="13">13日</Option>
                          <Option key="14">14日</Option>
                          <Option key="15">15日</Option>
                          <Option key="16">16日</Option>
                          <Option key="17">17日</Option>
                          <Option key="18">18日</Option>
                          <Option key="19">19日</Option>
                          <Option key="20">20日</Option>
                          <Option key="21">21日</Option>
                          <Option key="22">22日</Option>
                          <Option key="23">23日</Option>
                          <Option key="24">24日</Option>
                          <Option key="25">25日</Option>
                          <Option key="26">26日</Option>
                          <Option key="27">27日</Option>
                          <Option key="28">28日</Option>
                          <Option key="29">29日</Option>
                          <Option key="30">30日</Option>
                          <Option key="31">31日</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={3}>
                    <Form.Item label="滞纳金比例(‰)" >
                      {getFieldDecorator('lateFee', {
                        initialValue: contractCharge.lateFee ? contractCharge.lateFee : null,
                        rules: [{ required: form.getFieldValue('lateStartDateBase'), message: '请输入' }],
                      })(<InputNumber placeholder="请输入滞纳金比例" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                  {/* <Col lg={6}>
                    <Form.Item label="滞纳金起算日期" >
                      {getFieldDecorator('lateDate', {
                        initialValue: contractCharge.lateDate
                          ? moment(new Date(contractCharge.lateDate))
                          : null,
                        // rules: [{ required: true, message: '请选择滞纳金起算日期' }],
                      })(<DatePicker placeholder="请选择滞纳金起算日期" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col> */}
                  <Col lg={6}>
                    <Form.Item label="滞纳金算法" >
                      {getFieldDecorator('lateMethod', {
                        initialValue: contractCharge.lateMethod ? contractCharge.lateMethod : null,
                        rules: [{ required: form.getFieldValue('lateStartDateBase'), message: '请选择滞纳金算法' }],
                      })(<Select allowClear>
                        <Option value="固定滞纳金率按天计算" >固定滞纳金率按天计算</Option>
                      </Select>
                      )}
                    </Form.Item>
                  </Col>
                  {/* <Col lg={7}>
                    <Form.Item label="物业费项" >
                      {getFieldDecorator('propertyFeeId', {
                        initialValue: contractCharge.propertyFeeId
                        // rules: [{ required: true, message: '请选择物业费项' }]
                      })(
                        <Select placeholder="请选择物业费项"
                          onChange={changeFeeItem}  >
                          {feeItems.map(item => (
                            <Option value={item.value} key={item.key}>
                              {item.title}
                            </Option>
                          ))}
                        </Select>
                      )}
                      {getFieldDecorator('propertyFeeName', {
                        initialValue: contractCharge.propertyFeeName
                      })(
                        <input type='hidden' />
                      )}
                    </Form.Item>
                  </Col> */}
                </Row>
                <Row gutter={24}>
                  <Col lg={6}>
                    <Form.Item label="中间每一步计算结果保留">
                      {getFieldDecorator('midResultScale', {
                        initialValue: contractCharge.midResultScale || contractCharge.midResultScale == 0 ? contractCharge.midResultScale : 2,
                        rules: [{ required: true, message: '请选择小数位数' }],
                      })(
                        <Select placeholder="请选择小数位数">
                          <Option value={0}>0</Option>
                          <Option value={1}>1</Option>
                          <Option value={2}>2</Option>
                          <Option value={3}>3</Option>
                          <Option value={4}>4</Option>
                          <Option value={5}>5</Option>
                          <Option value={6}>6</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="对最后一位">
                      {getFieldDecorator('midScaleDispose', {
                        initialValue: contractCharge.midScaleDispose ? contractCharge.midScaleDispose : 1,
                        rules: [{ required: true, message: '请选择小数处理方法' }],
                      })(
                        <Select placeholder="请选择小数处理方法">
                          <Option value={1}>四舍五入</Option>
                          <Option value={2}>直接舍去</Option>
                          <Option value={3}>有数进一</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="最终结果保留小数位数">
                      {getFieldDecorator('lastResultScale', {
                        initialValue: contractCharge.lastResultScale || contractCharge.lastResultScale == 0 ? contractCharge.lastResultScale : 2,
                        rules: [{ required: true, message: '请选择小数位数' }],
                      })(
                        <Select placeholder="请选择小数位数">
                          <Option value={0}>0</Option>
                          <Option value={1}>1</Option>
                          <Option value={2}>2</Option>
                          {/* <Option value={3}>3</Option>
                        <Option value={4}>4</Option> */}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="对最后一位">
                      {getFieldDecorator('lastScaleDispose', {
                        initialValue: contractCharge.lastScaleDispose ? contractCharge.lastScaleDispose : 1,
                        rules: [{ required: true, message: '请选择小数处理方法' }],
                      })(
                        <Select placeholder="请选择小数处理方法">
                          <Option value={1}>四舍五入</Option>
                          <Option value={2}>直接舍去</Option>
                          <Option value={3}>有数进一</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              <LeaseTermModify
                form={form}
                // feeItems={feeItems}
                chargeFeeList={chargeFeeList}
                visible={visible}
              ></LeaseTermModify>
              {/* <IncreasingRateModify
                form={form}
                chargeIncre={chargeincre}
              ></IncreasingRateModify>
              <RebateModify
                form={form}
                chargeOffer={chargefeeoffer}
              ></RebateModify> */}
              <Button style={{ width: '100%', marginBottom: '10px' }}
                onClick={calculation}>点击生成租金明细</Button>
              <ResultList
                // depositData={depositData}
                chargeData={chargeData}
                // propertyData={propertyData}
                className={styles.addcard}
              ></ResultList>
            </TabPane>
            <TabPane tab="其他条款" key="3">
              <div style={{ marginBottom: '50px' }}>
                <Row gutter={24}>
                  <Col lg={24}>
                    <Form.Item label="&nbsp;">
                      {getFieldDecorator('memo', {
                        initialValue: infoDetail.memo,
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
                        //accept='.doc,.docx,.pdf,image/*'
                        action={process.env.basePath + '/Contract/Upload?keyvalue=' + instanceId}
                        fileList={fileList}
                        //listType="picture-card"
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
              </div>
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
          关闭
          </Button>
        <Button onClick={save} style={{ marginRight: 8 }}>
          暂存
          </Button>
        <Button
          onClick={isReSubmit ? resubmit : submit}
          type="primary"
          disabled={!isCal}>
          提交
          </Button>
      </div>

      <QuickModify
        modifyVisible={customerVisible}
        closeDrawer={closeCustomerDrawer}
        data={customer}
        organizeId={form.getFieldValue('organizeId')}
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

      <Follow
        visible={followVisible}
        closeDrawer={closeFollowDrawer}
        id={instanceId}
        reload={() => {
          GetFollowCount(instanceId).then(res => {
            setCount(res);
            // setNewFlow(res.newFollow);
            setLoading(false);
          })
        }}
      />

    </Drawer >
  );
};

export default Form.create<ModifyProps>()(Modify);

