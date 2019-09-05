
//优惠条款动态组件 
import { Input, Select, DatePicker, Card, Col, Row, Icon, Form, Button } from 'antd';
import React from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import styles from './style.less';
const { Option } = Select;

interface RebateProps {
  form: WrappedFormUtils;
}

//动态数量
let index = 1;
function Rebate(props: RebateProps) {
  const { form } = props;
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

  getFieldDecorator('Rebates', { initialValue: [] });
  const keys = getFieldValue('Rebates');
  const formItems = keys.map((k, index) => (

    <Card key={k} className={styles.card} title="优惠" extra={<Icon type="minus-circle-o" onClick={() => remove(k)} />}>
      <Row gutter={24}>
        <Col lg={4}>
          <Form.Item label="优惠类型" >
            {getFieldDecorator(`rebateType[${k}]`, {
              initialValue: '免租期'
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
            {getFieldDecorator(`rebateStartDate[${k}]`, {
              rules: [{ required: true, message: '请选择开始时间' }],
            })(<DatePicker />)}
          </Form.Item>
        </Col>

        <Col lg={4}>
          <Form.Item label="结束时间" required>
            {getFieldDecorator(`rebateEndDate[${k}]`, {
              rules: [{ required: true, message: '请选择结束时间' }],
            })(<DatePicker />)}
          </Form.Item>
        </Col>

        <Col lg={4}>
          <Form.Item label="开始期数" required>
            {getFieldDecorator(`startPeriod[${k}]`, {
              rules: [{ required: true, message: '请输入开始期数' }],
            })(<Input placeholder="请输入开始期数" />)}
          </Form.Item>
        </Col>

        <Col lg={4}>
          <Form.Item label="期长" required>
            {getFieldDecorator(`periodLength[${k}]`, {
              rules: [{ required: true, message: '请输入期长' }],
            })(<Input placeholder="请输入期长" />)}
          </Form.Item>
        </Col>

        <Col lg={4}>
          <Form.Item label="折扣" required>
            {getFieldDecorator(`discount[${k}]`, {
              rules: [{ required: true, message: '请输入折扣' }],
            })(<Input placeholder="请输入折扣" />)}
          </Form.Item>
        </Col>

        <Col lg={4}>
          <Form.Item label="备注" required>
            {getFieldDecorator(`remark[${k}]`, {
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
      <Button type="dashed"   onClick={add}>
        <Icon type="plus" />添加优惠
            </Button> 
    </div>
  );
}
export default Rebate;
