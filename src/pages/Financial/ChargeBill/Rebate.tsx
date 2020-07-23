//快速优惠，只能做全部优惠
import { Select, Spin, message, Button, Col, Drawer, Form, Input, DatePicker, Row, Card } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetShowDetail, RebateBilling } from './Main.service';
import styles from './style.less';
import moment from 'moment';
const { Option } = Select;

interface RebateProps {
  visible: boolean;
  close(): void;
  form: WrappedFormUtils;
  id?: string;
  reload(): void;
}
const Rebate = (props: RebateProps) => {
  const { visible, close, id, form, reload } = props;
  const { getFieldDecorator } = form;
  const title = "费用优惠";
  const [infoDetail, setInfoDetail] = useState<any>({});
  // const [maxAmount, setMaxAmount] = useState<number>(0);
  // 打开抽屉时初始化
  useEffect(() => {
    if (visible) {
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
  }, [visible]);

  // const close = () => {
  //   closeReduction();
  // };

  const [loading, setLoading] = useState<boolean>(false);

  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        setLoading(true); 
        //判断之前是否已经做过全部优惠
        // var flag = false;
        // CheckRebate(id).then((res) => {
        //   flag = res;
        // }); 
        // if (flag) {
        //   message.warning('已经做过全部优惠，不能重复优惠');
        //   return;
        // }

        var data = {
          RebateName: values.rebateName,
          RebateCode: values.rebateCode,
          BeginDate: values.beginDate.format('YYYY-MM-DD'),
          EndDate: values.endDate.format('YYYY-MM-DD'),
          Memo: values.memo
        }
        var jsonData = {
          Data: JSON.stringify(data),
          keyvalue: id
        };

        RebateBilling(jsonData).then(res => {
          setLoading(false);
          message.success('提交成功');
          close();
          reload();
        });
      }
    });
  };

  //禁用日期
  // const disabledDate = (current) => {
  //   return current < moment(infoDetail.beginDate) || current > moment(infoDetail.endDate).add(1, 'days');
  // };
  //计算张总天数
  //  const GetDays = (max: moment.Moment, min: moment.Moment) => {
  //   const iMonth = max.diff(min, 'months');
  //   if (iMonth == 0) {
  //     return max.diff(min, 'days')+1;//不足一个月
  //   }
  //   else { 
  //     let days = (iMonth - 1) * 30;
  //     let minEnd = min.clone();//防止影响原来的日期
  //     let maxBegin = max.clone();//防止影响原来的日期
  //     minEnd = minEnd.endOf('month');//月底
  //     maxBegin = maxBegin.startOf('month');//月底
  //     let pdays = minEnd.diff(min, 'days')+1;
  //     let adays = max.diff(maxBegin, 'days')+1;
  //     alert(days + pdays + adays);
  //     return days + pdays + adays;
  //   }
  // }

  //选择优惠政策
  const change = (value, option) => {
    form.setFieldsValue({ rebateName: option.props.children });
  };

  //起始日期控制
  const disabledStartDate = (current) => {
    return current && current.isAfter(moment(form.getFieldValue('endDate')), 'day');
  };

  //结束日期控制
  const disabledEndDate = (current) => {
    return current && current.isBefore(moment(form.getFieldValue('beginDate')), 'day');
  };

  return (
    <Drawer
      title={title}
      placement="right"
      width={680}
      onClose={close}
      visible={visible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Spin tip="数据处理中..." spinning={loading}>
        <Card className={styles.card} hoverable>
          <Form layout="vertical" hideRequiredMark>
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

            <Row gutter={24}>
              <Col span={8}>
                <Form.Item label="金额">
                  {infoDetail.amount}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="计费起始日期"  >
                  {infoDetail.beginDate ? String(infoDetail.beginDate).substr(0, 10) : ''}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="计费截止日期" >
                  {infoDetail.endDate ? String(infoDetail.endDate).substr(0, 10) : ''}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col lg={8}>
                <Form.Item label="优惠政策" required>
                  {getFieldDecorator('rebateCode', {
                    initialValue: '3',//infoDetail.rebateCode,
                    rules: [{ required: true, message: '请选择优惠政策' }]
                  })(
                    <Select placeholder="==请选择=="
                      onChange={change}>
                      <Option value='3'>全部优惠</Option>
                    </Select>
                  )}
                  {getFieldDecorator('rebateName', {
                    initialValue: infoDetail.rebateName,
                  })(
                    <input type='hidden' />
                  )}
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item label="优惠开始日期" required>
                  {getFieldDecorator('beginDate', {
                    initialValue: moment(new Date()),
                    rules: [{ required: true, message: '请选择优惠开始日期' }]
                  })(
                    <DatePicker placeholder="请选择优惠开始日期" style={{ width: '100%' }}
                      disabledDate={disabledStartDate} />
                  )}
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item label="优惠结束日期" required >
                  {getFieldDecorator('endDate', {
                    initialValue: moment(new Date()),
                    rules: [{ required: true, message: '请选择优惠结束日期' }]
                  })(
                    <DatePicker placeholder="请选择优惠结束日期" style={{ width: '100%' }}
                      disabledDate={disabledEndDate} />
                  )}
                </Form.Item></Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item label="备注" >
                  {getFieldDecorator('memo', {
                    initialValue: ''//infoDetail.memo,
                  })(
                    <Input.TextArea rows={4} style={{ width: '100%' }} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Spin>
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
        <Button onClick={close} style={{ marginRight: 8 }} disabled={loading}>
          取消
        </Button>
        <Button onClick={save} type="primary" disabled={loading}  >
          提交
        </Button>
      </div>
    </Drawer>
  );
};
export default Form.create<RebateProps>()(Rebate);

