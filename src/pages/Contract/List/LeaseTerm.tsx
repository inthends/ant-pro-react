
//租期条款动态组件 
import { TreeEntity } from '@/model/models';
import { InputNumber, Select, DatePicker, Card, Col, Row, Icon, Form, Button } from 'antd';
import React, { useState } from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import styles from './style.less';
import moment from 'moment';
const { Option } = Select;

interface LeaseTermProps {
  form: WrappedFormUtils;
  feeitems: TreeEntity[];
}

//动态数量
let index = 1;
function LeaseTerm(props: LeaseTermProps) {
  const { form, feeitems } = props;
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
  getFieldDecorator('LeaseTerms', { initialValue: [] });  
  const keys = getFieldValue('LeaseTerms'); 
  const formItems = keys.map((k, index) => (
    <Card key={k} className={styles.card}
      extra={<Icon type="minus-circle-o" onClick={() => remove(k)} />}>
      <Row gutter={24}>
        <Col lg={4}>
          <Form.Item label="开始时间" required >
            {getFieldDecorator(`startDate[${k}]`, {
              rules: [{ required: true, message: '请选择开始时间' }],
            })(<DatePicker />)}
          </Form.Item>
        </Col> 
        <Col lg={4}>
          <Form.Item label="结束时间" required>
            {getFieldDecorator(`endDate[${k}]`, {
              rules: [{ required: true, message: '请选择结束时间' }],
            })(<DatePicker />)}
          </Form.Item>
        </Col> 
        <Col lg={8}>
          <Form.Item label="费项" required>
            {getFieldDecorator(`feeItemID[${k}]`, {
              rules: [{ required: true, message: '请选择费项'}]
            })( 
              <Select placeholder="请选择费项">
                {feeitems.map(item => (
                  <Option value={item.value} >
                    {item.text}
                  </Option>
                ))}
              </Select> 
            )}
          </Form.Item>
        </Col>

        <Col lg={4}>
          <Form.Item label="合同单价" required>
            {getFieldDecorator(`price[${k}]`, {
              initialValue:10,
              rules: [{ required: true, message: '请输入合同单价' }],
            })(<InputNumber placeholder="请输入合同单价" />)}
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label="&nbsp;">
            {getFieldDecorator(`priceUnit[${k}]`, {
              initialValue: '2'
            })(
              <Select>
                <Option value="1">元/m²·月</Option>
                <Option value="2" >元/m²·天</Option>
                <Option value="3" >元/月</Option>
                <Option value="4" >元/天</Option>
              </Select>)}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={4}>
          <Form.Item label="提前付款时间">
            {getFieldDecorator(`advancePayTime[${k}]`, {
               initialValue:1,
              rules: [{ required: true, message: '请输入提前付款时间' }],
            })(<InputNumber placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label="&nbsp;">
            {getFieldDecorator(`advancePayTimeUnit[${k}]`, {
              initialValue: '1'
            })(
              <Select>
                <Option value="1">工作日</Option>
                <Option value="2" >自然日</Option>
                <Option value="3" >指定日期</Option>
              </Select>)}
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label="计费类型">
            {getFieldDecorator(`billType[${k}]`, {
              initialValue: '2'
            })(
              <Select>
                <Option value="1">按实际天数计费</Option>
                <Option value="2" >按月计费</Option>
              </Select>)}
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label="天单价换算规则">
            {getFieldDecorator(`dayPriceConvertRule[${k}]`, {
              initialValue: '2',
            })(
              <Select>
                <Option value="1">按自然月换算</Option>
                <Option value="2" >按年换算</Option>
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label="年天数">
            {getFieldDecorator(`yearDays[${k}]`, {
              initialValue: 365,
              rules: [{ required: true, message: '请输入年天数' }],
            })(<InputNumber placeholder="请输入年天数" />)}
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label="付款周期（月）" required>
            {getFieldDecorator(`payCycle[${k}]`, {
              rules: [{ required: true, message: '请填写付款周期' }]
            })(
              <InputNumber placeholder="请填写付款周期" />
            )}
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item label="租期划分方式">
            {getFieldDecorator(`rentalPeriodDivided[${k}]`, {
              initialValue: '1'
            })(
              <Select  >
                <Option value="1">按起始日划分</Option>
                <Option value="2">次月按自然月划分(仅一月一付有效)</Option>
                <Option value="3">按自然月划分(首月非整自然月划入第一期)</Option> 
                <Option value="4">按自然月划分(首月非整自然月算一个月)</Option>
              </Select>)}
          </Form.Item>
        </Col>
      </Row>
    </Card>
  ));

  return (
    <div style={{ marginBottom: '10px' }}  >
      <Card key='0' title="租期条款" className={styles.card}  >
        <Row gutter={24}>
          <Col lg={4}>
            <Form.Item label="开始时间" required >
              {getFieldDecorator(`startDate[0]`, {
                initialValue: moment(new Date()),
                rules: [{ required: true, message: '请选择开始时间' }],
              })(<DatePicker />)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="结束时间" required>
              {getFieldDecorator(`endDate[0]`, {
                initialValue: moment(new Date()).add(1, 'years').add(-1, 'days'),
                rules: [{ required: true, message: '请选择结束时间' }],
              })(<DatePicker />)}
            </Form.Item>
          </Col>

          <Col lg={8}>
            <Form.Item label="费项" required>
              {getFieldDecorator(`feeItemID[0]`, {
                rules: [{ required: true, message: '请选择费项' }]
              })(
                <Select placeholder="请选择费项">
                  {feeitems.map(item => (
                    <Option value={item.value} key={item.value}>
                      {item.text}
                    </Option>
                  ))}
                </Select>
              )} 
            </Form.Item>
          </Col>

          <Col lg={4}>
            <Form.Item label='合同单价' required>
              {getFieldDecorator(`price[0]`, {
                initialValue:5,
                rules: [{ required: true, message: '请输入合同单价' }],
              })(<InputNumber placeholder="请输入合同单价" style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="&nbsp;">
              {getFieldDecorator(`priceUnit[0]`, {
                initialValue: '2'
              })(
                <Select onChange={changeUnit}>
                  <Option value="1">元/m²·月</Option>
                  <Option value="2">元/m²·天</Option>
                  <Option value="3">元/月</Option>
                  <Option value="4">元/天</Option>
                </Select>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={4}>
            <Form.Item label="提前付款时间">
              {getFieldDecorator(`advancePayTime[0]`, {
                initialValue:1,
                rules: [{ required: true, message: '请输入提前付款时间' }],
              })(<InputNumber placeholder="请输入" style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="&nbsp;">
              {getFieldDecorator(`advancePayTimeUnit[0]`, {
                initialValue: '1'
              })(
                <Select>
                  <Option value="1">工作日</Option>
                  <Option value="2" >自然日</Option>
                  <Option value="3" >指定日期</Option>
                </Select>)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="计费类型">
              {getFieldDecorator(`billType[0]`, {
                initialValue: '2'
              })(
                <Select>
                  <Option value="1">按实际天数计费</Option>
                  <Option value="2" >按月计费</Option>
                </Select>)}
            </Form.Item>
          </Col>

          {
            (priceUnit == 1 || priceUnit == 3) ?
              <Col lg={4}>
                <Form.Item label="天单价换算规则">
                  {getFieldDecorator(`dayPriceConvertRule[0]`, {
                    initialValue: '2',
                  })(
                    <Select>
                      <Option value="1">按自然月换算</Option>
                      <Option value="2" >按年换算</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              : null}

          <Col lg={4}>
            <Form.Item label="年天数">
              {getFieldDecorator(`yearDays[0]`, {
                initialValue: 365,
                rules: [{ required: true, message: '请输入年天数' }],
              })(<InputNumber placeholder="请输入年天数" style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="付款周期（月）" required>
              {getFieldDecorator(`payCycle[0]`, {
                initialValue:1,
                rules: [{ required: true, message: '请输入付款周期' }]
              })(
                <InputNumber placeholder="请输入付款周期" style={{ width: '100%' }} />
              )}
            </Form.Item>
          </Col>
          <Col lg={9}>
            <Form.Item label="租期划分方式">
              {getFieldDecorator(`rentalPeriodDivided[0]`, {
                initialValue: '1'
              })(
                <Select  >
                  <Option value="1">按起始日划分</Option>
                  <Option value="2">次月按自然月划分(仅一月一付有效)</Option>
                  <Option value="3">按自然月划分(首月非整自然月划入第一期)</Option> 
                  <Option value="4">按自然月划分(首月非整自然月算一个月)</Option>
                </Select>)}
            </Form.Item>
          </Col>
        </Row>
      </Card>
      {formItems}
      <Button type="dashed" onClick={add}>
        <Icon type="plus"/>添加租期条款
        </Button>
    </div>
  );
}

export default LeaseTerm;
