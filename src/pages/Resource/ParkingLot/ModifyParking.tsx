// import { ParkingData } from '@/model/models';
import { getCommonItems } from '@/services/commonItem';
import {
  AutoComplete,
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Input,
  message,
  Row,
  Select,
  DatePicker,
  TreeSelect,
  InputNumber,
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { SaveParkingForm, GetCustomerList } from './ParkingLot.service';
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
  const { treeData, modifyVisible, data, closeDrawer, form, reload } = props;
  const { getFieldDecorator } = form;
  const title = data === undefined ? '添加车位' : '修改车位';
  // const [infoDetail, setInfoDetail] = useState<ParkingData>({});
  // const [estateTree, setEstateTree] = useState<any[]>([]);
  // const [parkingLotState, setParkingLotState] = useState<any[]>([]); // 获取车位状态
  // const [vehicleBrand, setVehicleBrand] = useState<any[]>([]); // 车辆品牌
  const [parkingLotType, setParkingLotType] = useState<any[]>([]); // 车位类型
  const [parkingNature, setParkingNature] = useState<any[]>([]); // 车位性质
  // const [color, setColor] = useState<any[]>([]); // 颜色 
  const [userSource, setUserSource] = useState<any[]>([]);

  const [infoDetail, setInfoDetail] = useState<any>({});

  // 打开抽屉时初始化
  useEffect(() => {
    // 获取车位状态
    // getCommonItems('ParkingLotState').then(res => {
    //   setParkingLotState(res || []);
    // });
    // 车位性质
    getCommonItems('ParkingNature').then(res => {
      setParkingNature(res || []);
    });
    // 车位类型
    getCommonItems('ParkingLotType').then(res => {
      setParkingLotType(res || []);
    });
    // 车辆品牌
    // getCommonItems('VehicleBrand').then(res => {
    //   setVehicleBrand(res || []);
    // });
    // // 车辆品牌
    // getCommonItems('Color').then(res => {
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
    } else {
      form.resetFields();
    }
  }, [modifyVisible]);

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
    dataDetail.keyValue = dataDetail.id;
    dataDetail.type = 9;
    SaveParkingForm(dataDetail).then(res => {
      message.success('保存成功');
      closeDrawer();
      reload();
    });
  };

  //用户选择
  const handleSearch = value => {
    if (value == '')
      return;
    GetCustomerList(value).then(res => {
      setUserSource(res || []);
    })
  };

  const userList = userSource.map
    (item => <Option key={item.id} value={item.name}>{item.name}</Option>);

  const onOwnerSelect = (value, option) => {
    form.setFieldsValue({ ownerId: option.key });
  };

  const onTenantSelect = (value, option) => {
    form.setFieldsValue({ tenantId: option.key });
  };

  return (
    <Drawer
      title={title}
      placement="right"
      width={600}
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
                    rules: [{ required: true, message: '请输入车位编号' }],
                  })(<Input placeholder="请输入车位编号" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="车位状态">
                  {getFieldDecorator('state', {
                    initialValue: infoDetail.state,
                  })(
                    <Select placeholder="请选择车位状态">
                      {/* {parkingLotState.map(item => (
                        <Option value={item.value} key={item.key}>
                          {item.title}
                        </Option>
                      ))} */}
                      <Option value={3}>空置</Option>
                      <Option value={4}>出租</Option>
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
                    </Select>,
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

            <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="业主名称">
                  {/* {getFieldDecorator('ownerId', {
                    initialValue: infoDetail.ownerId,
                  })(<TextArea rows={4} placeholder="请输入建筑面积" />)} */}
                  {getFieldDecorator('ownerName', {
                    initialValue: infoDetail.ownerName,
                  })(
                    <AutoComplete
                      dataSource={userList}
                      style={{ width: '100%' }}
                      onSearch={handleSearch}
                      placeholder="请输入业主"
                      onSelect={onOwnerSelect}
                    />
                  )}
                  {getFieldDecorator('ownerId', {
                    initialValue: infoDetail.ownerId,
                  })(
                    <input type='hidden' />
                  )}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="住户名称">
                  {/* {getFieldDecorator('customerId', {
                    initialValue: infoDetail.customerId,
                  })(<TextArea rows={4} placeholder="请输计费面积" />)} */}
                  {getFieldDecorator('tenantName', {
                    initialValue: infoDetail.tenantName,
                  })(<AutoComplete
                    dataSource={userList}
                    style={{ width: '100%' }}
                    onSearch={handleSearch}
                    placeholder="请输入住户"
                    onSelect={onTenantSelect}
                  />)}
                  {getFieldDecorator('tenantId', {
                    initialValue: infoDetail.tenantId,
                  })(
                    <input type='hidden' />
                  )}
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
                <Form.Item label="终止日期">
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
        }}
      >
        <Button onClick={close} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button onClick={save} type="primary">
          提交
        </Button>
      </div>
    </Drawer>
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
