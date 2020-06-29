
//递增率条款动态组件 
import { Input, Select, DatePicker, Card, Col, Row, Icon, Form, Button } from 'antd';
import React from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import styles from './style.less';
const { Option } = Select;

interface IncreasingRateProps {
  form: WrappedFormUtils;
}

//动态数量
let index = 1;
function IncreasingRate(props: IncreasingRateProps) {
  const { form } = props;
  const { getFieldDecorator, getFieldValue, setFieldsValue } = form;

  const remove = k => {
    const keys = getFieldValue('IncreasingRates');
    setFieldsValue({
      IncreasingRates: keys.filter(key => key !== k),
    });
    index--;
  };

  const add = () => {
    const keys = getFieldValue('IncreasingRates');
    const nextKeys = keys.concat(index++);
    setFieldsValue({
      IncreasingRates: nextKeys,
    });
  };

  getFieldDecorator('IncreasingRates', { initialValue: [] });
  const keys = getFieldValue('IncreasingRates');
  const formItems = keys.map((k, index) => (

    <Card  hoverable key={k} className={styles.card} title="递增率" extra={<Icon type="minus-circle-o" onClick={() => remove(k)} />}>
      <Row gutter={24}>
        <Col lg={4}>
          <Form.Item label="递增时间点" required >
            {getFieldDecorator(`increDate[${k}]`, {
              rules: [{ required: true, message: '请选择递增时间点' }],
            })(<DatePicker />)}
          </Form.Item>
        </Col>

        <Col lg={4}>
          <Form.Item label="单价递增" required>
            {getFieldDecorator(`increPrice[${k}]`, {
              rules: [{ required: true, message: '请输入递增率' }],
            })(<Input placeholder="请输入递增率" />)}
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label="&nbsp;">
            {getFieldDecorator(`increPriceUnit[${k}]`, {
              initialValue: '%'
            })(
              <Select>
                <Option value="%">%</Option>
                <Option value="元" >元</Option>
              </Select>)}
          </Form.Item>
        </Col> 
        <Col lg={4}>
          <Form.Item label="保证金递增" required>
            {getFieldDecorator(`increDeposit[${k}]`, {
              rules: [{ required: true, message: '请输入递增率' }],
            })(<Input placeholder="请输入递增率" />)}
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label="&nbsp;">
            {getFieldDecorator(`increDepositUnit[${k}]`, {
              initialValue: '%'
            })(
              <Select>
                <Option value="%">%</Option>
                <Option value="元" >元</Option>
              </Select>)}
          </Form.Item>
        </Col>
      </Row>
    </Card> 
  ));
  return (
    <div style={{ marginBottom: '10px' }}>
      {formItems} 
            <Button type="dashed"  onClick={add}>
              <Icon type="plus" />添加递增率
            </Button> 
    </div>
  );
}

export default IncreasingRate;
