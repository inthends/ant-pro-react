
//条款动态组件，新增
// import { TreeEntity } from '@/model/models';
import { Tooltip, Input, InputNumber, Select, DatePicker, Card, Col, Row, Icon, Form, Button } from 'antd';
import React, { useState } from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import styles from './style.less';
import moment from 'moment';
const { Option } = Select;

interface LeaseTermProps {
  form: WrappedFormUtils;
  feeItems: any[];//TreeEntity[];
  isValidate: boolean;//是否进行必填项验证
}

//动态数量
let index = 1;
function LeaseTerm(props: LeaseTermProps) {
  const { form, feeItems, isValidate } = props;
  const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
  const [priceUnit, setPriceUnit] = useState<string>("元/m²·天");//单价单位

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
        : option.props.children
    });
  };

  const remove = k => {
    const keys = getFieldValue('LeaseTerms');
    setFieldsValue({
      LeaseTerms: keys.filter(key => key !== k),
    });
    index--;
  };

  const add = () => {
    const keys = getFieldValue('LeaseTerms');
    const nextKeys = keys.concat(index++);
    setFieldsValue({
      LeaseTerms: nextKeys,
    });
  };

  //初始化 租赁条款 
  getFieldDecorator('LeaseTerms', { initialValue: [] });
  const keys = getFieldValue('LeaseTerms');
  const formItems = keys.map((k, index) => (
    <Card hoverable key={k} className={styles.card} title={'费用条款' + (index + 2)}
      extra={<Icon type="minus-circle-o" onClick={() => remove(k)} />}>
      <Row gutter={24}>
        <Col lg={4}>
          <Form.Item label="开始时间" required >
            {getFieldDecorator(`chargeStartDate[${k}]`, {
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
              rules: [{ required: isValidate, message: '请选择费项' }]
            })(
              <Select placeholder="请选择费项"
                onChange={(value, option) => changeFee(value, option, k)}
              >
                {feeItems.map(item => (
                  <Option value={item.value} key={item.key}>
                    {item.title}
                  </Option>
                ))}
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
                  onChange={(value, option) => changeFee(value, option, 0)}
                >
                  {feeItems.map(item => (
                    <Option value={item.value} key={item.key}>
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
          <Col lg={4}>
            <Form.Item label="递增结束时间" >
              {getFieldDecorator(`increEndDate[0]`, {
                // rules: [{ required: true, message: '请选择' }],
              })(<DatePicker placeholder='请选择' />)}
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
    </div>
  );
}

export default LeaseTerm;
