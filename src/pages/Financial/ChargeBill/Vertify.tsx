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
import { GetEntity,Audit} from './Main.service';
import styles from './style.less';
import  moment from 'moment';

interface VertifyProps {
  vertifyVisible: boolean;
  closeVertify(): void;
  form: WrappedFormUtils;
  id?:string;
  ifVertify:boolean;
  reload():void;
}
const Vertify = (props:  VertifyProps) => {
  const { vertifyVisible, closeVertify, id,form,ifVertify,reload} = props;
  const { getFieldDecorator } = form;
  const title=ifVertify?"收款单取消审核":"收款单审核";
  const [infoDetail, setInfoDetail] = useState<any>({});
  // 打开抽屉时初始化
  useEffect(() => {
    form.resetFields();
    if (vertifyVisible) {
      if(id){
        GetEntity(id).then(res=>{
          if(res!=null)
        /*  var infoTemp =Object.assign({},res.entity,
            { feeName:res.feeName, customerName:res.customerName, unitName:res.unitName});*/
          setInfoDetail(res);
        });
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
    form.validateFields((errors, values) =>{
      console.log(values,infoDetail);
      var newData=Object.assign({},values,
        {verifyPerson:ifVertify?localStorage.getItem('userid'):'',
        verifyDate:ifVertify?moment(new Date).format('YYYY-MM-DD'):'',
        verifyMemo:ifVertify?values.verifyMemo:'',
        keyValue:infoDetail.billID,
        billDate:moment(values.billDate).format('YYYY-MM-DD'),
        status:ifVertify?2:1//，已收未审核1，已审核2，已冲红3
      });
      Audit(newData).then(res=>{
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
              {getFieldDecorator('verifyPerson', {
                initialValue: infoDetail.verifyPerson,
              })(
                <Input disabled={true} style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={4}>
          <Col span={24}>
          <Form.Item label="审核情况" labelCol={{span:2}} wrapperCol={{span:22}}>
              {getFieldDecorator('verifyMemo', {
                initialValue: infoDetail.verifyMemo,
              })(
                <Input.TextArea rows={6} style={{width:'100%'}}/>
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

