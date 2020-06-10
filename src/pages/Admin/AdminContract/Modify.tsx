//修改合同
import {
  Tooltip, Upload, Icon, Tag, Spin, Divider, PageHeader, AutoComplete, InputNumber, message,
  Tabs, Select, Button, Card, Col, DatePicker, Drawer, Form, Input, Row
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { TreeEntity, htAdmincontractfee, htAdmincontract, ChargeDetailDTO } from '@/model/models';
import React, { useEffect, useState } from 'react';
import {
  RemoveFile, GetFilesData, SubmitForm, SaveForm, GetFeeItemsByUnitId,
  GetCharge, GetContractInfo, GetModifyChargeDetail, GetAllFeeItems,GetFollowCount
} from './Main.service';
import { GetCommonItems, GetUserList } from '@/services/commonItem';
import { GetDetailJson, CheckVendor, GetVendorList } from '../../Resource/Vendor/Vendor.service';
import moment from 'moment';
import styles from './style.less';
import QuickModify from '../../Resource/PStructUser/QuickModify';
import Follow from './Follow';
import LeaseTermModify from './LeaseTermModify';
import ResultList from './ResultList';

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface ModifyProps {
  visible: boolean;
  id?: string;//合同id
  chargeId?: string;//合同条款id
  closeDrawer(): void;
  form: WrappedFormUtils;
  reload(): void;
  // treeData: any[];
  // choose(): void;
};

const Modify = (props: ModifyProps) => {
  const title = '修改合同';
  const { visible, closeDrawer, id, form, chargeId, reload } = props;
  const { getFieldDecorator } = form;
  const [infoDetail, setInfoDetail] = useState<htAdmincontract>({});
  const [chargeData, setChargeData] = useState<any[]>([]);
  const [feeItems, setFeeItems] = useState<TreeEntity[]>([]);
  const [TermJson, setTermJson] = useState<string>();
  const [userSource, setUserSource] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [channel, setChannel] = useState<any[]>([]);//渠道 
  const [followVisible, setFollowVisible] = useState<boolean>(false);
  const [chargeFeeList, setChargeFeeList] = useState<htAdmincontractfee[]>([]);

  const showFollowDrawer = () => {
    setFollowVisible(true);
  };

  const closeFollowDrawer = () => {
    setFollowVisible(false);
  };

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

  }, []);

  // 打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      if (id) {
        setLoading(true);
        GetContractInfo(id).then((tempInfo) => {

          //加载费项
          GetFeeItemsByUnitId(tempInfo.contract.billUnitId).then(res => {
            setFeeItems(res || []);
          });

          setInfoDetail(tempInfo.contract);
          setCount(tempInfo.followCount);

          //获取条款
          GetCharge(chargeId).then((charge: ChargeDetailDTO) => {
            setChargeFeeList(charge.chargeFeeList || []);//费用条款
            setChargeData(charge.chargeFeeResultList || []);//明细  
          });

          //附件
          GetFilesData(id).then(res => {
            setFileList(res || []);
          });
          //合计信息
          setTotalInfo({
            // leasePrice: tempInfo.leasePrice,
            // totalDeposit: tempInfo.totalDeposit,
            totalAmount: tempInfo.totalAmount,
            // totalPropertyAmount: tempInfo.totalPropertyAmount
          });
          form.resetFields();
          setLoading(false);
        });
      } else {
        form.resetFields();
        setFileList([]);
      }
    } else {
      form.setFieldsValue({});
    }
  }, [visible]);

  // const handleSearch = value => {
  //   if (value == '')
  //     return;
  //   GetUserList(value, '员工').then(res => {
  //     setUserSource(res || []);
  //   })
  // };
  // const userList = userSource.map(item => <Option key={item.id} value={item.name}>{item.name}</Option>);

  const onFollowerSelect = (value, option) => {
    form.setFieldsValue({ followerId: option.key });
  };

  const onSignerSelect = (value, option) => {
    form.setFieldsValue({ signerId: option.key });
  };

  const [isCal, setIsCal] = useState<boolean>(false);

  //计算租金明细
  const calculation = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        // setLoading(true);
        //租赁条款     
        let TermJson: htAdmincontractfee[] = [];
        //动态添加的租期
        values.LeaseTerms.map(function (k, index, arr) {
          let mychargefee: htAdmincontractfee = {};
          mychargefee.feeItemId = values.feeItemId[index];
          mychargefee.feeItemName = values.feeItemName[index];
          mychargefee.beginDate = values.beginDate[index].format('YYYY-MM-DD');
          mychargefee.endDate = values.endDate[index].format('YYYY-MM-DD');
          mychargefee.amount = values.amount[index];
          TermJson.push(mychargefee);
        });

        let strTermJson = JSON.stringify(TermJson);
        setTermJson(strTermJson);

        GetModifyChargeDetail({
          termJson: strTermJson
        }).then(tempInfo => {

          setChargeData(tempInfo.dataInfo.chargeFeeResultList);//租金明细   
          //合计信息
          setTotalInfo({
            // leasePrice: tempInfo.leasePrice,
            // totalDeposit: tempInfo.totalDeposit,
            amount: tempInfo.amount,
            // totalPropertyAmount: tempInfo.totalPropertyAmount
          });
          setLoading(false);
        });
      }
    });
  };

  //提交审核
  const submit = () => {
    //弹出选人
    //choose();
    //save(); 
    //发起审批
    form.validateFields((errors, values) => {
      if (!errors) {
        setLoading(true);
        //合同信息
        let Contract: htAdmincontract = {};
        Contract.id = id;
        Contract.no = values.no;
        Contract.follower = values.follower;
        Contract.followerId = values.followerId;
        Contract.amount = values.amount;
        Contract.signingDate = values.signingDate.format('YYYY-MM-DD');
        Contract.startDate = values.startDate.format('YYYY-MM-DD');
        Contract.endDate = values.endDate.format('YYYY-MM-DD');
        Contract.vendorId = values.vendorId;
        Contract.vendorName = values.vendorName;
        Contract.linkMan = values.linkMan;
        Contract.linkPhone = values.linkPhone;
        Contract.address = values.address;
        Contract.signer = values.signer;
        Contract.signerId = values.signerId;
        Contract.organizeId = values.organizeId;

        Contract.penaltyRatio = values.penaltyRatio;
        Contract.penaltyDate = values.penaltyDate ? values.penaltyDate.format('YYYY-MM-DD') : null;
        Contract.lastResultScale = values.lastResultScale;
        Contract.lastScaleDispose = values.lastScaleDispose;

        Contract.memo = values.memo;
        SubmitForm({
          ...Contract,
          keyValue: id, 
          termJson: TermJson,
          ChargeFeeResult: JSON.stringify(chargeData),
        }).then(res => {
          if (res.flag) {
            message.success('提交成功');
            closeDrawer();
            reload();
            setLoading(false);
          } else {
            message.warning(res.message);
            setLoading(false);
          }
        });
      }
    });
  };


  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {  
        setLoading(true);
        //保存合同数据 
        //合同信息
        let Contract: htAdmincontract = {};
        Contract.id = id;
        Contract.no = values.no;
        Contract.follower = values.follower;
        Contract.followerId = values.followerId;
        Contract.amount = values.amount;
        Contract.signingDate = values.signingDate.format('YYYY-MM-DD');
        Contract.startDate = values.startDate.format('YYYY-MM-DD');
        Contract.endDate = values.endDate.format('YYYY-MM-DD');
        Contract.vendorId = values.vendorId;
        Contract.vendorName = values.vendorName;
        Contract.linkMan = values.linkMan;
        Contract.linkPhone = values.linkPhone;
        Contract.address = values.address;
        Contract.signer = values.signer;
        Contract.signerId = values.signerId;
        Contract.organizeId = values.organizeId;
        Contract.memo = values.memo;
        SaveForm({
          ...Contract,
          keyValue: id, 
          termJson: TermJson,
          ChargeFeeResult: JSON.stringify(chargeData)
        }).then(res => {
          message.success('保存成功');
          closeDrawer();
          reload();
          setLoading(false);
        });
      }
    });
  };

  //转换状态
  const GetStatus = (status) => {
    switch (status) {
      case 0:
        return <Tag color="#e4aa5b">新建待修改</Tag>;
      case 1:
        return <Tag color="#e4aa4b">新建待审核</Tag>;
      case 2:
        return <Tag color="#19d54e">变更待修改</Tag>;
      case 3:
        return <Tag color="#19d54e">变更待审核</Tag>;
      case 4:
        return <Tag color="#19d54e">退租待审核</Tag>;
      case 5:
        return <Tag color="#19d54e">作废待审核</Tag>;
      case 6:
        return <Tag color="#19d54e">正常执行</Tag>;
      case 7:
        return <Tag color="#19d54e">到期未处理</Tag>;
      case 8:
        return <Tag color="#19d54e">待执行</Tag>;
      case -1:
        return <Tag color="#d82d2d">已作废</Tag>
      default:
        return '';
    }
  };

  //保证金单位切换
  // const changeFeeItem = (value, option) => {
  //   form.setFieldsValue({ depositFeeItemName: option.props.children });
  // };

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

  // const [organizeId, setOrganizeId] = useState<string>('');//所属机构id
  const [userList, setUserList] = useState<any[]>([]);
  const [customerVisible, setCustomerVisible] = useState<boolean>(false);
  const [customer, setCustomer] = useState<any>();

  const closeCustomerDrawer = () => {
    setCustomerVisible(false);
  };

  const showCustomerDrawer = (customerId) => {
    if (customerId != '') {
      GetDetailJson(customerId).then(res => {
        setCustomer(res);
        setCustomerVisible(true);
      })
    } else {
      setCustomerVisible(true);
    }
  };

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
            value={item.name.trim()}>{item.name.trim()}
            <span className={styles.phoneNum}>{item.phoneNum}</span>
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
    })
  };


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


  //跟进 
  const [totalInfo, setTotalInfo] = useState<any>({});//合计信息 
  const [count, setCount] = useState<string>('0');

  //结束日期控制
  const disabledEndDate = (current) => {
    return current && current.isBefore(moment(form.getFieldValue('startDate')), 'day');
  };

  //起始日期控制
  const disabledStartDate = (current) => {
    return current && current.isAfter(moment(form.getFieldValue('endDate')), 'day');
  };


  return (
    <Drawer
      title={title}
      placement="right"
      width={850}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <PageHeader
        ghost={false}
        title={null}
        subTitle={
          <div>
            <label style={{ color: '#4494f0', fontSize: '24px' }}>{infoDetail.vendorName}</label>
          </div>
        }
        //title={GetStatus(infoDetail.status)}
        style={{
          border: '1px solid rgb(235, 237, 240)'
        }}
        extra={[
          <Tooltip title='跟进人'>
            <Button key="1" icon="user"> {infoDetail.follower}</Button>
          </Tooltip>,
          // <Button key="2" icon="edit" onClick={() => modify(id)}>编辑</Button>,
          <Button key="2" icon="message" onClick={showFollowDrawer} >跟进({count})</Button>
        ]}
      // extra={[
      //   <Button key="1">附件</Button>, 
      //   <Button key="2">打印</Button>,
      // ]}
      >
        <Divider dashed />
        {GetStatus(infoDetail.status)}
      合同摘要 【合同期间
      {form.getFieldValue('startDate') ? moment(form.getFieldValue('startDate')).format('YYYY-MM-DD') : ''}
      到{form.getFieldValue('endDate') ? moment(form.getFieldValue('endDate')).format('YYYY-MM-DD') : ''}，
      付款方式{form.getFieldValue('payType')}，
      合同金额{totalInfo.amount}】
      </PageHeader>
      <Divider dashed />
      <Form layout="vertical" hideRequiredMark>
        <Spin tip="数据处理中..." spinning={loading}>
          <Tabs defaultActiveKey="1" >
            <TabPane tab="基本信息" key="1">
              <Row gutter={24}>
                <Col span={12}>
                  <Card title="基本信息" className={styles.addcard} hoverable>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="合同编号" required>
                          {getFieldDecorator('no', {
                            initialValue: infoDetail.no,
                            rules: [{ required: true, message: '请输入合同编号' }],
                          })(<Input placeholder="请输入合同编号" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="合同金额">
                          {getFieldDecorator('amount', {
                            initialValue: infoDetail.amount,
                            //rules: [{ required: true, message: '请输入租赁数量' }],
                          })(<Input placeholder="自动获取合同金额" readOnly />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="起始日期" required>
                          {getFieldDecorator('startDate', {
                            initialValue: infoDetail.startDate
                              ? moment(new Date(infoDetail.startDate))
                              : moment(new Date()),
                            rules: [{ required: true, message: '请选择起始日期' }],
                          })(<DatePicker placeholder="请选择起始日期" style={{ width: '100%' }}
                            disabledDate={disabledStartDate}
                          />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="终止日期" required>
                          {getFieldDecorator('endDate', {
                            initialValue: infoDetail.endDate
                              ? moment(new Date(infoDetail.endDate))
                              : moment(new Date()).add(1, 'years').add(-1, 'days'),
                            rules: [{ required: true, message: '请选择终止日期' }],
                          })(<DatePicker placeholder="请选择终止日期"
                            style={{ width: '100%' }}
                            disabledDate={disabledEndDate}
                          />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="签约日期" required>
                          {getFieldDecorator('signingDate', {
                            initialValue: infoDetail.signingDate
                              ? moment(new Date(infoDetail.signingDate))
                              : moment(new Date()),
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
                            initialValue: infoDetail.signer
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
                            initialValue: infoDetail.signerId
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
                            initialValue: infoDetail.businessEntity
                            // rules: [{ required: true, message: '请输入经营主体' }],
                          })(<Input placeholder="请输入经营主体" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="付款方式">
                          {getFieldDecorator('payType', {
                            initialValue: infoDetail.payType
                            // rules: [{ required: true, message: '请输入付款方式' }],
                          })(<Input placeholder="请输入付款方式" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="跟进人" >
                          {/* {getFieldDecorator('follower', {
                            initialValue: infoDetail.follower
                          })(
                            <AutoComplete
                              dataSource={userList}
                              onSearch={handleSearch}
                              placeholder="请输入跟进人"
                              onSelect={onFollowerSelect}
                            />
                          )} */}
                          {getFieldDecorator('follower', {
                            initialValue: infoDetail.follower
                          })(
                            <Select
                              showSearch
                              // onSearch={handleSearch}
                              // optionFilterProp="children"
                              placeholder="请选择招商人"
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
                            initialValue: infoDetail.followerId
                          })(
                            <input type='hidden' />
                          )}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="渠道"  >
                          {getFieldDecorator('channelType', {
                            initialValue: infoDetail.channelType
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
                    {/* <Row gutter={24}>
                      <Col span={24}>
                        <Form.Item label="备注">
                          {getFieldDecorator('memo', {
                            initialValue: infoDetail.memo
                          })(
                            <TextArea rows={3} placeholder="请输入备注" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row> */}
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="签约信息" className={styles.addcard} hoverable>
                    <Row gutter={24}>
                      <Col lg={24}>
                        <Form.Item label="签约对象" required>
                          {getFieldDecorator('vendorName', {
                            initialValue: infoDetail.vendorName,
                            rules: [{
                              required: true,
                              message: '请输入签约对象'
                            },
                            { validator: checkExist }]
                          })(<AutoComplete
                            dropdownClassName={styles.searchdropdown}
                            optionLabelProp="value"
                            dropdownMatchSelectWidth={false}
                            dataSource={userList}
                            onSearch={vendorSearch}
                            placeholder="请输入签约对象"
                            onSelect={onVendorSelect}
                            disabled={form.getFieldValue('organizeId') == '' ? true : false}
                          />)}
                          {getFieldDecorator('vendorId', {
                            initialValue: infoDetail.vendorId,
                          })(
                            <input type='hidden' />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="联系人">
                          {getFieldDecorator('linkMan', {
                            initialValue: infoDetail.linkMan,
                            rules: [{ required: true, message: '请输入联系人' }],
                          })(<Input placeholder="请输入联系人"
                            disabled={form.getFieldValue('customerId') == '' ? true : false}
                          />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="联系电话">
                          {getFieldDecorator('linkPhone', {
                            initialValue: infoDetail.linkPhone,
                            rules: [{ required: true, message: '请输入联系电话' }],
                          })(<Input placeholder="请输入联系电话"
                            disabled={form.getFieldValue('customerId') == '' ? true : false} />)}
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col lg={24}>
                        <Form.Item label="联系地址" required>
                          {getFieldDecorator('address', {
                            initialValue: infoDetail.address,
                            rules: [{ required: true, message: '请输入联系地址' }],
                          })(<Input placeholder="请输入联系地址" disabled={form.getFieldValue('customerId') == '' ? true : false} />)}
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
                        initialValue: infoDetail.penaltyRatio ? infoDetail.penaltyRatio : 3,
                      })(<InputNumber placeholder="请输入违约金比例" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                  <Col lg={7}>
                    <Form.Item label="违约金起算日期" >
                      {getFieldDecorator('lateDate', {
                        initialValue: infoDetail.penaltyDate
                          ? moment(new Date(infoDetail.penaltyDate))
                          : null,
                        // rules: [{ required: true, message: '请选择滞纳金起算日期' }],
                      })(<DatePicker placeholder="请选择违约金起算日期" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>

                  <Col lg={6}>
                    <Form.Item label="保留小数位数">
                      {getFieldDecorator('lastResultScale', {
                        initialValue: infoDetail.lastResultScale || infoDetail.lastResultScale == 0 ? infoDetail.lastResultScale : 2,
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
                        initialValue: infoDetail.lastScaleDispose ? infoDetail.lastScaleDispose : 1,
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
              <LeaseTermModify
                form={form}
                feeItems={feeItems}
                chargeFeeList={chargeFeeList}
              ></LeaseTermModify>
              <Button style={{ width: '100%', marginBottom: '10px' }}
                onClick={calculation}>点击生成租金明细</Button>
              <ResultList
                // depositData={depositData}
                chargeData={chargeData}
                // propertyData={propertyData}
                className={styles.addcard}
              ></ResultList>
            </TabPane>
            <TabPane tab="其他条款" key="3">
              <div style={{ marginBottom: '50px' }}>
                <Row gutter={24}>
                  <Col lg={24}>
                    <Form.Item label="&nbsp;">
                      {getFieldDecorator('memo', {
                        initialValue: infoDetail.memo,
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
                        //accept='.doc,.docx,.pdf,image/*'
                        action={process.env.basePath + '/Contract/Upload?keyValue=' + id}
                        fileList={fileList}
                        //listType="picture-card"
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
              </div>
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
        <Button onClick={save} style={{ marginRight: 8 }}>
          暂存
          </Button>
        <Button onClick={submit} type="primary">
          提交
          </Button>
      </div>

      <QuickModify
        modifyVisible={customerVisible}
        closeDrawer={closeCustomerDrawer}
        data={customer}
        organizeId={form.getFieldValue('organizeId')}
        // type={type}
        reload={(customerId) => {
          GetDetailJson(customerId).then(res => {
            //防止旧数据缓存，清空下拉
            setUserList([]);
            form.setFieldsValue({ ownerName: res.name });
            form.setFieldsValue({ ownerId: customerId });
            form.setFieldsValue({ ownerPhone: res.phoneNum });
          });
        }
        }
      />


      <Follow
        visible={followVisible}
        closeDrawer={closeFollowDrawer}
        id={id}
        reload={() => {
          GetFollowCount(id).then(res => {
            setCount(res);
            // setNewFlow(res.newFollow);
            setLoading(false);
          })
        }}
      />

    </Drawer >
  );
};

export default Form.create<ModifyProps>()(Modify);

