
//优惠条款动态组件,编辑
import { InputNumber, Input, Select, DatePicker, Card, Col, Row, Form } from 'antd';
import React from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import styles from './style.less';
import { HtLeasecontractchargefeeoffer } from '@/model/models';
import moment from 'moment';
const { TextArea } = Input;
const { Option } = Select;

interface RebateModifyProps {
  form: WrappedFormUtils;
  chargeOfferList: HtLeasecontractchargefeeoffer[];
}

//动态数量
// let index = 1;
function RebateModify(props: RebateModifyProps) {
  const { form, chargeOfferList } = props;
  const { getFieldDecorator, getFieldValue } = form;

  // const remove = k => {
  //   const keys = getFieldValue('Rebates');
  //   setFieldsValue({
  //     Rebates: keys.filter(key => key !== k),
  //   });
  //   index--;
  // };

  // const add = () => {
  //   const keys = getFieldValue('Rebates');
  //   const nextKeys = keys.concat(index++);
  //   setFieldsValue({
  //     Rebates: nextKeys,
  //   });
  // };

  getFieldDecorator('Rebates', { initialValue: chargeOfferList });
  const keys = getFieldValue('Rebates');
  const formItems = keys.map((k, index) => (
    <Card key={k} className={styles.card} title="优惠"  >
      <Row gutter={24}>
        <Col lg={5}>
          <Form.Item label="优惠类型" required>
            {getFieldDecorator(`rebateType[${index}]`, {
              initialValue: k.rebateType
            })(<Select
              placeholder="请选择优惠类型"
              allowClear>
              <Option value="免租期">免租期</Option>
              <Option value="装修期">装修期</Option>
              <Option value="单价折扣">单价折扣</Option>
              <Option value="减免金额">减免金额</Option>
              <Option value="单价减免">单价减免</Option>
            </Select>)}
          </Form.Item>
        </Col>
        <Col lg={5}>
          <Form.Item label="开始时间"  >
            {getFieldDecorator(`rebateStartDate[${index}]`, {
              initialValue: k.rebateStartDate
                ? moment(new Date(k.rebateStartDate))
                : moment(new Date()),
              rules: [{ required: form.getFieldValue('rebateType'), message: '请选择开始时间' }],
            })(<DatePicker placeholder="请选择开始时间" disabled={!form.getFieldValue('rebateType')} />)}
          </Form.Item>
        </Col>
        <Col lg={5}>
          <Form.Item label="结束时间"  >
            {getFieldDecorator(`rebateEndDate[${index}]`, {
              initialValue: k.rebateEndDate
                ? moment(new Date(k.rebateEndDate))
                : moment(new Date()),
              rules: [{ required: form.getFieldValue('rebateType'), message: '请选择结束时间' }],
            })(<DatePicker placeholder="请选择结束时间" disabled={!form.getFieldValue('rebateType')} />)}
          </Form.Item>
        </Col>
        <Col lg={3}>
          <Form.Item label="开始期数"  >
            {getFieldDecorator(`startPeriod[${index}]`, {
              initialValue: k.startPeriod,
              rules: [{ required: form.getFieldValue('rebateType'), message: '请输入开始期数' }],
            })(<InputNumber placeholder="请输入" style={{ width: '100%' }} disabled={!form.getFieldValue('rebateType')} />)}
          </Form.Item>
        </Col>
        <Col lg={3}>
          <Form.Item label="期长"  >
            {getFieldDecorator(`periodLength[${index}]`, {
              initialValue: k.periodLength,
              rules: [{ required: form.getFieldValue('rebateType'), message: '请输入期长' }],
            })(<InputNumber placeholder="请输入期长" style={{ width: '100%' }} disabled={!form.getFieldValue('rebateType')} />)}
          </Form.Item>
        </Col>
        <Col lg={3}>
          <Form.Item label="折扣"  >
            {getFieldDecorator(`discount[${index}]`, {
              initialValue: k.discount,
              rules: [{ required: form.getFieldValue('rebateType'), message: '请输入折扣' }],
            })(<InputNumber placeholder="请输入折扣" style={{ width: '100%' }} disabled={!form.getFieldValue('rebateType')} />)}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={24}>
          <Form.Item label="备注">
            {getFieldDecorator(`remark[${index}]`, {
              initialValue: k.remark,
              // rules: [{ required: true, message: '请输入备注' }],
            })(<TextArea placeholder="请输入备注" rows={3} />)}
          </Form.Item>
        </Col>
      </Row>
    </Card>
  ));
  return (
    <div style={{ marginBottom: '10px' }}>
      {formItems}
      {/* <Button type="dashed" onClick={add}>
        <Icon type="plus" />添加优惠
            </Button> */}
    </div>
  );
}
export default RebateModify;
