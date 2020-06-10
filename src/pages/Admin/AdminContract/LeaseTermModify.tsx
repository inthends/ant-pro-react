
//租期条款动态组件，编辑
import { HtAdmincontractfee, TreeEntity } from '@/model/models';
import {   Icon, DatePicker, Button, InputNumber, Select, Card, Col, Row, Form } from 'antd';
import React  from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import styles from './style.less';
import moment from 'moment';
const { Option } = Select;

interface LeaseTermModifyProps {
  form: WrappedFormUtils;
  feeItems: TreeEntity[];
  chargeFeeList: HtAdmincontractfee[];
}

//动态数量
let index = 1;
function LeaseTermModify(props: LeaseTermModifyProps) {
  const { form, feeItems, chargeFeeList } = props;
  const { getFieldDecorator, getFieldValue, setFieldsValue } = form; 

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


  //初始化 租赁条款 
  getFieldDecorator('LeaseTerms', { initialValue: chargeFeeList });
  const keys = getFieldValue('LeaseTerms');
  const formItems = keys.map((k, index) =>
    (
      <Card hoverable key={index} className={styles.card} title={index == 0 ? '租期条款' : ''}
        extra={index > 0 ? <Icon type="minus-circle-o" onClick={() => remove(index)} /> : null}>
        <Row gutter={24}>
          <Col lg={5}>
            <Form.Item label="开始时间" required >
              {getFieldDecorator(`beginDate[${index}]`, {
                initialValue: k.beginDate
                  ? moment(new Date(k.beginDate))
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
          <Col lg={5}>
            <Form.Item label="结束时间" required>
              {getFieldDecorator(`endDate[${index}]`, {
                initialValue: k.endDate
                  ? moment(new Date(k.endDate))
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
                initialValue: k.feeItemId,
                rules: [{ required: true, message: '请选择费项' }]
              })(
                <Select placeholder="请选择费项"
                  onChange={(value, option) => changeFee(value, option, index)}
                >
                  {feeItems.map(item => (
                    <Option value={item.value} >
                      {item.title}
                    </Option>
                  ))}
                </Select>
              )}
              {getFieldDecorator(`feeItemName[${index}]`, {
                initialValue: k.feeItemName,
              })(
                <input type='hidden' />
              )}
            </Form.Item>
          </Col>
          <Col lg={6}>
            <Form.Item label="金额" required>
              {getFieldDecorator(`price[${index}]`, {
                initialValue: k.price,
                rules: [{ required: true, message: '请输入金额' }],
              })(<InputNumber placeholder="请输入金额" style={{ width: '100%' }} />)}
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
