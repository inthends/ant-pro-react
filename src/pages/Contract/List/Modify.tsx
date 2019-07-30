
import {
  TreeSelect,
  Tabs,
  Select,
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Row
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetFormJson } from './Main.service';

import LeaseTerm from './LeaseTerm';
import IncreasingRate from './IncreasingRate';
import Rebate from './Rebate';


import styles from './style.less';
const { Option } = Select;
const { TabPane } = Tabs;

interface ModifyProps {
  modifyVisible: boolean;
  data?: any;
  closeDrawer(): void;
  form: WrappedFormUtils;
  treeData: any[];
  id?: string;
  reload(): void;
}
const Modify = (props: ModifyProps) => {
  const { treeData, modifyVisible, closeDrawer, form, id } = props;
  const { getFieldDecorator } = form;
  const title = id === undefined ? '添加合同' : '修改合同';
  const [infoDetail, setInfoDetail] = useState<any>({});

  //打开抽屉时初始化
  useEffect(() => {


  }, []);


  // 打开抽屉时初始化
  useEffect(() => {

    if (modifyVisible) {
      if (id) {
        getInfo(id).then((tempInfo: any) => {

          setInfoDetail(tempInfo);
          form.resetFields();
        });
      } else {
        //重置之前选择加载的费项类别 
        setInfoDetail({});
        form.resetFields();
      }
    } else {
      form.setFieldsValue({});
    }
  }, [modifyVisible]);

  const close = () => {
    closeDrawer();
  };
  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        getInfo(id).then(tempInfo => {
          let newvalue = { ...values, date: values.date.format('YYYY-MM-DD') };
        });
      }
    });
  };
  const getInfo = id => {
    if (id) {
      return GetFormJson(id).then(res => {
        const { feeItem, feeItemDetail } = res || ({} as any);
        let info = {
          ...feeItem,
          ...feeItemDetail,
        };
        info.id = feeItem && feeItem.feeItemID;
        return info;
      });
    } else {
      return Promise.resolve({
        parentId: 0,
        type: 1,
      });
    }
  };

  return (
    <Drawer
      title={title}
      placement="right"
      width={1000}
      onClose={close}
      visible={modifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >

      <Tabs defaultActiveKey="1" >
        <TabPane tab="基本信息" key="1">
          <div>
            <Row gutter={24}>
              <Col span={12}>
                <Card title="基本信息" className={styles.card}  >
                  <Form layout="vertical" hideRequiredMark>
                    <Row gutter={24}>
                      <Col lg={24}>
                        <Form.Item label="模板选择" required>
                          {getFieldDecorator('template', {
                            rules: [{ required: true, message: '请选择' }],
                          })(<Select placeholder="请选择" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="合同编号" required>
                          {getFieldDecorator('no', {
                            rules: [{ required: true, message: '如不填写系统将自动生成' }],
                          })(<Input placeholder="如不填写系统将自动生成" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="跟进人" required>
                          {getFieldDecorator('follower', {
                            rules: [{ required: true, message: '请选择跟进人' }],
                          })(<Select placeholder="请选择跟进人" />)}
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="租赁数量（m²)">
                          {getFieldDecorator('leaseSize', {
                            rules: [{ required: true, message: '请输入面积' }],
                          })(<Input placeholder="请输入面积" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="合同签订时间" required>
                          {getFieldDecorator('contractStartDate', {
                            rules: [{ required: true, message: '请输入小区名称' }],
                          })(<DatePicker />)}
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="合同计租时间">
                          {getFieldDecorator('billingDate', {
                            rules: [{ required: true, message: '请输入详细地址' }],
                          })(<DatePicker placeholder="请输入详细地址" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="合同失效时间" required>
                          {getFieldDecorator('contractEndDate', {
                            rules: [{ required: true, message: '请输入小区名称' }],
                          })(<DatePicker placeholder="请输入小区名称" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="单价保留小数点">
                          {getFieldDecorator('precision', {
                            rules: [{ required: true, message: '请填写保留几位' }],
                          })(<Input placeholder="请填写保留几位" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="计算精度">
                          {getFieldDecorator('calcPrecisionMode', {
                            initialValue: "1"
                          })(<Select>
                            <Option value="1" >精确计算结果保留2位</Option>
                            <Option value="2" >每步计算结果保留2位</Option>
                          </Select>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>

                  </Form>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="租赁信息">
                  <Form layout="vertical" hideRequiredMark>
                    <Row gutter={24}>
                      <Col lg={24}>
                        <Form.Item label="房源选择" required>
                          {getFieldDecorator('room', {
                            rules: [{ required: true, message: '请选择房源' }],
                          })(
                            <TreeSelect
                              placeholder="请选择房源"
                              allowClear
                              dropdownStyle={{ maxHeight: 300 }}
                              treeData={treeData}
                              treeDataSimpleMode={true}
                              multiple={true}
                            >
                            </TreeSelect>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="租客" required>
                          {getFieldDecorator('customer', {
                            rules: [{ required: true, message: '请填写姓名或公司' }],
                          })(<Input placeholder="请填写姓名或公司" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="行业" required>
                          {getFieldDecorator('industry', {
                            rules: [{ required: true, message: '请选择行业' }],
                          })(<Select placeholder="请选择行业" />)}
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="法人" required>
                          {getFieldDecorator('legalPerson', {
                            rules: [{ required: true, message: '请填写法人' }],
                          })(<Input placeholder="请填写法人" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="签订人" required>
                          {getFieldDecorator('signer', {
                            rules: [{ required: true, message: '请输入签订人' }],
                          })(<Input placeholder="请输入签订人" />)}
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col lg={24}>
                        <Form.Item label="租客联系人">
                          {getFieldDecorator('customerContact', {
                            rules: [{ required: true, message: '请输入租客联系人' }],
                          })(<Input placeholder="请输入租客联系人" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={6}>
                        <Form.Item label="滞纳金比例" required>
                          {getFieldDecorator('lateFee', {
                            rules: [{ required: true, message: '请输入' }],
                          })(<Input placeholder="请输入" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={6}>
                        <Form.Item label="&nbsp;" required>
                          {getFieldDecorator('lateFeeUnitId', {
                            initialValue: "1"
                          })(
                            <Select>
                              <Option value="1">%/天</Option>
                            </Select>)}
                        </Form.Item>
                      </Col>

                      <Col lg={7}>
                        <Form.Item label="滞纳金上限" required>
                          {getFieldDecorator('maxLateFee', {
                            rules: [{ required: true, message: '请输入' }],
                          })(<Input placeholder="请输入" />)},
                        </Form.Item>
                      </Col>
                      <Col lg={5}>
                        <Form.Item label="&nbsp;" required>
                          {getFieldDecorator('maxLateFeeUnitId', {
                            initialValue: "1"
                          })(<Select>
                            <Option value="1">%</Option>
                          </Select>)}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Card>
              </Col>
            </Row>
          </div>
        </TabPane>
        <TabPane tab="费用条款" key="2">
          <Form layout="vertical" hideRequiredMark>
            <Card title="基本条款" className={styles.card} >
              <Row gutter={24}>
                <Col lg={5}>
                  <Form.Item label="租赁数量（㎡）" required>
                    {getFieldDecorator('leaseArea', {
                    })(<Input readOnly />)}
                  </Form.Item>
                </Col>
                <Col lg={5}>
                  <Form.Item label="保证金数量" required>
                    {getFieldDecorator('deposit', {
                      rules: [{ required: true, message: '请输入保证金数量' }],
                    })(<Input placeholder="请输入保证金数量" />)}
                  </Form.Item>
                </Col>

                <Col lg={3}>
                  <Form.Item label="&nbsp;" >
                    {getFieldDecorator('depositUnit', {
                      initialValue: "1"
                    })(
                      <Select>
                        <Option value="1">月</Option>
                        <Option value="2">元</Option>
                      </Select>)}
                  </Form.Item>
                </Col>
                <Col lg={5}>
                  <Form.Item label="保证金金额" required>
                    {getFieldDecorator('totalDeposit', {
                      rules: [{ required: true, message: '请输入保证金数量' }],
                    })(<Input placeholder="请输入保证金数量" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Card title="租期条款" className={styles.card}  >
              <Row gutter={24}>
                <Col lg={4}>
                  <Form.Item label="开始时间" required >
                    {getFieldDecorator(`contractStartDate`, {
                      rules: [{ required: true, message: '请选择开始时间' }],
                    })(<DatePicker />)}
                  </Form.Item>
                </Col>

                <Col lg={4}>
                  <Form.Item label="结束时间" required>
                    {getFieldDecorator(`endDate`, {
                      rules: [{ required: true, message: '请选择结束时间' }],
                    })(<DatePicker />)}
                  </Form.Item>
                </Col>

                <Col lg={8}>
                  <Form.Item label="费项" required>
                    {getFieldDecorator(`feeItemName`, {
                      rules: [{ required: true, message: '请选择费项' }]
                    })(
                      <Select placeholder="请选择费项">
                      </Select>)}
                  </Form.Item>
                </Col>

                <Col lg={4}>
                  <Form.Item label="合同单价" required>
                    {getFieldDecorator(`price`, {
                      rules: [{ required: true, message: '请输入合同单价' }],
                    })(<Input placeholder="请输入合同单价" />)}
                  </Form.Item>
                </Col>
                <Col lg={4}>
                  <Form.Item label="&nbsp;">
                    {getFieldDecorator(`priceUnit`, {
                      initialValue: '元/m²·天'
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
                    {getFieldDecorator(`advancePayTime`, {
                      rules: [{ required: true, message: '请输入提前付款时间' }],
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col lg={4}>
                  <Form.Item label="&nbsp;">
                    {getFieldDecorator(`advancePayTimeUnit`, {
                      initialValue: '工作日'
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
                    {getFieldDecorator(`billType`, {
                      initialValue: '按月计费'
                    })(
                      <Select>
                        <Option value="1">按实际天数计费</Option>
                        <Option value="2" >按月计费</Option>
                      </Select>)}
                  </Form.Item>
                </Col>
                <Col lg={4}>
                  <Form.Item label="天单价换算规则">
                    {getFieldDecorator(`dayPriceConvertRule`, {
                      initialValue: '按年换算',
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
                    {getFieldDecorator(`yearDays`, {
                      initialValue: 365,
                      rules: [{ required: true, message: '请输入年天数' }],
                    })(<Input placeholder="请输入年天数" />)}
                  </Form.Item>
                </Col>
                <Col lg={4}>
                  <Form.Item label="付款周期（月）" required>
                    {getFieldDecorator(`payCycle`, {
                      rules: [{ required: true, message: '请填写付款周期' }]
                    })(
                      <Input placeholder="请填写付款周期" />
                    )}
                  </Form.Item>
                </Col>
                <Col lg={8}>
                  <Form.Item label="租期划分方式">
                    {getFieldDecorator(`rentalPeriodDivided`, {
                      initialValue: '按起始日划分'
                    })(
                      <Select  >
                        <Option value="1">按起始日划分</Option>
                        <Option value="2" >次月按自然月划分(仅一月一付有效)</Option>
                        <Option value="3" >按自然月划分(首月非整自然月划入第一期)</Option>
                        <Option value="2" >次月按自然月划分(仅一月一付有效)</Option>
                        <Option value="4" >按自然月划分(首月非整自然月算一个月)</Option>
                      </Select>)}
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <LeaseTerm form={form}></LeaseTerm>
            <IncreasingRate form={form}></IncreasingRate>
            <Rebate form={form}></Rebate>
          </Form>

          <Button style={{ width: '100%', marginBottom: '40px' }}> 点击生成租金明细</Button>

        </TabPane>
      </Tabs>
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={close} style={{ marginRight: 8 }}>
          取消
          </Button>
        <Button onClick={close} type="primary">
          确定
          </Button>
      </div>
    </Drawer>
  );

};

export default Form.create<ModifyProps>()(Modify);

