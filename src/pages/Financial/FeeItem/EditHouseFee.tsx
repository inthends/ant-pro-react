import { TreeEntity } from '@/model/models';
// import { DefaultPagination } from '@/utils/defaultSetting';
import { Modal, Checkbox, Tabs, Select, Button, Card, Icon, Col, DatePicker, Form, Input, Row, InputNumber } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { HouseSaveForm, GetHouseFormJson, GetAllFeeItems, GetFeeItemName } from './Main.service';
import styles from './style.less';
import moment from 'moment';
import AddFormula from './AddFormula';
import SelectHouse from './SelectHouse';
const Option = Select.Option;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface EditHouseFeeProps {
  visible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  houseItemId?: string;
  reload(): void;
}
const EditHouseFee = (props: EditHouseFeeProps) => {
  const { visible, closeModal, form, houseItemId, reload } = props;
  const { getFieldDecorator } = form;
  const title = houseItemId === undefined ? '添加房屋费项' : '修改房屋费项';
  const [infoDetail, setInfoDetail] = useState<any>({});
  // const [feetypes, setFeetype] = useState<TreeEntity[]>([]);
  const [feeitems, setFeeitems] = useState<TreeEntity[]>([]);

  const [isFormula, setIsFormula] = useState<boolean>(false);
  const [addFormulaVisible, setAddFormulaVisible] = useState<boolean>(false);
  const [selectHouseVisible, setSelectHouseVisible] = useState<boolean>(false);
  const [feeItemNames, setFeeItemNames] = useState<any[]>([]);
  const [linkFeeDisable, setLinkFeeDisable] = useState<boolean>(true);

  const [showFeeField, setShowFeeField] = useState<boolean>(false);
  const [accFixedDisabled, setAccFixedDisabled] = useState<boolean>(true);
  const [payFixedDisabled, setPayFixedDisabled] = useState<boolean>(true);
  const [lateFixedDisabled, setLateFixedDisabled] = useState<boolean>(true);

  // const dateItems = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
  //打开抽屉时初始化
  useEffect(() => {

    //加载关联收费项目
    GetAllFeeItems().then(res => {
      setFeeitems(res || []);
    });
    GetFeeItemName().then(res => {
      setFeeItemNames(res || []);
    })
  }, []);

  // const changeFeeType = (value) => {
  //   GetFeeType(value).then(res => {
  //     setFeetype(res || []);
  //   });
  // };

  // 打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      if (houseItemId) {
        getInfo(houseItemId).then((tempInfo: any) => {
          // if (tempInfo.feeKind) {
          //   var kind = tempInfo.feeKind == "收款费项" ? "ReceivablesItem" : "PaymentItem";
          //   changeFeeType(kind);
          // }
          setInfoDetail(tempInfo);
          form.resetFields();
        });
      } else {
        //重置之前选择加载的费项类别
        // setFeetype([]);
        setInfoDetail({});
        form.resetFields();
      }
    } else {
      form.setFieldsValue({});
    }
  }, [visible]);

  const close = () => {
    closeModal();
  };
  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        let newvalue = {
          keyValue: houseItemId,
          AccBillDateNum: values.accBillDateNum,
          //BankTransfer:tempInfo.bankTransfer,
          //CreateDate:tempInfo.createDate,
          EndDate: moment(values.endDate).format('YYYY-MM-DD'),
          //InFeeMethod:tempInfo.inFeeMethod,
          IsModifyDate: infoDetail.isModifyDate ? true : false,
          LateStartDateNum: values.lateStartDateNum,
          //ModifyUserName:tempInfo.modifyUserName,
          PayDeadlineFixed: values.payDeadlineFixed,
          //SplitFee:tempInfo.splitFee,
          //UseStepPrice:tempInfo.useStepPrice,
          AccBillDateUnit: values.accBillDateUnit,
          BeginDate: moment(values.beginDate).format('YYYY-MM-DD'),
          //CreateUserId:tempInfo.CreateUserId,
          FeeApportion: values.feeApportion,
          //InMethod:tempInfo.inMethod,
          IsNullDate: infoDetail.isNullDate ? true : false,
          LateStartDateUnit: values.lateStartDateUnit,
          //MonthAmount:tempInfo.monthAmount,
          PayDeadlineNum: values.payDeadlineNum,
          //StartCalDate:tempInfo.startCalDate,
          //UseTimePrice:tempInfo.useTimePrice,
          AccPeriodBase: values.accPeriodBase,
          //CalResultScale:tempInfo.calResultScale,
          //CreateUserName:tempInfo.createUserName,
          FeeFormulaOne: values.feeFormulaOne,
          //InOutDate:moment(tempInfo.inOutDate).format('YYYY-MM-DD'),
          IsTax: infoDetail.isTax ? true : false,
          LinkFee: values.linkFee,
          //NowCalDate:moment(tempInfo.nowCalDate).format('YYYY-MM-DD'),
          PayDeadlineUnit: values.payDeadlineUnit,
          //StepPriceId:tempInfo.stepPriceId,
          AccPeriodBaseNum: values.accPeriodBaseNum,
          //CalScaleDispose:tempInfo.calScaleDispose,
          //Currency:tempInfo.currency,
          //FeeFormulaTwo:tempInfo.feeFormulaTwo,
          IsCancel: infoDetail.isCancel ? true : false,
          IsTemp: infoDetail.isTemp ? true : false,
          Memo: values.memo,
          //OutFeeMethod:tempInfo.outFeeMethod,
          PayedCreateCope: values.payedCreateCope ? true : false,
          UnitFeeId: houseItemId,
          AccPeriodBaseUnit: values.accPeriodBaseUnit,
          //CopePersonType:tempInfo.copePersonType,
          CycleType: values.cycleType,
          FeeItemId: values.feeItemId,
          IsCustomizeDate: infoDetail.isCustomizeDate ? true : false,
          LastResultScale: values.lastResultScale,
          MidResultScale: values.midResultScale,
          //OutMethod:tempInfo.outMethod,
          PayFeeItemId: values.payFeeItemId,
          UnitId: values.unitId,
          AccRightBase: values.accRightBase,
          CopeRate: values.copeRate,
          CycleValue: values.cycleValue,
          FeePerson: values.feePerson,
          IsEditTemp: infoDetail.isEditTemp ? true : false,
          LastScaleDispose: values.lastScaleDispose,
          MidScaleDispose: values.midScaleDispose,
          PayDateNum: values.payDateNum,
          //PeriodNum:tempInfo.periodNum,
          //UseFormulaTwo:tempInfo.useFormulaTwo,
          AccBillDateBase: values.accBillDateBase,
          //AccRightBaseNum:tempInfo.accRightBaseNum,
          //CopeUserId:tempInfo.copeUserId,
          DelayRate: values.delayRate,
          //FeePersonType:tempInfo.feePersonType,
          IsEnable: infoDetail.isEnable ? true : false,
          LateStartDateBase: values.lateStartDateBase,
          // ModifyDate:tempInfo.ModifyDate,
          PayDateUnit: values.payDateUnit,
          //PeriodUnit:tempInfo.periodUnit,
          //UseInOrOut:tempInfo.useInOrOut,
          AccBillDateFixed: values.accBillDateFixed,
          //AccRightBaseUnit:tempInfo.accRightBaseUnit,
          //CopeUserName:tempInfo.copeUserName,
          DelayType: values.delayType,
          FeePrice: values.feePrice,
          IsInContract: infoDetail.isInContract ? true : false,
          LateStartDateFixed: values.lateStartDateFixed,
          //ModifyUserId:tempInfo.ModifyUserId,
          PayDeadlineBase: values.payDeadlineBase,
          PriceId: values.priceId,
          //UseRebate:tempInfo.useRebate,
        };
        HouseSaveForm(newvalue).then(res => {
          reload();
          closeModal();
        });
      }
    });
  };
  const getInfo = id => {
    if (id) {
      return GetHouseFormJson(id).then(res => {
        const { unitData, allName } = res || ({} as any);
        let info = {
          ...unitData,
          allName,
        };

        //设置状态
        if (info.accBillDateUnit == 2) {
          setAccFixedDisabled(false);
        }
        if (info.payDeadlineUnit == 2) {
          setPayFixedDisabled(false);
        }
        if (info.lateStartDateUnit == 2) {
          setLateFixedDisabled(false);
        }
        //info.id = feeItem && feeItem.feeItemId;
        return info;
      });
    } else {
      return Promise.resolve({
        parentId: 0,
        type: 1,
      });
    }
  };

  const closeAddFormula = () => {
    setAddFormulaVisible(false);
  }
  const closeSelectHouse = () => {
    setSelectHouseVisible(false);
  }

  const setEndDate = (beginDate: string, cycleValue?: number, cycleType?: string) => {
    var startDate = moment(beginDate);
    var endDate = "";
    if (cycleType == '日') {
      endDate = startDate.add(cycleValue, 'days').add(-1, 'days').format('YYYY-MM-DD');
    } else if (cycleType == '月') {
      endDate = startDate.add(cycleValue, 'month').add(-1, 'days').format('YYYY-MM-DD');
    } else {
      endDate = startDate.add(cycleValue, 'years').add(-1, 'days').format('YYYY-MM-DD');
    }
    var info = Object.assign({}, infoDetail, { endDate: endDate, cycleValue: cycleValue, cycleType: cycleType });
    setInfoDetail(info);
  }
  //求自然月日期
  const getMonthBeforeFormatAndDay = (num, format, date) => {

    let day = date.get('date');
    let month = date.get('month');
    date.set('month', month + num * 1, 'date', 1); //周期月一号
    //读取日期自动会减一，所以要加一
    let mo = date.get('month') + 1;
    //小月
    if (mo == 4 || mo == 6 || mo == 9 || mo == 11) {
      if (day > 30) {
        day = 30;
      }
    }
    //2月
    else if (mo == 2) {
      //闰年
      if (date.isLeapYear()) {
        if (day > 29) {
          day = 29;
        } else {
          day = 28;
        }
      }
      if (day > 28) {
        day = 28;
      }
    }
    //大月
    else {
      if (day > 31) {
        day = 31;
      }
    }
    date.set('date', day);
    return date;
  };
  //设置结束日期
  const getEndDate = () => {
    const cycle = form.getFieldValue('cycleValue');
    const cycletype = form.getFieldValue('cycleType')
    let d = form.getFieldValue('beginDate');
    if (d != "") {
      let endDate = moment(d);
      if (cycletype == "日") {
        //日
        endDate.set('date', endDate.get('date') + cycle);
      } else if (cycletype == "月") {
        // 月
        endDate = getMonthBeforeFormatAndDay(cycle, "-", endDate);
      } else {
        //年
        endDate.set('year', endDate.get('year') + cycle);
      }
      endDate.set('date', endDate.get('date') - 1);
      return endDate;
    }
    return '';
  };

  return (
    <Modal
      title={title}
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={() => {
        save();
      }}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='800px'
    >
      <Form layout="vertical" hideRequiredMark>
        <Tabs defaultActiveKey="1" >
          <TabPane tab="基本信息" key="1">
            <Card className={styles.card} >
              <Row gutter={24}>
                <Col lg={12}>
                  <Form.Item label="费项名称" required>
                    {getFieldDecorator('feeItemId', {
                      initialValue: infoDetail.feeItemId,
                      rules: [{ required: true, message: '请输入费项名称' }],
                    })(
                      <Select
                        placeholder="请选择费项名称"
                      >
                        {feeitems.map(item => (
                          <Option key={item.value} value={item.value}>
                            {item.title}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col lg={12}>
                  <Form.Item label="关联收费项目" >
                    {getFieldDecorator('linkFee', {
                      initialValue: infoDetail.linkFee,
                    })(
                      <Select
                        placeholder="请选择关联收费项目"
                        disabled={linkFeeDisable}
                      >
                        {feeitems.map(item => (
                          <Option key={item.value} value={item.value}>
                            {item.title}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={12}>
                  <Form.Item label="房屋名称" required>
                    {getFieldDecorator('allName', {
                      initialValue: infoDetail.allName,
                      rules: [{ required: true, message: '请选择房屋' }],
                    })(
                      <Input addonAfter={<Icon type="setting" onClick={() => {
                        setSelectHouseVisible(true);
                      }} />} />
                    )}
                  </Form.Item>
                </Col>
                <Col lg={12}>
                  <Form.Item label="房屋编号" >
                    {getFieldDecorator('unitId', {
                      initialValue: infoDetail.unitId,
                    })(
                      <Input disabled={true} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={12}>
                  <Form.Item label="单价">
                    {getFieldDecorator('feePrice', {
                      initialValue: infoDetail.feePrice,
                      rules: [{ required: true, message: '请输入单价' }],
                    })(<Input placeholder="请输入单价" />)}
                  </Form.Item>
                </Col>
                <Col lg={7}>
                  <Form.Item label="计费周期">
                    {getFieldDecorator('cycleValue', {
                      initialValue: infoDetail.cycleValue,
                      rules: [{ required: true, message: '请输入计费周期' }],
                    })(<InputNumber style={{ width: '100%' }} placeholder="请输入计费周期"
                      onChange={value => {
                        setEndDate(infoDetail.beginDate, value, infoDetail.cycleType);
                      }} />)}
                  </Form.Item>
                </Col>
                <Col lg={5}>
                  <Form.Item label="&nbsp;">
                    {getFieldDecorator('cycleType', {
                      initialValue: infoDetail.cycleType,
                      rules: [{ required: true, message: '请选择单位' }],
                    })(<Select placeholder="请选择单位" onChange={(value: string) => {
                      setEndDate(infoDetail.beginDate, infoDetail.cycleValue, value);
                    }}>
                      <Option value="日">日</Option>
                      <Option value="月" >月</Option>
                      <Option value="年">年</Option>
                    </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={12}>
                  <Form.Item label="计费起始日期">
                    {getFieldDecorator('beginDate', {
                      initialValue: infoDetail.beginDate
                        ? moment(new Date(infoDetail.beginDate))
                        : moment(new Date()),
                      rules: [{ required: true, message: '请选择计费起始日期' }],
                    })(<DatePicker placeholder="请选择计费起始日期" style={{ width: '100%' }} onChange={(date, dateString) => {
                      setEndDate(dateString, infoDetail.cycleValue, infoDetail.cycleType);
                    }} />)}
                  </Form.Item>
                </Col>
                <Col lg={12}>
                  <Form.Item label="计费终止日期">
                    {getFieldDecorator('endDate', {
                      initialValue: infoDetail.endDate
                        ? moment(new Date(infoDetail.endDate))
                        : moment(getEndDate()),
                      rules: [{ required: true, message: '计费终止日期' }],
                    })(<DatePicker disabled={true} placeholder="计费终止日期" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={24}>
                  <Form.Item  >
                    {/* <Checkbox checked={infoDetail.isNullDate ? true : false} onChange={(e) => {
                      var info = Object.assign({}, infoDetail, { isNullDate: e.target.checked });
                      setInfoDetail(info);
                    }}>起止日期不允许为空</Checkbox>
                    <Checkbox checked={infoDetail.isModifyDate ? true : false} onChange={(e) => {
                      var info = Object.assign({}, infoDetail, { isModifyDate: e.target.checked });
                      setInfoDetail(info);
                    }} >允许修改起止日期</Checkbox>
                    <Checkbox checked={infoDetail.isInContract ? true : false} onChange={(e) => {
                      var info = Object.assign({}, infoDetail, { isInContract: e.target.checked });
                      setInfoDetail(info);
                    }}>允许在合同中添加</Checkbox>
                    <Checkbox checked={infoDetail.isTax ? true : false} onChange={(e) => {
                      var info = Object.assign({}, infoDetail, { isTax: e.target.checked });
                      setInfoDetail(info);
                    }}>含税单价</Checkbox>
                    <Checkbox checked={infoDetail.isCancel ? true : false} onChange={(e) => {
                      var info = Object.assign({}, infoDetail, { isCancel: e.target.checked });
                      setInfoDetail(info);
                    }}>减免费项</Checkbox> */}

                    {getFieldDecorator('isNullDate', {
                      initialValue: infoDetail.isNullDate ? true : false,
                    })(<Checkbox checked={form.getFieldValue('isNullDate')}>
                      起止日期允许为空
                      </Checkbox>
                    )}
                    {getFieldDecorator('isModifyDate', {
                      initialValue: infoDetail.isModifyDate ? true : false,
                    })(<Checkbox checked={form.getFieldValue('isModifyDate')}>
                      允许修改起止日期
                      </Checkbox>
                    )}
                    {getFieldDecorator('isCustomizeDate', {
                      initialValue: infoDetail.isCustomizeDate ? true : false,
                    })(<Checkbox checked={form.getFieldValue('isCustomizeDate')}>
                      自定义起止日期
                      </Checkbox>
                    )}
                    {getFieldDecorator('isTax', {
                      initialValue: infoDetail.isTax ? true : false,
                    })(<Checkbox checked={form.getFieldValue('isTax')}>
                      含税单价
                      </Checkbox>
                    )}
                    {getFieldDecorator('isCancel', {
                      initialValue: infoDetail.isCancel ? true : false,
                    })(<Checkbox checked={form.getFieldValue('isCancel')} onChange={(e) => {
                      if (e.target.checked) {
                        setLinkFeeDisable(false);
                      } else {
                        setLinkFeeDisable(true);
                      }
                    }}>
                      减免费项
                      </Checkbox>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={24}>
                  <Form.Item  >
                    {/* <Checkbox checked={infoDetail.isTemp ? true : false} onChange={(e) => {
                      var info = Object.assign({}, infoDetail, { isTemp: e.target.checked });
                      setInfoDetail(info);
                    }}>不允许临时加费</Checkbox>
                    <Checkbox checked={infoDetail.isEditTemp ? true : false} onChange={(e) => {
                      var info = Object.assign({}, infoDetail, { isEditTemp: e.target.checked });
                      setInfoDetail(info);
                    }}>临时加费不允许修改单价</Checkbox>
                    <Checkbox checked={infoDetail.isCustomizeDate ? true : false} onChange={(e) => {
                      var info = Object.assign({}, infoDetail, { isCustomizeDate: e.target.checked });
                      setInfoDetail(info);
                    }}>自定义起止日期</Checkbox>
                    <Checkbox checked={infoDetail.isEnable ? true : false} onChange={(e) => {
                      var info = Object.assign({}, infoDetail, { isEnable: e.target.checked });
                      setInfoDetail(info);
                    }}>是否停用</Checkbox> */}

                    {getFieldDecorator('isInContract', {
                      initialValue: infoDetail.isInContract ? true : false,
                    })(<Checkbox checked={form.getFieldValue('isInContract')}>
                      允许在合同中添加
                      </Checkbox>
                    )}
                    {getFieldDecorator('isTemp', {
                      initialValue: infoDetail.isTemp ? true : false,
                    })(<Checkbox checked={form.getFieldValue('isTemp')}>
                      允许临时加费
                      </Checkbox>
                    )}
                    {getFieldDecorator('isEditTemp', {
                      initialValue: infoDetail.isEditTemp ? true : false,
                    })(<Checkbox checked={form.getFieldValue('isEditTemp')}>
                      临时加费允许修改单价
                      </Checkbox>
                    )}
                    {getFieldDecorator('isEnable', {
                      initialValue: infoDetail.isEnable ? true : false,
                    })(<Checkbox checked={form.getFieldValue('isEnable')}>
                      是否启用
                      </Checkbox>
                    )}

                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={21}>
                  <Form.Item label="用量公式">
                    {getFieldDecorator('feeFormulaOne', {
                      initialValue: infoDetail.feeFormulaOne,
                      rules: [{ required: true, message: '请设置用量公式' }],
                    })(<Input placeholder="请设置用量公式" />)}
                  </Form.Item>
                </Col>
                <Col lg={3}>
                  <Form.Item label="&nbsp;">
                    <Button type="primary" onClick={() => {
                      setAddFormulaVisible(true);
                      setIsFormula(true);
                    }}>设置</Button>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={21}>
                  <Form.Item label="系数公式">
                    {getFieldDecorator('feeApportion', {
                      initialValue: infoDetail.feeApportion,
                      rules: [{ required: true, message: '请设置系数公式' }],
                    })(<Input placeholder="请设置系数公式" />)}
                  </Form.Item>
                </Col>
                <Col lg={3}>
                  <Form.Item label="&nbsp;">
                    <Button type="primary" onClick={() => {
                      setAddFormulaVisible(true);
                      setIsFormula(false);
                    }}>设置</Button>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={12}>
                  <Form.Item label="滞纳金比例(%)">
                    {getFieldDecorator('delayRate', {
                      initialValue: infoDetail.delayRate,
                    })(<Input placeholder="请输入滞纳金比例" />)}
                  </Form.Item>
                </Col>
                <Col lg={12}>
                  <Form.Item label="计算方法">
                    {getFieldDecorator('delayType', { 
                      initialValue: infoDetail.delayType ? infoDetail.delayType : 1,
                    })(
                      <Select placeholder="选择滞纳金计算方式">
                        <Option value={1}>按天计算（固定滞纳率）</Option>
                        <Option value={2}>按月计算（固定滞纳率）</Option>
                        <Option value={3}>按季计算（固定滞纳率）</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col lg={24}>
                  <Form.Item label="附加说明">
                    {getFieldDecorator('memo', {
                      initialValue: infoDetail.memo,
                    })(<TextArea rows={6} placeholder="请输入附加说明" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </TabPane>
          <TabPane tab="高级" key="2">
            <Card title="小数精度"  >
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
                      initialValue: infoDetail.calcPrecisionMode ? infoDetail.calcPrecisionMode : "最终计算结果保留2位",
                    })(<Select>
                      <Option value="最终计算结果保留2位" >最终计算结果保留2位</Option>
                      <Option value="每步计算结果保留2位" >每步计算结果保留2位</Option>
                    </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>

              {/* <Row gutter={24}>
                <Col lg={12}>
                  <Form.Item label="中间每一步计算结果保留">
                    {getFieldDecorator('midResultScale', {
                      initialValue: infoDetail.midResultScale,
                    })( 
                      <Select placeholder="请选择单位">
                        <Option value="0">0</Option>
                        <Option value="1" >1</Option>
                        <Option value="2">2</Option>
                        <Option value="3" >3</Option>
                        <Option value="4">4</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col lg={12}>
                  <Form.Item label="对最后一位">
                    {getFieldDecorator('midScaleDispose', {
                      initialValue: infoDetail.midScaleDispose,
                    })(
                      <Select placeholder="请选择小数处理方法">
                        <Option value="0">四舍五入</Option>
                        <Option value="1" >直接舍去</Option>
                        <Option value="2">有数进一</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row> 
              <Row gutter={24}>
                <Col lg={12}>
                  <Form.Item label="最终结果保留小数位数">
                    {getFieldDecorator('lastResultScale', {
                      initialValue: infoDetail.lastResultScale,
                    })(
                      <Select placeholder="请选择单位">
                        <Option value="0">0</Option>
                        <Option value="1" >1</Option>
                        <Option value="2">2</Option>
                        <Option value="3" >3</Option>
                        <Option value="4">4</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col lg={12}>
                  <Form.Item label="对最后一位">
                    {getFieldDecorator('lastScaleDispose', {
                      initialValue: infoDetail.lastScaleDispose,
                    })(
                      <Select placeholder="请选择小数处理方法">
                        <Option value="0">四舍五入</Option>
                        <Option value="1" >直接舍去</Option>
                        <Option value="2">有数进一</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row> */}
            </Card>
            <Card title="账单日设置"  >
              <Row gutter={8}>
                <Col span={6}>
                  <Form.Item label="应收期间 距">
                    {getFieldDecorator('accPeriodBase', {
                      initialValue: infoDetail.accPeriodBase,//? infoDetail.accPeriodBase.toString() : "2",
                    })(
                      <Select placeholder="==选择应收期间==">
                        <Option value={1}>同一季度费用,每季度首月为应收期间</Option>
                        <Option value={2} >计费起始日期</Option>
                        <Option value={3}>计费终止日期</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={6} style={{ marginTop: '29px' }}>
                  <Form.Item>
                    {getFieldDecorator('accPeriodBaseNum', {
                      initialValue: infoDetail.accPeriodBaseNum ? infoDetail.accPeriodBaseNum : 7,
                    })(
                      <InputNumber style={{ width: '100%' }} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={6} style={{ marginTop: '29px' }}>
                  <Form.Item>
                    {getFieldDecorator('accPeriodBaseUnit', {
                      initialValue: infoDetail.accPeriodBaseUnit,//? infoDetail.accPeriodBaseUnit.toString() : "1",
                    })(
                      <Select placeholder="==选择单位==">
                        <Option value={1}>天</Option>
                        <Option value={2} >月</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={6}>
                  <Form.Item label="账单日 距">
                    {getFieldDecorator('accBillDateBase', {
                      initialValue: infoDetail.accBillDateBase,//? infoDetail.accBillDateBase.toString() : "2",
                    })(
                      <Select placeholder="==选择应收期间==">
                        <Option value={1}>同一季度费用,每季度首月为应收期间</Option>
                        <Option value={2}>计费起始日期</Option>
                        <Option value={3}>计费终止日期</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={6} style={{ marginTop: '29px' }}>
                  <Form.Item>
                    {getFieldDecorator('accBillDateNum', {
                      initialValue: infoDetail.accBillDateNum ? infoDetail.accBillDateNum : 7,
                    })(
                      <InputNumber style={{ width: '100%' }} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={6} style={{ marginTop: '29px' }}>
                  <Form.Item>
                    {getFieldDecorator('accBillDateUnit', {
                      initialValue: infoDetail.accBillDateUnit,// ? infoDetail.accBillDateUnit.toString() : "1",
                    })(
                      <Select placeholder="==选择单位==" onChange={value => {
                        if (value == 1) {
                          setAccFixedDisabled(true);
                        } else {
                          setAccFixedDisabled(false);
                        }
                      }}>
                        <Option value={1}>天</Option>
                        <Option value={2} >月</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={6} style={{ marginTop: '29px' }}>
                  <Form.Item>
                    {getFieldDecorator('accBillDateFixed', {
                      initialValue: infoDetail.accBillDateFixed,
                    })(
                      <Select disabled={accFixedDisabled}>
                        <Option key="1"> 1日</Option>
                        <Option key="2"> 2日</Option>
                        <Option key="3"> 3日</Option>
                        <Option key="4"> 4日</Option>
                        <Option key="5"> 5日</Option>
                        <Option key="6"> 6日</Option>
                        <Option key="7"> 7日</Option>
                        <Option key="8"> 8日</Option>
                        <Option key="9"> 9日</Option>
                        <Option key="10"> 10日</Option>
                        <Option key="11"> 11日</Option>
                        <Option key="12"> 12日</Option>
                        <Option key="13"> 13日</Option>
                        <Option key="14"> 14日</Option>
                        <Option key="15"> 15日</Option>
                        <Option key="16"> 16日</Option>
                        <Option key="17"> 17日</Option>
                        <Option key="18"> 18日</Option>
                        <Option key="19"> 19日</Option>
                        <Option key="20"> 20日</Option>
                        <Option key="21"> 21日</Option>
                        <Option key="22"> 22日</Option>
                        <Option key="23"> 23日</Option>
                        <Option key="24"> 24日</Option>
                        <Option key="25"> 25日</Option>
                        <Option key="26"> 26日</Option>
                        <Option key="27"> 27日</Option>
                        <Option key="28"> 28日</Option>
                        <Option key="29"> 29日</Option>
                        <Option key="30"> 30日</Option>
                        <Option key="31"> 31日</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={6}>
                  <Form.Item label="收款截止日 距">
                    {getFieldDecorator('payDeadlineBase', {
                      initialValue: infoDetail.payDeadlineBase,//? infoDetail.payDeadlineBase.toString() : "2",
                    })(
                      <Select placeholder="==选择应收期间==">
                        <Option value={1}>同一季度费用,每季度首月为应收期间</Option>
                        <Option value={2}>计费起始日期</Option>
                        <Option value={3}>计费终止日期</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={6} style={{ marginTop: '29px' }}>
                  <Form.Item>
                    {getFieldDecorator('payDeadlineNum', {
                      initialValue: infoDetail.payDeadlineNum ? infoDetail.payDeadlineNum : 10,
                    })(
                      <InputNumber style={{ width: '100%' }} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={6} style={{ marginTop: '29px' }}>
                  <Form.Item>
                    {getFieldDecorator('payDeadlineUnit', {
                      initialValue: infoDetail.payDeadlineUnit,//? infoDetail.payDeadlineUnit.toString() : "1",
                    })(
                      <Select placeholder="==选择单位==" onChange={value => {
                        if (value == 1) {
                          setPayFixedDisabled(true);
                        } else {
                          setPayFixedDisabled(false);
                        }
                      }}>
                        <Option value={1}>天</Option>
                        <Option value={2}>月</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={6} style={{ marginTop: '29px' }}>
                  <Form.Item>
                    {getFieldDecorator('payDeadlineFixed', {
                      initialValue: infoDetail.payDeadlineFixed,
                    })(
                      <Select disabled={payFixedDisabled}>
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
                        <Option key="22"> 22日</Option>
                        <Option key="23"> 23日</Option>
                        <Option key="24"> 24日</Option>
                        <Option key="25"> 25日</Option>
                        <Option key="26"> 26日</Option>
                        <Option key="27"> 27日</Option>
                        <Option key="28"> 28日</Option>
                        <Option key="29"> 29日</Option>
                        <Option key="30"> 30日</Option>
                        <Option key="31"> 31日</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={6}>
                  <Form.Item label="滞纳金起算日 距">
                    {getFieldDecorator('lateStartDateBase', {
                      initialValue: infoDetail.lateStartDateBase,//? infoDetail.lateStartDateBase.toString() : "2",
                    })(
                      <Select placeholder="==选择应收期间==">
                        <Option value={1}>同一季度费用,每季度首月为应收期间</Option>
                        <Option value={2}>计费起始日期</Option>
                        <Option value={3}>计费终止日期</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={6} style={{ marginTop: '29px' }}>
                  <Form.Item>
                    {getFieldDecorator('lateStartDateNum', {
                      initialValue: infoDetail.lateStartDateNum ? infoDetail.lateStartDateNum : 10,
                    })(
                      <InputNumber style={{ width: '100%' }} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={6} style={{ marginTop: '29px' }}>
                  <Form.Item>
                    {getFieldDecorator('lateStartDateUnit', {
                      initialValue: infoDetail.lateStartDateUnit,//? infoDetail.lateStartDateUnit.toString() : "1",
                    })(
                      <Select placeholder="==选择单位==" onChange={value => {
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
                <Col span={6} style={{ marginTop: '29px' }}>
                  <Form.Item>
                    {getFieldDecorator('lateStartDateFixed', {
                      initialValue: infoDetail.lateStartDateFixed,
                    })(
                      <Select disabled={lateFixedDisabled}>
                        <Option key="1"> 1日</Option>
                        <Option key="2"> 2日</Option>
                        <Option key="3"> 3日</Option>
                        <Option key="4"> 4日</Option>
                        <Option key="5"> 5日</Option>
                        <Option key="6"> 6日</Option>
                        <Option key="7"> 7日</Option>
                        <Option key="8"> 8日</Option>
                        <Option key="9"> 9日</Option>
                        <Option key="10"> 10日</Option>
                        <Option key="11"> 11日</Option>
                        <Option key="12"> 12日</Option>
                        <Option key="13"> 13日</Option>
                        <Option key="14"> 14日</Option>
                        <Option key="15"> 15日</Option>
                        <Option key="16"> 16日</Option>
                        <Option key="17"> 17日</Option>
                        <Option key="18"> 18日</Option>
                        <Option key="19"> 19日</Option>
                        <Option key="20"> 20日</Option>
                        <Option key="21"> 21日</Option>
                        <Option key="22"> 22日</Option>
                        <Option key="23"> 23日</Option>
                        <Option key="24"> 24日</Option>
                        <Option key="25"> 25日</Option>
                        <Option key="26"> 26日</Option>
                        <Option key="27"> 27日</Option>
                        <Option key="28"> 28日</Option>
                        <Option key="29"> 29日</Option>
                        <Option key="30"> 30日</Option>
                        <Option key="31"> 31日</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Card title="其他">
              <Row gutter={8}>
                <Col span={6} style={{ marginTop: '29px' }}>
                  <Form.Item>
                    {getFieldDecorator('payedCreateCope', {
                      initialValue: infoDetail.payedCreateCope,
                    })(
                      <Checkbox onChange={(e) => {
                        if (e.target.checked) {
                          setShowFeeField(true);
                          var info = Object.assign({}, infoDetail, { payedCreateCope: e.target.checked })
                          setInfoDetail(info);
                        } else {
                          setShowFeeField(false);
                          var info = Object.assign({}, infoDetail, { payedCreateCope: e.target.checked, payDateUnit: null, payDateNum: null })
                          setInfoDetail(info);
                        }
                      }}>收款后生成付款</Checkbox>
                    )}
                  </Form.Item>
                </Col>
                <Col span={6} style={{ marginTop: '29px' }}>
                  <Form.Item >
                    {getFieldDecorator('payFeeItemId', {
                      initialValue: infoDetail.payFeeItemId,
                    })(
                      <Select placeholder="==应付款项==">
                        {feeItemNames.map(item => (
                          <Option value={item.key} key={item.key}>
                            {item.title}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={6} >
                  <Form.Item label="应付比例（100%）">
                    {getFieldDecorator('copeRate', {
                      initialValue: infoDetail.copeRate ? infoDetail.copeRate : 100,
                    })(
                      <InputNumber style={{ width: '100%' }} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={6} style={{ marginTop: '29px' }}>
                  <Form.Item>
                    {getFieldDecorator('tdCopeUser', {
                      initialValue: infoDetail.tdCopeUser,
                    })(
                      <Select placeholder="==付款对象==">
                        <Option value={1}>业主</Option>
                        <Option value={2}>住/租户</Option>
                        <Option value={3}>住/租户，空置时转给业主</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8} style={{ display: showFeeField ? "" : "none" }}>
                <Col span={6}>
                  <Form.Item label="应付期间距收款日">
                    {getFieldDecorator('payDateNum', {
                      initialValue: infoDetail.payDateNum,
                    })(
                      <InputNumber />
                    )}
                  </Form.Item>
                </Col>
                <Col span={6} style={{ marginTop: '29px' }}>
                  <Form.Item>
                    {getFieldDecorator('payDateUnit', {
                      initialValue: infoDetail.payDateUnit,
                    })(
                      <Select placeholder="==请选择单位==">
                         <Option value={1}>天</Option>
                          <Option value={2}>月</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </TabPane>
        </Tabs>
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
          }}
        >
          <Button onClick={close} style={{ marginRight: 8 }}>
            取消
        </Button>
          <Button onClick={save} type="primary">
            提交
        </Button>
        </div>
      </Form>
      <AddFormula
        visible={addFormulaVisible}
        closeModal={closeAddFormula}
        getFormulaStr={(str, isFormula) => {
          if (isFormula) {
            var info = Object.assign({}, infoDetail, { feeFormulaOne: str });
            setInfoDetail(info);
          } else {
            var info = Object.assign({}, infoDetail, { feeApportion: str });
            setInfoDetail(info);
          }
        }}
        isFormula={isFormula}
      />
      <SelectHouse
        visible={selectHouseVisible}
        closeModal={closeSelectHouse}
        getSelectTree={(info) => {
          console.log(info);
          var newInfo = Object.assign({}, infoDetail, { allName: info.allname, unitId: info.key })
          setInfoDetail(newInfo);
        }}
      />
    </Modal>
  );
};

export default Form.create<EditHouseFeeProps>()(EditHouseFee);

