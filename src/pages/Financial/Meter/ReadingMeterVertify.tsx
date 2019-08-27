import {  Button,  Col,  DatePicker,  Drawer,  Form,  Row,  Input,  Spin} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { Audit,GetMeterRead} from './Meter.service';
import './style.less';
import  moment from 'moment';

interface ReadingMeterVertifyProps {
  vertifyVisible: boolean;
  ifVertify:boolean;
  closeVertify(result?): void;
  form: WrappedFormUtils;
  id?: string;
  reload(): void;
}

const ReadingMeterVertify = (props: ReadingMeterVertifyProps) => {
  const { vertifyVisible, closeVertify, form, id,ifVertify ,reload} = props;
  const title = id === undefined ? '抄表单审核' : '抄表单取消审核';
  const [loading, setLoading] = useState<boolean>(false);
  const { getFieldDecorator } = form;
  const [infoDetail, setInfoDetail] = useState<any>({});

  useEffect(() => {
    if(vertifyVisible){
      form.resetFields();
      if(id!=null&&id!=''){
        setLoading(true);
        GetMeterRead(id).then(res=>{
          setInfoDetail(res);
          setLoading(false);
        })
      }else{
        setInfoDetail({});
        setLoading(false);
      }
    }
  }, [vertifyVisible]);

  const close = () => {
    closeVertify(false);
  };

  const onSave=()=>{
    form.validateFields((errors, values) => {
      if (!errors) {
        let newData={
          keyValue:infoDetail.billID,
          BillID:infoDetail.billID,
          OrganizeID:infoDetail.organizeID,
          BillCode:infoDetail.billCode,
          BatchCode:infoDetail.batchCode,
          MeterCode:infoDetail.meterCode,
          ReadDate:infoDetail.readDate,
          EndReadDate:infoDetail.endReadDate,
          Memo:infoDetail.memo,
          MeterReader:infoDetail.meterReader,
          IfVerify:!infoDetail.ifVertify,
          VerifyDate:ifVertify?moment(new Date()).format('YYYY-MM-DD HH:mm:ss'):moment(values.verifyDate).format('YYYY-MM-DD HH:mm:ss'),
          VerifyMemo:values.verifymemo
        };
        Audit(newData).then(()=>{
          closeVertify(true);
          reload();
        });
      }
    });
  };

  return (
      <Drawer
        className="offsetVertify"
        title={title}
        placement="right"
        width={880}
        onClose={close}
        visible={vertifyVisible}
        bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
      >
          <Form layout="vertical"  hideRequiredMark>
          <Spin tip="数据加载中..." spinning={loading}>
            <Row gutter={24}>
              <Col span={8} >
                <Form.Item className="vertifyItem" label="单号">
                  {getFieldDecorator('billCode', {
                      initialValue:infoDetail.billCode==null?'':infoDetail.billCode,
                  })(
                    <Input  disabled={true}></Input>
                  )}
                </Form.Item>
              </Col>
              <Col span={8} >
                <Form.Item label="抄表日期">
                  {getFieldDecorator('readDate', {
                      initialValue:infoDetail.readDate!=null
                      ? moment(new Date(infoDetail.readDate))
                      : moment(new Date()),
                  })(
                    <DatePicker  disabled={true}></DatePicker>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}  >
                <Form.Item label="抄表人">
                  {getFieldDecorator('meterReader', {
                      initialValue:infoDetail.meterReader==null?'':infoDetail.meterReader,
                  })(
                    <Input  disabled={true}></Input>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8} >
                <Form.Item label="抄表期间">
                  {getFieldDecorator('meterCode', {
                      initialValue:infoDetail.meterCode==null?'':infoDetail.meterCode,
                  })(
                    <Input disabled={true}></Input>
                  )}
                </Form.Item>
              </Col>
              <Col span={8} >
                <Form.Item label="审核日期" >
                  {getFieldDecorator('verifyDate', {
                      initialValue:infoDetail.verifyDate!=null
                      ? moment(new Date(infoDetail.verifyDate))
                      : moment(new Date()),
                  })(
                    <DatePicker  disabled={true}></DatePicker>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="审核人">
                  {getFieldDecorator('verifyPerson', {
                      initialValue:infoDetail.verifyPerson==null?'':infoDetail.verifyPerson
                  })(
                    <Input disabled={true}></Input>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="审核情况" >
                  {getFieldDecorator('verifymemo', {
                      initialValue:infoDetail.verifymemo==null?'':infoDetail.verifymemo
                  })(
                    <Input.TextArea rows={4} >
                    </Input.TextArea >
                  )}
                </Form.Item>
              </Col>
            </Row>
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
            <Button style={{ marginRight: 8 }}
            onClick={()=>closeVertify()}
            >
              取消
            </Button>
            <Button type="primary"
              onClick={()=>onSave()}
            >
              提交
            </Button>
          </div>
          </Form>
      </Drawer>
  );
};

export default Form.create<ReadingMeterVertifyProps>()(ReadingMeterVertify);

