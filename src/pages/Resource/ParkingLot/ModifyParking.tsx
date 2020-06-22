// import { ParkingData } from '@/model/models';
import { GetCommonItems } from '@/services/commonItem';
import { Icon, Button, Card, Col, Drawer, Form, Input, message, Row, Select, DatePicker, TreeSelect, InputNumber } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { SaveParkingForm, ExistEnCode } from './ParkingLot.service';
import { GetParkingCustomerInfo } from '../PStructUser/PStructUser.service';
import QuickModify from '../PStructUser/QuickModify';
import CustomerSelect from '../PStructUser/CustomerSelect';
import styles from './style.less';

const { Option } = Select;
const { TextArea } = Input;
// const { TreeNode } = Tree;

interface ModifyParkingProps {
  modifyVisible: boolean;
  data?: any;
  form: WrappedFormUtils;
  organizeId: string;
  treeData: any[];
  closeDrawer(): void;
  reload(): void;
}

const ModifyParking = (props: ModifyParkingProps) => {
  const { organizeId, treeData, modifyVisible, data, closeDrawer, form, reload } = props;
  const { getFieldDecorator } = form;
  const title = data === undefined ? '添加车位' : '修改车位';
  // const [infoDetail, setInfoDetail] = useState<ParkingData>({});
  // const [estateTree, setEstateTree] = useState<any[]>([]);
  // const [parkingLotState, setParkingLotState] = useState<any[]>([]); // 获取车位状态
  // const [vehicleBrand, setVehicleBrand] = useState<any[]>([]); // 车辆品牌
  const [parkingLotType, setParkingLotType] = useState<any[]>([]); // 车位类型
  const [parkingNature, setParkingNature] = useState<any[]>([]); // 车位性质
  // const [color, setColor] = useState<any[]>([]); // 颜色 
  // const [userSource, setUserSource] = useState<any[]>([]);
  const [infoDetail, setInfoDetail] = useState<any>({});
  // const [userList, setUserList] = useState<any[]>([]);
  // const [type, setType] = useState<any>(1);
  const [customerVisible, setCustomerVisible] = useState<boolean>(false);
  const [customer, setCustomer] = useState<any>();

  // 打开抽屉时初始化
  useEffect(() => {
    // 获取车位状态
    // GetCommonItems('ParkingLotState').then(res => {
    //   setParkingLotState(res || []);
    // });
    // 车位性质
    GetCommonItems('ParkingNature').then(res => {
      setParkingNature(res || []);
    });
    // 车位类型
    GetCommonItems('ParkingLotType').then(res => {
      setParkingLotType(res || []);
    });
    // 车辆品牌
    // GetCommonItems('VehicleBrand').then(res => {
    //   setVehicleBrand(res || []);
    // });
    // // 车辆品牌
    // GetCommonItems('Color').then(res => {
    //   setColor(res || []);
    // });

  }, []);

  // 打开抽屉时初始化
  useEffect(() => {
    if (modifyVisible) {

      if (data) {
        // setInfoDetail({ ...data.baseInfo, ...data.parkingDetail });
        // getEstateTreeData(organizeId, '8').then(res => {
        //   const treeList = res || [];
        //   setEstateTree(treeList);
        // }); 
        setInfoDetail(data);
        form.resetFields();
      }
      else {
        setInfoDetail({});
        form.resetFields();
      }
    } else {
      form.resetFields();
    }
  }, [modifyVisible]);

  const closeCustomerDrawer = () => {
    setCustomerVisible(false);
  };

  const showCustomerDrawer = (customerId, type) => {
    if (customerId != '') {
      GetParkingCustomerInfo(customerId).then(res => {
        setCustomer(res);
        // setType(type);
        setCustomerType(type);
        setCustomerVisible(true);
      })
    } else {
      setCustomerVisible(true);
    }
  };

  const close = () => {
    closeDrawer();
  };

  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        // let newData =
        //   data && data.baseInfo && data.baseInfo.id
        //     ? { ...data.baseInfo, ...data.parkingDetail, ...values, id: data!.parkingDetail!.id }
        //     : values;
        // newData = {
        //   ...newData,
        //   date: values.date ? values.date.format('YYYY-MM-DD') : undefined,
        //   beginRentDate: values.beginRentDate
        //     ? values.beginRentDate.format('YYYY-MM-DD')
        //     : undefined,
        //   endRentDate: values.endRentDate ? values.endRentDate.format('YYYY-MM-DD') : undefined,
        // };
        const newData = data ? { ...data, ...values } : values;
        doSave(newData);
      }
    });
  };

  const doSave = dataDetail => {
    dataDetail.keyvalue = dataDetail.id;
    dataDetail.type = 9;
    dataDetail.organizeId = organizeId;
    SaveParkingForm(dataDetail).then(res => {
      message.success('保存成功');
      closeDrawer();
      reload();
    });
  };

  // const ownerChange = value => {
  //   form.setFieldsValue({ ownerId: '' });
  //   form.setFieldsValue({ ownerPhone: '' });
  //   form.setFieldsValue({ ownerUnitAllName: '' });
  // }

  //业主
  // const ownerSearch = value => {
  //   if (value == '') {
  //     setUserList([]);
  //   }
  //   else {
  //     setUserList([]);
  //     GetCustomerList(value, organizeId).then(res => {
  //       // setUserSource(res || []); 
  //       const list = res.map(item =>
  //         <Option key={item.id}
  //           value={item.id}>{item.name.trim()}
  //           <span className={styles.right}>{item.phoneNum}</span>
  //           <br></br>
  //           {item.code}
  //           <span className={styles.right}>{item.allName}</span>
  //         </Option>
  //       ).concat([
  //         <Option disabled key="all" className={styles.addCustomer}>
  //           <a onClick={() => showCustomerDrawer('', 1)}>
  //             新增业主
  //           </a>
  //         </Option>]);//新增 
  //       setUserList(list);
  //     })
  //   }
  // };

  // const tenantChange = value => {
  //   form.setFieldsValue({ tenantId: '' });
  //   form.setFieldsValue({ tenantPhone: '' });
  //   form.setFieldsValue({ tenantUnitAllName: '' });
  // }

  //租户
  // const tenantSearch = value => {
  //   if (value == '') {
  //     setUserList([]);
  //   }
  //   else {
  //     setUserList([]);
  //     GetCustomerList(value, organizeId).then(res => {
  //       // setUserSource(res || []); 
  //       const list = res.map(item =>
  //         <Option key={item.id}
  //           value={item.id}>{item.name.trim()}
  //           <span className={styles.right}>{item.phoneNum}</span>
  //           <br></br>
  //           {item.code}
  //           <span className={styles.right}>{item.allName}</span>
  //         </Option>
  //       ).concat([
  //         <Option disabled key="all" className={styles.addCustomer}>
  //           <a onClick={() => showCustomerDrawer('', 1)}>
  //             新增租户
  //           </a>
  //         </Option>]);//新增 
  //       setUserList(list);
  //     })
  //   }
  // };

  // const userList = userSource.map(item =>
  //   <Option key={item.id}
  //     value={item.name}>{item.name}
  //     <span className={styles.phoneNum}>{item.phoneNum}</span>
  //   </Option>
  // ).concat([
  //   <Option disabled key="all" className={styles.addCustomer}>
  //     <a href="#" target="_blank" rel="noopener noreferrer">
  //       新增住户
  //     </a>
  //   </Option>]);
  // //新增

  // const onOwnerSelect = (value, option) => {
  //   form.setFieldsValue({ ownerId: value });
  //   if (option.props.children.length == 5) {
  //     form.setFieldsValue({ ownerName: option.props.children[0] });
  //     form.setFieldsValue({ ownerPhone: option.props.children[1].props.children });
  //     form.setFieldsValue({ ownerUnitAllName: option.props.children[4].props.children });
  //   }
  // };

  // const onTenantSelect = (value, option) => { 
  //   form.setFieldsValue({ tenantId: value });
  //   if (option.props.children.length == 5) {
  //     form.setFieldsValue({ tenantName: option.props.children[0] });
  //     form.setFieldsValue({ tenantPhone: option.props.children[1].props.children });
  //     form.setFieldsValue({ tenantUnitAllName: option.props.children[4].props.children });
  //   }
  // };

  //验证用户
  // const checkExist = (rule, value, callback) => {
  //   if (value == undefined || value == '') {
  //     callback();
  //   }
  //   else {
  //     CheckCustomer(organizeId, value).then(res => {
  //       if (res)
  //         callback('人员信息不存在，请先新增');
  //       else
  //         callback();
  //     })
  //   }
  // };

  const [customerType, setCustomerType] = useState<any>(1);//1业主，2住户
  const [customerSelectVisible, setCustomerSelectVisible] = useState<boolean>(false);//用户选择

  const closeCustomerSelect = () => {
    setCustomerSelectVisible(false);
  }


  //验证编码是否重复
  const checkCodeExist = (rule, value, callback) => {
    if (value == undefined) {
      callback();
    }
    else {
      const keyvalue = infoDetail.id == undefined ? '' : infoDetail.id;
      ExistEnCode(keyvalue, value).then(res => {
        if (res)
          callback('车位编号重复');
        else
          callback();
      })
    }
  };

  return (
    <Drawer
      title={title}
      placement="right"
      width={700}
      onClose={close}
      visible={modifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Card className={styles.card}  >
        {modifyVisible ? (
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={24}>
              <Col lg={24}>
                <Form.Item label="所属车库" required>
                  {getFieldDecorator('parentId', {
                    rules: [{ required: true, message: '请选择所属车库' }],
                    initialValue: infoDetail.parentId,
                  })(
                    <TreeSelect placeholder="请选择所属车库"
                      allowClear
                      treeData={treeData}
                      dropdownStyle={{ maxHeight: 400 }}
                      treeDefaultExpandAll>
                    </TreeSelect>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="车位名称" required>
                  {getFieldDecorator('name', {
                    initialValue: infoDetail.name,
                    rules: [{ required: true, message: '请输入车位名称' }],
                  })(<Input placeholder="请输入车位名称" />)}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="车位编号" required>
                  {getFieldDecorator('code', {
                    initialValue: infoDetail.code,
                    rules: [{ required: true, message: '请输入车位编号' },
                    {
                      validator: checkCodeExist
                    }
                    ],
                  })(<Input placeholder="请输入车位编号" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="车位状态">
                  {getFieldDecorator('state', {
                    initialValue: infoDetail.state ? infoDetail.state : 0,
                  })(
                    <Select placeholder="请选择车位状态">
                      {/* {parkingLotState.map(item => (
                        <Option value={item.value} key={item.key}>
                          {item.title}
                        </Option>
                      ))} */}
                      <Option value={0}>未售</Option>
                      <Option value={3}>空置</Option>
                      <Option value={4}>出租</Option>
                      <Option value={5}>自用</Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col lg={12}>
                <Form.Item label="车位类型">
                  {getFieldDecorator('propertyType', {
                    initialValue: infoDetail.propertyType,
                  })(
                    <Select placeholder="请选择车位类型">
                      {parkingLotType.map(item => (
                        <Option value={item.value} key={item.key}>
                          {item.title}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="车位性质">
                  {getFieldDecorator('parkingNature', {
                    initialValue: infoDetail.parkingNature,
                  })(
                    <Select placeholder="请选择车位性质">
                      {parkingNature.map(item => (
                        <Option value={item.value} key={item.key}>
                          {item.title}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="交付日期">
                  {getFieldDecorator('date', {
                    initialValue: infoDetail.handoverDate
                      ? moment(new Date(infoDetail.handoverDate))
                      : moment(new Date()),
                  })(<DatePicker style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="建筑面积(㎡)">
                  {getFieldDecorator('area', {
                    initialValue: infoDetail.area,
                  })(<InputNumber placeholder="请输入建筑面积" style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="计费面积(㎡)">
                  {getFieldDecorator('billArea', {
                    initialValue: infoDetail.billArea,
                  })(<InputNumber placeholder="请输入计费面积" style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col lg={12}>
                <Form.Item label={infoDetail.ownerName ? <div>业主名称 <a onClick={() => { showCustomerDrawer(infoDetail.ownerId, 1) }}>编辑</a></div> : '业主名称'}>
                  {/* {getFieldDecorator('ownerId', {
                    initialValue: infoDetail.ownerId,
                  })(<TextArea rows={4} placeholder="请输入建筑面积" />)} */}
                  {getFieldDecorator('ownerName', {
                    initialValue: infoDetail.ownerName,
                    // rules: [{
                    //   required: false, message: '业主不存在，请先新增'
                    // },
                    // { validator: checkExist }]
                  })(
                    // <AutoComplete
                    //   dropdownClassName={styles.searchdropdown}
                    //   optionLabelProp="value"
                    //   dropdownMatchSelectWidth={false}
                    //   style={{ width: '100%' }}
                    //   dataSource={userList}
                    //   onSearch={ownerSearch}
                    //   onChange={ownerChange}
                    //   placeholder="请输入业主名称"
                    //   onSelect={onOwnerSelect}
                    // />
                    <Input
                      readOnly
                      allowClear
                      onChange={(e) => {
                        form.setFieldsValue({ ownerId: '' });
                        form.setFieldsValue({ ownerPhone: '' });
                        form.setFieldsValue({ ownerUnitId: '' });
                      }}
                      addonAfter={<Icon type="setting" onClick={() => {
                        setCustomerType(1);
                        setCustomerSelectVisible(true);
                      }} />} />
                  )}
                  {getFieldDecorator('ownerId', {
                    initialValue: infoDetail.ownerId,
                  })(
                    <input type='hidden' />
                  )}

                  {getFieldDecorator('ownerUnitId', {
                    initialValue: infoDetail.ownerUnitId,
                  })(
                    <input type='hidden' />
                  )}
                </Form.Item>
              </Col>

              <Col lg={12}>
                <Form.Item label={infoDetail.tenantName ? <div>租户名称 <a onClick={() => { showCustomerDrawer(infoDetail.tenantId, 2) }}>编辑</a></div> : '租户名称'}>
                  {/* {getFieldDecorator('customerId', {
                    initialValue: infoDetail.customerId,
                  })(<TextArea rows={4} placeholder="请输计费面积" />)} */}
                  {getFieldDecorator('tenantName', {
                    initialValue: infoDetail.tenantName
                  })(
                    // <AutoComplete
                    //   dropdownClassName={styles.searchdropdown}
                    //   optionLabelProp="value"
                    //   dropdownMatchSelectWidth={false}
                    //   dataSource={userList}
                    //   style={{ width: '100%' }}
                    //   onSearch={tenantSearch}
                    //   onChange={tenantChange}
                    //   placeholder="请输入租户名称"
                    //   onSelect={onTenantSelect}
                    // /> 
                    <Input
                      readOnly
                      allowClear
                      onChange={(e) => {
                        form.setFieldsValue({ tenantId: '' });
                        form.setFieldsValue({ tenantPhone: '' });
                        form.setFieldsValue({ tenantUnitId: '' });
                      }}
                      addonAfter={<Icon type="setting" onClick={() => {
                        setCustomerType(2);
                        setCustomerSelectVisible(true);
                      }} />} /> 
                  )}
                  {getFieldDecorator('tenantId', {
                    initialValue: infoDetail.tenantId,
                  })(
                    <input type='hidden' />
                  )}
                  {getFieldDecorator('tenantUnitId', {
                    initialValue: infoDetail.tenantUnitId,
                  })(
                    <input type='hidden' />
                  )} 
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="业主电话">
                  {getFieldDecorator('ownerPhone', {
                    initialValue: infoDetail.ownerPhone,
                  })(
                    <Input placeholder="自动带出业主电话" readOnly />
                  )}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="租户电话">
                  {getFieldDecorator('tenantPhone', {
                    initialValue: infoDetail.tenantPhone,
                  })(<Input placeholder="自动带出租户电话" readOnly />)}
                </Form.Item>
              </Col>
            </Row>

            {/* <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="起租日期">
                  {getFieldDecorator('memo', {
                    initialValue: infoDetail.beginRentDate
                      ? moment(new Date(infoDetail.beginRentDate))
                      : moment(new Date()),
                  })(<DatePicker style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="截止日期">
                  {getFieldDecorator('endRentDate', {
                    initialValue: infoDetail.endRentDate
                      ? moment(new Date(infoDetail.endRentDate))
                      : moment(new Date()),
                  })(<DatePicker style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>
            </Row> */}

            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="车牌号">
                  {getFieldDecorator('carNo', {
                    initialValue: infoDetail.carNo,
                  })(<Input placeholder="请输入车牌号" />)}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="卡号">
                  {getFieldDecorator('cardNo', {
                    initialValue: infoDetail.cardNo,
                  })(<Input placeholder="请输入卡号" />)}
                </Form.Item>
              </Col>
            </Row>
            {/* <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="车辆品牌">
                  {getFieldDecorator('vehicleBrand', {
                    initialValue: infoDetail.vehicleBrand,
                  })(
                    <Select placeholder="请选择车辆品牌">
                      {vehicleBrand.map(item => (
                        <Option value={item.value} key={item.key}>
                          {item.title}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="颜色">
                  {getFieldDecorator('color', {
                    initialValue: infoDetail.color,
                  })(
                    <Select placeholder="请选择颜色">
                      {color.map(item => (
                        <Option value={item.value} key={item.key}>
                          {item.title}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row> */}
            <Row gutter={24}>
              <Col lg={24}>
                <Form.Item label="附加说明">
                  {getFieldDecorator('memo', {
                    initialValue: infoDetail.memo,
                  })(<TextArea rows={4} placeholder="请输入附加说明" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        ) : null}
      </Card>
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
          zIndex: 999,
        }}
      >
        <Button onClick={close} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button onClick={save} type="primary">
          提交
        </Button>
      </div>

      <QuickModify
        modifyVisible={customerVisible}
        closeDrawer={closeCustomerDrawer}
        data={customer}
        organizeId={organizeId}
        // type={type}
        reload={(customerId) => {
          GetParkingCustomerInfo(customerId).then(res => { 
            //防止旧数据缓存，清空下拉
            // setUserList([]);
            if (customerType == 1) {
              //业主
              form.setFieldsValue({ ownerName: res.name });
              form.setFieldsValue({ ownerId: customerId });
              form.setFieldsValue({ ownerPhone: res.phoneNum });
              form.setFieldsValue({ ownerUnitAllName: res.ownerUnitAllName });
              
            } else {
              //租户
              form.setFieldsValue({ tenantName: res.name });
              form.setFieldsValue({ tenantId: customerId });
              form.setFieldsValue({ tenantPhone: res.phoneNum });
              form.setFieldsValue({ tenantUnitAllName: res.tenantUnitAllName });
            }
          });
        }
        }
      />

      <CustomerSelect
        visible={customerSelectVisible}
        closeModal={closeCustomerSelect}
        organizeId={organizeId}
        type='parking'
        Select={(res) => { 
          if (customerType == 1) {
            //业主
            form.setFieldsValue({ ownerName: res.name });
            form.setFieldsValue({ ownerId: res.id });
            form.setFieldsValue({ ownerPhone: res.phoneNum });
            form.setFieldsValue({ ownerUnitId: res.unitId });
            // form.setFieldsValue({ ownerUnitAllName: res.allName });
          } else {
            //租户
            form.setFieldsValue({ tenantName: res.name });
            form.setFieldsValue({ tenantId: res.id });
            form.setFieldsValue({ tenantPhone: res.phoneNum });
            form.setFieldsValue({ tenantUnitId: res.unitId });
          }
        }}
      />

    </Drawer >

  );
};

export default Form.create<ModifyParkingProps>()(ModifyParking);

// const renderTree = (treeData: TreeEntity[], parentId: string) => {
//   return treeData
//     .filter(item => item.parentId === parentId)
//     .map(filteditem => {
//       return (
//         <TreeNode title={filteditem.text} key={filteditem.id} value={filteditem.id}>
//           {renderTree(treeData, filteditem.id as string)}
//         </TreeNode>
//       );
//     });
// };
