import {  Button,  Col,  DatePicker,  Drawer,  Form,  Row,  Input,  Spin} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { Audit,GetBilling} from './BillingMain.service';
import './style.less';
import  moment from 'moment';

interface MeterVerifyProps {
  vertifyVisible: boolean;
  ifVerify:boolean;
  closeVerify(result?): void;
  form: WrappedFormUtils;
  id?: string;
  reload(): void;
}

const MeterVerify = (props: MeterVerifyProps) => {
  const { vertifyVisible, closeVerify, form, id,ifVerify ,reload} = props;
  const title = id === undefined ? '抄表单审核' : '抄表单取消审核';
  const [loading, setLoading] = useState<boolean>(false);
  const { getFieldDecorator } = form;
  const [infoDetail, setInfoDetail] = useState<any>({});

  useEffect(() => {
    if(vertifyVisible){
      form.resetFields();
      if(id!=null&&id!=''){
        setLoading(true);
        GetBilling(id).then(res=>{
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
    closeVerify(false);
  };

  const onSave=()=>{
    form.validateFields((errors, values) => {
      if (!errors) {
        console.log(infoDetail);
        let newData={
          keyValue:infoDetail.billID,
          billCode:values.billCode,
          billDate:moment(values.billDate).format('YYYY-MM-DD'),
          createUserName:values.createUserName,
          IfVerify:!infoDetail.ifVerify,
          billSource:infoDetail.billSource,
          VerifyDate:ifVerify?moment(new Date()).format('YYYY-MM-DD HH:mm:ss'):moment(values.verifyDate).format('YYYY-MM-DD HH:mm:ss'),
          VerifyMemo:values.verifyMemo
        };
        Audit(newData).then(()=>{
          closeVerify(true);
        //  reload();
        });
      }
    });
  };

  return (
      <Drawer
        className="offsetVerify"
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
              <Col span={8}>
                <Form.Item required label="单据编号">
                  {getFieldDecorator('billCode', {
                    initialValue: infoDetail.billCode,
                  })(
                    <Input disabled={true} placeholder="自动获取编号"/>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required label="单据日期"  >
                  {getFieldDecorator('billDate', {
                    initialValue: infoDetail.billDate==null?moment(new Date()):moment(infoDetail.billDate),
                    rules: [{ required: true, message: '请选择单据日期' }],
                  })(
                    <DatePicker  disabled={true}/>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required label="计费人"  >
                  {getFieldDecorator('createUserName', {
                    initialValue: infoDetail.createUserName,
                  })(
                    <Input  disabled={true}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item required label="状态"   >
                  {getFieldDecorator('ifVerify', {
                    initialValue:infoDetail.ifVerify==null|| !infoDetail.ifVerify?'未审核':'已审核',
                  })(
                    <Input  disabled={true}></Input>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required label="审核人"  >
                  {getFieldDecorator('verifyPerson', {
                    initialValue: infoDetail.verifyPerson,
                  })(
                    <Input  disabled={true}  />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item required label="审核日期"   >
                  {getFieldDecorator('verifyDate', {
                      initialValue: infoDetail.billDate==null?moment(new Date()):moment(infoDetail.billDate),
                  })(
                    <DatePicker disabled={true}/>
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
                    <Input.TextArea rows={3} placeholder="请输入审核情况" />
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
            onClick={()=>closeVerify()}
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

export default Form.create<MeterVerifyProps>()(MeterVerify);

