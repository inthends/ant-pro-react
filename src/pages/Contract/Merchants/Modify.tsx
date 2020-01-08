
import { Spin, Slider, message, InputNumber, TreeSelect, Select, Button, Card, Col, DatePicker, Drawer, Form, Input, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { getCommonItems, GetUserList } from '@/services/commonItem';
import { GetFormJson, SaveForm } from './Main.service';
import { GetOrgTreeSimple, GetAsynChildBuildingsSimple } from '@/services/commonItem';
import styles from './style.less';
const { Option } = Select;
const { TextArea } = Input;

interface ModifyProps {
  visible: boolean;
  id?: string;
  closeDrawer(): void;
  form: WrappedFormUtils;
  reload(): void;
};

const Modify = (props: ModifyProps) => {
  const { id, visible, closeDrawer, form, reload } = props;
  const title = id ? '修改客户' : '添加客户';
  const { getFieldDecorator } = form;
  const [industryType, setIndustryType] = useState<any[]>([]);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [userSource, setUserSource] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [rooms, setRooms] = useState<any[]>([]);

  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        setLoading(true);
        const newData = infoDetail ? { ...infoDetail, ...values } : values;
        newData.visitDate = newData.visitDate == '' ? '' : newData.visitDate.format('YYYY-MM-DD');
        newData.signingDate = newData.signingDate == '' ? '' : newData.signingDate.format('YYYY-MM-DD');
        newData.oldContractDueDate = newData.oldContractDueDate == '' ? '' : newData.oldContractDueDate.format('YYYY-MM-DD');
        SaveForm({
          ...newData,
          keyValue: id == null || id == '' ? '' : id,
          rooms: newData.room
        }).then(res => {
          setLoading(false);
          message.success('保存成功');
          closeDrawer();
          if (id) {
            //关闭查看页面 
          }
          reload();
        });
      }
    });
  };

  //打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      getCommonItems('IndustryType').then(res => {
        setIndustryType(res || []);
      });

      //获取房产树
      GetOrgTreeSimple().then((res: any[]) => {
        setTreeData(res || []);
      });

      GetUserList('', '员工').then(res => {
        setUserSource(res || []);
      })


      if (id) {
        setLoading(true);
        GetFormJson(id).then((res) => {
          setInfoDetail(res.data);
          // setRooms(res.houseList || []);
          let house: any[] = [];
          if (res != null && res.houseList != null) {
            res.houseList.forEach(item => {
              house.push(item.roomId);
            });
            setRooms(house);
          }
          form.resetFields(); 
          setLoading(false);
        });
      }
      else {
        setInfoDetail({});
        setRooms([]);
        // form.setFieldsValue({});
        // form.resetFields();
      }
    }
    // else {
    //   form.setFieldsValue({});
    // }
  }, [visible]);

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

  const onChannelSelect = (value, option) => {
    form.setFieldsValue({ channelContactId: option.key });
  };

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
  // const onIndustrySelect = (value, option) => { 
  //   //设置行业名称
  //   form.setFieldsValue({ industry: option.props.children });
  // };

  //异步加载
  const onLoadData = treeNode =>
    new Promise<any>(resolve => {
      if (treeNode.props.children && treeNode.props.children.length > 0 && treeNode.props.type != 'D') {
        resolve();
        return;
      }
      setTimeout(() => {
        GetAsynChildBuildingsSimple(treeNode.props.eventKey, treeNode.props.type).then((res: any[]) => {
          // treeNode.props.children = res || [];
          let newtree = treeData.concat(res);
          // setTreeData([...treeData]);
          setTreeData(newtree);
        });
        resolve();
      }, 50);
    });

  return (
    <Drawer
      title={title}
      placement="right"
      width={1050}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <Form layout="vertical" hideRequiredMark>
        <Spin tip="数据处理中..." spinning={loading}>
          <Row gutter={24}>
            <Col span={12}>
              <Card title="基本信息" className={styles.addcard}>
                <Row gutter={24}>
                  <Col lg={24}>
                    <Form.Item label="客户名称" required>
                      {getFieldDecorator('customer', {
                        initialValue: infoDetail.customer,
                        rules: [{ required: true, message: '请输入客户名称' }],
                      })(<Input placeholder="请输入客户名称" />)}
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="客户联系人" required>
                      {getFieldDecorator('customerContact', {
                        initialValue: infoDetail.customerContact,
                        rules: [{ required: true, message: '请输入客户联系人' }],
                      })(<Input placeholder="请输入客户联系人" />)}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label="联系人电话">
                      {getFieldDecorator('customerTelephone', {
                        initialValue: infoDetail.customerTelephone,
                        rules: [{ required: true, message: '请输入联系人电话' }],
                      })(<Input placeholder="请输入联系人电话" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="行业" required>
                      {getFieldDecorator('industry', {
                        initialValue: infoDetail.industry,
                        rules: [{ required: true, message: '请选择行业' }],
                      })(
                        <Select placeholder="请选择行业">
                          {industryType.map(item => (
                            <Option value={item.title} key={item.title}>
                              {item.title}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label="跟进人" >
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
                      {getFieldDecorator('follower', {
                        initialValue: infoDetail.follower,
                        rules: [{ required: true, message: '请选择跟进人' }]
                      })(
                        <Select
                          showSearch
                          placeholder="请选择跟进人"
                          onSelect={onFollowerSelect} >
                          {userSource.map(item => (
                            <Option key={item.id} value={item.name}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      )}
                      {getFieldDecorator('followerId', {
                        initialValue: infoDetail.followerId,
                      })(
                        <input type='hidden' />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="来访时间" required>
                      {getFieldDecorator('visitDate', {
                        initialValue: infoDetail.visitDate
                          ? moment(new Date(infoDetail.visitDate))
                          : moment(new Date()),
                      })(<DatePicker placeholder="请选择来访时间" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label="客户状态" required>
                      {getFieldDecorator('status', {
                        initialValue: infoDetail.status ? infoDetail.status : 1
                      })(<Select >
                        <Option value={1}>初次接触</Option>
                        <Option value={2}>潜在客户</Option>
                        <Option value={3}>意向客户</Option>
                        <Option value={4}>成交客户</Option>
                        <Option value={5}>流失客户</Option>
                      </Select>)}
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="需求数量最小值/㎡" required>
                      {getFieldDecorator('demandMinSize', {
                        initialValue: infoDetail.demandMinSize,
                        rules: [{ required: true, message: '请输入最小值' }]
                      })(<Input placeholder="请输入最小值" />)}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label="最大值/㎡" required>
                      {getFieldDecorator('demandMaxSize', {
                        initialValue: infoDetail.demandMaxSize,
                        rules: [{ required: true, message: '请输入最大值' }]
                      })(<Input placeholder="请输入最大值" />
                      )}
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="成交几率">
                      {getFieldDecorator('tradeOdds', {
                        initialValue: infoDetail.tradeOdds ? infoDetail.tradeOdds : 0
                      })(
                        <Slider
                          tipFormatter={(value) => {
                            return `${value}%`;
                          }
                          }
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label="预计签约时间">
                      {getFieldDecorator('signingDate', {
                        initialValue: infoDetail.signingDate
                          ? moment(new Date(infoDetail.signingDate))
                          : '',
                      })(<DatePicker placeholder="请选择预计签约时间"
                        style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="来访渠道">
                      {getFieldDecorator('visitChannel', {
                        initialValue: infoDetail.visitChannel
                      })(
                        <Select placeholder="请选择来访渠道" >
                          {industryType.map(item => (
                            <Option value={item.title} key={item.title}>
                              {item.title}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label="渠道联系人" >
                      {getFieldDecorator('channelContact', {
                        initialValue: infoDetail.channelContact
                      })(
                        <Select showSearch
                          placeholder="请选择渠道联系人"
                          onSelect={onChannelSelect} >
                          {userSource.map(item => (
                            <Option key={item.id} value={item.name}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      )}
                      {getFieldDecorator('channelContactId', {
                        initialValue: infoDetail.channelContactId
                      })(
                        <input type='hidden' />
                      )}
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col lg={24}>
                    <Form.Item label="备注">
                      {getFieldDecorator('remark', {
                        initialValue: infoDetail.remark,
                      })(
                        <TextArea rows={3} placeholder="请输入备注" />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={12}>
              <Card title="意向房源" className={styles.card}>
                <Row gutter={24}>
                  <Col lg={24}>
                    <Form.Item label="意向房源选择" required>
                      {getFieldDecorator('room', {
                        initialValue: rooms,
                      })(
                        <TreeSelect
                          placeholder="请选择意向房源"
                          allowClear
                          dropdownStyle={{ maxHeight: 300 }}
                          treeData={treeData}
                          loadData={onLoadData}
                          treeDataSimpleMode={true}
                          multiple={true}>
                        </TreeSelect>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Card title="需求信息" className={styles.card}>
                <Row gutter={24}>
                  <Col lg={24}>
                    <Form.Item label="城市/区域/商圈" >
                      {getFieldDecorator('tradingArea', {
                        initialValue: infoDetail.tradingArea,
                      })(
                        <Select placeholder="请选择商圈">
                          {industryType.map(item => (
                            <Option value={item.title} key={item.title}>
                              {item.title}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col lg={8}>
                    <Form.Item label="期望价格最小值" >
                      {getFieldDecorator('demandMinPrice', {
                        initialValue: infoDetail.demandMinPrice,
                      })(<InputNumber placeholder="请输入最小值" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                  <Col lg={8}>
                    <Form.Item label="最大值" >
                      {getFieldDecorator('demandMaxPrice', {
                        initialValue: infoDetail.demandMaxPrice,
                      })(<InputNumber placeholder="请输入最大值" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                  <Col lg={8}>
                    <Form.Item label="&nbsp;" >
                      {getFieldDecorator('demandPriceUnit', {
                        initialValue: infoDetail.demandPriceUnit ? infoDetail.demandPriceUnit : '元/m²·天'
                      })(<Select >
                        <Option value="元/m²·天">元/m²·天</Option>
                        <Option value="元/m²·月">元/m²·月</Option>
                        <Option value="元/天">元/天</Option>
                        <Option value="元/月">元/月</Option>
                      </Select>)}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              <Card title="客户当前信息" className={styles.addcard}>
                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="联系地址" >
                      {getFieldDecorator('customerAddress', {
                        initialValue: infoDetail.customerAddress,
                      })(<Input placeholder="请输入联系地址" />)}
                    </Form.Item>
                  </Col>

                  <Col lg={12}>
                    <Form.Item label="当前合同到期日" >
                      {getFieldDecorator('oldContractDueDate', {
                        initialValue: infoDetail.oldContractDueDate
                          ? moment(new Date(infoDetail.oldContractDueDate))
                          : '',
                      })(<DatePicker placeholder="请选择当前合同到期日" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={9}>
                    <Form.Item label="当前租赁数/㎡"  >
                      {getFieldDecorator('leaseSize', {
                        initialValue: infoDetail.leaseSize,
                      })(<InputNumber placeholder="请输入当前租赁数" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>

                  <Col lg={8}>
                    <Form.Item label="当前租金" >
                      {getFieldDecorator('leasePrice', {
                        initialValue: infoDetail.leasePrice,
                      })(<InputNumber placeholder="请输入当前租金" style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                  <Col lg={7}>
                    <Form.Item label="&nbsp;">
                      {getFieldDecorator('leasePriceUnit', {
                        initialValue: infoDetail.leasePriceUnit ? infoDetail.leasePriceUnit : '元/m²·天'
                      })(
                        <Select >
                          <Option value="元/m²·天">元/m²·天</Option>
                          <Option value="元/m²·月">元/m²·月</Option>
                          <Option value="元/天">元/天</Option>
                          <Option value="元/月">元/月</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
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
          取消
          </Button>
        <Button onClick={save} type="primary">
          确定
          </Button>
      </div>
    </Drawer>
  );
};

export default Form.create<ModifyProps>()(Modify);

