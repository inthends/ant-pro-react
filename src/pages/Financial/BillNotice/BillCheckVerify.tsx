import { Card, Button, Col, DatePicker, Drawer, Form, Row, Input  } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { Audit, GetEntityShow } from './BillNotice.service';
import './style.less';
import moment from 'moment';

interface BillCheckVerifyProps {
  vertifyVisible: boolean;
  ifVerify: boolean;
  closeVerify(result?): void;
  form: WrappedFormUtils;
  id?: string;
  reload(): void;
}

const BillCheckVerify = (props: BillCheckVerifyProps) => {
  const { vertifyVisible, closeVerify, form, id, ifVerify } = props;
  const title = ifVerify ? '账单审核' : '账单取消审核';
  // const [loading, setLoading] = useState<boolean>(false);
  const { getFieldDecorator } = form;
  const [infoDetail, setInfoDetail] = useState<any>({});

  useEffect(() => {
    if (vertifyVisible) {
      form.resetFields();
      if (id != null && id != '') {
        // setLoading(true);
        GetEntityShow(id).then(res => {
          setInfoDetail(Object.assign({}, res.entity, { customerName: res.name }));
          // setLoading(false);
        })
      } else {
        setInfoDetail({});
        // setLoading(false);
      }
    }
  }, [vertifyVisible]);

  const close = () => {
    closeVerify(false);
  };

  const onSave = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        // let newData={
        //   keyValue:infoDetail.billId,
        //   billCode:values.billCode,
        //   billDate:moment(values.billDate).format('YYYY-MM-DD'),
        //   billType:values.billType,
        //   customerName:values.customerName,
        //   IfVerify:!infoDetail.ifVerify,
        //   VerifyDate:ifVerify?moment(new Date()).format('YYYY-MM-DD HH:mm:ss'):moment(values.verifyDate).format('YYYY-MM-DD HH:mm:ss'),
        //   VerifyMemo:values.verifyMemo
        // };

        const newData = {
          ...values,
          ...infoDetail,
          keyValue: infoDetail.billId,
          ifVerify: !infoDetail.ifVerify,
          verifyDate: values.verifyDate.format('YYYY-MM-DD HH:mm:ss')
        };

        Audit(newData).then(() => {
          closeVerify(true);
          // reload();
        });
      }
    });
  };

  return (
    <Drawer
      className="offsetVerify"
      title={title}
      placement="right"
      width={600}
      onClose={close}
      visible={vertifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Card>
        <Form layout="vertical" hideRequiredMark> 
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item required label="单号">
                {getFieldDecorator('billCode', {
                  initialValue: infoDetail.billCode,
                })(
                  <Input disabled={true} placeholder="自动获取编号" />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item required label="账单日期"  >
                {getFieldDecorator('billDate', {
                  initialValue: infoDetail.billDate == null ? moment(new Date()) : moment(infoDetail.billDate),
                  rules: [{ required: true, message: '请选择账单日期' }],
                })(
                  <DatePicker disabled={true} />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item required label="单据类型"  >
                {getFieldDecorator('billType', {
                  initialValue: infoDetail.billType,
                })(
                  <Input disabled={true} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item required label="业户名称"   >
                {getFieldDecorator('customerName', {
                  initialValue: infoDetail.customerName,
                })(
                  <Input disabled={true}></Input>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item required label="审核日期"   >
                {getFieldDecorator('verifyDate', {
                  initialValue: infoDetail.billDate == null ? moment(new Date()) : moment(infoDetail.billDate),
                })(
                  <DatePicker disabled={true} />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item required label="审核人"  >
                {getFieldDecorator('verifyPerson', {
                  initialValue: infoDetail.verifyPerson,
                })(
                  <Input disabled={true} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="审核情况"  >
                {getFieldDecorator('verifyMemo', {
                  initialValue: infoDetail.verifyMemo
                })(
                  <Input.TextArea rows={6} placeholder="请输入审核情况" />
                )}
              </Form.Item>
            </Col>
          </Row>

        </Form>
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
        <Button style={{ marginRight: 8 }}
          onClick={() => closeVerify()}
        >
          取消
            </Button>
        <Button type="primary"
          onClick={() => onSave()}
        >
          提交
            </Button>
      </div>

    </Drawer>
  );
};

export default Form.create<BillCheckVerifyProps>()(BillCheckVerify);

