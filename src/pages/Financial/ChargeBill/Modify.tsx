import { TreeEntity } from '@/model/models';
import {
  Select,
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input, InputNumber,
  Row,
  message,
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import {
  SaveDetail, GetReceivablesFeeItemTreeJson, GetRoomUsers,
  GetUserRooms, GetFeeItemDetail, SaveBilling, GetShowDetail
} from './Main.service';

import LeftTree from '../LeftTree';
import moment from 'moment';

const { Option } = Select;

interface ModifyProps {
  modifyVisible: boolean;
  closeDrawer(): void;
  form: WrappedFormUtils;
  organizeId?: string;
  id?: string;
  reload(): void;
  edit: boolean;
}
const Modify = (props: ModifyProps) => {
  const { modifyVisible, closeDrawer, form, organizeId, id, reload, edit } = props;
  const { getFieldDecorator } = form;
  const title = id == "" ? '新增费用' : "修改费用";
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [feeTreeData, setFeeTreeData] = useState<TreeEntity[]>([]);
  const [relationIds, setRelationIds] = useState<any[]>([]);
  const [unitIds, setUnitIds] = useState<any[]>([]);

  // 打开抽屉时初始化
  useEffect(() => {
    form.resetFields();
    if (modifyVisible) {
      if (id != null && id != "") {
        var infoTemp = {};

        GetShowDetail(id).then(res => {
          infoTemp = Object.assign({}, res.entity, { number: res.number });
          return GetRoomUsers(res.entity.unitId);
        }).then(res => {
          setRelationIds(res);
          if (res.length > 0) {
            infoTemp = Object.assign({}, infoTemp, { relationId: res[0].key });
          }
          setInfoDetail(infoTemp);
          return res;
        }).then(relations => {
          if (infoTemp.relationId) {
            var selectId = '';
            for (var i = 0; i < relations.length; i++) {
              if (relations[i].key == infoTemp.relationId) {
                selectId = relations[i].value;
              }
            }
            return GetUserRooms(selectId);
          }
        }).then(res => {
          setUnitIds(res);
          if (res.length > 0) {
            infoTemp = Object.assign({}, infoTemp, { householdId: res[0].value })
            setInfoDetail(infoTemp);
          }
        });

        //加载数据
        // GetShowDetail(id).then(res => {
        //   infoTemp = Object.assign({}, res.entity, { number: res.number });
        //   GetRoomUsers(res.entity.unitId).then(ru=>{
        //     setRelationIds(ru);
        //     if (res.length > 0) {
        //           infoTemp = Object.assign({}, infoTemp, { relationId: ru[0].key });
        //         }
        //   }); 
        //   setInfoDetail(infoTemp);
        //   form.resetFields();
        // });


      } else {
        if (organizeId) {
          GetRoomUsers(organizeId).then(res => {
            setRelationIds(res);
            if (res.length > 0) {
              var info = Object.assign({}, infoDetail, { relationId: res[0].key });
              setInfoDetail(info);
            }
            return info;
          }).then(infoDetail => {
            GetUserRooms(getRelationId(infoDetail.relationId))
              .then(res => {
                setUnitIds(res);
                if (res.length > 0) {
                  var info = Object.assign({}, infoDetail, { householdId: res[0].value });
                  setInfoDetail(info);
                }
              });
          });
        }
        if (relationIds == null) {
          setInfoDetail({});
        }
        GetReceivablesFeeItemTreeJson().then(res => {
          // const treeList = (res || []).map(item => {
          //   return Object.assign({}, item, {
          //     id: item.key,
          //     text: item.text,
          //     parentId: item.parentId
          //   });
          // });
          setFeeTreeData(res);
        });
        //重置之前选择加载的费项类别
        setInfoDetail({});
        form.resetFields();
      }
    } else {
      form.setFieldsValue({});
    }
  }, [modifyVisible]);

  const close = (refresh: boolean) => {
    if (refresh) {
      reload();
    }
    closeDrawer();
  };


  const getRelationId = (key) => {
    if (relationIds == null) {
      return null
    }
    for (var i = 0; i < relationIds.length; i++) {
      if (relationIds[i].key == key) {
        return relationIds[i].value;
      }
    }
  }

  const getUnitId = (value) => {
    if (unitIds == null) {
      return null
    }
    for (var i = 0; i < unitIds.length; i++) {
      if (unitIds[i].value == value) {
        return unitIds[i].key;
      }
    }
  }
  const getGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  const onSave = () => {
    form.validateFields((errors, values) => {
      if (infoDetail.feeItemId == null || infoDetail.feeItemId == '') {

      }
      if (!errors) {
        var guid = getGuid();

        var unit = {
          BillId: id != null && id != "" ? infoDetail.billId : guid,
          UnitId: values.householdId,
          FeeItemId: infoDetail.feeItemId,
          Quantity: "" + values.quantity,
          Price: "" + values.price,
          Amount: "" + values.amount,
          Period: moment(values.period).format("YYYY-MM-DD"),//"2019-04-08",
          BeginDate: moment(values.beginDate).format("YYYY-MM-DD"),//"2019-04-01",
          EndDate: moment(values.endDate).format("YYYY-MM-DD"),//"2019-04-30",
          Memo: values.memo,
          RelationId: values.relationId,//getRelationId(values.relationId),
          CycleValue: "" + values.cycleValue,
          CycleType: values.cycleType,
          BillDate: moment(values.billDate).format("YYYY-MM-DD")
        }
        if (id != null && id != "") {
          unit = Object.assign({}, unit, { Id: id, keyValue: id });
          SaveDetail(unit).then(res => {
            close(true);

          })
        } else {
          let units: any[];
          units = [];
          units.push(unit);
          let newData = {
            BillId: id != null && id != "" ? infoDetail.billId : guid,
            OrganizeId: organizeId,
            BillSource: "临时加费",
            Units: JSON.stringify(units),
            keyValue: id != null && id != "" ? infoDetail.billId : guid,
            // CreateUserId: localStorage.getItem('userid'),
            // CreateUserName: localStorage.getItem('username'),
            // CreateDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            // ModifyUserId: localStorage.getItem('userid'),
            // ModifyUserName: localStorage.getItem('username'),
            // ModifyDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            LinkId: '',
            IfVerify: false,
            VerifyPerson: '',
            VerifyDate: '',
            VerifyMemo: '',
            Status: 0,//0正常 1 删除
            code: id != null && id != "" ? 1 : 0
          };
          SaveBilling(newData).then((res) => {
            close(true);
          });
        }
      }
    });
  }

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
  const getMonthBeforeFormatAndDay = (num, format, date) => {

    let day = date.get('date');
    let month = date.get('month');
    date.set('month', month + num * 1, 'date', 1); //周期月一号
    //读取日期自动会减一，所以要加一
    let mo = date.get('month') + 1;
    //小月
    if (mo == 4 || mo == 6 || mo == 9 || mo == 11) {
      if (day > 30) {
        day = 30;
      }
    }
    //2月
    else if (mo == 2) {
      //闰年
      if (date.isLeapYear()) {
        if (day > 29) {
          day = 29;
        } else {
          day = 28;
        }
      }
      if (day > 28) {
        day = 28;
      }
    }
    //大月
    else {
      if (day > 31) {
        day = 31;
      }
    }
    date.set('date', day);
    return date;
  };

  //设置结束日期
  const getEndDate = () => {
    const cycle = form.getFieldValue('cycleValue');
    const cycletype = form.getFieldValue('cycleType')
    let d = form.getFieldValue('beginDate');
    if (d != "") {
      let endDate = moment(d);
      if (cycletype == "日") {
        //日
        endDate.set('date', endDate.get('date') + cycle);
      } else if (cycletype == "月") {
        // 月
        endDate = getMonthBeforeFormatAndDay(cycle, "-", endDate);
      } else {
        //年
        endDate.set('year', endDate.get('year') + cycle);
      }
      endDate.set('date', endDate.get('date') - 1);
      return endDate;
    }
    return '';
  };

  return (
    <Drawer
      title={title}
      placement="right"
      width={id != '' ? 488 : 780}
      onClose={() => close(false)}
      visible={modifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 50px)' }}
    >
      <Row>
        {
          id != '' ?
            null : <Col span={8} style={{ overflow: 'visible', position: 'relative', height: 'calc(100vh - 140px)' }}>
              <LeftTree
                treeData={feeTreeData}
                selectTree={(id, item) => {
                  // setFeeItemId(id);
                  if (organizeId) {
                    GetFeeItemDetail(id, organizeId).then(res => {
                      if (res.relationId != null) {
                        var info = Object.assign({}, res, { feeItemId: id });
                        // console.log(info);
                        setInfoDetail(info);
                        return info;
                      }
                      else {
                        message.warning(res);
                        return null;
                      }
                    }).then(info => {
                      if (info !== null) {
                        GetUserRooms(getRelationId(info.relationId))
                          .then(res => {
                            setUnitIds(res);
                            if (res.length > 0)
                              info = Object.assign({}, info, { householdId: res[0].value });
                            setInfoDetail(info);
                          });
                      }
                    });
                  }
                }}
              />
            </Col>
        }

        <Col span={id != '' ? 24 : 16}>
          <Form hideRequiredMark>
            <Row>
              <Form.Item label="加费对象" required labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} >
                {getFieldDecorator('relationId', {
                  initialValue: infoDetail.relationId == null ? null : infoDetail.relationId,// getRelationId(infoDetail.relationId),
                  rules: [{ required: true, message: '请选择加费对象' }]
                })(
                  <Select placeholder="=请选择=" disabled={id === '' && edit ? false : true} onSelect={(key) => {
                    //debugger;
                    GetUserRooms(getRelationId(key)).then(res => {
                      setUnitIds(res);
                      var info = Object.assign({}, infoDetail, { householdId: res[0].value });
                      setInfoDetail(info);
                    });
                  }}>
                    {relationIds.map(item => (
                      <Option value={item.key}>
                        {item.title}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label="选择房屋" required labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} >
                {getFieldDecorator('householdId', {
                  initialValue: infoDetail.householdId == null ? null : getUnitId(infoDetail.householdId),
                  rules: [{ required: true, message: '请选择房屋' }]
                })(
                  <Select placeholder="=请选择=" disabled={id === '' && edit ? false : true} >
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
              <Col span={10}>
                <Form.Item label="单价" required labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} >
                  {getFieldDecorator('price', {
                    initialValue: infoDetail.price,
                    rules: [{ required: true, message: '请输入单价' }]
                  })(
                    <Input min={0} readOnly style={{ width: '100%' }} ></Input>
                  )}
                </Form.Item>
              </Col>
              <Col span={1} style={{ lineHeight: "32px", textAlign: 'center' }}>
                X
              </Col>
              <Col span={6}>
                <Form.Item label="" required wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('quantity', {
                    initialValue: infoDetail.quantity,
                    rules: [{ required: true, message: '请输入数量' }]
                  })(
                    <Input min={0} readOnly style={{ width: '100%' }} ></Input>
                  )}
                </Form.Item>
              </Col>
              <Col span={1} style={{ lineHeight: "32px", textAlign: 'center' }}>
                X
              </Col>
              <Col span={6}>
                <Form.Item label="" required wrapperCol={{ span: 24 }}>
                  {getFieldDecorator('number', {
                    initialValue: infoDetail.number,
                    rules: [{ required: true, message: '请输入系数' }]
                  })(
                    <InputNumber min={0} style={{ width: '100%' }} disabled={edit ? false : true}
                      onChange={(value) => {
                        if (value != undefined) {
                          var amount = infoDetail.price * infoDetail.quantity * value;
                          var info = Object.assign({}, infoDetail, { number: value, amount: amount });
                          setInfoDetail(info);
                        }
                      }}></InputNumber>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="金额" required labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} >
                  {getFieldDecorator('amount', {
                    initialValue: infoDetail.price == null || infoDetail.quantity == null || infoDetail.number == null ? 0 : infoDetail.price * infoDetail.quantity * infoDetail.number,
                    rules: [{ required: true, message: '=请选择=' }]
                  })(
                    <InputNumber precision={2} readOnly style={{ width: '100%' }} ></InputNumber>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item label="周期" required labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
                  {getFieldDecorator('cycleValue', {
                    initialValue: infoDetail.cycleValue,
                    rules: [{ required: true, message: '请输入周期' }]
                  })(
                    <InputNumber disabled={edit ? false : true} style={{ width: '100%' }}
                      onChange={value => {
                        if (value != undefined) {
                          setEndDate(infoDetail.beginDate, value, infoDetail.cycleType);
                        }
                      }}></InputNumber>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="" required labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} >
                  {getFieldDecorator('cycleType', {
                    initialValue: infoDetail.cycleType === null ? "月" : infoDetail.cycleType,
                    rules: [{ required: true, message: '请选择周期单位' }]
                  })(
                    <Select placeholder="=请选择=" disabled={edit ? false : true} style={{ width: '100%' }} onChange={(value: string) => {
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
                    initialValue: infoDetail.beginDate == null ? moment(new Date()) : moment(infoDetail.beginDate),
                    rules: [{ required: true, message: '请选择起始日期' }]
                  })(
                    <DatePicker disabled={true} style={{ width: '100%' }} />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="结束日期" required labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
                  {getFieldDecorator('endDate', {
                    initialValue: infoDetail.endDate == null ? moment(getEndDate()) : moment(infoDetail.endDate),
                    rules: [{ required: true, message: '请选择结束日期' }]
                  })(
                    <DatePicker disabled={true} style={{ width: '100%' }} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="账单日" required labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
                  {getFieldDecorator('billDate', {
                    initialValue: infoDetail.billDate == null ? moment(new Date()) : moment(infoDetail.billDate),
                    rules: [{ required: true, message: '请选择账单日' }]
                  })(
                    <DatePicker disabled={true} style={{ width: '100%' }} />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="应收期间" required labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
                  {getFieldDecorator('period', {
                    initialValue: infoDetail.period == null ? moment(new Date()) : moment(infoDetail.period),
                    rules: [{ required: true, message: '请选择应收期间' }]
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
                    <Input.TextArea disabled={edit ? false : true} rows={3} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      {edit ? <div
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
        <Button onClick={() => close(false)} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button onClick={onSave} type="primary">
          提交
        </Button>
      </div> : null}

    </Drawer>
  );
};
export default Form.create<ModifyProps>()(Modify);

