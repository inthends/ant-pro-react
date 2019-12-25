//新增应付费用
import { Card, Button, Col, Select, Form, Input, Row, InputNumber, Drawer, DatePicker } from 'antd';
import { TreeEntity } from '@/model/models';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetUserRoomsByRelationId,GetTempPaymentFeeItemTreeJson, GetRoomUsers, GetUserRooms, GetPayFeeItemDetail, SaveForm, GetShowDetail } from './Payment.service';
import LeftTree from '../LeftTree';
import moment from 'moment';

interface FeeModifyProps {
  visible: boolean;
  closeDrawer(): void;
  form: WrappedFormUtils;
  isEdit: boolean;
  id?: string;
  reload(): void;
  organize: any;
}

const FeeModify = (props: FeeModifyProps) => {
  const { visible, closeDrawer, form, isEdit, id, reload, organize } = props;
  const [feeTreeData, setFeeTreeData] = useState<TreeEntity[]>([]);
  const [infoDetail, setInfoDetail] = useState<any>({});
  // const [loading, setLoading] = useState<boolean>(false);
  const { getFieldDecorator } = form;
  const [relationIds, setRelationID] = useState<any[]>([]);
  const [unitIds, setUnitIds] = useState<any[]>([]);
  const title = id ? "修改应付费用" : "新增应付费用";

  useEffect(() => {
    if (visible) {

      // GetTempPaymentFeeItemTreeJson(organize.eventKey).then(res => {
      //   setFeeTreeData(res);
      // });

      //付款费项不控制房间
      GetTempPaymentFeeItemTreeJson().then(res => {
        setFeeTreeData(res);
      });

      // setInfoDetail({});//数据重置

      if (id) {
        // GetRoomUsers(organize.code).then(res => {
        //   setRelationID(res);
        //   return res;
        // }).then(relations => {
        //   GetShowDetail(id).then(res => {
        //     var info = Object.assign({}, res.entity, { number: res.number });
        //     setInfoDetail(info);
        //     return info.relationId
        //   }).then(relationId => {
        //     var relation = "";
        //     for (var i = 0; i < relations.length; i++) {
        //       if (relations[i].key == relationId) {
        //         relation = relations[i].value;
        //       }
        //     }
        //     return GetUserRooms(relation)
        //   }).then(res => {
        //     setUnitIds(res);
        //   });
        // }); 

        GetRoomUsers(organize.eventKey).then(res => {
          setRelationID(res);
          GetShowDetail(id).then(info => {
            // let info = value.entity;
            // info.number = value.number;
            setInfoDetail(info);
            let customerid = "";
            for (var i = 0; i < res.length; i++) {
              if (res[i].key == info.relationId) {
                customerid = res[i].attributeA;
              }
            }
            GetUserRooms(customerid).then(urooms => {
              setUnitIds(urooms);
            });
          })
        });

      } else {
        // setInfoDetail({});
        // if (organize.eventKey) {
        //获取客户 

        GetRoomUsers(organize.eventKey).then(res => {
          setRelationID(res);
          if (res.length > 0) {
            // var info = Object.assign({}, infoDetail, { relationId: res[0].key });
            let info = Object.assign({ relationId: res[0].key });
            //获取客户的房间
            // GetUserRooms(getRelationId(res[0].key))
            GetUserRooms(res[0].attributeA)//customerid
              .then(res => {
                setUnitIds(res);
                if (res.length > 0) {
                  //var info = Object.assign({}, infoDetail, { unitId: res[0].key });
                  info.unitId = res[0].key;
                  setInfoDetail(info);
                  form.resetFields();
                }
              });
           
          }
        })
        //}
      }
    }
  }, [visible]);

  // const [unitData, setUnitData] = useState<string[]>([]);
  // const [selectedFeeId, setSelectedFeeId] = useState<string[]>([]);

  // const getRelationId = (key) => {
  //   if (relationIds == null) {
  //     return null
  //   }
  //   for (var i = 0; i < relationIds.length; i++) {
  //     if (relationIds[i].key == key) {
  //       return relationIds[i].value;
  //     }
  //   }
  // };

  // const getUnitId = (value) => {
  //   if (unitIds == null) {
  //     return null
  //   }
  //   for (var i = 0; i < unitIds.length; i++) {
  //     if (unitIds[i].value == value) {
  //       return unitIds[i].key;
  //     }
  //   }
  // }
  // const getGuid = () => {
  //   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
  //     var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
  //     return v.toString(16);
  //   });
  // }

  const setEndDate = (beginDate: string, cycleValue: number, cycleType: string) => {
    var startDate = moment(beginDate);
    var endDate = "";
    if (cycleType == '日') {
      endDate = startDate.add(cycleValue, 'days').add(-1, 'days').format('YYYY-MM-DD');
    } else if (cycleType == '月') {
      endDate = startDate.add(cycleValue, 'month').add(-1, 'days').format('YYYY-MM-DD');
    } else {
      endDate = startDate.add(cycleValue, 'years').add(-1, 'days').format('YYYY-MM-DD');
    }
    var info = Object.assign({}, infoDetail, { endDate: endDate, cycleValue: cycleValue, cycleType: cycleType });
    setInfoDetail(info);
  };

  return (
    <Drawer
      title={title}
      placement="right"
      width={id != null && id != "" ? 600 : 780}
      // width={780}
      onClose={closeDrawer}
      destroyOnClose={true}
      visible={visible}
      style={{ height: 'calc(100vh-50px)' }}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 50px)' }}
    >
      {/* <Row gutter={8} style={{ height: 'calc(100vh - 55px)', overflow: 'hidden', marginTop: '5px', backgroundColor: 'rgb(255,255,255)' }}> */}
      <Row gutter={16}>
        {
          id != null && id != "" ?
            null :
            // <Col span={8} style={{ overflow: 'visible', position: 'relative', height: 'calc(100vh - 140px)' }}>
            <Col span={8} style={{ overflow: 'visible', position: 'relative', height: 'calc(100vh - 77px)' }}>
              <LeftTree
                treeData={feeTreeData}
                selectTree={(id, item) => {
                  if (organize.eventKey) {
                    // setLoading(true);
                    GetPayFeeItemDetail(id, organize.eventKey).then(res => {
                      let amount = parseInt(res.price) * parseInt(res.number) * parseInt(res.quantity);
                      // var info = Object.assign({}, res, { feeItemId: id, amount: amount });
                      res.feeItemId = id;
                      res.amount = amount;
                      setInfoDetail(res);
                      // setLoading(false);
                      // return info;
                    })
                    //.then(info => {
                    // GetUserRooms( getRelationId(info.relationId) )
                    //   .then(res => {
                    //     setUnitIds(res);
                    //     if (res.length > 0)
                    //       info = Object.assign({}, info, { unitId: res[0].value });
                    //     setInfoDetail(info);
                    //     setLoading(false);
                    //   });
                    //});
                  }
                }}
              />
            </Col>
        }
        {/* <Col span={id != null && id != "" ? 24 : 16} style={{ height: 'calc(100vh - 100px)', padding: '5px', overflow: 'auto' }}> */}

        <Col span={id != null && id != "" ? 24 : 16} style={{ height: 'calc(100vh - 20px)', overflow: 'visible', position: 'relative' }}>
          <Card   >
            <Form hideRequiredMark>
              {/* <Spin tip="数据处理中..." spinning={loading}> */}
              <Row> <Col>
                <Form.Item label="付款对象" required labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  {getFieldDecorator('relationId', {
                    initialValue: infoDetail.relationId == null ? null : infoDetail.relationId,// getRelationId(infoDetail.relationId),
                    rules: [{ required: true, message: '请选择付款对象' }]
                  })(
                    <Select placeholder="=请选择=" disabled={isEdit || (id != "") ? false : true}
                      onSelect={(key) => { 
                        GetUserRoomsByRelationId(key).then(res => {
                          //加载房间列表
                          setUnitIds(res);
                          // if (infoDetail.unitId == null) {
                          //   var info = Object.assign({}, infoDetail, { unitId: res[0].value });
                          //   setInfoDetail(info);
                          // }
                        });
                      }}>
                      {relationIds.map(item => (
                        <Select.Option value={item.key}>
                          {item.title}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item> </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Item label="选择房屋" required labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} >
                    {getFieldDecorator('unitId', {
                      initialValue: infoDetail.unitId == null ? null : infoDetail.unitId,/*getUnitId(infoDetail.householdId)*/
                      rules: [{ required: true, message: '请选择房屋' }]
                    })(
                      <Select placeholder="=请选择=" disabled={isEdit || (id != "") ? false : true} >
                        {unitIds.map(item => (
                          <Select.Option value={item.key}>
                            {item.title}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12} >
                  <Form.Item label="单价" required labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    {getFieldDecorator('price', {
                      initialValue: infoDetail.price,
                      rules: [{ required: true, message: '请输入单价' }]
                    })(
                      <InputNumber readOnly={!infoDetail.isEditTemp}
                        min={0}
                        precision={4}
                        style={{ width: '100%' }}
                        onChange={value => {
                          const quantity = Number(form.getFieldValue('quantity'));
                          const number = Number(form.getFieldValue('number'));
                          form.setFieldsValue({ amount: quantity * number * Number(value) });
                        }}
                      ></InputNumber>
                    )}
                  </Form.Item>
                </Col>
                <Col span={1} style={{ marginTop: "5px", lineHeight: "32px", textAlign: 'center' }}>
                  X
                  </Col>
                <Col span={5}  >
                  <Form.Item label="" required wrapperCol={{ span: 24 }}>
                    {getFieldDecorator('quantity', {
                      initialValue: infoDetail.quantity,
                      rules: [{ required: true, message: '请输入数量' }]
                    })(
                      <InputNumber readOnly placeholder='数量' style={{ width: '100%' }} ></InputNumber>
                    )}
                  </Form.Item>
                </Col>

                <Col span={1} style={{ marginTop: "5px", lineHeight: "32px", textAlign: 'center' }}>
                  X
                </Col>
                <Col span={5}>
                  <Form.Item label="" required wrapperCol={{ span: 24 }}>
                    {getFieldDecorator('number', {
                      initialValue: infoDetail.number,
                      rules: [{ required: true, message: '请输入系数' }]
                    })(
                      <InputNumber style={{ width: '100%' }}
                        placeholder='系数'
                        min={0}
                        onChange={value => {
                          // if (value != undefined) {
                          // const amount = value * infoDetail.quantity * infoDetail.price;
                          // // const info = Object.assign({}, infoDetail, { amount: amount });
                          // infoDetail.amount = amount;
                          // setInfoDetail(infoDetail);
                          // } 
                          const price = Number(form.getFieldValue('price'));
                          const quantity = Number(form.getFieldValue('quantity'));
                          form.setFieldsValue({ amount: price * quantity * Number(value) });

                        }}></InputNumber>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col >
                  <Form.Item label="金额" required labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} >
                    {getFieldDecorator('amount', {
                      initialValue: infoDetail.amount,
                      rules: [{ required: true, message: '请输入金额' }]
                    })(
                      <InputNumber readOnly style={{ width: '100%' }} precision={2}></InputNumber>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item label="周期" required labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    {getFieldDecorator('cycleValue', {
                      initialValue: infoDetail.cycleValue,
                      rules: [{ required: true, message: '请输入周期' }]
                    })(
                      <InputNumber style={{ width: '100%' }}
                        onChange={value => {
                          if (value != undefined) {
                            setEndDate(infoDetail.beginDate, value, infoDetail.cycleType);
                          }
                        }}></InputNumber>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}  >
                  <Form.Item label="" required labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}  >
                    {getFieldDecorator('cycleType', {
                      initialValue: infoDetail.cycleType,
                      rules: [{ required: true, message: '请选择周期单位' }]
                    })(
                      <Select placeholder="=请选择=" style={{ width: '100%' }} onChange={(value: string) => {
                        setEndDate(infoDetail.beginDate, infoDetail.cycleValue, value);
                      }}>
                        <Select.Option key='日' value='日'>
                          {'日'}
                        </Select.Option>
                        <Select.Option key='月' value='月'>
                          {'月'}
                        </Select.Option>
                        <Select.Option key='年' value='年'>
                          {'年'}
                        </Select.Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item label="起始日期" required labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
                    {getFieldDecorator('beginDate', {
                      initialValue: infoDetail.beginDate ? moment(infoDetail.beginDate) : moment(new Date()),
                      rules: [{ required: true, message: '请选择起始日期' }]
                    })(
                      <DatePicker disabled={true} style={{ width: '100%' }} onChange={(date, dateString) => {
                        setEndDate(dateString, infoDetail.cycleValue, infoDetail.cycleType);
                      }} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="结束日期" required labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
                    {getFieldDecorator('endDate', {
                      initialValue: infoDetail.endDate ? moment(infoDetail.endDate) : moment(new Date()),
                      rules: [{ required: true, message: '请选择结束日期' }]
                    })(
                      <DatePicker disabled={true} style={{ width: '100%' }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item label="备注" required labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                    {getFieldDecorator('memo', {
                      initialValue: infoDetail.memo,
                      rules: [{ required: false }]
                    })(
                      <Input.TextArea rows={4} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              {/* </Spin> */}
            </Form>
          </Card>
        </Col>
      </Row>
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
        <Button style={{ marginRight: 8 }}
          onClick={() => closeDrawer()}
        >
          取消
            </Button>
        <Button type="primary"
          onClick={() => {
            form.validateFields((errors, values) => {
              if (!errors) {
                // var guid = getGuid();
                let entity = {
                  billDate: moment(values.billDate).format('YYYY-MM-DD'),
                  endDate: moment(values.endDate).format('YYYY-MM-DD'),
                  billId: id != null && id != "" ? infoDetail.billId : "",
                  feeItemId: infoDetail.feeItemId,
                  price: parseInt(values.price),// 0,
                  billSource: "临时付款",
                  linkId: '',
                  quantity: parseInt(values.quantity),//0,
                  memo: values.memo ? values.memo : '',
                  relationId: values.relationId,// "string",
                  status: 0,
                  unitId: values.unitId,
                  amount: values.amount,
                  cycleType: values.cycleType,
                  beginDate: moment(values.beginDate).format('YYYY-MM-DD'),
                  cycleValue: values.cycleValue,
                  organizeId: organize.eventKey,
                  period: infoDetail.period
                }
                let newData = {
                  keyValue: id != null && id != "" ? infoDetail.billId : "",
                  entity: entity
                }
                SaveForm(newData).then((res) => {
                  closeDrawer();
                  reload();
                });
              }
            });
          }}
        >
          提交
            </Button>
      </div>
    </Drawer >
  );
};
export default Form.create<FeeModifyProps>()(FeeModify);

