
//优惠条款动态组件,编辑
import { Input, Select, DatePicker, Card, Col, Row, Icon, Form, Button } from 'antd';
import React from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import styles from './style.less';
const { Option } = Select;
import { HtLeasecontractchargefeeoffer } from '@/model/models';
import moment from 'moment';

interface RebateModifyProps {
  form: WrappedFormUtils;
  chargeOfferList: HtLeasecontractchargefeeoffer[];
}

//动态数量
let index = 1;
function RebateModify(props: RebateModifyProps) {
  const { form, chargeOfferList } = props;
  const { getFieldDecorator, getFieldValue, setFieldsValue } = form;

  const remove = k => {
    const keys = getFieldValue('Rebates');
    setFieldsValue({
      Rebates: keys.filter(key => key !== k),
    });
    index--;
  };

  const add = () => {
    const keys = getFieldValue('Rebates');
    const nextKeys = keys.concat(index++);
    setFieldsValue({
      Rebates: nextKeys,
    });
  };

  getFieldDecorator('Rebates', { initialValue: chargeOfferList });
  const keys = getFieldValue('Rebates');
  const formItems = keys.map((k, index) => (
    <Card key={k} className={styles.card} title="优惠"
      extra={index > 0 ? <Icon type="minus-circle-o" onClick={() => remove(k)} /> : null}>
      <Row gutter={24}>
        <Col lg={4}>
          <Form.Item label="优惠类型" >
            {getFieldDecorator(`rebateType[${index}]`, {
              initialValue: k.rebateType ? k.rebateType : '免租期'
            })(<Select>
              <Option value="免租期">免租期</Option>
              <Option value="装修期">装修期</Option>
              <Option value="单价折扣">单价折扣</Option>
              <Option value="减免金额">减免金额</Option>
              <Option value="单价减免">单价减免</Option>
            </Select>)}
          </Form.Item>
        </Col>

        <Col lg={4}>
          <Form.Item label="开始时间" required>
            {getFieldDecorator(`rebateStartDate[${index}]`, {
              initialValue: k.rebateStartDate
                ? moment(new Date(k.rebateStartDate))
                : moment(new Date()),
              rules: [{ required: true, message: '请选择开始时间' }],
            })(<DatePicker />)}
          </Form.Item>
        </Col>

        <Col lg={4}>
          <Form.Item label="结束时间" required>
            {getFieldDecorator(`rebateEndDate[${index}]`, {
              initialValue: k.rebateEndDate
                ? moment(new Date(k.rebateEndDate))
                : moment(new Date()),
              rules: [{ required: true, message: '请选择结束时间' }],
            })(<DatePicker />)}
          </Form.Item>
        </Col>

        <Col lg={4}>
          <Form.Item label="开始期数" required>
            {getFieldDecorator(`startPeriod[${index}]`, {
              initialValue: k.startPeriod,
              rules: [{ required: true, message: '请输入开始期数' }],
            })(<Input placeholder="请输入开始期数" />)}
          </Form.Item>
        </Col>

        <Col lg={4}>
          <Form.Item label="期长" required>
            {getFieldDecorator(`periodLength[${index}]`, {
              initialValue: k.periodLength,
              rules: [{ required: true, message: '请输入期长' }],
            })(<Input placeholder="请输入期长" />)}
          </Form.Item>
        </Col>

        <Col lg={4}>
          <Form.Item label="折扣" required>
            {getFieldDecorator(`discount[${index}]`, {
              initialValue: k.discount,
              rules: [{ required: true, message: '请输入折扣' }],
            })(<Input placeholder="请输入折扣" />)}
          </Form.Item>
        </Col>

        <Col lg={4}>
          <Form.Item label="备注" required>
            {getFieldDecorator(`remark[${index}]`, {
              initialValue: k.remark,
              rules: [{ required: true, message: '请输入备注' }],
            })(<Input placeholder="请输入备注" />)}
          </Form.Item>
        </Col>
      </Row>
    </Card>

  ));
  return (
    <div style={{ marginBottom: '10px' }}>
      {formItems}
      <Button type="dashed" onClick={add}>
        <Icon type="plus" />添加优惠
            </Button>
    </div>
  );
}
export default RebateModify;
