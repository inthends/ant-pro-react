
//条款动态组件，新增
// import { TreeEntity } from '@/model/models';
import {  InputNumber, Select, DatePicker, Card, Col, Row, Icon, Form, Button } from 'antd';
import React  from 'react';
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
        <Col lg={5}>
          <Form.Item label="开始时间" required >
            {getFieldDecorator(`beginDate[${k}]`, {
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
        <Col lg={5}>
          <Form.Item label="结束时间" required>
            {getFieldDecorator(`endDate[${k}]`, {
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
        <Col lg={6}>
          <Form.Item label="金额" required>
            {getFieldDecorator(`amount[${k}]`, {
              rules: [{ required: isValidate, message: '请输入金额' }],
            })(<InputNumber placeholder="请输入金额" style={{ width: '100%' }} />)}
          </Form.Item>
        </Col>

      </Row>
    </Card>
  ));

  return (
    <div style={{ marginBottom: '10px' }}  >
      <Card key='0' title="费用条款1" className={styles.card} hoverable>
        <Row gutter={24}>
          <Col lg={5}>
            <Form.Item label="开始时间" required >
              {getFieldDecorator(`beginDate[0]`, {
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
          <Col lg={5}>
            <Form.Item label="结束时间" required>
              {getFieldDecorator(`endDate[0]`, {
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
          <Col lg={6}>
            <Form.Item label='金额' required>
              {getFieldDecorator(`amount[0]`, {
                rules: [{ required: isValidate, message: '请输入金额' }],
              })(<InputNumber placeholder="请输入金额" style={{ width: '100%' }} />)}
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
