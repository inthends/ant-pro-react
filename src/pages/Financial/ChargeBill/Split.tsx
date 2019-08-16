//拆费
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

interface SplitProps {
  splitVisible: boolean;
  closeSplit(): void;
  form: WrappedFormUtils;
  id?:string;

}
const Split = (props:  SplitProps) => {
  const { splitVisible, closeSplit, id,form} = props;
  const { getFieldDecorator } = form;
  const title="拆分费用";
  const [infoDetail, setInfoDetail] = useState<any>({});
  // 打开抽屉时初始化
  useEffect(() => {
    if (splitVisible) {
      if(id){
      }else{
        setInfoDetail({  });
      }
    } else {

    }
  }, [splitVisible]);

  const close = () => {
    closeSplit();
  };

  const save=()=>{

  }
  return (
    <Drawer
      title={title}
      placement="right"
      width={800}
      onClose={close}
      visible={splitVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Form hideRequiredMark>
        <Row gutter={4}>
          <Col span={24}>
            <Form.Item label="收费对象"  labelCol={{span:2}} wrapperCol={{span:22}} >
              {getFieldDecorator('customerName', {
                initialValue: infoDetail.customerName,
              })(
                <Input disabled={true} style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={4}>
          <Col span={24}>
            <Form.Item label="收费房屋"  labelCol={{span:2}} wrapperCol={{span:22}}>
              {getFieldDecorator('unitName', {
                initialValue: infoDetail.unitName,
              })(
                <Input disabled={true} style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={4}>
          <Col span={24}>
            <Form.Item label="收费项目" labelCol={{span:2}} wrapperCol={{span:22}}>
              {getFieldDecorator('feeName', {
                initialValue: infoDetail.feeName,
              })(
                <Input disabled={true} style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={4}>
          <p style={{fontSize:'18px',fontWeight:'bold'}}>拆分前</p>
        </Row>
        <Row gutter={4}>
          <Col span={8}>
            <Form.Item label="总金额"  labelCol={{span:8}} wrapperCol={{span:16}} >
              {getFieldDecorator('amount', {
                initialValue: infoDetail.amount,
              })(
                <Input disabled={true} style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="计费起始日期" labelCol={{span:9}} wrapperCol={{span:15}}>
            {getFieldDecorator('beginDate', {
                initialValue: infoDetail.beginDate==null?moment(new Date):moment(infoDetail.beginDate),
              })(
                <DatePicker disabled={true} style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="计费终止日期" labelCol={{span:9}} wrapperCol={{span:15}}>
            {getFieldDecorator('endDate', {
                initialValue: infoDetail.endDate==null?moment(new Date):moment(infoDetail.endDate),
              })(
                <DatePicker disabled={true} style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={4}>
            <p style={{fontSize:'18px',fontWeight:'bold'}}>拆分为</p>
          </Row>
        <Row gutter={4}>
          <Col span={8}>
            <Form.Item label="第一笔金额"  labelCol={{span:8}} wrapperCol={{span:16}} >
              {getFieldDecorator('firstAmount', {
                initialValue: infoDetail.firstAmount,
              })(
                <Input disabled={true} style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="计费起始日期" labelCol={{span:9}} wrapperCol={{span:15}}>
            {getFieldDecorator('firstBeginDate', {
                initialValue: infoDetail.firstBeginDate==null?moment(new Date):moment(infoDetail.firstBeginDate),
              })(
                <DatePicker disabled={true} style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="计费终止日期" labelCol={{span:9}} wrapperCol={{span:15}}>
            {getFieldDecorator('firstEndDate', {
                initialValue: infoDetail.firstEndDate==null?moment(new Date):moment(infoDetail.firstEndDate),
              })(
                <DatePicker disabled={true} style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={4}>
          <Col span={8}>
            <Form.Item label="第二笔金额"  labelCol={{span:8}} wrapperCol={{span:16}} >
              {getFieldDecorator('secondAmount', {
                initialValue: infoDetail.secondAmount,
              })(
                <Input disabled={true} style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="计费起始日期" labelCol={{span:9}} wrapperCol={{span:15}}>
            {getFieldDecorator('secondBeginDate', {
                initialValue: infoDetail.secondBeginDate==null?moment(new Date):moment(infoDetail.secondBeginDate),
              })(
                <DatePicker disabled={true} style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="计费终止日期" labelCol={{span:9}} wrapperCol={{span:15}}>
            {getFieldDecorator('secondEndDate', {
                initialValue: infoDetail.secondEndDate==null?moment(new Date):moment(infoDetail.secondEndDate),
              })(
                <DatePicker disabled={true} style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={4}>
          <Col span={24}>
          <Form.Item label="审核情况" labelCol={{span:2}} wrapperCol={{span:22}}>
              {getFieldDecorator('memo', {
                initialValue: infoDetail.memo,
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
export default Form.create< SplitProps>()(Split);

