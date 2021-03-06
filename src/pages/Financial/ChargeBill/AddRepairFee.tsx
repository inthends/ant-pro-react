//新增维修收费，ok
import { TreeEntity } from '@/model/models';
import { Modal, Spin, Card, Select, Button, Col, DatePicker, Drawer, Form, Input, InputNumber, Row, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { SaveDetail, GetReceivablesFeeItemTreeJson, InvalidBillDetailForm, SaveTempBill, GetShowDetailByMainId, Call } from './Main.service';
import { GetUserRoomsByRelationId, GetRoomUsers, GetUserRooms, GetFeeItemDetail } from '@/services/commonItem';

import LeftTree from '../LeftTree';
import moment from 'moment';
import styles from './style.less';
const { Option } = Select;

interface AddRepairFeeProps {
  closeDrawer(feeId?, amount?): void;
  modifyVisible: boolean;
  form: WrappedFormUtils;
  roomId?: string;
  mainId?: string;//计费主单id
  linkId?: string;
  adminOrgId?: String;//管理处Id 
  edit: boolean;
}

const AddRepairFee = (props: AddRepairFeeProps) => {
  const { modifyVisible, closeDrawer, form, roomId, mainId, edit, adminOrgId, linkId } = props;
  const title = mainId == "" ? '新增费用' : "修改费用";
  const { getFieldDecorator } = form;
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [feeTreeData, setFeeTreeData] = useState<TreeEntity[]>([]);
  const [relationIds, setRelationIds] = useState<any[]>([]);
  const [unitIds, setUnitIds] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 打开抽屉时初始化
  useEffect(() => {
    // form.resetFields();
    if (modifyVisible) {
      setLoading(true);
      GetReceivablesFeeItemTreeJson(roomId).then(res => {
        setFeeTreeData(res);
      });
      if (mainId) {
        //加载数据
        GetRoomUsers(roomId).then(res => {
          setRelationIds(res);
          GetShowDetailByMainId(mainId).then(info => {
            // let info = value.entity;
            // info.number = value.number;  
            let customerid = '';
            for (var i = 0; i < res.length; i++) {
              if (res[i].key == info.relationId) {
                customerid = res[i].attributeA;
              }
            }
            GetUserRooms(customerid).then(urooms => {
              setUnitIds(urooms);
            });
            //赋值
            setInfoDetail(info);
            setLoading(false);
          })
        });

      } else {
        GetRoomUsers(roomId).then(res => {
          setRelationIds(res);
          if (res.length > 0) {
            //var info = Object.assign({}, infoDetail, { relationId: res[0].key });
            let info = Object.assign({ relationId: res[0].key });
            // setInfoDetail(info); 
            GetUserRooms(res[0].attributeA)//customerid
              .then(res => {
                setUnitIds(res);
                if (res.length > 0) {
                  //var info = Object.assign({}, infoDetail, { unitId: res[0].key });
                  info.unitId = res[0].key;
                  setInfoDetail(info);
                  form.resetFields();
                }
                setLoading(false);
              });
          } else {
            setLoading(false);
          }
          // return info;
        });
      }
    }
    // else {
    //   form.setFieldsValue({});
    // }
  }, [modifyVisible]);

  const getGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const onSave = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        var guid = getGuid();
        var unit = {
          BillId: mainId != null && mainId != "" ? infoDetail.billId : guid,
          UnitId: values.unitId,
          FeeItemId: infoDetail.feeItemId,
          Quantity: "" + values.quantity,
          Price: "" + values.price,
          Amount: "" + values.amount,
          // Period: moment(values.period).format("YYYY-MM-DD"),//"2019-04-08",
          BeginDate: values.beginDate == null ? null : moment(values.beginDate).format("YYYY-MM-DD"),//"2019-04-01",
          EndDate: values.endDate == null ? null : moment(values.endDate).format("YYYY-MM-DD"),//"2019-04-30",
          Memo: values.memo,
          RelationId: values.relationId,//getRelationId(values.relationId),
          CycleValue: "" + values.cycleValue,
          CycleType: values.cycleType,
          BillDate: moment(values.billDate).format("YYYY-MM-DD"),
          Deadline: moment(values.deadline).format("YYYY-MM-DD")
        }
        if (infoDetail.id != null && infoDetail.id != "") {
          unit = Object.assign({}, unit, { Id: infoDetail.id, keyvalue: infoDetail.id });
          SaveDetail(unit).then(res => {
            closeDrawer(mainId, values.amount);
          })
        } else {
          let units: any[];
          units = [];
          units.push(unit);
          let newData = {
            BillId: mainId != null && mainId != "" ? infoDetail.billId : guid,
            OrganizeId: adminOrgId,
            BillSource: "维修单",
            Units: JSON.stringify(units),
            keyvalue: mainId != null && mainId != "" ? infoDetail.billId : guid,
            LinkId: linkId,
            IfVerify: false,
            // VerifyPerson: '',
            // VerifyDate: '',
            // VerifyMemo: '',
            Status: 0,//0正常 1 删除
            code: mainId != null && mainId != "" ? 1 : 0
          };
          SaveTempBill(newData).then((res) => {
            message.success('提交成功');
            closeDrawer(newData.BillId, values.amount);
          });
        }
      }
    });
  }

  const doInvalid = () => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要作废改费用？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        //console.log(record);
        InvalidBillDetailForm(infoDetail.id).then(() => {
          message.success('作废成功');
          closeDrawer();
        });
      },
    });
  };

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
  }

  //求自然月日期
  // const getMonthBeforeFormatAndDay = (num, format, date) => { 
  //   let day = date.get('date');
  //   let month = date.get('month');
  //   date.set('month', month + num * 1, 'date', 1); //周期月一号
  //   //读取日期自动会减一，所以要加一
  //   let mo = date.get('month') + 1;
  //   //小月
  //   if (mo == 4 || mo == 6 || mo == 9 || mo == 11) {
  //     if (day > 30) {
  //       day = 30;
  //     }
  //   }
  //   //2月
  //   else if (mo == 2) {
  //     //闰年
  //     if (date.isLeapYear()) {
  //       if (day > 29) {
  //         day = 29;
  //       } else {
  //         day = 28;
  //       }
  //     }
  //     if (day > 28) {
  //       day = 28;
  //     }
  //   }
  //   //大月
  //   else {
  //     if (day > 31) {
  //       day = 31;
  //     }
  //   }
  //   date.set('date', day);
  //   return date;
  // };

  //设置结束日期
  // const getEndDate = () => {
  //   const cycle = form.getFieldValue('cycleValue');
  //   const cycletype = form.getFieldValue('cycleType')
  //   let d = form.getFieldValue('beginDate');
  //   if (d != "") {
  //     let endDate = moment(d);
  //     if (cycletype == "日") {
  //       //日
  //       endDate.set('date', endDate.get('date') + cycle);
  //     } else if (cycletype == "月") {
  //       // 月
  //       endDate = getMonthBeforeFormatAndDay(cycle, "-", endDate);
  //     } else {
  //       //年
  //       endDate.set('year', endDate.get('year') + cycle);
  //     }
  //     endDate.set('date', endDate.get('date') - 1);
  //     return endDate;
  //   }
  //   return '';
  // };

  const disabledDate = (current) => {
    return current&&current.isBefore(moment(form.getFieldValue('beginDate')), 'day');
  };

  const close = () => {
    closeDrawer();
  };

  return (
    <Drawer
      title={title}
      placement="right"
      width={mainId != '' ? 600 : 840}
      onClose={() => close()}
      visible={modifyVisible}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 50px)' }}>
      <Spin tip="数据处理中..." spinning={loading}>
        <Row gutter={8}>
          {
            mainId != '' ?
              null :
              <Col span={7} style={{
                overflow: 'visible', position: 'relative',
                height: 'calc(100vh - 35px)',
              }}>
                <LeftTree
                  treeData={feeTreeData}
                  selectTree={(id, item) => {
                    // setFeeItemId(id);
                    if (roomId) {
                      setLoading(true);
                      GetFeeItemDetail(id, roomId).then(res => {
                        if (res.feeItemId) {
                          // if (res.relationId != null) {
                          // var info = Object.assign({}, res, { feeItemId: id });
                          // console.log(info);
                          //res.feeItemId = id;
                          setInfoDetail(res);
                          setLoading(false);
                        } else {
                          message.warning(res);
                          setLoading(false);
                        }
                        // return info;
                        // }
                        // else {
                        //   message.warning(res);
                        //   return null;
                        // }
                      });
                      // .then(info => {
                      //   if (info !== null) {
                      //     GetUserRooms(getRelationId(info.relationId))
                      //       .then(res => {
                      //         setUnitIds(res);
                      //         if (res.length > 0)
                      //           info = Object.assign({}, info, { householdId: res[0].value });
                      //         setInfoDetail(info);
                      //       });
                      //   }
                      // });
                    }
                  }}
                />
              </Col>
          }

          <Col span={mainId != '' ? 24 : 17}>
            <Card className={styles.card} hoverable>
              <Form hideRequiredMark>
                <Row>
                  <Form.Item label="加费对象" required labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} >
                    {getFieldDecorator('relationId', {
                      initialValue: infoDetail.relationId == null ? null : infoDetail.relationId,// getRelationId(infoDetail.relationId),
                      rules: [{ required: true, message: '请选择加费对象' }]
                    })(
                      <Select placeholder="=请选择=" disabled={mainId === '' && edit ? false : true}
                        onSelect={(key) => {
                          GetUserRoomsByRelationId(key).then(res => {
                            setUnitIds(res);
                            // var info = Object.assign({}, infoDetail, { householdId: res[0].value });
                            // setInfoDetail(info);
                          });
                        }}>
                        {relationIds.map(item => (
                          <Option value={item.key}
                          >
                            {item.title}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Row>
                <Row>
                  <Form.Item label="选择房屋" required labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} >
                    {getFieldDecorator('unitId', {
                      // initialValue: infoDetail.householdId == null ? null : getUnitId(infoDetail.householdId),
                      initialValue: infoDetail.unitId == null ? null : infoDetail.unitId,
                      rules: [{ required: true, message: '请选择房屋' }]
                    })(
                      <Select placeholder="=请选择=" disabled={mainId === '' && edit ? false : true} >
                        {unitIds.map(item => (
                          <Option value={item.key}>
                            {item.title}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item label="单价" required labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
                      {getFieldDecorator('price', {
                        initialValue: infoDetail.price,
                        rules: [{ required: true, message: '请输入单价' }]
                      })(
                        <InputNumber
                          style={{ width: '100%' }}
                          disabled={!infoDetail.isEditTemp}
                          placeholder='请输入单价'
                          min={0}
                          precision={4}
                          onChange={value => {
                            form.validateFields((errors, values) => {
                              if (!errors) {
                                const quantity = Number(form.getFieldValue('quantity'));
                                const number = Number(form.getFieldValue('number'));
                                //form.setFieldsValue({ amount: quantity * number * Number(value) }); 
                                //调用后台计算并且根据设置保留小数位
                                const unitId = form.getFieldValue('unitId');
                                Call({ unitId: unitId, feeItemId: infoDetail.feeItemId, price: value, quantity: quantity, number: number }).then(res => {
                                  form.setFieldsValue({ amount: res });
                                });
                              }
                            });
                          }}
                        ></InputNumber>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={1} style={{ lineHeight: "32px", textAlign: 'center' }}>
                    X
              </Col>
                  <Col span={5}>
                    <Form.Item label="" required wrapperCol={{ span: 24 }}>
                      {getFieldDecorator('quantity', {
                        initialValue: infoDetail.quantity,
                        rules: [{ required: true, message: '请输入数量' }]
                      })(
                        <Input min={0} disabled style={{ width: '100%' }}
                          placeholder='请输入数量'
                        ></Input>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={1} style={{ lineHeight: "32px", textAlign: 'center' }}>
                    X
              </Col>
                  <Col span={5}>
                    <Form.Item label="" required wrapperCol={{ span: 24 }}>
                      {getFieldDecorator('number', {
                        initialValue: infoDetail.number,
                        rules: [{ required: true, message: '请输入系数' }]
                      })(
                        <InputNumber min={0}
                          placeholder='请输入系数'
                          style={{ width: '100%' }}
                          disabled={edit ? false : true}
                          onChange={(value) => {

                            form.validateFields((errors, values) => {
                              if (!errors) {
                                const price = Number(form.getFieldValue('price'));
                                const quantity = Number(form.getFieldValue('quantity'));
                                //form.setFieldsValue({ amount: price * quantity * Number(value) }); 
                                //调用后台计算并且根据设置保留小数位
                                const unitId = form.getFieldValue('unitId');
                                Call({ unitId: unitId, feeItemId: infoDetail.feeItemId, price: price, quantity: quantity, number: value }).then(res => {
                                  form.setFieldsValue({ amount: res });
                                });
                              }
                            });
                          }}></InputNumber>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item label="金额" required labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} >
                      {getFieldDecorator('amount', {
                        initialValue: infoDetail.amount,
                        // initialValue: infoDetail.price == null || infoDetail.quantity == null || infoDetail.number == null ? 0 : infoDetail.price * infoDetail.quantity * infoDetail.number,
                        rules: [{ required: true, message: '请输入金额' }]
                      })(
                        <InputNumber precision={2} readOnly style={{ width: '100%' }} ></InputNumber>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item label="周期" required labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
                      {getFieldDecorator('cycleValue', {
                        initialValue: infoDetail.cycleValue,
                        rules: [{ required: true, message: '请输入周期' }]
                      })(
                        <InputNumber
                          placeholder='请输入周期'
                          disabled={edit ? false : true}
                          style={{ width: '100%' }}
                          onChange={value => {
                            if (value != undefined) {
                              setEndDate(infoDetail.beginDate, value, infoDetail.cycleType);
                            }
                          }}></InputNumber>
                      )}
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="周期单位" required labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
                      {getFieldDecorator('cycleType', {
                        initialValue: infoDetail.cycleType === null ? "月" : infoDetail.cycleType,
                        rules: [{ required: true, message: '请选择周期单位' }]
                      })(
                        <Select placeholder="=请选择周期单位="
                          disabled={edit ? false : true}
                          style={{ width: '100%' }}
                          onChange={(value: string) => {
                            setEndDate(infoDetail.beginDate, infoDetail.cycleValue, value);
                          }}>
                          <Option key='日' value='日'>
                            {'日'}
                          </Option>
                          <Option key='月' value='月'>
                            {'月'}
                          </Option>
                          <Option key='年' value='年'>
                            {'年'}
                          </Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item label="起始日期" required labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}  >
                      {getFieldDecorator('beginDate', {
                        initialValue: !infoDetail.isNullDate ? moment(infoDetail.beginDate) : null,
                        rules: [{ required: !infoDetail.isNullDate, message: '请选择起始日期' }]
                      })(
                        <DatePicker
                          disabled={!infoDetail.isModifyDate}
                          placeholder='请选择起始日期'
                          style={{ width: '100%' }} />
                      )}
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="截止日期" required labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
                      {getFieldDecorator('endDate', {
                        initialValue: !infoDetail.isNullDate ? moment(infoDetail.endDate) : null,
                        // initialValue: infoDetail.endDate == null ? moment(getEndDate()) : moment(infoDetail.endDate),
                        rules: [{ required: !infoDetail.isNullDate, message: '请选择截止日期' }]
                      })(
                        <DatePicker disabled={!infoDetail.isModifyDate}
                          disabledDate={disabledDate}
                          placeholder='请选择截止日期'
                          style={{ width: '100%' }} />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}> 
                    {/* <Form.Item label="应收期间" required labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
                    {getFieldDecorator('period', {
                      initialValue: infoDetail.period == null ? moment(new Date()) : moment(infoDetail.period),
                      rules: [{ required: true, message: '请选择应收期间' }]
                    })(
                      <DatePicker disabled={true} style={{ width: '100%' }} />
                    )}
                    </Form.Item> */} 
                    {/* {getFieldDecorator('period', {
                      initialValue: infoDetail.period,
                    })(
                      <input type='hidden' />
                    )} */}

                    <Form.Item label="收款截止日" required labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
                      {getFieldDecorator('deadline', {
                        initialValue: infoDetail.deadline == null ? moment(new Date()) : moment(infoDetail.deadline),
                        rules: [{ required: true, message: '请选择收款截止日期' }]
                      })(
                        <DatePicker disabled={!infoDetail.isModifyDate} style={{ width: '100%' }} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="账单日" required labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
                      {getFieldDecorator('billDate', {
                        initialValue: infoDetail.billDate == null ? moment(new Date()) : moment(infoDetail.billDate),
                        rules: [{ required: true, message: '请选择账单日' }]
                      })(
                        <DatePicker disabled={!infoDetail.isModifyDate} style={{ width: '100%' }} />
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
                        <Input.TextArea disabled={edit ? false : true} rows={3} />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </Spin>

      {
        edit ? <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}>
          <Button onClick={() => close()} style={{ marginRight: 8 }}>
            取消
        </Button>
          <Button onClick={onSave} type="primary" style={{ marginRight: 8 }}>
            保存
        </Button>
          {mainId ?
            <Button onClick={doInvalid} type="danger" >
              作废
        </Button> : null}
        </div> : null
      }

    </Drawer >
  );
};
export default Form.create<AddRepairFeeProps>()(AddRepairFee);

