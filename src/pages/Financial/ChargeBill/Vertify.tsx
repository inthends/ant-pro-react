//审核
import {

  Checkbox,
  Tabs,
  Select,
  Button,Table,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,InputNumber,
  Row,
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { } from './Main.service';
import styles from './style.less';
import  moment from 'moment';

interface VertifyProps {
  vertifyVisible: boolean;
  closeVertify(): void;
  form: WrappedFormUtils;
  id?:string;
  ifVertify:boolean;
}
const Vertify = (props:  VertifyProps) => {
  const { vertifyVisible, closeVertify, id,form,ifVertify} = props;
  const { getFieldDecorator } = form;
  const title=ifVertify?"收款单取消审核":"收款单审核";
  const [infoDetail, setInfoDetail] = useState<any>({});
  // 打开抽屉时初始化
  useEffect(() => {
    if (vertifyVisible) {
      if(id){
      }else{
        setInfoDetail({  });
      }
    } else {

    }
  }, [vertifyVisible]);

  const close = () => {
    closeVertify();
  };

  const save=()=>{

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
      <Form hideRequiredMark>
        <Row gutter={4}>
          <Col span={8}>
            <Form.Item label="收款单号"  labelCol={{span:8}} wrapperCol={{span:16}} >
              {getFieldDecorator('billCode', {
                initialValue: infoDetail.billCode,
              })(
                <Input disabled={true} style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="收款日期"  labelCol={{span:8}} wrapperCol={{span:16}}>
              {getFieldDecorator('billDate', {
                initialValue: infoDetail.billDate==null?moment(new Date):moment(infoDetail.billDate),
              })(
                <DatePicker disabled={true} style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="收款人" labelCol={{span:8}} wrapperCol={{span:16}}>
              {getFieldDecorator('createUserName', {
                initialValue: infoDetail.createUserName,
              })(
                <Input disabled={true} style={{width:'100%'}}/>
              )}
            </Form.Item>

          </Col>
        </Row>
        <Row gutter={4}>
          <Col span={8}>
            <Form.Item label="收款方式A"  labelCol={{span:8}} wrapperCol={{span:16}} >
              {getFieldDecorator('payTypeA', {
                initialValue: infoDetail.payTypeA,
              })(
                <Input disabled={true} style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="收款金额A" labelCol={{span:8}} wrapperCol={{span:16}}>
              {getFieldDecorator('payAmountA', {
                initialValue: infoDetail.payAmountA,
              })(
                <Input disabled={true} style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="发票编号" labelCol={{span:8}} wrapperCol={{span:16}}>
              {getFieldDecorator('invoiceCdde', {
                initialValue: infoDetail.invoiceCdde,
              })(
                <Input disabled={true} style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={4}>
          <Col span={8}>
            <Form.Item label="收款方式B"  labelCol={{span:8}} wrapperCol={{span:16}} >
              {getFieldDecorator('payTypeB', {
                initialValue: infoDetail.payTypeB,
              })(
                <Input disabled={true} style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="收款金额B" labelCol={{span:8}} wrapperCol={{span:16}}>
              {getFieldDecorator('payAmountB', {
                initialValue: infoDetail.payAmountB,
              })(
                <Input disabled={true} style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="收据编号" labelCol={{span:8}} wrapperCol={{span:16}}>
              {getFieldDecorator('payCode', {
                initialValue: infoDetail.payCode,
              })(
                <Input disabled={true} style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={4}>
          <Col span={8}>
            <Form.Item label="收款方式C"  labelCol={{span:8}} wrapperCol={{span:16}} >
              {getFieldDecorator('payTypeC', {
                initialValue: infoDetail.payTypeC,
              })(
                <Input disabled={true} style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="收款金额C" labelCol={{span:8}} wrapperCol={{span:16}}>
              {getFieldDecorator('payAmountC', {
                initialValue: infoDetail.payAmountC,
              })(
                <Input disabled={true} style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核人"  labelCol={{span:8}} wrapperCol={{span:16}} >
              {getFieldDecorator('vertifyPerson', {
                initialValue: infoDetail.vertifyPerson,
              })(
                <Input disabled={true} style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={4}>
          <Col span={24}>
          <Form.Item label="审核情况" labelCol={{span:2}} wrapperCol={{span:22}}>
              {getFieldDecorator('vertifyMemo', {
                initialValue: infoDetail.vertifyMemo,
              })(
                <Input.TextArea rows={6} disabled={true} style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
        </Row>
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
        <Button onClick={save} type="primary">
          提交
        </Button>
      </div>
    </Drawer>
  );
};
export default Form.create< VertifyProps>()(Vertify);

