
//租期条款动态组件，编辑
import { HtLeasecontractchargefee, TreeEntity } from '@/model/models';
import { InputNumber, Select,  Card, Col, Row, Form } from 'antd';
import React, { useState } from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import styles from './style.less';
// import moment from 'moment';
const { Option } = Select;

interface LeaseTermModifyProps {
  form: WrappedFormUtils;
  feeItems: TreeEntity[];
  chargeFee: HtLeasecontractchargefee;
}

//动态数量
// let index = 1;
function LeaseTermModify(props: LeaseTermModifyProps) {
  const { form, feeItems, chargeFee } = props;
  const { getFieldDecorator } = form;
  const [priceUnit, setPriceUnit] = useState<string>("元/m²·天");//单价单位
  //单位切换
  const changeUnit = value => {
    setPriceUnit(value);
  };

  // const remove = k => {
  //   const keys = getFieldValue('LeaseTerms');
  //   setFieldsValue({
  //     LeaseTerms: keys.filter(key => key !== k),
  //   });
  //   index--;
  // };

  // const add = () => {
  //   const keys = getFieldValue('LeaseTerms');
  //   const nextKeys = keys.concat(index++);
  //   setFieldsValue({
  //     LeaseTerms: nextKeys,
  //   });
  // };

  //费项选择
  const changeFee = (value, option) => {
    //更新费项id和name
    // option._owner.pendingProps.chargeFeeList[index].feeItemName = option.props.children;
    // option._owner.pendingProps.chargeFeeList[index].feeItemId = value;
    form.setFieldsValue({ feeItemName: option.props.children });
  };

  return (
    // <div style={{ marginBottom: '10px' }}  >
    //   {formItems}
    //   <Button type="dashed" onClick={add}>
    //     <Icon type="plus" />添加租期条款
    //     </Button>
    // </div>

    //初始化 租赁条款 
    // getFieldDecorator('LeaseTerms', { initialValue: chargeFeeList });
    // const keys = getFieldValue('LeaseTerms');
    // const formItems = keys.map((k, index) =>
    //   (
    <Card className={styles.card} title='租期条款'>
      <Row gutter={24}>
        {/* <Col lg={4}>
          <Form.Item label="开始时间" required >
            {getFieldDecorator('startDate', {
              initialValue: chargeFee.startDate
                ? moment(new Date(chargeFee.startDate))
                : moment(new Date()),
              rules: [{ required: true, message: '请选择开始时间' }],
            })(<DatePicker placeholder='请选择开始时间' />)}
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label="结束时间" required>
            {getFieldDecorator('endDate', {
              initialValue: chargeFee.endDate
                ? moment(new Date(chargeFee.endDate))
                : moment(new Date()),
              rules: [{ required: true, message: '请选择结束时间' }],
            })(<DatePicker placeholder='请选择结束时间' />)}
          </Form.Item>
        </Col> */}
        <Col lg={6}>
          <Form.Item label="租金费项" required>
            {getFieldDecorator('feeItemId', {
              initialValue: chargeFee.feeItemId,
              rules: [{ required: true, message: '请选择租金费项' }]
            })(
              <Select placeholder="请选择租金费项"
                onChange={(value, option) => changeFee(value, option)}
              >
                {feeItems.map(item => (
                  <Option value={item.value} key={item.key}>
                    {item.title}
                  </Option>
                ))}
              </Select>
            )}
            {getFieldDecorator('feeItemName', {
              initialValue: chargeFee.feeItemName,
            })(
              <input type='hidden' />
            )}

          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label="租金单价" required>
            {getFieldDecorator('price', {
              initialValue: chargeFee.price,
              rules: [{ required: true, message: '请输入租金单价' }],
            })(<InputNumber placeholder="请输入租金单价" style={{ width: '100%' }} />)}
          </Form.Item>
        </Col>
        <Col lg={3}>
          <Form.Item label="&nbsp;">
            {getFieldDecorator('priceUnit', {
              initialValue: chargeFee.priceUnit ? chargeFee.priceUnit : '元/m²·天'
            })(
              <Select onChange={changeUnit}>
                <Option value="元/m²·月">元/m²·月</Option>
                <Option value="元/m²·天">元/m²·天</Option>
                <Option value="元/月">元/月</Option>
                <Option value="元/天">元/天</Option>
              </Select>)}
          </Form.Item>
        </Col>

        <Col lg={5}>
          <Form.Item label="递增类型">
            {getFieldDecorator('increType', {
              initialValue: chargeFee.increType
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
        <Col lg={3}>
          <Form.Item label="单价递增" required>
            {getFieldDecorator('increPrice', {
              initialValue: chargeFee.increPrice,
              rules: [{ required: form.getFieldValue('increType'), message: '请输入' }],
            })(
              <InputNumber placeholder="请输入" style={{ width: '100%' }}
                disabled={!form.getFieldValue('increType')}
              />
            )}
          </Form.Item>
        </Col>
        <Col lg={3}>
          <Form.Item label="&nbsp;">
            {getFieldDecorator('increPriceUnit', {
              initialValue: chargeFee.increPriceUnit,
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
      </Row>
      <Row gutter={24}>
        <Col lg={3}>
          <Form.Item label="付款周期(月)" required>
            {getFieldDecorator('payCycle', {
              initialValue: chargeFee.payCycle,
              rules: [{ required: true, message: '请输入付款周期' }]
            })(
              <InputNumber min={1} placeholder="请输入付款周期" style={{ width: '100%' }} />
            )}
          </Form.Item>
        </Col>
        <Col lg={3}>
          <Form.Item label="提前付款时间">
            {getFieldDecorator('advancePayTime', {
              initialValue: chargeFee.advancePayTime ? chargeFee.advancePayTime : 1,
              rules: [{ required: true, message: '请输入提前付款时间' }],
            })(<InputNumber placeholder="请输入" style={{ width: '100%' }} />)}
          </Form.Item>
        </Col>
        <Col lg={3}>
          <Form.Item label="&nbsp;">
            {getFieldDecorator('advancePayTimeUnit', {
              initialValue: chargeFee.advancePayTimeUnit ? chargeFee.advancePayTimeUnit : '工作日'
            })(
              <Select>
                <Option value="工作日">工作日</Option>
                <Option value="自然日" >自然日</Option>
                <Option value="指定日期" >指定日期</Option>
              </Select>)}
          </Form.Item>
        </Col>
        {/* <Col lg={4}>
          <Form.Item label="计费类型">
            {getFieldDecorator('billType', {
              initialValue: chargeFee.billType ? chargeFee.billType : '按月计费'
            })(
              <Select>
                <Option value="按实际天数计费">按实际天数计费</Option>
                <Option value="按月计费" >按月计费</Option>
              </Select>)}
          </Form.Item>
        </Col> */}
        {/* <Col lg={4}>
            <Form.Item label="天单价换算规则">
              {getFieldDecorator(`dayPriceConvertRule[${k}]`, {
                initialValue: '按年换算',
              })(
                <Select>
                  <Option value="按自然月换算">按自然月换算</Option>
                  <Option value="按年换算" >按年换算</Option>
                </Select>
              )}
            </Form.Item>
          </Col> */}
        {
          (priceUnit == "元/m²·天" || priceUnit == "元/天") ?
            <Col lg={4}>
              <Form.Item label="天单价换算规则">
                {getFieldDecorator('dayPriceConvertRule', {
                  initialValue: chargeFee.dayPriceConvertRule ? chargeFee.dayPriceConvertRule : '按年换算',
                })(
                  <Select>
                    <Option value="按自然月换算">按自然月换算</Option>
                    <Option value="按年换算" >按年换算</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            : null}
        <Col lg={3}>
          <Form.Item label="年天数">
            {getFieldDecorator('yearDays', {
              initialValue: chargeFee.yearDays ? chargeFee.yearDays : 365,
              rules: [{ required: true, message: '请输入年天数' }],
            })(<InputNumber placeholder="请输入年天数" style={{ width: '100%' }} />)}
          </Form.Item>
        </Col> 
        <Col lg={8}>
          <Form.Item label="租期划分方式">
            {getFieldDecorator('rentalPeriodDivided', {
              initialValue: chargeFee.rentalPeriodDivided ? chargeFee.rentalPeriodDivided : '按起始日划分'
            })(
              <Select  >
                <Option value="按起始日划分">按起始日划分</Option>
                {/* <Option value="次月按自然月划分(仅一月一付有效)">次月按自然月划分(仅一月一付有效)</Option> */}
                <Option value="按自然月划分(首月非整自然月划入第一期)">按自然月划分(首月非整自然月划入第一期)</Option>
                <Option value="按自然月划分(首月非整自然月算一个月)">按自然月划分(首月非整自然月算一个月)</Option>
              </Select>)}
          </Form.Item>
        </Col>
      </Row>
    </Card >
    // ));

  );
}
export default LeaseTermModify;
