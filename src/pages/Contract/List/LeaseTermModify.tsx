
//租期条款动态组件，编辑
import { LeaseContractChargeFeeEntity, TreeEntity } from '@/model/models';
import { InputNumber, Select, DatePicker, Card, Col, Row, Icon, Form, Button } from 'antd';
import React, { useState } from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import styles from './style.less';
import moment from 'moment';
const { Option } = Select;

interface LeaseTermModifyProps {
  form: WrappedFormUtils;
  feeitems: TreeEntity[];
  chargeFeeList: LeaseContractChargeFeeEntity[];
}

//动态数量
let index = 1;
function LeaseTermModify(props: LeaseTermModifyProps) {
  const { form, feeitems, chargeFeeList } = props;
  const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
  const [priceUnit, setPriceUnit] = useState<number>(2);//单价单位 
  //单位切换
  const changeUnit = value => {
    setPriceUnit(value);
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
  getFieldDecorator('LeaseTerms', { initialValue: chargeFeeList });
  const keys = getFieldValue('LeaseTerms');
  const formItems = keys.map((k, index) =>
    (
      <Card key={index} className={styles.card}
        extra={index > 0 ? <Icon type="minus-circle-o" onClick={() => remove(index)} /> : null}>
        <Row gutter={24}>
          <Col lg={4}>
            <Form.Item label="开始时间" required >
              {getFieldDecorator(`startDate[${index}]`, {
                initialValue: k.startDate
                  ? moment(new Date(k.startDate))
                  : moment(new Date()),
                rules: [{ required: true, message: '请选择开始时间' }],
              })(<DatePicker placeholder='请选择开始时间' />)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="结束时间" required>
              {getFieldDecorator(`endDate[${index}]`, {
                initialValue: k.endDate
                  ? moment(new Date(k.endDate))
                  : moment(new Date()),
                rules: [{ required: true, message: '请选择结束时间' }],
              })(<DatePicker placeholder='请选择结束时间' />)}
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item label="关联费项" required>
              {getFieldDecorator(`feeItemId[${index}]`, {
                initialValue: k.feeItemId,
                rules: [{ required: true, message: '请选择费项' }]
              })(
                <Select placeholder="请选择费项">
                  {feeitems.map(item => (
                    <Option value={item.value} >
                      {item.title}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="合同单价" required>
              {getFieldDecorator(`price[${index}]`, {
                initialValue: k.price,
                rules: [{ required: true, message: '请输入合同单价' }],
              })(<InputNumber placeholder="请输入合同单价" style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="&nbsp;">
              {getFieldDecorator(`priceUnit[${index}]`, {
                initialValue: k.priceUnit ? k.priceUnit : '元/m²·天'
              })(
                <Select onChange={changeUnit}>
                  <Option value="元/m²·月">元/m²·月</Option>
                  <Option value="元/m²·天" >元/m²·天</Option>
                  <Option value="元/月" >元/月</Option>
                  <Option value="元/天" >元/天</Option>
                </Select>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={4}>
            <Form.Item label="提前付款时间">
              {getFieldDecorator(`advancePayTime[${index}]`, {
                initialValue: k.advancePayTime ? k.advancePayTime : 1,
                rules: [{ required: true, message: '请输入提前付款时间' }],
              })(<InputNumber placeholder="请输入" style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="&nbsp;">
              {getFieldDecorator(`advancePayTimeUnit[${index}]`, {
                initialValue: k.advancePayTimeUnit ? k.advancePayTimeUnit : '工作日'
              })(
                <Select>
                  <Option value="工作日">工作日</Option>
                  <Option value="自然日" >自然日</Option>
                  <Option value="指定日期" >指定日期</Option>
                </Select>)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="计费类型">
              {getFieldDecorator(`billType[${index}]`, {
                initialValue: k.billType ? k.billType : '按月计费'
              })(
                <Select>
                  <Option value="按实际天数计费">按实际天数计费</Option>
                  <Option value="按月计费" >按月计费</Option>
                </Select>)}
            </Form.Item>
          </Col>
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
            (priceUnit == 1 || priceUnit == 3) ?
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
              : null}

          <Col lg={4}>
            <Form.Item label="年天数">
              {getFieldDecorator(`yearDays[${index}]`, {
                initialValue: k.yearDays ? k.yearDays : 365,
                rules: [{ required: true, message: '请输入年天数' }],
              })(<InputNumber placeholder="请输入年天数" style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="付款周期（月）" required>
              {getFieldDecorator(`payCycle[${index}]`, {
                initialValue: k.payCycle,
                rules: [{ required: true, message: '请填写付款周期' }]
              })(
                <InputNumber placeholder="请填写付款周期" style={{ width: '100%' }} />
              )}
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item label="租期划分方式">
              {getFieldDecorator(`rentalPeriodDivided[${index}]`, {
                initialValue: k.rentalPeriodDivided ? k.rentalPeriodDivided : '按起始日划分'
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
    ));

  return (
    <div style={{ marginBottom: '10px' }}  >
      {formItems}
      <Button type="dashed" onClick={add}>
        <Icon type="plus" />添加租期条款
        </Button>
    </div>
  );
}
export default LeaseTermModify;
