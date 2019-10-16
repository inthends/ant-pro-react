
import { Divider, PageHeader, AutoComplete, InputNumber, TreeSelect, Tabs, Select, Button, Card, Col, DatePicker, Drawer, Form, Input, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import {
  TreeEntity,
  LeaseContractChargeEntity,
  LeaseContractChargeFeeEntity,
  LeaseContractChargeIncreEntity,
  LeaseContractChargeFeeOfferEntity,
  LeaseContractDTO,
  ChargeDetailDTO
} from '@/model/models';
import React, { useEffect, useState } from 'react';
import ResultList from './ResultList';
import { GetCharge, GetFormJson } from './Main.service';
import { getCommonItems, GetUserList } from '@/services/commonItem';
import moment from 'moment';
import styles from './style.less';

const { Option } = Select;
const { TabPane } = Tabs;

interface ModifyProps {
  visible: boolean;
  id?: string;//合同id
  chargeId?: string;//合同条款id
  closeDrawer(): void;
  form: WrappedFormUtils;
  reload(): void;
  treeData: any[];
};

const Modify = (props: ModifyProps) => {
  const title = '修改合同';
  const { visible, closeDrawer, id, form, chargeId, treeData } = props;
  const { getFieldDecorator } = form;
  //const [industryType, setIndustryType] = useState<any[]>([]); //行业  
  //const [feeitems, setFeeitems] = useState<TreeEntity[]>([]);
  const [infoDetail, setInfoDetail] = useState<LeaseContractDTO>({});
  const [contractCharge, setContractCharge] = useState<LeaseContractChargeEntity>({});
  const [chargeFeeList, setChargeFeeList] = useState<LeaseContractChargeFeeEntity[]>([]);
  const [chargeIncreList, setChargeIncreList] = useState<LeaseContractChargeIncreEntity[]>([]);
  const [chargeOfferList, setChargeOfferList] = useState<LeaseContractChargeFeeOfferEntity[]>([]);
  const [depositData, setDepositData] = useState<any[]>([]);//保证金
  const [chargeData, setChargeData] = useState<any[]>([]);//租金
  const [userSource, setUserSource] = useState<any[]>([]);
  const [industryType, setIndustryType] = useState<any[]>([]); //行业  
  const [feeitems, setFeeitems] = useState<TreeEntity[]>([]);

  const close = () => {
    closeDrawer();
  };

  //打开抽屉时初始化
  useEffect(() => {
    getCommonItems('IndustryType').then(res => {
      setIndustryType(res || []);
    });

    //加载关联收费项目
    GetAllFeeItems().then(res => {
      setFeeitems(res || []);
    });

  }, []);

  // 打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      if (id) {
        GetFormJson(id).then((tempInfo: LeaseContractDTO) => {
          setInfoDetail(tempInfo);
          //获取条款
          GetCharge(chargeId).then((charge: ChargeDetailDTO) => {
            setContractCharge(charge.contractCharge || {});
            setChargeFeeList(charge.chargeFeeList || []);
            setChargeIncreList(charge.chargeIncreList || []);
            setChargeOfferList(charge.chargeFeeOfferList || []);
            setDepositData(charge.depositFeeResultList || []);//保证金明细
            setChargeData(charge.chargeFeeResultList || []);//租金明细    
          })
          form.resetFields();
        });
      } else {
        form.resetFields();
      }
    } else {
      form.setFieldsValue({});
    }
  }, [visible]);

  const handleSearch = value => {
    if (value == '')
      return;
    GetUserList(value, '员工').then(res => {
      setUserSource(res || []);
    })
  };

  const userList = userSource.map
    (item => <Option key={item.id} value={item.name}>{item.name}</Option>);

  const onFollowerSelect = (value, option) => {
    form.setFieldsValue({ followerId: option.key });
  };

  const onSignerSelect = (value, option) => {
    form.setFieldsValue({ signerId: option.key });
  };

  const onRoomChange = (value, label, extra) => {
    //选择房源,计算面积
    //["101 158.67㎡", "102 156.21㎡"] 
    let area = 0;
    label.forEach((val, idx, arr) => {
      area += parseFloat(val.split(' ')[1].replace('㎡', ''));
    });
    form.setFieldsValue({ leaseSize: area.toFixed(2) });
    form.setFieldsValue({ leaseArea: area.toFixed(2) });
  };

  const onIndustrySelect = (value, option) => {
    //设置行业名称
    form.setFieldsValue({ industry: option.props.children });
  };

  return (
    <Drawer
      title={title}
      placement="right"
      width={1000}
      onClose={close}
      visible={visible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <PageHeader title={infoDetail.state}
      // extra={[
      //   <Button key="1">附件</Button>, 
      //   <Button key="2">打印</Button>,
      // ]}
      />
      <Divider dashed />
      <Form layout="vertical" hideRequiredMark>
        <Tabs defaultActiveKey="1" >

          <TabPane tab="基本信息" key="1">
            <Row gutter={24}>
              <Col span={12}>
                <Card title="基本信息" className={styles.card}>
                  <Row gutter={24}>
                    <Col lg={24}>
                      <Form.Item label="模板选择">
                        {getFieldDecorator('template', {
                          initialValue: infoDetail.template
                        })(<Select placeholder="请选择模板" />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={12}>
                      <Form.Item label="合同编号" required>
                        {getFieldDecorator('no', {
                          initialValue: infoDetail.no,
                          rules: [{ required: true, message: '未选择模版时，请输入编号' }],
                        })(<Input placeholder="如不填写系统将自动生成" />)}
                      </Form.Item>
                    </Col>
                    <Col lg={12}>
                      <Form.Item label="跟进人" >
                        {getFieldDecorator('follower', {
                          initialValue: infoDetail.follower
                        })(
                          <AutoComplete
                            dataSource={userList}
                            onSearch={handleSearch}
                            placeholder="请输入跟进人"
                            onSelect={onFollowerSelect}
                          />
                        )}
                        {getFieldDecorator('followerId', {
                        })(
                          <input type='hidden' />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={12}>
                      <Form.Item label="租赁数量（m²)">
                        {getFieldDecorator('leaseSize', {
                          initialValue: infoDetail.leaseSize,
                          rules: [{ required: true, message: '请输入租赁数量' }],
                        })(<InputNumber placeholder="请输入租赁数量" style={{ width: '100%' }} />)}
                      </Form.Item>
                    </Col>
                    <Col lg={12}>
                      <Form.Item label="合同签订时间" required>
                        {getFieldDecorator('contractStartDate', {
                          initialValue: infoDetail.contractStartDate
                            ? moment(new Date(infoDetail.contractStartDate))
                            : moment(new Date()),
                          rules: [{ required: true, message: '请选择合同签订时间' }],
                        })(<DatePicker placeholder="请选择合同签订时间" style={{ width: '100%' }} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={12}>
                      <Form.Item label="合同计租时间">
                        {getFieldDecorator('billingDate', {
                          initialValue: infoDetail.billingDate
                            ? moment(new Date(infoDetail.billingDate))
                            : moment(new Date()),
                          rules: [{ required: true, message: '请选择合同计租时间' }],
                        })(<DatePicker placeholder="请选择合同计租时间" style={{ width: '100%' }} />)}
                      </Form.Item>
                    </Col>
                    <Col lg={12}>
                      <Form.Item label="合同失效时间" required>
                        {getFieldDecorator('contractEndDate', {
                          initialValue: infoDetail.contractEndDate
                            ? moment(new Date(infoDetail.contractEndDate))
                            : moment(new Date()).add(1, 'years').add(-1, 'days'),
                          rules: [{ required: true, message: '请选择合同失效时间' }],
                        })(<DatePicker placeholder="请选择合同失效时间" style={{ width: '100%' }} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={12}>
                      <Form.Item label="单价保留小数点">
                        {getFieldDecorator('calcPrecision', {
                          initialValue: infoDetail.calcPrecision ? infoDetail.calcPrecision : 2,
                          rules: [{ required: true, message: '请填写保留几位' }],
                        })(<InputNumber placeholder="请填写保留几位" style={{ width: '100%' }} />)}
                      </Form.Item>
                    </Col>
                    <Col lg={12}>
                      <Form.Item label="计算精度">
                        {getFieldDecorator('calcPrecisionMode', {
                          initialValue: infoDetail.calcPrecisionMode ? infoDetail.calcPrecisionMode : "最终计算结果保留2位"
                        })(<Select>
                          <Option value="最终计算结果保留2位" >最终计算结果保留2位</Option>
                          <Option value="每步计算结果保留2位" >每步计算结果保留2位</Option>
                        </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                </Card>
              </Col>
              <Col span={12}>
                <Card title="租赁信息">
                  <Row gutter={24}>
                    <Col lg={24}>
                      <Form.Item label="房源选择" required>
                        {getFieldDecorator('room', {
                          initialValue: infoDetail.houseList,
                          rules: [{ required: true, message: '请选择房源' }],
                        })(
                          <TreeSelect
                            placeholder="请选择房源"
                            allowClear
                            dropdownStyle={{ maxHeight: 300 }}
                            treeData={treeData}
                            treeDataSimpleMode={true}
                            onChange={onRoomChange}
                            multiple={true}>
                          </TreeSelect>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={12}>
                      <Form.Item label="租客" required>
                        {getFieldDecorator('customer', {
                          initialValue: infoDetail.customer,
                          rules: [{ required: true, message: '请填写姓名或公司' }],
                        })(<Input placeholder="请填写姓名或公司" />)}
                      </Form.Item>
                    </Col>
                    <Col lg={12}>
                      <Form.Item label="行业" required>
                        {getFieldDecorator('industryId', {
                          initialValue: infoDetail.industryId,
                          rules: [{ required: true, message: '请选择行业' }],
                        })(
                          <Select placeholder="请选择行业"
                            onSelect={onIndustrySelect}
                          >
                            {industryType.map(item => (
                              <Option value={item.value} key={item.key}>
                                {item.title}
                              </Option>
                            ))}
                          </Select>
                        )}
                        {getFieldDecorator('industry', {
                          initialValue: infoDetail.industry
                        })(
                          <input type='hidden' />
                        )}

                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={12}>
                      <Form.Item label="法人" required>
                        {getFieldDecorator('legalPerson', {
                          initialValue: infoDetail.legalPerson,
                          rules: [{ required: true, message: '请填写法人' }],
                        })(<Input placeholder="请填写法人" />)}
                      </Form.Item>
                    </Col>
                    <Col lg={12}>
                      <Form.Item label="签订人" required>
                        {getFieldDecorator('signer', {
                          initialValue: infoDetail.signer,
                          rules: [{ required: true, message: '请输入签订人' }],
                        })(
                          <AutoComplete
                            dataSource={userList}
                            onSearch={handleSearch}
                            placeholder="请输入签订人"
                            onSelect={onSignerSelect}
                          />
                        )}
                        {getFieldDecorator('signerId', {
                          initialValue: infoDetail.signerId,
                        })(
                          <input type='hidden' />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={24}>
                      <Form.Item label="租客联系人">
                        {getFieldDecorator('customerContact', {
                          initialValue: infoDetail.customerContact,
                          rules: [{ required: true, message: '请输入租客联系人' }],
                        })(<Input placeholder="请输入租客联系人" />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={6}>
                      <Form.Item label="滞纳金比例" >
                        {getFieldDecorator('lateFee', {
                          initialValue: infoDetail.lateFee
                        })(<InputNumber placeholder="请输入" />)}
                      </Form.Item>
                    </Col>
                    <Col lg={6}>
                      <Form.Item label="&nbsp;" >
                        {getFieldDecorator('lateFeeUnit', {
                          initialValue: infoDetail.lateFeeUnit ? infoDetail.lateFeeUnit : "%/天"
                        })(
                          <Select>
                            <Option value="%/天">%/天</Option>
                          </Select>)}
                      </Form.Item>
                    </Col>
                    <Col lg={7}>
                      <Form.Item label="滞纳金上限" >
                        {getFieldDecorator('maxLateFee', {
                          initialValue: infoDetail.maxLateFee
                        })(<InputNumber placeholder="请输入" />)}
                      </Form.Item>
                    </Col>
                    <Col lg={5}>
                      <Form.Item label="&nbsp;" >
                        {getFieldDecorator('maxLateFeeUnit', {
                          initialValue: infoDetail.maxLateFeeUnit ? infoDetail.maxLateFeeUnit : "%"
                        })(<Select>
                          <Option value="%">%</Option>
                        </Select>)}
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="租赁条款" key="2">
            <Card title="基本条款" className={styles.card} >
              <Row gutter={24}>
                <Col lg={7}>
                  <Form.Item label="租赁数量（㎡）">
                    {contractCharge.leaseArea}
                  </Form.Item>
                </Col>
                <Col lg={10}>
                  <Form.Item label="保证金关联费项">
                    {contractCharge.depositFeeItemId}
                  </Form.Item>
                </Col>
                <Col lg={7}>
                  <Form.Item label="保证金数量">
                    {contractCharge.deposit}
                    {contractCharge.depositUnit == '1' ? '月' : '元'}
                  </Form.Item>
                </Col>
                {/* <Col lg={4}>
                  <Form.Item label="保证金金额" >
                    {getFieldDecorator('totalDeposit', {
                    })(<Input readOnly />)}
                  </Form.Item>
                </Col> */}
              </Row>
            </Card>
            {
              chargeFeeList ? chargeFeeList.map((k, index) => (
                <Card title={'租期条款' + (index + 1)} className={styles.card}>
                  <Row gutter={24}>
                    <Col lg={4}>
                      <Form.Item label="开始时间"  >
                        {String(k.startDate).substr(0, 10)}
                      </Form.Item>
                    </Col>
                    <Col lg={4}>
                      <Form.Item label="结束时间" >
                        {String(k.endDate).substr(0, 10)}
                      </Form.Item>
                    </Col>
                    <Col lg={4}>
                      <Form.Item label="提前付款时间">
                        ({k.advancePayTimeUnit})
                        {k.advancePayTime}天
                      </Form.Item>
                    </Col>
                    <Col lg={4}>
                      <Form.Item label="合同单价" >
                        {k.price}
                        {k.priceUnit}
                      </Form.Item>
                    </Col>
                    <Col lg={4}>
                      <Form.Item label="关联费项" >
                        {k.feeItemName}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={4}>
                      <Form.Item label="计费类型">
                        {k.billType}
                      </Form.Item>
                    </Col>
                    <Col lg={4}>
                      <Form.Item label="租期划分方式">
                        {k.rentalPeriodDivided}
                      </Form.Item>
                    </Col>
                    <Col lg={4}>
                      <Form.Item label="天单价换算规则">
                        {k.dayPriceConvertRule}
                      </Form.Item>
                    </Col>
                    <Col lg={4}>
                      <Form.Item label="年天数">
                        {k.yearDays}
                      </Form.Item>
                    </Col>
                    <Col lg={4}>
                      <Form.Item label="付款周期（月）" >
                        {k.payCycle}月一付
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              )) : null
            }

            {chargeIncreList ? chargeIncreList.map((k, index) => (
              <Card title={'递增率' + (index + 1)} className={styles.card}>
                <Row gutter={24}>
                  <Col lg={8}>
                    <Form.Item label="递增时间点"  >
                      {String(k.increDate).substr(0, 10)}
                    </Form.Item>
                  </Col>
                  <Col lg={8}>
                    <Form.Item label="单价递增" >
                      {k.increPrice}
                      {k.increPriceUnit}
                    </Form.Item>
                  </Col>
                  <Col lg={8}>
                    <Form.Item label="保证金递增">
                      {k.increDeposit}
                      {k.increDepositUnit}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            )) : null
            }

            {chargeOfferList ? chargeOfferList.map((k, index) => (
              <Card title={'优惠' + (index + 1)} className={styles.card}>
                <Row gutter={24}>
                  <Col lg={4}>
                    <Form.Item label="优惠类型"  >
                      {k.type}
                    </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label="开始时间" >
                      {k.startDate}
                    </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label="结束时间">
                      {k.endDate}
                    </Form.Item>
                  </Col>
                  <Col lg={4}>
                    <Form.Item label="开始期数">
                      {k.startPeriod}
                    </Form.Item>
                  </Col>

                  <Col lg={4}>
                    <Form.Item label="期长">
                      {k.periodLength}
                    </Form.Item>
                  </Col>

                  <Col lg={4}>
                    <Form.Item label="折扣">
                      {k.discount}
                    </Form.Item>
                  </Col>

                  <Col lg={4}>
                    <Form.Item label="备注">
                      {k.remark}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            )) : null
            }

          </TabPane>
          <TabPane tab="租金明细" key="3">
            <ResultList
              depositData={depositData}
              chargeData={chargeData}
            ></ResultList>

          </TabPane>
        </Tabs>
      </Form>
      <div
        style={{
          position: 'absolute',
          zIndex: 999,
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
        <Button type="primary">
          确定
          </Button>
      </div>
    </Drawer>
  );

};

export default Form.create<ModifyProps>()(Modify);

