
//租期条款动态组件，编辑
import { ChargeFeeDetailDTO } from '@/model/models';
import { Modal, List, Tooltip, Input, Icon, DatePicker, Button, InputNumber, Select, Card, Col, Row, Form } from 'antd';
import React, { useState } from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import SelectHouse from './SelectHouse';
import styles from './style.less';
import moment from 'moment';
const { Option } = Select;

interface LeaseTermModifyProps {
  form: WrappedFormUtils;
  // feeItems: TreeEntity[];
  // chargeFeeList: HtLeasecontractchargefee[]; 
  chargeFeeList: ChargeFeeDetailDTO[];
}

//动态数量
let index = 1;
function LeaseTermModify(props: LeaseTermModifyProps) {
  const { form, chargeFeeList } = props;
  const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
  const [priceUnit, setPriceUnit] = useState<string>("元/m²·天");//单价单位

  const [mychargeFeeList, setMyChargeFeeList] = useState<ChargeFeeDetailDTO[]>(chargeFeeList);

  //单位切换
  const changeUnit = value => {
    setPriceUnit(value);
  };

  const closeSelectHouse = () => {
    setSelectHouseVisible(false);
  }

  const remove = k => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要删除条款${k + 1}？`,
      onOk: () => {
        const keys = getFieldValue('LeaseTerms');
        setFieldsValue({
          LeaseTerms: keys.filter(key => key !== k),
        });
        index--;
      },
    });
  };

  const add = () => {
    const keys = getFieldValue('LeaseTerms');
    const nextKeys = keys.concat(index++);
    setFieldsValue({
      LeaseTerms: nextKeys,
    });
  };

  //费项选择
  const changeFee = (value, option, index) => {
    //更新费项id和name
    // option._owner.pendingProps.chargeFeeList[index].feeItemName = option.props.children;
    // option._owner.pendingProps.chargeFeeList[index].feeItemId = value;
    // form.setFieldsValue({ feeItemName: option.props.children });
    form.setFieldsValue({
      ['feeItemName[' + index + ']']
        : option.props.children
    });
  };

  // const [feeItems, setFeeItems] = useState<TreeEntity[]>([]);
  const [selectHouseVisible, setSelectHouseVisible] = useState<boolean>(false);
  const [roomIndex, setRoomIndex] = useState<number>(0);
  const [houseList, setHouseList] = useState<any[]>([]);//房屋列表

  //初始化 租赁条款 
  getFieldDecorator('LeaseTerms', { initialValue: mychargeFeeList });
  const keys = getFieldValue('LeaseTerms');
  const formItems = keys.map((k: ChargeFeeDetailDTO, index) =>
    (
      <Card hoverable key={index} className={styles.card} title={index == 0 ? '租期条款' : ''}
        extra={index > 0 ? <Icon type="minus-circle-o" onClick={() => remove(index)} /> : null}>
        <Row gutter={24}>
          <Col lg={24}>
            <Form.Item required>
              {getFieldDecorator(`rooms[${index}]`, {
                initialValue: k.rooms,
                rules: [{ required: true, message: '请选择房源' }],
              })(
                // <Input
                //   onChange={e => { 
                //   }}
                //   allowClear={true}
                //   addonAfter={<Icon type="setting" onClick={() => {
                //     setSelectHouseVisible(true);
                //     // setRoomIndex(0);
                //   }} />} />

                <List
                  header={<a
                    onClick={() => {
                      setSelectHouseVisible(true);
                      setRoomIndex(index);
                    }}

                  >房源选择 </a>}
                  bordered
                  dataSource={k.rooms}
                  renderItem={item =>
                    <List.Item
                      actions={[<a key="list-loadmore-remove"
                        onClick={(e) => {
                          Modal.confirm({
                            title: '删除房源',
                            content: '确定删除该房源吗？',
                            okText: '确认',
                            cancelText: '取消',
                            onOk: () => {
                              // var index = houseList.indexOf(item);
                              // houseList.splice(index, 1);
                              // setHouseList([...houseList]);//必须展开

                              var index = chargeFeeList[0].rooms.indexOf(item);
                              chargeFeeList[0].rooms.splice(index, 1);
                              if (chargeFeeList[0].rooms.length == 0) {
                                chargeFeeList[0].feeItems = [];//清空费项

                                form.setFieldsValue({
                                  ['rooms[0]']
                                    : []
                                });

                                form.setFieldsValue({
                                  ['feeItemId[0]']
                                    : null
                                });

                                form.setFieldsValue({
                                  ['price[0]']
                                    : null
                                });
                              }
                              setMyChargeFeeList([...chargeFeeList]);//必须展开   
                            }
                          });
                        }}

                      >移除</a>]}  >
                      <List.Item.Meta title={item.allName} />
                      <div>{item.area}㎡</div>
                    </List.Item>
                  }
                />

              )}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col lg={4}>
            <Form.Item label="开始时间" required >
              {getFieldDecorator(`chargeStartDate[${index}]`, {
                initialValue: k.chargeFee.chargeStartDate
                  ? moment(new Date(k.chargeFee.chargeStartDate))
                  : moment(new Date()),
                rules: [{ required: true, message: '请选择' }],
              })(<DatePicker placeholder='请选择'
                disabledDate={(currentDate) => {
                  return currentDate && (
                    currentDate.isBefore(moment(form.getFieldValue(`startDate`)), 'day') ||
                    currentDate.isAfter(moment(form.getFieldValue(`endDate`)), 'day')
                  ) ? true : false;
                }}
              />)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="结束时间" required>
              {getFieldDecorator(`chargeEndDate[${index}]`, {
                initialValue: k.chargeFee.chargeEndDate
                  ? moment(new Date(k.chargeFee.chargeEndDate))
                  : moment(new Date()),
                rules: [{ required: true, message: '请选择' }],
              })(<DatePicker placeholder='请选择'
                disabledDate={(currentDate) => {
                  return currentDate && (
                    currentDate.isBefore(moment(form.getFieldValue(`startDate`)), 'day') ||
                    currentDate.isAfter(moment(form.getFieldValue(`endDate`)), 'day')
                  ) ? true : false;
                }} />)}
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item label="关联费项" required>
              {getFieldDecorator(`feeItemId[${index}]`, {
                initialValue: k.chargeFee.feeItemId,
                rules: [{ required: true, message: '请选择费项' }]
              })(
                <Select placeholder="请选择费项"
                  onChange={(value, option) => changeFee(value, option, index)}
                >
                  {k.feeItems.map(item => (
                    <Option value={item.value} >
                      {item.title}
                    </Option>
                  ))}
                </Select>
              )}
              {getFieldDecorator(`feeItemName[${index}]`, {
                initialValue: k.chargeFee.feeItemName,
              })(
                <input type='hidden' />
              )}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="单价" required>
              {getFieldDecorator(`price[${index}]`, {
                initialValue: k.chargeFee.price,
                rules: [{ required: true, message: '请输入单价' }],
              })(<InputNumber placeholder="请输入单价" style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="&nbsp;">
              {getFieldDecorator(`priceUnit[${index}]`, {
                initialValue: k.chargeFee.priceUnit ? k.chargeFee.priceUnit : '元/m²·天'
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
            <Form.Item label={<div>计费类型 <Tooltip
              overlayStyle={{ maxWidth: 'none' }}
              title={<span>
                1、天单价=实际输入天单价 或者 月单价*12/年天数 或者 月单价/自然月天数<br />
            2、月单价=实际输入月单价 或者 天单价*年天数/12<br />
            3、总价=（月单价*月数*面积）+（天单价*实际天数*面积）<br />
            4、以天记租时没有月数，即套用公式3计算，其中月数为0计算<br />
            5、以月记租时，整月按公式3第一项计算，余下的天数按照公式3的第二项计算</span>}>
              <Icon type="question-circle" /></Tooltip></div>}>
              {getFieldDecorator(`billType[${index}]`, {
                initialValue: k.chargeFee.billType ? k.chargeFee.billType : '按月计费'
              })(
                <Select>
                  <Option value="按实际天数计费">按实际天数计费</Option>
                  <Option value="按月计费" >按月计费</Option>
                </Select>)}
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
              {getFieldDecorator(`dayPriceConvertRule[${index}]`, {
                initialValue: k.chargeFee.dayPriceConvertRule ? k.chargeFee.dayPriceConvertRule : '按年换算',
              })(
                <Select
                  disabled={!(priceUnit != "元/m²·天" && priceUnit != "元/天")}>
                  <Option value="按自然月换算">按自然月换算</Option>
                  <Option value="按年换算" >按年换算</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          {/* {
            (priceUnit == "元/m²·天" || priceUnit == "元/天") ?
              <Col lg={4}>
                <Form.Item label="天单价换算规则">
                  {getFieldDecorator(`dayPriceConvertRule[${index}]`, {
                    initialValue: k.dayPriceConvertRule ? k.dayPriceConvertRule : '按年换算',
                  })(
                    <Select>
                      <Option value="按自然月换算">按自然月换算</Option>
                      <Option value="按年换算" >按年换算</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              : null} */}

          <Col lg={4}>
            <Form.Item label={<div>年天数 <Tooltip title="指一年按多少天来计算">
              <Icon type="question-circle" /></Tooltip></div>}>
              {getFieldDecorator(`yearDays[${index}]`, {
                initialValue: k.chargeFee.yearDays ? k.chargeFee.yearDays : 365,
                rules: [{ required: true, message: '请输入年天数' }],
              })(<InputNumber placeholder="请输入年天数" style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="付款周期（月）" required>
              {getFieldDecorator(`payCycle[${index}]`, {
                initialValue: k.chargeFee.payCycle,
                rules: [{ required: true, message: '请填写付款周期' }]
              })(
                <InputNumber placeholder="请填写付款周期" style={{ width: '100%' }} />
              )}
            </Form.Item>
          </Col>

          <Col lg={4}>
            <Form.Item label="提前付款时间">
              {getFieldDecorator(`advancePayTime[${index}]`, {
                initialValue: k.chargeFee.advancePayTime ? k.chargeFee.advancePayTime : 1,
                rules: [{ required: true, message: '请输入提前付款时间' }],
              })(<InputNumber placeholder="请输入" style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="&nbsp;">
              {getFieldDecorator(`advancePayTimeUnit[${index}]`, {
                initialValue: k.chargeFee.advancePayTimeUnit ? k.chargeFee.advancePayTimeUnit : '工作日'
              })(
                <Select>
                  <Option value="工作日">工作日</Option>
                  <Option value="自然日" >自然日</Option>
                  <Option value="指定日期" >指定日期</Option>
                </Select>)}
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item label={<div>租期划分方式 <Tooltip
              overlayStyle={{ maxWidth: 'none' }}
              title={<span>
                按起始日划分<br />
              按自然月划分(首月非整自然月划入第一期)<br />
              按自然月划分(首月非整自然月算一个月)
            </span>}>
              <Icon type="question-circle" />
            </Tooltip></div>}>
              {getFieldDecorator(`rentalPeriodDivided[${index}]`, {
                initialValue: k.chargeFee.rentalPeriodDivided ? k.chargeFee.rentalPeriodDivided : '按起始日划分'
              })(
                <Select>
                  <Option value="按起始日划分">按起始日划分</Option>
                  <Option value="按自然月划分(首月非整自然月划入第一期)">按自然月划分(首月非整自然月划入第一期)</Option>
                  <Option value="按自然月划分(首月非整自然月算一个月)">按自然月划分(首月非整自然月算一个月)</Option>
                </Select>)}
            </Form.Item>
          </Col>

          <Col lg={4}>
            <Form.Item label="递增时间点"  >
              {getFieldDecorator(`increStartDate[${index}]`, {
                initialValue: k.chargeFee.increStartDate
                  ? moment(new Date(k.chargeFee.increStartDate))
                  : null,
                // rules: [{ required: true, message: '请选择' }],
              })(<DatePicker placeholder='请选择' />)}
            </Form.Item>
          </Col>
          {/* <Col lg={4}>
            <Form.Item label="递增结束时间" >
              {getFieldDecorator(`increEndDate[${index}]`, {
                initialValue: k.increEndDate
                  ? moment(new Date(k.increEndDate))
                  : null,
                // rules: [{ required: true, message: '请选择' }],
              })(<DatePicker placeholder='请选择' />)}
            </Form.Item>
          </Col> */}

          <Col lg={4}>
            <Form.Item label="递增间隔（月）">
              {getFieldDecorator(`increGap[${index}]`, {
                initialValue: k.chargeFee.increGap,
                rules: [{ required: form.getFieldValue(`increStartDate[${index}]`), message: '请输入' }],
              })(<InputNumber placeholder='请输入' style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>

          <Col lg={4}>
            <Form.Item label="单价递增" >
              {getFieldDecorator(`increPrice[${index}]`, {
                initialValue: k.chargeFee.increPrice,
                rules: [{ required: form.getFieldValue(`increStartDate[${index}]`), message: '请输入' }],
              })(
                <InputNumber placeholder="请输入" style={{ width: '100%' }} />
              )}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="&nbsp;">
              {getFieldDecorator(`increPriceUnit[${index}]`, {
                rules: [{ required: form.getFieldValue(`increStartDate[${index}]`), message: '请选择单位' }],
              })(
                <Select placeholder="请选择" allowClear  >
                  <Option value="%">%</Option>
                  <Option value="元" >元</Option>
                </Select>)}
            </Form.Item>
          </Col>
          {/* <Col lg={4}>
            <Form.Item label="优惠类型" >
              {getFieldDecorator(`rebateType[${index}]`, {
                initialValue: k.rebateType,
              })(<Select placeholder="请选择"
                allowClear>
                <Option value="免租期">免租期</Option>
                <Option value="装修期">装修期</Option>
                <Option value="单价折扣">单价折扣</Option>
                <Option value="减免金额">减免金额</Option>
                <Option value="单价减免">单价减免</Option>
              </Select>)}
            </Form.Item>
          </Col> */}
          <Col lg={4}>
            <Form.Item label="免租期开始" >
              {getFieldDecorator(`rebateStartDate[${index}]`, {
                initialValue: k.chargeFee.rebateStartDate
                  ? moment(new Date(k.chargeFee.rebateStartDate))
                  : null,
              })(<DatePicker placeholder="请选择"
                disabledDate={(currentDate) => {
                  return currentDate && (
                    currentDate.isBefore(moment(form.getFieldValue(`chargeStartDate[${index}]`)), 'day') ||
                    currentDate.isAfter(moment(form.getFieldValue(`chargeEndDate[${index}]`)), 'day')
                  ) ? true : false;
                }}
              />)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="免租期结束" >
              {getFieldDecorator(`rebateEndDate[${index}]`, {
                initialValue: k.chargeFee.rebateEndDate
                  ? moment(new Date(k.chargeFee.rebateEndDate))
                  : null,
              })(<DatePicker placeholder="请选择"
                disabledDate={(currentDate) => {
                  return currentDate && (
                    currentDate.isBefore(moment(form.getFieldValue(`chargeStartDate[${index}]`)), 'day') ||
                    currentDate.isAfter(moment(form.getFieldValue(`chargeEndDate[${index}]`)), 'day')
                  ) ? true : false;
                }}
              />)}
            </Form.Item>
          </Col>
          {/* <Col lg={4}>
            <Form.Item label="开始期数" >
              {getFieldDecorator(`startPeriod[${index}]`, {
                initialValue: k.startPeriod,
                rules: [{ required: form.getFieldValue(`rebateType[${index}]`), message: '请输入' }],
              })(<InputNumber placeholder="请输入" style={{ width: '100%' }} disabled={!form.getFieldValue(`rebateType[${index}]`)} />)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="期长" >
              {getFieldDecorator(`periodLength[${index}]`, {
                initialValue: k.periodLength,
                rules: [{ required: form.getFieldValue(`rebateType[${index}]`), message: '请输入期长' }],
              })(<InputNumber placeholder="请输入期长" style={{ width: '100%' }} disabled={!form.getFieldValue(`rebateType[${index}]`)} />)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="折扣" >
              {getFieldDecorator(`discount[${index}]`, {
                initialValue: k.discount,
                rules: [{ required: form.getFieldValue(`rebateType[${index}]`), message: '请输入折扣' }],
              })(<InputNumber placeholder="请输入折扣" style={{ width: '100%' }} disabled={!form.getFieldValue(`rebateType[${index}]`)} />)}
            </Form.Item>
          </Col> */}
          <Col lg={16}>
            <Form.Item label="优惠备注" >
              {getFieldDecorator(`rebateRemark[${index}]`, {
                initialValue: k.chargeFee.rebateRemark,
                //rules: [{ required: true, message: '请输入备注' }],
              })(<Input placeholder="请输入优惠备注" />)}
            </Form.Item>
          </Col>
        </Row>
      </Card>
    ));

  return (
    <div style={{ marginBottom: '10px' }}  >
      {formItems}
      <Button type="dashed" onClick={add}>
        <Icon type="plus" />添加租期条款
          </Button>


      <SelectHouse
        visible={selectHouseVisible}
        closeModal={closeSelectHouse}
        getSelectTree={(res, feeItems) => {

          //临时值
          let items = chargeFeeList.length > 0 ? chargeFeeList :
            [{
              rooms: [],
              feeItems: [],
              chargeFee: {}
            }];

          //追加赋值 
          //去除原队列已存在数据 
          for (var i = 0; i < houseList.length; i++) {
            for (var j = 0; j < res.length; j++) {
              if (res[j].roomId == houseList[i].roomId) {
                res.splice(j, 1);
                j = j - 1;
              }
            }
          }

          // var list = [...houseList, ...res];
          // setHouseList(list);

          var list = [...items[roomIndex].rooms, ...res];

          form.setFieldsValue({
            ['rooms[' + roomIndex + ']']
              : list
          });

          items[roomIndex].rooms = list;
          items[roomIndex].feeItems = feeItems; //[ { key: 'test', value: 'test', title: 'test' }]; 
          setMyChargeFeeList(items);

          //加载费项
          // GetFeeItemsByUnitId(res[0].id).then(res => {
          //   setFeeItems(res || []);
          // });
        }}
      />

    </div>
  );
}
export default LeaseTermModify;
