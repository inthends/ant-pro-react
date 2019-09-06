//审核
import {
  Card,
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Row,
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetEntity, Audit } from './Main.service';
import styles from './style.less';
import moment from 'moment';

interface VertifyProps {
  vertifyVisible: boolean;
  closeVertify(): void;
  form: WrappedFormUtils;
  id?: string;
  ifVertify: boolean;
  reload(): void;
}
const Vertify = (props: VertifyProps) => {
  const { vertifyVisible, closeVertify, id, form, ifVertify, reload } = props;
  const { getFieldDecorator } = form;
  const title = ifVertify ? "收款单取消审核" : "收款单审核";
  const [infoDetail, setInfoDetail] = useState<any>({});
  // 打开抽屉时初始化
  useEffect(() => {
    form.resetFields();
    if (vertifyVisible) {
      if (id) {
        GetEntity(id).then(res => {
          if (res != null)
            /*  var infoTemp =Object.assign({},res.entity,
                { feeName:res.feeName, customerName:res.customerName, unitName:res.unitName});*/
            setInfoDetail(res);
        });
      } else {
        setInfoDetail({});
      }
    } else {

    }
  }, [vertifyVisible]);

  const close = () => {
    closeVertify();
  };

  const save = () => {
    form.validateFields((errors, values) => {
      // console.log(values, infoDetail);
      var newData = Object.assign({}, infoDetail,
        {
          // verifyPerson: localStorage.getItem('userid'),
          // verifyDate: moment(new Date).format('YYYY-MM-DD'),
          verifyMemo: values.verifyMemo,
          keyValue: infoDetail.billId,
          billDate: moment(values.billDate).format('YYYY-MM-DD'),
          status: ifVertify ? 1 : 2//，已收未审核1，已审核2，已冲红3
        });
      Audit(newData).then(res => {
        reload();
        close();
      });
    });
  }
  return (
    <Drawer
      title={title}
      placement="right"
      width={800}
      onClose={close}
      visible={vertifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Card className={styles.card}>
        <Form layout="vertical">
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item label="收款单号"  >
                {infoDetail.billCode}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="收款日期"  >
                {infoDetail.billDate}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="收据编号" >
                {infoDetail.payCode}
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="发票编号"  >
                {infoDetail.invoiceCdde}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item label="收款方式A"   >
                {infoDetail.payTypeA}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="收款金额A" >
                {infoDetail.payAmountA}
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="收款方式B"  >
                {infoDetail.payTypeB}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="收款金额B"  >
                {infoDetail.payAmountB}
              </Form.Item>
            </Col>

          </Row>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item label="收款方式C"   >
                {infoDetail.payTypeC}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="收款金额C" >
                {infoDetail.payAmountC}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="收款人" >
                {infoDetail.createUserName}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="审核人"  >
                {infoDetail.verifyPerson}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item label="审核情况" >
                {getFieldDecorator('verifyMemo', {
                  initialValue: infoDetail.verifyMemo,
                })(
                  <Input.TextArea rows={6} style={{ width: '100%' }} />
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
export default Form.create<VertifyProps>()(Vertify);

