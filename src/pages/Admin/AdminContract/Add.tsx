//添加合同
import {
  Upload, Icon, AutoComplete, Spin, message, InputNumber, Tabs, Select, Button,
  Card, Col, DatePicker, Drawer, Form, Input, Row
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { TreeEntity, HtAdmincontractfee, HtAdminfeeresult, htAdmincontract } from '@/model/models';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { GetCommonItems, GetUserList } from '@/services/commonItem';
import { RemoveFile, SaveForm, GetAllFeeItems, GetChargeDetail } from './Main.service';
import { GetDetailJson, CheckVendor, GetVendorList } from '../../Resource/Vendor/Vendor.service';
import QuickModify from '../../Resource/PStructUser/QuickModify';
import styles from './style.less';

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

import LeaseTerm from './LeaseTerm';
import ResultList from './ResultList';

interface AddProps {
  visible: boolean;
  id?: string;
  data?: any;
  closeDrawer(): void;
  form: WrappedFormUtils;
  reload(): void;
};

const Add = (props: AddProps) => {
  const title = '添加合同';
  const { visible, closeDrawer, form, reload } = props;
  const { getFieldDecorator } = form;
  const [feeItems, setFeeItems] = useState<TreeEntity[]>([]);
  //租金计算结果    
  const [loading, setLoading] = useState<boolean>(false);
  const [channel, setChannel] = useState<any[]>([]);//渠道 
  const [userSource, setUserSource] = useState<any[]>([]);

  //打开抽屉时初始化
  useEffect(() => {
    //加载关联收费项目
    GetAllFeeItems().then(res => {
      setFeeItems(res || []);
    });

    GetUserList('', '员工').then(res => {
      setUserSource(res || []);
    });

    //渠道
    GetCommonItems('VisitChannel').then(res => {
      setChannel(res || []);
    });

  }, [visible]);

  const [isCal, setIsCal] = useState<boolean>(false);
  //是否启用验证
  const [isValidate, setIsValidate] = useState<boolean>(false);

  const save = (submit) => {
    setIsValidate(submit);
    form.validateFields((errors, values) => {
      if (!errors) {
        //是否生成租金明细
        if (!isCal && submit) {
          // Modal.warning({
          //   title: '提示',
          //   content: '请生成租金明细！',
          //   okText: '确认'
          // }); 
          message.warning('请生成费用明细！');
          return;
        }
        setLoading(true);
        //保存合同数据 
        let Contract: htAdmincontract = {};
        Contract.no = values.no;
        Contract.follower = values.follower;
        Contract.followerId = values.followerId;
        Contract.amount = values.amount;
        Contract.signingDate = values.signingDate.format('YYYY-MM-DD');
        Contract.startDate = values.startDate.format('YYYY-MM-DD');
        Contract.endDate = values.endDate.format('YYYY-MM-DD');
        Contract.vendorName = values.vendorName;
        Contract.vendorId = values.vendorId;
        Contract.linkMan = values.linkMan;
        Contract.linkPhone = values.linkPhone;
        Contract.address = values.address;
        Contract.signer = values.signer;
        Contract.signerId = values.signerId;
        Contract.organizeId = organizeId;

        Contract.penaltyRatio = values.penaltyRatio;
        Contract.penaltyDate = values.penaltyDate ? values.penaltyDate.format('YYYY-MM-DD') : null;
        Contract.lastResultScale = values.lastResultScale;
        Contract.lastScaleDispose = values.lastScaleDispose;

        Contract.memo = values.memo;

        SaveForm({
          ...Contract,
          keyvalue: '',
          room: values.room,
          termJson: TermJson,
          chargeFeeResult: JSON.stringify(chargeData)
        }).then(res => {
          message.success('保存成功');
          closeDrawer();
          reload();
          setLoading(false);
        });
      }
    });
  };

  // 打开抽屉时初始化
  // useEffect(() => {
  // }, [visible]);

  // const handleSearch = value => {
  //   if (value == '')
  //     return;
  //   GetUserList(value, '员工').then(res => {
  //     setUserSource(res || []);
  //   })
  // };

  // const userList = userSource.map
  //   (item => <Option key={item.id} value={item.name}>{item.name}</Option>);

  const onFollowerSelect = (value, option) => {
    form.setFieldsValue({ followerId: option.key });
  };

  // const onFollowerChange = (value) => { 
  //   //验证值
  //   const len = userSource.indexOf(value);
  //   if (len < 0) {
  //     message.warning('用户不存在');
  //   } 
  // };

  const onSignerSelect = (value, option) => {
    form.setFieldsValue({ signerId: option.key });
  };


  //保证金单位切换
  // const changeFeeItem = (value, option) => {
  //   //const changeFeeItem = e => {
  //   form.setFieldsValue({ depositFeeItemName: option.props.children });
  // };

  //结束日期控制
  const disabledEndDate = (current) => {
    return current && current.isBefore(moment(form.getFieldValue('startDate')), 'day');
  };

  //起始日期控制
  const disabledStartDate = (current) => {
    return current && current.isAfter(moment(form.getFieldValue('endDate')), 'day');
  };

  //验证用户
  const checkExist = (rule, value, callback) => {
    if (value == undefined || value == '') {
      callback();//'承租方不能为空');
    }
    else {
      CheckVendor(value).then(res => {
        if (res)
          callback('签约对象不存在，请先新增');
        else
          callback();
      })
    }
  };

  const [organizeId, setOrganizeId] = useState<string>('');//所属机构id
  const [userList, setUserList] = useState<any[]>([]);
  const [customerVisible, setCustomerVisible] = useState<boolean>(false);
  const [customer, setCustomer] = useState<any>();

  //签约对象
  const vendorSearch = value => {
    if (value == '') {
      setUserList([]);
    }
    else {
      setUserList([]);
      GetVendorList(value).then(res => {
        // setUserSource(res || []); 
        const list = res.map(item =>
          <Option key={item.id}
            value={item.fullName.trim()}>{item.fullName.trim()}
            <span className={styles.linkPhone}>{item.linkPhone}</span>
          </Option>
        ).concat([
          <Option disabled key="all" className={styles.addCustomer}>
            <a onClick={() => showCustomerDrawer('')}>
              新增
            </a>
          </Option>]);//新增 
        setUserList(list);
      })
    }
  };

  const onVendorSelect = (value, option) => {
    //props.children[1].props.children
    form.setFieldsValue({ vendorId: option.key });
    GetDetailJson(option.key).then(res => {
      form.setFieldsValue({ linkMan: res.linkMan });
      form.setFieldsValue({ linkPhone: res.linkPhone });
      form.setFieldsValue({ address: res.address });
      setOrganizeId(res.organizeId);
    })
  };

  const closeCustomerDrawer = () => {
    setCustomerVisible(false);
  };

  const showCustomerDrawer = (vendorId) => {
    if (vendorId != '') {
      GetDetailJson(vendorId).then(res => {
        setCustomer(res);
        setCustomerVisible(true);
      })
    } else {
      setCustomerVisible(true);
    }
  };

  //动态条款里面选择费项
  // const changeFee = (value, option) => {
  //   form.setFieldsValue({ feeItemName: option.props.children });
  // };

  //附件上传
  const [fileList, setFileList] = useState<any[]>([]);
  // const uploadButton = (
  //   <div>
  //     <Icon type="plus" />
  //     <div className="ant-upload-text">点击上传附件</div>
  //   </div>
  // );

  //重新设置state
  const handleChange = ({ fileList }) => setFileList([...fileList]);
  const handleRemove = (file) => {
    const fileid = file.fileid || file.response.fileid;
    RemoveFile(fileid).then(res => {
    });
  };

  const [chargeData, setChargeData] = useState<HtAdminfeeresult[]>([]);//费用
  const [TermJson, setTermJson] = useState<string>();

  //计算租金明细
  const calculation = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        //租赁条款     
        // setLoading(true);
        let TermJson: HtAdmincontractfee[] = [];
        let data: HtAdmincontractfee = {};
        data.feeItemId = values.feeItemId[0];
        data.feeItemName = values.feeItemName[0];
        data.beginDate = values.beginDate[0].format('YYYY-MM-DD');
        data.endDate = values.endDate[0].format('YYYY-MM-DD');
        data.amount = values.amount[0];
        TermJson.push(data);

        //动态添加的租期
        values.LeaseTerms.map(function (k, index, arr) {
          let data: HtAdmincontractfee = {};
          data.feeItemId = values.feeItemId[k];
          data.feeItemName = values.feeItemName[k];
          data.beginDate = values.beginDate[k];
          data.endDate = values.endDate[k];
          data.amount = values.amount[k];
          TermJson.push(data);
        });

        let strTermJson = JSON.stringify(TermJson);
        setTermJson(strTermJson);

      
        GetChargeDetail({
          TermJson: strTermJson,
        }).then(res => {
          setIsCal(true);//计算租金 
          setChargeData(res.chargeFeeResultList);//租金明细   
          setLoading(false);
        });
      }
    });
  };


  return (
    <Drawer
      title={title}
      placement="right"
      width={850}
      onClose={closeDrawer}
      visible={visible}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <Form layout="vertical" hideRequiredMark>
        <Spin tip="数据处理中..." spinning={loading}>
          <Tabs defaultActiveKey="1" >
            <TabPane tab="基本信息" key="1">
              <Row gutter={24}>
                <Col span={12}>
                  <Card title="基本信息"
                   className={styles.addcard} 
                   hoverable>
                    {/* <Row gutter={24}>
                      <Col lg={24}>
                        <Form.Item label="模板选择">
                          {getFieldDecorator('template', {
                          })(<Select placeholder="请选择模板" />)}
                        </Form.Item>
                      </Col>
                    </Row> */}
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="合同编号" required>
                          {getFieldDecorator('no', {
                            rules: [{ required: true, message: '请输入合同编号' }],
                          })(<Input placeholder="请输入合同编号" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="合同金额">
                          {getFieldDecorator('amount', {
                            rules: [{ required: true, message: '请输入合同金额' }],
                          })(<Input placeholder="自动获取合同金额" readOnly />)}
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="起始日期">
                          {getFieldDecorator('startDate', {
                            initialValue: moment(new Date()),
                            rules: [{ required: true, message: '请选择起始日期' }],
                          })(<DatePicker placeholder="请选择起始日期"
                            disabledDate={disabledStartDate}
                            style={{ width: '100%' }}
                          />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="终止日期" required>
                          {getFieldDecorator('endDate', {
                            initialValue: moment(new Date()).add(1, 'years').add(-1, 'days'),
                            rules: [{ required: true, message: '请选择终止日期' }],
                          })(<DatePicker placeholder="请选择终止日期"
                            disabledDate={disabledEndDate}
                            style={{ width: '100%' }} />)}
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="签约日期" required>
                          {getFieldDecorator('signingDate', {
                            initialValue: moment(new Date()),
                            rules: [{ required: true, message: '请选择签约日期' }],
                          })(<DatePicker placeholder="请选择签约日期" style={{ width: '100%' }} />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="签约人">
                          {/* {getFieldDecorator('follower', {
                          })(
                            <AutoComplete
                              dataSource={userList}
                              onSearch={handleSearch}
                              placeholder="请输入跟进人"
                              onSelect={onFollowerSelect}
                              // onChange={onFollowerChange}
                            />
                          )} */}
                          {getFieldDecorator('signer', {
                          })(
                            <Select
                              showSearch
                              // onSearch={handleSearch}
                              // optionFilterProp="children"
                              placeholder="请选择签约人"
                              onSelect={onSignerSelect}>
                              {userSource.map(item => (
                                <Option key={item.id} value={item.name}>
                                  {item.name}
                                </Option>
                              ))}
                            </Select>
                          )}
                          {getFieldDecorator('signerId', {
                          })(
                            <input type='hidden' />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="经营主体" >
                          {getFieldDecorator('businessEntity', {
                            // rules: [{ required: true, message: '请输入经营主体' }],
                          })(<Input placeholder="请输入经营主体" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="付款方式">
                          {getFieldDecorator('payType', {
                            // rules: [{ required: true, message: '请输入付款方式' }],
                          })(<Input placeholder="请输入付款方式" />)}
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="跟进人">
                          {getFieldDecorator('follower', {
                          })(
                            <Select
                              showSearch
                              placeholder="请选择跟进人"
                              onSelect={onFollowerSelect}
                            >
                              {userSource.map(item => (
                                <Option key={item.id} value={item.name}>
                                  {item.name}
                                </Option>
                              ))}
                            </Select>
                          )}
                          {getFieldDecorator('followerId', {
                          })(
                            <input type='hidden' />
                          )}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="渠道"  >
                          {getFieldDecorator('channelType', {
                            // rules: [{ required: true, message: '请选择渠道' }],
                          })(
                            <Select placeholder="请选择渠道"  >
                              {channel.map(item => (
                                <Option value={item.value} key={item.key}>
                                  {item.title}
                                </Option>
                              ))}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>

                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="签约信息" className={styles.addcard} hoverable>
                    <Row gutter={24}>
                      <Col lg={24}>
                        <Form.Item label='签约对象' required>
                          {getFieldDecorator('vendorName', {
                            rules: [{
                              required: true,
                              message: '请输入签约对象'
                            },
                            { validator: checkExist }]
                          })(
                            <AutoComplete
                              dropdownClassName={styles.searchdropdown}
                              optionLabelProp="value"
                              dropdownMatchSelectWidth={false}
                              dataSource={userList}
                              onSearch={vendorSearch}
                              placeholder="请输入签约对象"
                              onSelect={onVendorSelect}
                            />
                          )}
                          {getFieldDecorator('vendorId', {
                            initialValue: ''
                          })(
                            <input type='hidden' />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="联系人" required>
                          {getFieldDecorator('linkMan', {
                            rules: [{ required: true, message: '请输入联系人' }],
                          })(<Input placeholder="请输入联系人"
                            disabled={form.getFieldValue('vendorId') == '' ? true : false}
                          />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="联系电话" required>
                          {getFieldDecorator('linkPhone', {
                            rules: [{ required: true, message: '请输入联系电话' }],
                          })(<Input placeholder="请输入联系电话"
                            disabled={form.getFieldValue('vendorId') != '' ? false : true} />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={24}>
                        <Form.Item label="联系地址" required>
                          {getFieldDecorator('address', {
                            rules: [{ required: true, message: '请输入联系地址' }],
                          })(<Input placeholder="请输入联系地址" disabled={form.getFieldValue('vendorId') != '' ? false : true} />)}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>

            </TabPane>
            <TabPane tab="费用条款" key="2">

              <Card title="基本条款" className={styles.card} hoverable >
                <Row gutter={24}>
                  <Col lg={5}>
                    <Form.Item label="违约金比例(‰)" >
                      {getFieldDecorator('penaltyRatio', {
                        initialValue: 3,
                      })(<InputNumber placeholder="请输入违约金比例" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                  <Col lg={7}>
                    <Form.Item label="违约金起算日期" >
                      {getFieldDecorator('penaltyDate', {
                      })(<DatePicker placeholder="请选择违约金起算日期" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>

                  <Col lg={6}>
                    <Form.Item label="保留小数位数">
                      {getFieldDecorator('lastResultScale', {
                        initialValue: 2,
                        rules: [{ required: true, message: '请选择小数位数' }],
                      })(
                        <Select placeholder="请选择小数位数">
                          <Option value={0}>0</Option>
                          <Option value={1}>1</Option>
                          <Option value={2}>2</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={6}>
                    <Form.Item label="对最后一位">
                      {getFieldDecorator('lastScaleDispose', {
                        initialValue: 1,
                        rules: [{ required: true, message: '请选择小数处理方法' }],
                      })(
                        <Select placeholder="请选择小数处理方法">
                          <Option value={1}>四舍五入</Option>
                          <Option value={2}>直接舍去</Option>
                          <Option value={3}>有数进一</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <LeaseTerm form={form} feeItems={feeItems} isValidate={isValidate} ></LeaseTerm>
              <Button style={{ width: '100%', marginBottom: '10px' }}
                onClick={calculation}>点击生成费用明细</Button>
              <ResultList
                chargeData={chargeData}
                className={styles.addcard}
              ></ResultList>
            </TabPane>

            <TabPane tab="其他条款" key="3">
              <Row gutter={24}>
                <Col lg={24}>
                  <Form.Item label="&nbsp;">
                    {getFieldDecorator('memo', {
                    })(
                      <TextArea rows={15} placeholder="请输入条款" />
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col lg={24}>
                  <div className="clearfix">
                    <Upload
                      // accept='.doc,.docx,.pdf,image/*'
                      action={process.env.basePath + '/Contract/Upload'}
                      fileList={fileList}
                      listType='picture'
                      onChange={handleChange}
                      onRemove={handleRemove}>
                      {/* {uploadButton} */}
                      <Button>
                        <Icon type="upload" />上传附件
                      </Button>
                    </Upload>
                  </div>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Spin>
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
        <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
        关闭
        </Button>
        <Button onClick={() => save(false)} style={{ marginRight: 8 }}>
          保存
        </Button>
        <Button onClick={() => save(true)} type="primary">
          提交
        </Button>
      </div>

      <QuickModify
        modifyVisible={customerVisible}
        closeDrawer={closeCustomerDrawer}
        data={customer}
        organizeId={organizeId}
        // type={type}
        reload={(vendorId) => {
          GetDetailJson(vendorId).then(res => {
            //防止旧数据缓存，清空下拉
            setUserList([]);
            form.setFieldsValue({ ownerName: res.fullName });
            form.setFieldsValue({ ownerId: vendorId });
            form.setFieldsValue({ ownerPhone: res.linkPhone });
          });
        }
        }
      />

    </Drawer>
  );
};

export default Form.create<AddProps>()(Add);

