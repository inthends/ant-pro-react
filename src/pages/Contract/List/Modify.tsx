import { Tooltip, Upload, Icon, Tag, Spin, Divider, PageHeader, AutoComplete, InputNumber, TreeSelect, message, Tabs, Select, Button, Card, Col, DatePicker, Drawer, Form, Input, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { TreeEntity, HtLeasecontractcharge, HtLeasecontractchargefee, HtLeasecontractchargeincre, HtLeasecontractchargefeeoffer, LeaseContractDTO, ChargeDetailDTO } from '@/model/models';
import React, { useEffect, useState } from 'react';
import ResultList from './ResultList';
import {
  RemoveFile, GetFilesData, SubmitForm, SaveForm, GetFeeItemsByUnitId,
  GetCharge, GetContractInfo, GetModifyChargeDetail, GetFollowCount
} from './Main.service';
import { GetOrgTreeSimple, GetAsynChildBuildingsSimple, getCommonItems, GetUserList } from '@/services/commonItem';
import { GetCustomerInfo, CheckContractCustomer, GetContractCustomerList } from '../../Resource/PStructUser/PStructUser.service';
import moment from 'moment';
import styles from './style.less';
import LeaseTermModify from './LeaseTermModify';
import IncreasingRateModify from './IncreasingRateModify';
import RebateModify from './RebateModify';
import QuickModify from '../../Resource/PStructUser/QuickModify';
import Follow from './Follow';
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface ModifyProps {
  visible: boolean;
  id?: string;//合同id
  chargeId?: string;//合同条款id
  closeDrawer(): void;
  form: WrappedFormUtils;
  reload(): void;
  // treeData: any[];
  // choose(): void;
};

const Modify = (props: ModifyProps) => {
  const title = '修改合同';
  const { visible, closeDrawer, id, form, chargeId, reload } = props;
  const { getFieldDecorator } = form;
  //const [industryType, setIndustryType] = useState<any[]>([]); //行业  
  //const [feeitems, setFeeitems] = useState<TreeEntity[]>([]);
  const [infoDetail, setInfoDetail] = useState<LeaseContractDTO>({});
  const [contractCharge, setContractCharge] = useState<HtLeasecontractcharge>({});

  const [chargefee, setChargefee] = useState<HtLeasecontractchargefee>({});
  const [chargeincre, setChargeincre] = useState<HtLeasecontractchargeincre>({});
  const [chargefeeoffer, setChargefeeoffer] = useState<HtLeasecontractchargefeeoffer>({});

  const [depositData, setDepositData] = useState<any[]>([]);//保证金
  const [chargeData, setChargeData] = useState<any[]>([]);//租金 
  const [industryType, setIndustryType] = useState<any[]>([]); //行业 
  const [feeItems, setFeeItems] = useState<TreeEntity[]>([]);
  const [isCal, setIsCal] = useState<boolean>(false);
  // const [TermJson, setTermJson] = useState<string>();
  // const [RateJson, setRateJson] = useState<string>();
  // const [RebateJson, setRebateJson] = useState<string>();
  const [userSource, setUserSource] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<any[]>([]);

  // const close = () => {
  //   closeDrawer();
  // };

  //打开抽屉时初始化
  useEffect(() => {
    if (visible) {

      getCommonItems('IndustryType').then(res => {
        setIndustryType(res || []);
      });

      //加载关联收费项目
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

    }
  }, [visible]);

  // 打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      if (id) {
        setLoading(true);
        GetContractInfo(id).then((tempInfo) => {
          //处理一下房间
          let rooms: any[] = [];
          if (tempInfo != null && tempInfo.houseList != null) {
            tempInfo.houseList.forEach(item => {
              rooms.push(item.roomId);
            });
            setRooms(rooms);
          }

          //加载费项
          GetFeeItemsByUnitId(tempInfo.contract.billUnitId).then(res => {
            setFeeItems(res || []);
          });

          setInfoDetail(tempInfo.contract);
          setCount(tempInfo.followCount);

          //获取条款
          GetCharge(chargeId).then((charge: ChargeDetailDTO) => {
            setContractCharge(charge.contractCharge || {});
            setChargefee(charge.chargeFee || {});
            setChargeincre(charge.chargeIncre || {});
            setChargefeeoffer(charge.chargeFeeOffer || {});
            setDepositData(charge.depositFeeResultList || []);//保证金明细
            setChargeData(charge.chargeFeeResultList || []);//租金明细    
          });

          //附件
          GetFilesData(id).then(res => {
            setFileList(res || []);
          });

          //合计信息
          setTotalInfo({ leasePrice: tempInfo.leasePrice, totalDeposit: tempInfo.totalDeposit, totalAmount: tempInfo.totalAmount });

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
  };

  const onRoomChange = (value, label, extra) => {
    //多个房屋的时候，默认获取第一个房屋作为计费单元
    if (value.length == 0) {
      form.setFieldsValue({ billUnitId: '' });
      // setOrganizeId('');

      form.setFieldsValue({ organizeId: '' });

      setFeeItems([]);
    } else {
      form.setFieldsValue({ billUnitId: value[0] });
      //机构Id
      // setOrganizeId(extra.triggerNode.props.organizeId);

      form.setFieldsValue({ organizeId: extra.triggerNode.props.organizeId });

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

  //计算租金明细
  const calculation = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        setLoading(true);

        //数据处理  
        //租赁条款     
        // let TermJson: HtLeasecontractchargefee[] = [];
        // let data: HtLeasecontractchargefee = {}; 
        // data.feeItemId = values.feeItemId[0];
        // data.startDate = values.startDate[0];
        // data.endDate = values.endDate[0];
        // data.price = values.price[0];
        // data.priceUnit = values.priceUnit[0];
        // data.advancePayTime = values.advancePayTime[0];
        // data.advancePayTimeUnit = values.advancePayTimeUnit[0];
        // data.billType = values.billType[0];
        // if (data.priceUnit == "1" || data.priceUnit == "3") {
        //   data.dayPriceConvertRule = values.dayPriceConvertRule[0];
        // }
        // data.yearDays = values.yearDays[0];
        // data.payCycle = values.payCycle[0];
        // data.rentalPeriodDivided = values.rentalPeriodDivided[0];
        // TermJson.push(data); 

        //动态添加的租期
        // values.LeaseTerms.map(function (k, index, arr) {
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
        //   TermJson.push(data);
        // });

        //递增率
        // let RateJson: HtLeasecontractchargeincre[] = [];
        // values.IncreasingRates.map(function (k, index, arr) {
        let mychargeincre: HtLeasecontractchargeincre = {};
        mychargeincre.increType = values.increType;
        mychargeincre.increPrice = values.increPrice;
        mychargeincre.increPriceUnit = values.increPriceUnit;
        mychargeincre.increDeposit = values.increDeposit;
        mychargeincre.increDepositUnit = values.increDepositUnit;
        //   RateJson.push(rate);
        // });

        //优惠
        // let RebateJson: HtLeasecontractchargefeeoffer[] = [];
        // values.Rebates.map(function (k, index, arr) {
        let mychargefeeoffer: HtLeasecontractchargefeeoffer = {};
        mychargefeeoffer.rebateType = values.rebateType;
        if (values.rebateStartDate != '')
          mychargefeeoffer.rebateStartDate = values.rebateStartDate.format('YYYY-MM-DD');
        if (values.rebateEndDate != '')
          mychargefeeoffer.rebateEndDate = values.rebateEndDate.format('YYYY-MM-DD');
        mychargefeeoffer.startPeriod = values.startPeriod;
        mychargefeeoffer.periodLength = values.periodLength;
        mychargefeeoffer.discount = values.discount;
        mychargefeeoffer.remark = values.remark;
        //   RebateJson.push(rebate);
        // });

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

        // let strTermJson = JSON.stringify(TermJson);
        setChargefee(mychargefee);
        // let strRateJson = JSON.stringify(RateJson);
        setChargeincre(mychargeincre);
        // let strRebateJson = JSON.stringify(RebateJson);
        setChargefeeoffer(mychargefeeoffer);

        GetModifyChargeDetail({
          ...entity,
          ...mychargefee,
          ...mychargeincre,
          ...mychargefeeoffer,
          BillUnitId: values.billUnitId,//计费单元id
          LeaseContractId: '',
          CalcPrecision: values.calcPrecision,
          CalcPrecisionMode: values.calcPrecisionMode
        }).then(tempInfo => {
          setIsCal(true);//计算了租金
          setDepositData(tempInfo.dataInfo.depositFeeResultList);//保证金明细
          setChargeData(tempInfo.dataInfo.chargeFeeResultList);//租金明细  
          // setDepositResult(res.depositFeeResultList);
          // setChargeFeeResult(res.chargeFeeResultList);  
          //合计信息
          setTotalInfo({ leasePrice: tempInfo.leasePrice, totalDeposit: tempInfo.totalDeposit, totalAmount: tempInfo.totalAmount });

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

        //合同信息
        let Contract: LeaseContractDTO = {};
        Contract.id = id;
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
        Contract.customerType = values.customerType;
        Contract.industry = values.industry;
        //Contract.industryId = values.industryId; 
        Contract.legalPerson = values.legalPerson;
        Contract.linkMan = values.linkMan;
        Contract.linkPhone = values.linkPhone;
        Contract.address = values.address;
        Contract.signer = values.signer;
        Contract.signerId = values.signerId;
        Contract.lateFee = values.lateFee;
        Contract.lateFeeUnit = values.lateFeeUnit;
        Contract.maxLateFee = values.maxLateFee;
        Contract.maxLateFeeUnit = values.maxLateFeeUnit;
        Contract.billUnitId = values.billUnitId;
        Contract.organizeId = values.organizeId;
        Contract.memo = values.memo;
        SubmitForm({
          ...Contract,
          ...ContractCharge,
          ...chargefee,
          ...chargeincre,
          ...chargefeeoffer,
          keyValue: id,
          ChargeId: chargeId,
          room: values.room,
          // TermJson: TermJson,
          // RateJson: RateJson,
          // RebateJson: RebateJson,
          DepositResult: JSON.stringify(depositData),
          ChargeFeeResult: JSON.stringify(chargeData)

        }).then(res => {
          if (res.flag) {
            message.success('提交成功');
            closeDrawer();
            reload();
            setLoading(false);
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

        //合同信息
        let Contract: LeaseContractDTO = {};
        Contract.id = id;
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
        Contract.customerType = values.customerType;
        Contract.industry = values.industry;
        //Contract.industryId = values.industryId; 
        Contract.legalPerson = values.legalPerson;
        Contract.linkMan = values.linkMan;
        Contract.linkPhone = values.linkPhone;
        Contract.address = values.address;
        Contract.signer = values.signer;
        Contract.signerId = values.signerId;
        Contract.lateFee = values.lateFee;
        Contract.lateFeeUnit = values.lateFeeUnit;
        Contract.maxLateFee = values.maxLateFee;
        Contract.maxLateFeeUnit = values.maxLateFeeUnit;
        Contract.billUnitId = values.billUnitId;
        Contract.organizeId = values.organizeId;
        Contract.memo = values.memo;
        SaveForm({
          ...Contract,
          ...ContractCharge,
          ...chargefee,
          ...chargeincre,
          ...chargefeeoffer,
          keyValue: id,
          ChargeId: chargeId,
          room: values.room,
          // TermJson: TermJson,
          // RateJson: RateJson,
          // RebateJson: RebateJson,
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

  //异步加载房间，提高速度
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
  const changeFeeItem = (value, option) => {
    form.setFieldsValue({ depositFeeItemName: option.props.children });
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

  return (
    <Drawer
      title={title}
      placement="right"
      width={1050}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
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
                {form.getFieldValue('linkMan')}
              </Form.Item>
            </Col>
            <Col lg={4}>
              <Form.Item label="联系电话" >
                {form.getFieldValue('linkPhone')}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </PageHeader>

      <Divider dashed />
      <Form layout="vertical" hideRequiredMark>
        <Spin tip="数据处理中..." spinning={loading}>
          <Tabs defaultActiveKey="1" >
            <TabPane tab="基本信息" key="1">
              <Row gutter={24}>
                <Col span={12}>
                  <Card title="基本信息" className={styles.addcard}>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="合同编号" required>
                          {getFieldDecorator('no', {
                            initialValue: infoDetail.no,
                            rules: [{ required: true, message: '请输入合同编号' }],
                          })(<Input placeholder="请输入合同编号" />)}
                        </Form.Item>
                      </Col>
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
                              placeholder="请选择跟进人"
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
                    </Row>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="租赁数量（m²)">
                          {getFieldDecorator('leaseSize', {
                            initialValue: infoDetail.leaseSize,
                            rules: [{ required: true, message: '请输入租赁数量' }],
                          })(<InputNumber placeholder="请输入租赁数量" style={{ width: '100%' }} />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="合同签订时间" required>
                          {getFieldDecorator('contractStartDate', {
                            initialValue: infoDetail.contractStartDate
                              ? moment(new Date(infoDetail.contractStartDate))
                              : moment(new Date()),
                            rules: [{ required: true, message: '请选择合同签订时间' }],
                          })(<DatePicker placeholder="请选择合同签订时间" style={{ width: '100%' }} />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="合同计租时间">
                          {getFieldDecorator('billingDate', {
                            initialValue: infoDetail.billingDate
                              ? moment(new Date(infoDetail.billingDate))
                              : moment(new Date()),
                            rules: [{ required: true, message: '请选择合同计租时间' }],
                          })(<DatePicker placeholder="请选择合同计租时间" style={{ width: '100%' }} />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="合同失效时间" required>
                          {getFieldDecorator('contractEndDate', {
                            initialValue: infoDetail.contractEndDate
                              ? moment(new Date(infoDetail.contractEndDate))
                              : moment(new Date()).add(1, 'years').add(-1, 'days'),
                            rules: [{ required: true, message: '请选择合同失效时间' }],
                          })(<DatePicker placeholder="请选择合同失效时间" style={{ width: '100%' }} />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
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
                    </Row>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="租赁信息" className={styles.addcard}>
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

                          {getFieldDecorator('organizeId', {
                            initialValue: infoDetail.organizeId
                          })(
                            <input type='hidden' />
                          )}

                        </Form.Item>
                      </Col>
                    </Row>
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
                        <Form.Item label="签订人" required>
                          {/* {getFieldDecorator('signer', {
                            initialValue: infoDetail.signer,
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
                            initialValue: infoDetail.signer,
                            rules: [{ required: true, message: '请选择签订人' }],
                          })(
                            <Select
                              showSearch
                              placeholder="请选择签订人"
                              onSelect={onSignerSelect}>
                              {userSource.map(item => (
                                <Option key={item.id} value={item.name}>
                                  {item.name}
                                </Option>
                              ))}
                            </Select>
                          )}
                          {getFieldDecorator('signerId', {
                            initialValue: infoDetail.signerId,
                          })(
                            <input type='hidden' />
                          )}
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
                        <Form.Item label="联系电话">
                          {getFieldDecorator('linkPhone', {
                            initialValue: infoDetail.linkPhone,
                            rules: [{ required: true, message: '请输入联系电话' }],
                          })(<Input placeholder="请输入联系电话"
                            disabled={form.getFieldValue('customerId') == '' ? true : false} />)}
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col lg={24}>
                        <Form.Item label="联系地址" required>
                          {getFieldDecorator('address', {
                            initialValue: infoDetail.address,
                            rules: [{ required: true, message: '请输入联系地址' }],
                          })(<Input placeholder="请输入联系地址" disabled={form.getFieldValue('customerId') == '' ? true : false} />)}
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
                  <Col lg={4}>
                    <Form.Item label="租赁数量/㎡" required>
                      {getFieldDecorator('leaseArea', {
                        initialValue: contractCharge.leaseArea
                      })(<Input readOnly />)}
                    </Form.Item>
                  </Col>
                  <Col lg={10}>
                    <Form.Item label="保证金关联费项" required>
                      {getFieldDecorator('depositFeeItemId', {
                        initialValue: contractCharge.depositFeeItemId,
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
                        initialValue: contractCharge.depositFeeItemName,
                      })(
                        <input type='hidden' />
                      )}

                    </Form.Item>
                  </Col>
                  <Col lg={5}>
                    <Form.Item label="保证金数量" required>
                      {getFieldDecorator('deposit', {
                        initialValue: contractCharge.deposit ? contractCharge.deposit : 1,
                        rules: [{ required: true, message: '请输入保证金数量' }],
                      })(<Input placeholder="请输入保证金数量" />)}
                    </Form.Item>
                  </Col>
                  <Col lg={5}>
                    <Form.Item label="&nbsp;" >
                      {getFieldDecorator('depositUnit', {
                        initialValue: contractCharge.depositUnit ? contractCharge.depositUnit : "月"
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
              <LeaseTermModify
                form={form}
                feeItems={feeItems}
                chargeFee={chargefee}
              ></LeaseTermModify>
              <IncreasingRateModify
                form={form}
                chargeIncre={chargeincre}
              ></IncreasingRateModify>
              <RebateModify
                form={form}
                chargeOffer={chargefeeoffer}
              ></RebateModify>
              <Button style={{ width: '100%', marginBottom: '10px' }}
                onClick={calculation}>点击生成租金明细</Button>
              <ResultList
                depositData={depositData}
                chargeData={chargeData}
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
                        action={process.env.basePath + '/Contract/Upload?keyValue=' + id}
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
          保存
          </Button>
        <Button onClick={submit} type="primary">
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
        id={id}
        reload={() => {
          GetFollowCount(id).then(res => {
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

