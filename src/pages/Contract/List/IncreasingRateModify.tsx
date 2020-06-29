
//递增率条款动态组件,编辑
import { InputNumber, Select, Card, Col, Row, Form } from 'antd';
import React from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import styles from './style.less';
const { Option } = Select;
import { HtLeasecontractchargeincre } from '@/model/models';
// import moment from 'moment';

interface IncreasingRateModifyProps {
  form: WrappedFormUtils;
  chargeIncre: HtLeasecontractchargeincre;
}

//动态数量
// let index = 1;
function IncreasingRateModify(props: IncreasingRateModifyProps) {
  const { form, chargeIncre } = props;
  const { getFieldDecorator } = form;

  // const remove = k => {
  //   const keys = getFieldValue('IncreasingRates');
  //   setFieldsValue({
  //     IncreasingRates: keys.filter(key => key !== k),
  //   });
  //   index--;
  // };

  // const add = () => {
  //   const keys = getFieldValue('IncreasingRates');
  //   const nextKeys = keys.concat(index++);
  //   setFieldsValue({
  //     IncreasingRates: nextKeys,
  //   });
  // };



  return (
    // <div style={{ marginBottom: '10px' }}>
    //   {formItems}
    //   <Button type="dashed" onClick={add}>
    //     <Icon type="plus" />添加递增率
    //         </Button>
    // </div> 
    // getFieldDecorator('IncreasingRates', { initialValue: chargeIncre });
    // const keys = getFieldValue('IncreasingRates');
    // const formItems = keys.map((k, index) => (
       
    <Card className={styles.card} title="递增率"  hoverable>
      <Row gutter={24}>
        <Col lg={6}>
          <Form.Item label="递增类型" >
            {getFieldDecorator('increType', {
              initialValue: chargeIncre.increType,
              // rules: [{ required: true, message: '请选择递增时间点' }],
            })(<Select placeholder="请选择递增类型" allowClear>
              <Option value="三个月后递增">三个月后开始递增</Option>
              <Option value="半年后递增">半年后递增</Option>
              <Option value="一年后递增">一年后递增</Option>
              <Option value="两年后递增">两年后递增</Option>
              <Option value="三年后递增">三年后递增</Option>
            </Select>)}
          </Form.Item>
        </Col>

        <Col lg={6}>
          <Form.Item label="单价递增"  >
            {getFieldDecorator('increPrice', {
              initialValue: chargeIncre.increPrice,
              rules: [{ required: form.getFieldValue('increType'), message: '请输入递增率' }],
            })(<InputNumber placeholder="请输入递增率" style={{ width: '100%' }}
              disabled={!form.getFieldValue('increType')} />)}
          </Form.Item>
        </Col>
        <Col lg={3}>
          <Form.Item label="&nbsp;">
            {getFieldDecorator('increPriceUnit', {
              initialValue: chargeIncre.increPriceUnit,
              rules: [{ required: form.getFieldValue('increType'), message: '请选择单位' }],
            })(
              <Select placeholder="请选择" allowClear
                disabled={!form.getFieldValue('increType')}>
                <Option value="%">%</Option>
                <Option value="元" >元</Option>
              </Select>)}
          </Form.Item>
        </Col>
        <Col lg={6}>
          <Form.Item label="保证金递增"  >
            {getFieldDecorator('increDeposit', {
              initialValue: chargeIncre.increDeposit,
              rules: [{ required: form.getFieldValue('increType'), message: '请输入递增率' }],
            })(<InputNumber placeholder="请输入递增率"
              style={{ width: '100%' }}
              disabled={!form.getFieldValue('increType')} />)}
          </Form.Item>
        </Col>
        <Col lg={3}>
          <Form.Item label="&nbsp;">
            {getFieldDecorator('increDepositUnit', {
              initialValue: chargeIncre.increDepositUnit,
              rules: [{ required: form.getFieldValue('increType'), message: '请选择单位' }],
            })(
              <Select allowClear
                disabled={!form.getFieldValue('increType')}>
                <Option value="%">%</Option>
                <Option value="元" >元</Option>
              </Select>)}
          </Form.Item>
        </Col>
      </Row>
    </Card>
    // ));


  );
}

export default IncreasingRateModify;
