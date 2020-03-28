//快速减免
import { Spin, message, Button, Col, Drawer, Form, Input, InputNumber, Row, Card } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetShowDetail, ReductionBilling } from './Main.service';
import styles from './style.less';

interface ReductionProps {
  reductionVisible: boolean;
  closeReduction(): void;
  form: WrappedFormUtils;
  id?: string;
  reload(): void;
}
const Reduction = (props: ReductionProps) => {
  const { reductionVisible, closeReduction, id, form, reload } = props;
  const { getFieldDecorator } = form;
  const title = "减免费用";
  const [infoDetail, setInfoDetail] = useState<any>({});
  // const [maxAmount, setMaxAmount] = useState<number>(0);

  // 打开抽屉时初始化
  useEffect(() => {
    if (reductionVisible) {
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
  }, [reductionVisible]);

  const close = () => {
    closeReduction();
  };

  const [loading, setLoading] = useState<boolean>(false);

  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        setLoading(true);
        var data = {
          Rebate: values.rebate,
          ReductionAmount: values.reductionAmount,
          Memo: values.memo
        }
        var jsonData = {
          Data: JSON.stringify(data),
          keyValue: id
        };
        ReductionBilling(jsonData).then(res => {
          message.success('提交成功');
          close();
          reload();
          setLoading(false);
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

  return (
    <Drawer
      title={title}
      placement="right"
      width={700}
      onClose={close}
      visible={reductionVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Spin tip="数据处理中..." spinning={loading}>
        <Card className={styles.card} >
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
            <Row  >
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}>减免前</p>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item label="总金额"   >
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
            <Row  >
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}>减免为</p>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="折扣(默认10不打折)" required>
                  {getFieldDecorator('rebate', {
                    initialValue: 10,
                    rules: [{ required: true, message: '请输入折扣' }],
                  })(
                    <InputNumber style={{ width: '100%' }} max={10} min={1} ></InputNumber>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="减免金额"  >
                  {getFieldDecorator('reductionAmount', {
                    initialValue: 0,
                    rules: [{ required: true, message: '请输入减免金额' }],
                  })(
                    <InputNumber precision={2} style={{ width: '100%' }}
                      min={0}
                      max={infoDetail.amount}
                    ></InputNumber>
                  )}
                </Form.Item>
              </Col>
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
export default Form.create<ReductionProps>()(Reduction);

