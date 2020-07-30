
//租期条款动态组件，新增
import { ChargeFeeDetailDTO } from '@/model/models';
import { Modal, List, Tooltip, Input, InputNumber, Select, DatePicker, Card, Col, Row, Icon, Form, Button } from 'antd';
import React, { useState } from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';

import styles from './style.less';
import moment from 'moment';
import SelectHouse from './SelectHouse';
const { Option } = Select;

interface LeaseTermProps {
  form: WrappedFormUtils;
  // feeItems: any[];//TreeEntity[];
  isValidate: boolean;//是否进行必填项验证  
}

//动态数量
let index = 1;
function LeaseTerm(props: LeaseTermProps) {
  const { form, isValidate } = props;
  const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
  const [priceUnit, setPriceUnit] = useState<string>("元/m²·天");//单价单位
  // const [feeItems, setFeeItems] = useState<TreeEntity[]>([]);

  //单位切换
  const changeUnit = value => {
    setPriceUnit(value);
  };

  //模板中费项选择  
  // const changeFee0 = (value, option, index) => {
  //   form.setFieldsValue({ 'feeItemName[0]': option.props.children });
  // };

  //动态条款里面选择费项
  const changeFee = (value, option, index) => {

    // const keys = getFieldValue('feeItemName'); 
    form.setFieldsValue({
      ['feeItemName[' + index + ']']
        : option.props.title
    });
    //设置房屋里的单价
    form.setFieldsValue({
      ['price[' + index + ']']
        : option.props.attributeA
    });
  };

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

        //删除
        chargeFeeList.splice(k, 1);
        setChargeFeeList([...chargeFeeList]);//必须展开
      },
    });

  };

  const add = () => {

    const keys = getFieldValue('LeaseTerms');
    const nextKeys = keys.concat(index++);
    setFieldsValue({
      LeaseTerms: nextKeys,
    });

    chargeFeeList.push({
      rooms: [],
      feeItems: [],
      chargeFee: {}
    });
    // setChargeFeeList([...chargeFeeList]);
    setChargeFeeList(chargeFeeList);
  };

  const [selectHouseVisible, setSelectHouseVisible] = useState<boolean>(false);
  const [roomIndex, setRoomIndex] = useState<number>(0);
  // const [houseList, setHouseList] = useState<any[]>([]);//房屋列表 
  const [chargeFeeList, setChargeFeeList] = useState<ChargeFeeDetailDTO[]>(
    [{
      rooms: [],
      feeItems: [],
      chargeFee: {}
    }]
  );

  const closeSelectHouse = () => {
    setSelectHouseVisible(false);
  }

  //初始化 租赁条款 
  // getFieldDecorator('LeaseTerms', { initialValue: [] });
  getFieldDecorator('LeaseTerms', { initialValue: [] });
  const keys = getFieldValue('LeaseTerms');
  const formItems = keys.map((k, index) => (


    <Card hoverable key={k} className={styles.card} title={'租期条款' + (index + 2)}
      extra={<Icon type="minus-circle-o" onClick={() => remove(k)} />}>
      <Row gutter={24}>
        <Col lg={24}>
          <Form.Item required>
            {getFieldDecorator(`rooms[${k}]`, {
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
                    setRoomIndex(k);
                  }}
                >房源选择 </a>}
                bordered
                dataSource={chargeFeeList[k] ? chargeFeeList[k].rooms : []}
                renderItem={item =>
                  <List.Item
                    actions={[<a
                      //key="list-loadmore-remove"
                      key={`list-room-remove-${k}`}
                      onClick={(e: any) => {
                        //条款序号  
                        var index = e._targetInst.key.replace('list-room-remove-', '');
                        Modal.confirm({
                          title: '删除房源',
                          content: '确定删除该房源吗？',
                          okText: '确认',
                          cancelText: '取消',
                          onOk: () => {
                            // var index = houseList.indexOf(item);
                            // houseList.splice(index, 1);
                            // setHouseList([...houseList]);//必须展开

                            //要删除的房间序号
                            var roomindex = chargeFeeList[index].rooms.indexOf(item);
                            chargeFeeList[index].rooms.splice(roomindex, 1);
                            if (chargeFeeList[index].rooms.length == 0) {
                              chargeFeeList[index].feeItems = [];//清空费项 
                              form.setFieldsValue({
                                ['rooms[' + index + ']']
                                  : []
                              });

                              form.setFieldsValue({
                                ['feeItemId[' + index + ']']
                                  : null
                              });

                              form.setFieldsValue({
                                ['price[' + index + ']']
                                  : null
                              });
                            }
                            setChargeFeeList([...chargeFeeList]);//必须展开  

                          }
                        });
                      }}
                    >移除</a>]}>

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
            {getFieldDecorator(`chargeStartDate[${k}]`, {
              initialValue: moment(new Date()),
              rules: [{ required: isValidate, message: '请选择' }],
            })(<DatePicker placeholder='请选择'
              disabledDate={(currentDate) => {
                return currentDate && (
                  currentDate.isBefore(moment(form.getFieldValue('startDate')), 'day') ||
                  currentDate.isAfter(moment(form.getFieldValue('endDate')), 'day')
                ) ? true : false;
              }}
            />)}
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label="结束时间" required>
            {getFieldDecorator(`chargeEndDate[${k}]`, {
              initialValue: moment(new Date()).add(1, 'years').add(-1, 'days'),
              rules: [{ required: isValidate, message: '请选择' }],
            })(<DatePicker placeholder='请选择'

              disabledDate={(currentDate) => {
                return currentDate && (
                  currentDate.isBefore(moment(form.getFieldValue('startDate')), 'day') ||
                  currentDate.isAfter(moment(form.getFieldValue('endDate')), 'day')
                ) ? true : false;
              }}

            />)}
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item label="费项" required>
            {getFieldDecorator(`feeItemId[${k}]`, {
              initialValue: null,
              rules: [{ required: isValidate, message: '请选择费项' }]
            })(
              <Select placeholder="请选择费项"
                onChange={(value, option) => changeFee(value, option, k)}  >
                {chargeFeeList[k] ? chargeFeeList[k].feeItems.map(item => (
                  <Option value={item.value} key={item.key}>
                    {item.title}
                  </Option>
                )) : null}
              </Select>
            )}
            {getFieldDecorator(`feeItemName[${k}]`, {
            })(
              <input type='hidden' />
            )}
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label="单价" required>
            {getFieldDecorator(`price[${k}]`, {
              initialValue: null,
              rules: [{ required: isValidate, message: '请输入单价' }],
            })(<InputNumber placeholder="请输入单价" style={{ width: '100%' }} />)}
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label="&nbsp;">
            {getFieldDecorator(`priceUnit[${k}]`, {
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
          <Form.Item label={<div>计费类型 <Tooltip
            overlayStyle={{ maxWidth: 'none' }}
            title={<span>
              1、天单价=实际输入天单价 或者 月单价*12/年天数 或者 月单价/自然月天数<br />
            2、月单价=实际输入月单价 或者 天单价*年天数/12<br />
            3、总价=（月单价*月数*面积）+（天单价*实际天数*面积）<br />
            4、以天记租时没有月数，即套用公式3计算，其中月数为0计算<br />
            5、以月记租时，整月按公式3第一项计算，余下的天数按照公式3的第二项计算</span>}>
            <Icon type="question-circle" /></Tooltip></div>}>
            {getFieldDecorator(`billType[${k}]`, {
              initialValue: '按月计费'
            })(
              <Select>
                <Option value="按实际天数计费">按实际天数计费</Option>
                <Option value="按月计费" >按月计费</Option>
              </Select>)}
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label="天单价换算规则">
            {getFieldDecorator(`dayPriceConvertRule[${k}]`, {
              initialValue: '按年换算',
            })(
              <Select
                disabled={!(priceUnit != "元/m²·天" && priceUnit != "元/天")}>
                <Option value="按自然月换算">按自然月换算</Option>
                <Option value="按年换算" >按年换算</Option>
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label={<div>年天数 <Tooltip title="指一年按多少天来计算">
            <Icon type="question-circle" /></Tooltip></div>}>
            {getFieldDecorator(`yearDays[${k}]`, {
              initialValue: 365,
              rules: [{ required: isValidate, message: '请输入年天数' }],
            })(<InputNumber placeholder="请输入年天数" style={{ width: '100%' }} />)}
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label="付款周期（月）" required>
            {getFieldDecorator(`payCycle[${k}]`, {
              initialValue: 1,
              rules: [{ required: isValidate, message: '请填写付款周期' }]
            })(
              <InputNumber placeholder="请填写付款周期" style={{ width: '100%' }} />
            )}
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label="提前付款时间">
            {getFieldDecorator(`advancePayTime[${k}]`, {
              initialValue: 1,
              rules: [{ required: isValidate, message: '请输入提前付款时间' }],
            })(<InputNumber placeholder="请输入" style={{ width: '100%' }} />)}
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label="&nbsp;">
            {getFieldDecorator(`advancePayTimeUnit[${k}]`, {
              initialValue: '工作日'
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
            {getFieldDecorator(`rentalPeriodDivided[${k}]`, {
              initialValue: '按起始日划分'
            })(
              <Select >
                <Option value="按起始日划分">按起始日划分</Option>
                <Option value="按自然月划分(首月非整自然月划入第一期)">按自然月划分(首月非整自然月划入第一期)</Option>
                <Option value="按自然月划分(首月非整自然月算一个月)">按自然月划分(首月非整自然月算一个月)</Option>
              </Select>)}
          </Form.Item>
        </Col>

        <Col lg={4}>
          <Form.Item label="递增开始时间"  >
            {getFieldDecorator(`increStartDate[${k}]`, {
              // rules: [{ required: true, message: '请选择' }],
            })(<DatePicker placeholder='请选择' />)}
          </Form.Item>
        </Col>

        {/* <Col lg={4}>
          <Form.Item label="递增结束时间" >
            {getFieldDecorator(`increEndDate[${k}]`, {
              // rules: [{ required: true, message: '请选择' }],
            })(<DatePicker placeholder='请选择' />)}
          </Form.Item>
        </Col> */}

        <Col lg={4}>
          <Form.Item label="递增间隔（月）">
            {getFieldDecorator(`increGap[${k}]`, {
              rules: [{ required: form.getFieldValue(`increStartDate[${k}]`), message: '请输入' }],
            })(<InputNumber placeholder='请输入' style={{ width: '100%' }} min={1} />)}
          </Form.Item>
        </Col>

        <Col lg={4}>
          <Form.Item label="单价递增">
            {getFieldDecorator(`increPrice[${k}]`, {
              rules: [{ required: form.getFieldValue(`increStartDate[${k}]`), message: '请输入' }],
            })(
              <InputNumber placeholder="请输入" style={{ width: '100%' }} />
            )}
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label="&nbsp;">
            {getFieldDecorator(`increPriceUnit[${k}]`, {
              rules: [{ required: form.getFieldValue(`increStartDate[${k}]`), message: '请选择单位' }],
            })(
              <Select placeholder="请选择" allowClear>
                <Option value="%">%</Option>
                <Option value="元" >元</Option>
              </Select>)}
          </Form.Item>
        </Col>

        {/* <Col lg={4}>
          <Form.Item label="优惠类型" >
            {getFieldDecorator(`rebateType[${k}]`, {
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
            {getFieldDecorator(`rebateStartDate[${k}]`, {
            })(<DatePicker placeholder="请选择"
              disabledDate={(currentDate) => {
                return currentDate && (
                  currentDate.isBefore(moment(form.getFieldValue(`chargeStartDate[${k}]`)), 'day') ||
                  currentDate.isAfter(moment(form.getFieldValue(`chargeEndDate[${k}]`)), 'day')
                ) ? true : false;
              }}
            />)}
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label="免租期结束" >
            {getFieldDecorator(`rebateEndDate[${k}]`, {
            })(<DatePicker placeholder="请选择"
              disabledDate={(currentDate) => {
                return currentDate && (
                  currentDate.isBefore(moment(form.getFieldValue(`chargeStartDate[${k}]`)), 'day') ||
                  currentDate.isAfter(moment(form.getFieldValue(`chargeEndDate[${k}]`)), 'day')
                ) ? true : false;
              }}
            />)}
          </Form.Item>
        </Col>
        {/* <Col lg={4}>
          <Form.Item label="开始期数" >
            {getFieldDecorator(`startPeriod[${k}]`, {
              rules: [{ required: form.getFieldValue(`rebateType[${k}]`), message: '请输入' }],
            })(<InputNumber placeholder="请输入" style={{ width: '100%' }} disabled={!form.getFieldValue(`rebateType[${k}]`)} />)}
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label="期长" >
            {getFieldDecorator(`periodLength[${k}]`, {
              rules: [{ required: form.getFieldValue(`rebateType[${k}]`), message: '请输入期长' }],
            })(<InputNumber placeholder="请输入期长" style={{ width: '100%' }} disabled={!form.getFieldValue(`rebateType[${k}]`)} />)}
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label="折扣" >
            {getFieldDecorator(`discount[${k}]`, {
              rules: [{ required: form.getFieldValue(`rebateType[${k}]`), message: '请输入折扣' }],
            })(<InputNumber placeholder="请输入折扣" style={{ width: '100%' }} disabled={!form.getFieldValue(`rebateType[${k}]`)} />)}
          </Form.Item>
        </Col> */}
        <Col lg={16}>
          <Form.Item label="优惠备注" >
            {getFieldDecorator(`rebateRemark[${k}]`, {
              //rules: [{ required: true, message: '请输入备注' }],
            })(<Input placeholder="请输入优惠备注" />)}
          </Form.Item>
        </Col>
      </Row>
    </Card>
  ));

  return (
    <div style={{ marginBottom: '10px' }}  >
      <Card key='0' title="费用条款1" className={styles.card} hoverable>
        <Row gutter={24}>
          <Col lg={24}>
            <Form.Item required>
              {getFieldDecorator(`rooms[0]`, {
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
                      setRoomIndex(0);
                    }}

                  >房源选择 </a>}
                  bordered
                  dataSource={chargeFeeList[0].rooms}
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
                              ///ar items = chargeFeeList;
                              var index = chargeFeeList[0].rooms.indexOf(item);
                              //var list = [...items[0].rooms, ...res];
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
                              setChargeFeeList([...chargeFeeList]);//必须展开 
                            }
                          });
                        }}

                      >移除</a>]}>
                      <List.Item.Meta title={item.allName} />
                      <div>{item.area}㎡，{item.rentPrice}元/㎡.天</div>
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
              {getFieldDecorator(`chargeStartDate[0]`, {
                initialValue: moment(new Date()),
                rules: [{ required: isValidate, message: '请选择开始时间' }],
              })(<DatePicker placeholder='请选择开始时间'
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
              {getFieldDecorator(`chargeEndDate[0]`, {
                initialValue: moment(new Date()).add(1, 'years').add(-1, 'days'),
                rules: [{ required: isValidate, message: '请选择结束时间' }],
              })(<DatePicker placeholder='请选择结束时间'
                disabledDate={(currentDate) => {
                  return currentDate && (
                    currentDate.isBefore(moment(form.getFieldValue(`startDate`)), 'day') ||
                    currentDate.isAfter(moment(form.getFieldValue(`endDate`)), 'day')
                  ) ? true : false;
                }}
              />)}
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item label="费项" required>
              {getFieldDecorator(`feeItemId[0]`, {
                rules: [{ required: isValidate, message: '请选择费项' }]
              })(
                <Select placeholder="请选择费项"
                  onChange={(value, option) => changeFee(value, option, 0)}>
                  {
                    chargeFeeList[0].feeItems.map(item => (
                      <Option
                        value={item.value}
                        key={item.key}
                        {...item}
                      >
                        {item.title}
                      </Option>
                    ))}
                </Select>
              )}
              {getFieldDecorator(`feeItemName[0]`, {
              })(
                <input type='hidden' />
              )}
            </Form.Item>
          </Col>

          <Col lg={4}>
            <Form.Item label='单价' required>
              {getFieldDecorator(`price[0]`, {

                rules: [{ required: isValidate, message: '请输入单价' }],
              })(<InputNumber placeholder="请输入单价" style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="&nbsp;">
              {getFieldDecorator(`priceUnit[0]`, {
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
            <Form.Item label="计费类型">
              {getFieldDecorator(`billType[0]`, {
                initialValue: '按月计费'
              })(
                <Select>
                  <Option value="按实际天数计费">按实际天数计费</Option>
                  <Option value="按月计费">按月计费</Option>
                </Select>)}
            </Form.Item>
          </Col>

          {/* {
            (priceUnit != "元/m²·天" && priceUnit != "元/天") ?
              <Col lg={4}>
                <Form.Item label="天单价换算规则">
                  {getFieldDecorator(`dayPriceConvertRule[0]`, {
                    initialValue: '按年换算',
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
            <Form.Item label="天单价换算规则">
              {getFieldDecorator(`dayPriceConvertRule[0]`, {
                initialValue: !(priceUnit != "元/m²·天" && priceUnit != "元/天") ? '' : '按年换算',
              })(
                <Select
                  disabled={!(priceUnit != "元/m²·天" && priceUnit != "元/天")}>
                  <Option value="按自然月换算">按自然月换算</Option>
                  <Option value="按年换算" >按年换算</Option>
                </Select>
              )}
            </Form.Item>
          </Col>

          <Col lg={4}>
            <Form.Item label="年天数">
              {getFieldDecorator(`yearDays[0]`, {
                initialValue: 365,
                rules: [{ required: isValidate, message: '请输入年天数' }],
              })(<InputNumber placeholder="请输入年天数" style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="付款周期（月）" required>
              {getFieldDecorator(`payCycle[0]`, {
                initialValue: 1,
                rules: [{ required: isValidate, message: '请输入付款周期' }]
              })(
                <InputNumber placeholder="请输入付款周期" style={{ width: '100%' }} />
              )}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="提前付款时间">
              {getFieldDecorator(`advancePayTime[0]`, {
                initialValue: 1,
                rules: [{ required: isValidate, message: '请输入提前付款时间' }],
              })(<InputNumber placeholder="请输入" style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="&nbsp;">
              {getFieldDecorator(`advancePayTimeUnit[0]`, {
                initialValue: '工作日'
              })(
                <Select>
                  <Option value="工作日">工作日</Option>
                  <Option value="自然日">自然日</Option>
                  <Option value="指定日期">指定日期</Option>
                </Select>)}
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item label="租期划分方式">
              {getFieldDecorator(`rentalPeriodDivided[0]`, {
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

          <Col lg={4}>
            <Form.Item label="递增开始时间"  >
              {getFieldDecorator(`increStartDate[0]`, {
                // rules: [{ required: true, message: '请选择' }],
              })(<DatePicker placeholder='请选择' />)}
            </Form.Item>
          </Col>

          {/* <Col lg={4}>
            <Form.Item label="递增结束时间" >
              {getFieldDecorator(`increEndDate[0]`, {
                // rules: [{ required: true, message: '请选择' }],
              })(<DatePicker placeholder='请选择' />)}
            </Form.Item>
          </Col> */}

          <Col lg={4}>
            <Form.Item label="递增间隔（月）">
              {getFieldDecorator(`increGap[0]`, {
                rules: [{ required: form.getFieldValue(`increStartDate[0]`), message: '请输入' }],
              })(<InputNumber placeholder='请输入' style={{ width: '100%' }} min={1} />)}
            </Form.Item>
          </Col>

          <Col lg={4}>
            <Form.Item label="单价递增" >
              {getFieldDecorator(`increPrice[0]`, {
                // rules: [{ required: form.getFieldValue(`increType[0]`), message: '请输入' }],
              })(
                <InputNumber placeholder="请输入" style={{ width: '100%' }} />
              )}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="&nbsp;">
              {getFieldDecorator(`increPriceUnit[0]`, {
                // rules: [{ required: form.getFieldValue(`increType[0]`), message: '请选择单位' }],
              })(
                <Select placeholder="请选择" allowClear >
                  <Option value="%">%</Option>
                  <Option value="元" >元</Option>
                </Select>)}
            </Form.Item>
          </Col>
          {/* <Col lg={4}>
            <Form.Item label="优惠类型" >
              {getFieldDecorator(`rebateType[0]`, {
              })(<Select placeholder="请选择优惠类型"
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
              {getFieldDecorator(`rebateStartDate[0]`, {
              })(<DatePicker placeholder="请选择"
                disabledDate={(currentDate) => {
                  return currentDate && (
                    currentDate.isBefore(moment(form.getFieldValue(`chargeStartDate[0]`)), 'day') ||
                    currentDate.isAfter(moment(form.getFieldValue(`chargeEndDate[0]`)), 'day')
                  ) ? true : false;
                }}
              />)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="免租期结束" >
              {getFieldDecorator(`rebateEndDate[0]`, {
              })(<DatePicker placeholder="请选择"
                disabledDate={(currentDate) => {
                  return currentDate && (
                    currentDate.isBefore(moment(form.getFieldValue(`chargeStartDate[0]`)), 'day') ||
                    currentDate.isAfter(moment(form.getFieldValue(`chargeEndDate[0]`)), 'day')
                  ) ? true : false;
                }}
              />)}
            </Form.Item>
          </Col>
          {/* <Col lg={4}>
            <Form.Item label="开始期数" >
              {getFieldDecorator(`startPeriod[0]`, {
                rules: [{ required: form.getFieldValue(`rebateType[0]`), message: '请输入' }],
              })(<InputNumber placeholder="请输入" style={{ width: '100%' }} disabled={!form.getFieldValue(`rebateType[0]`)} />)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="期长" >
              {getFieldDecorator(`periodLength[0]`, {
                rules: [{ required: form.getFieldValue(`rebateType[0]`), message: '请输入期长' }],
              })(<InputNumber placeholder="请输入期长" style={{ width: '100%' }} disabled={!form.getFieldValue(`rebateType[0]`)} />)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="折扣" >
              {getFieldDecorator(`discount[0]`, {
                rules: [{ required: form.getFieldValue(`rebateType[0]`), message: '请输入折扣' }],
              })(<InputNumber placeholder="请输入折扣" style={{ width: '100%' }} disabled={!form.getFieldValue(`rebateType[0]`)} />)}
            </Form.Item>
          </Col> */}
          <Col lg={16}>
            <Form.Item label="优惠备注" >
              {getFieldDecorator(`rebateRemark[0]`, {
                //rules: [{ required: true, message: '请输入备注' }],
              })(<Input placeholder="请输入优惠备注" />)}
            </Form.Item>
          </Col>
        </Row>
      </Card>
      {formItems}
      <Button type="dashed" onClick={add}>
        <Icon type="plus" />添加费用条款
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

          // let houseList: HtLeasecontracthouse[] = [];
          // let charge: ChargeFeeDetailDTO = {};
          // if (chargeFeeList.length > 0) {
          //   houseList = chargeFeeList[roomIndex].rooms || [];
          //   charge = chargeFeeList[roomIndex];
          // }

          //追加赋值 
          //去除原队列已存在数据  
          for (var i = 0; i < items[roomIndex].rooms.length; i++) {
            for (var j = 0; j < res.length; j++) {
              if (res[j].roomId == items[roomIndex].rooms[i].roomId) {
                res.splice(j, 1);
                j = j - 1;
              }
            }
          }

          var list = [...items[roomIndex].rooms, ...res];
          //赋值，否则会提示选择房源
          form.setFieldsValue({
            ['rooms[' + roomIndex + ']']
              : list
          });

          items[roomIndex].rooms = list;
          //let tree: TreeEntity = { key: 'test', value: 'test', title: 'test' }; 
          items[roomIndex].feeItems = feeItems; //[ { key: 'test', value: 'test', title: 'test' }]; 
          setChargeFeeList(items);
        }}
      />
    </div>

  );
}

export default LeaseTerm;
