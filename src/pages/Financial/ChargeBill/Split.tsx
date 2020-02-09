//拆费
import { message, Button, Col, DatePicker, Drawer, Form, Input, InputNumber, Row, Card } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetShowDetail, SplitBilling } from './Main.service';
import styles from './style.less';
import moment from 'moment';

interface SplitProps {
  splitVisible: boolean;
  closeSplit(): void;
  form: WrappedFormUtils;
  id?: string;
  reload(): void;
}
const Split = (props: SplitProps) => {
  const { splitVisible, closeSplit, id, form, reload } = props;
  const { getFieldDecorator } = form;
  const title = "拆分费用";
  const [infoDetail, setInfoDetail] = useState<any>({});
  // const [maxAmount, setMaxAmount] = useState<number>(0);

  // 打开抽屉时初始化
  useEffect(() => {
    if (splitVisible) {
      form.resetFields();
      if (id != null && id != "") {
        GetShowDetail(id).then(res => {
          // var infoTemp = Object.assign({}, res.entity, { number: res.number, feeName: res.feeName, customerName: res.customerName, unitName: res.unitName });
          setInfoDetail(res);
          // setMaxAmount(res.entity.amount);
        });
      }
      else {
        setInfoDetail({});
      }
    } else {
    }
  }, [splitVisible]);

  const close = () => {
    closeSplit();
  };

  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        var data = {
          FirstAmount: values.firstAmount,
          FirstBeginDate: moment(values.firstBeginDate).format('YYYY-MM-DD'),
          FirstEndDate: moment(values.firstEndDate).format('YYYY-MM-DD'),
          SecondAmount: values.secondAmount,
          SecondBeginDate: moment(values.secondBeginDate).format('YYYY-MM-DD'),
          SecondEndDate: moment(values.secondEndDate).format('YYYY-MM-DD'),
          Memo: values.memo
        }
        var splitData = {
          Data: JSON.stringify(data),
          keyValue: id
        };
        SplitBilling(splitData).then(res => {
          message.success('提交成功');
          reload();
          close();
        });
      }
    });
  };

  //禁用日期
  const disabledDate = (current) => {
    return current < moment(infoDetail.beginDate) || current > moment(infoDetail.endDate).add(1, 'days');
  };

  return (
    <Drawer
      title={title}
      placement="right"
      width={700}
      onClose={close}
      visible={splitVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Form layout="vertical" hideRequiredMark>
        <Card className={styles.card} >
          {/* <Row gutter={4}>
            <Col span={24}>
              <Form.Item label="收费对象" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} >
                {getFieldDecorator('customerName', {
                  initialValue: infoDetail.customerName,
                })(
                  <Input disabled={true} style={{ width: '100%' }} />
                )}
              </Form.Item>
            </Col>
          </Row> */}

          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="收费对象"   >
                {infoDetail.customerName}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="收费房屋"  >
                {infoDetail.unitName}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="收费项目" >
                {infoDetail.feeName}
              </Form.Item>
            </Col>
          </Row>
          <Row  >
            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>拆分前</p>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="总金额"   >
                {infoDetail.amount}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="计费起始日期"  >
                {String(infoDetail.beginDate).substr(0, 10)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="计费截止日期" >
                {String(infoDetail.endDate).substr(0, 10)}
              </Form.Item>
            </Col>
          </Row>
          <Row  >
            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>拆分为</p>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="第一笔金额" required>
                {getFieldDecorator('firstAmount', {
                  initialValue: infoDetail.firstAmount,//? infoDetail.firstAmount : infoDetail.amount,
                  rules: [{ required: true, message: '请输入第一笔金额' },
                    // {
                    //   validator: (rules, value, callback) => {
                    //     if (value == undefined) {
                    //       callback();
                    //     }
                    //     else {
                    //       if (value > infoDetail.amount) {
                    //         callback('金额不能大于拆分前总金额');
                    //       }
                    //     }
                    //   }
                    // }
                  ]
                })(
                  <InputNumber style={{ width: '100%' }}
                    min={0} max={infoDetail.amount}
                    precision={2}
                    // onChange={(value) => {
                    //   if (value && value < infoDetail.amount) {
                    //     var tempInfo = Object.assign({}, infoDetail, { firstAmount: value });
                    //     setInfoDetail(tempInfo);
                    //   }
                    // }}

                    onChange={(value) => {
                      var secondAmount = infoDetail.amount - Number(value);
                      form.setFieldsValue({ secondAmount: secondAmount });
                      //修改金额的时候，改变日期 
                      const a = moment(infoDetail.beginDate);
                      const b = moment(infoDetail.endDate);
                      const iDays = b.diff(a, 'days');
                      const firstdays = Math.ceil(iDays * Number(value) / infoDetail.amount);
                      const firstEndDate = a.add(firstdays, 'days');
                      form.setFieldsValue({ firstEndDate: firstEndDate });
                      if (firstEndDate < b) {
                        form.setFieldsValue({ secondBeginDate: moment(firstEndDate).add(1, 'days') });
                      } else {
                        form.setFieldsValue({ secondBeginDate: firstEndDate });
                      }
                    }
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="计费起始日期"  >
                {getFieldDecorator('firstBeginDate', {
                  initialValue: infoDetail.beginDate == null ? moment(new Date) : moment(infoDetail.beginDate),
                })(
                  <DatePicker disabled={true} style={{ width: '100%' }} />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="计费截止日期" required >
                {getFieldDecorator('firstEndDate', {
                  initialValue: infoDetail.firstEndDate == null ? moment(new Date) : moment(infoDetail.firstEndDate),
                  rules: [{ required: true, message: '请输入计费截止日期' },
                    //   {
                    //   validator: (rules, value, callback) => {
                    //     if (value.isBefore(moment(infoDetail.beginDate).format('YYYY-MM-DD')) || value.isAfter(moment(infoDetail.endDate).format('YYYY-MM-DD'))) {
                    //       callback('拆分日期必须早于拆分前截止日期');
                    //     }
                    //   }
                    // }
                  ]
                })(
                  <DatePicker style={{ width: '100%' }}
                    disabledDate={disabledDate}
                    // onChange={(date, datestr) => {
                    //   /*if(date.isBefore(moment(infoDetail.beginDate).format('YYYY-MM-DD'))||date.isAfter(moment(infoDetail.endDate).format('YYYY-MM-DD')))
                    //   {
                    //     message.warning('计费截止日期必须晚于起始日期且早于第二次计费截止日期');
                    //     var tempInfo=Object.assign({},infoDetail,{firstEndDate:null});
                    //     setInfoDetail(tempInfo);
                    //   }else{*/
                    //   var tempInfo = Object.assign({}, infoDetail, { firstEndDate: date.format('YYYY-MM-DD'), secondBeginDate: moment(datestr).add(1, 'days').format('YYYY-MM-DD') });
                    //   //console.log(date,tempInfo);
                    //   setInfoDetail(tempInfo);
                    //   /*}*/
                    // }} 

                    onChange={(date, datestr) => {
                      //改变日期，计算金额
                      const a = moment(infoDetail.beginDate);
                      const b = moment(infoDetail.endDate);
                      const iDays = b.diff(a, 'days');
                      const firstEndDate = moment(datestr);
                      const firstDays = firstEndDate.diff(a, 'days');
                      const firstamount = (infoDetail.amount / iDays * firstDays).toFixed(2);
                      form.setFieldsValue({ firstAmount: firstamount });
                      form.setFieldsValue({ secondAmount: infoDetail.amount - Number(firstamount) });
                      if (firstEndDate < b) {
                        form.setFieldsValue({ secondBeginDate: firstEndDate.add(1, 'days') });
                      } else {
                        form.setFieldsValue({ secondBeginDate: firstEndDate });
                      }
                    }
                    }

                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="第二笔金额"   >
                {getFieldDecorator('secondAmount', {
                  initialValue: infoDetail.secondAmount,
                })(
                  <InputNumber disabled={true} style={{ width: '100%' }}
                    precision={2}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="计费起始日期"  >
                {getFieldDecorator('secondBeginDate', {
                  initialValue: infoDetail.secondBeginDate == null ? moment(new Date) : moment(infoDetail.secondBeginDate),
                })(
                  <DatePicker disabled={true} style={{ width: '100%' }} />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="计费截止日期"  >
                {getFieldDecorator('secondEndDate', {
                  initialValue: infoDetail.endDate == null ? moment(new Date) : moment(infoDetail.endDate),
                })(
                  <DatePicker disabled={true} style={{ width: '100%' }} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item label="备注" >
                {getFieldDecorator('memo', {
                  initialValue: infoDetail.memo,
                })(
                  <Input.TextArea rows={4} style={{ width: '100%' }} />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
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
        <Button onClick={save} type="primary"  >
          提交
        </Button>
      </div>
    </Drawer>
  );
};
export default Form.create<SplitProps>()(Split);

