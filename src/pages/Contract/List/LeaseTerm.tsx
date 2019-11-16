
//租期条款动态组件，新增
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
  const [priceUnit, setPriceUnit] = useState<string>("元/m²·天");//单价单位

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
            })(<DatePicker placeholder='请选择开始时间'/>)}
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label="结束时间" required>
            {getFieldDecorator(`endDate[${k}]`, {
              rules: [{ required: true, message: '请选择结束时间' }],
            })(<DatePicker placeholder='请选择结束时间'/>)}
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item label="关联费项" required>
            {getFieldDecorator(`feeItemId[${k}]`, {
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
            {getFieldDecorator(`price[${k}]`, {
              rules: [{ required: true, message: '请输入合同单价' }],
            })(<InputNumber placeholder="请输入合同单价" style={{ width: '100%' }}/>)}
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label="&nbsp;">
            {getFieldDecorator(`priceUnit[${k}]`, {
              initialValue: '元/m²·天'
            })(
              <Select onChange={changeUnit}>
                <Option value="元/m²·月">元/m²·月</Option>
                <Option value="元/m²·天">元/m²·天</Option>
                <Option value="元/月">元/月</Option>
                <Option value="元/天">元/天</Option>
              </Select>)}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={4}>
          <Form.Item label="提前付款时间">
            {getFieldDecorator(`advancePayTime[${k}]`, {
              initialValue: 1,
              rules: [{ required: true, message: '请输入提前付款时间' }],
            })(<InputNumber placeholder="请输入" style={{ width: '100%' }}/>)}
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label="&nbsp;">
            {getFieldDecorator(`advancePayTimeUnit[${k}]`, {
              initialValue: '工作日'
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
            {getFieldDecorator(`billType[${k}]`, {
              initialValue: '按月计费'
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
          (priceUnit == "元/m²·天" || priceUnit == "元/天") ?
            <Col lg={4}>
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
            </Col>
            : null}

        <Col lg={4}>
          <Form.Item label="年天数">
            {getFieldDecorator(`yearDays[${k}]`, {
              initialValue: 365,
              rules: [{ required: true, message: '请输入年天数' }],
            })(<InputNumber placeholder="请输入年天数" style={{ width: '100%' }}/>)}
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label="付款周期（月）" required>
            {getFieldDecorator(`payCycle[${k}]`, {
              rules: [{ required: true, message: '请填写付款周期' }]
            })(
              <InputNumber placeholder="请填写付款周期" style={{ width: '100%' }}/>
            )}
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item label="租期划分方式">
            {getFieldDecorator(`rentalPeriodDivided[${k}]`, {
              initialValue: '按起始日划分'
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
      <Card key='0' title="租期条款" className={styles.card}  >
        <Row gutter={24}>
          <Col lg={4}>
            <Form.Item label="开始时间" required >
              {getFieldDecorator(`startDate[0]`, {
                initialValue: moment(new Date()),
                rules: [{ required: true, message: '请选择开始时间' }],
              })(<DatePicker placeholder='请选择开始时间'/>)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="结束时间" required>
              {getFieldDecorator(`endDate[0]`, {
                initialValue: moment(new Date()).add(1, 'years').add(-1, 'days'),
                rules: [{ required: true, message: '请选择结束时间' }],
              })(<DatePicker placeholder='请选择结束时间'/>)}
            </Form.Item>
          </Col>

          <Col lg={8}>
            <Form.Item label="费项" required>
              {getFieldDecorator(`feeItemId[0]`, {
                rules: [{ required: true, message: '请选择费项' }]
              })(
                <Select placeholder="请选择费项">
                  {feeitems.map(item => (
                    <Option value={item.value} key={item.value}>
                      {item.title}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>

          <Col lg={4}>
            <Form.Item label='合同单价' required>
              {getFieldDecorator(`price[0]`, {
                rules: [{ required: true, message: '请输入合同单价' }],
              })(<InputNumber placeholder="请输入合同单价" style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="&nbsp;">
              {getFieldDecorator(`priceUnit[0]`, {
                initialValue: '元/m²·天'
              })(
                <Select onChange={changeUnit}>
                  <Option value="元/m²·月">元/m²·月</Option>
                  <Option value="元/m²·天">元/m²·天</Option>
                  <Option value="元/月">元/月</Option>
                  <Option value="元/天">元/天</Option>
                </Select>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={4}>
            <Form.Item label="提前付款时间">
              {getFieldDecorator(`advancePayTime[0]`, {
                initialValue: 1,
                rules: [{ required: true, message: '请输入提前付款时间' }],
              })(<InputNumber placeholder="请输入" style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="&nbsp;">
              {getFieldDecorator(`advancePayTimeUnit[0]`, {
                initialValue: '工作日'
              })(
                <Select>
                  <Option value="工作日">工作日</Option>
                  <Option value="自然日">自然日</Option>
                  <Option value="指定日期">指定日期</Option>
                </Select>)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="计费类型">
              {getFieldDecorator(`billType[0]`, {
                initialValue: '按月计费'
              })(
                <Select>
                  <Option value="按实际天数计费">按实际天数计费</Option>
                  <Option value="按月计费">按月计费</Option>
                </Select>)}
            </Form.Item>
          </Col>

          {
            (priceUnit == "元/m²·天" || priceUnit == "元/天") ?
              <Col lg={4}>
                <Form.Item label="天单价换算规则">
                  {getFieldDecorator(`dayPriceConvertRule[0]`, {
                    initialValue: '按年换算',
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
              {getFieldDecorator(`yearDays[0]`, {
                initialValue: 365,
                rules: [{ required: true, message: '请输入年天数' }],
              })(<InputNumber placeholder="请输入年天数" style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item label="付款周期（月）" required>
              {getFieldDecorator(`payCycle[0]`, {
                initialValue: 1,
                rules: [{ required: true, message: '请输入付款周期' }]
              })(
                <InputNumber placeholder="请输入付款周期" style={{ width: '100%' }} />
              )}
            </Form.Item>
          </Col>
          <Col lg={9}>
            <Form.Item label="租期划分方式">
              {getFieldDecorator(`rentalPeriodDivided[0]`, {
                initialValue: '按起始日划分'
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
      {formItems}
      <Button type="dashed" onClick={add}>
        <Icon type="plus" />添加租期条款
        </Button>
    </div>
  );
}

export default LeaseTerm;
