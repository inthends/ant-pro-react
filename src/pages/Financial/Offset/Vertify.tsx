 
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Row,
  Input,
  Spin
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import {  Audit,GetFormJson,GetCustomInfo } from './Offset.service';
import './style.less';
import  moment from 'moment'; 

interface VertifyProps {
  vertifyVisible: boolean;
  ifVertify:boolean;
  closeVertify(result?): void;
  form: WrappedFormUtils;
  id?: string;
  reload(): void;
}

const Vertify = (props: VertifyProps) => {
  const { vertifyVisible, closeVertify, form, id, ifVertify } = props;
  const title = id === undefined ? '新增冲抵单' : '修改冲抵单';
  const [loading, setLoading] = useState<boolean>(false);

  const { getFieldDecorator } = form;

  const [infoDetail, setInfoDetail] = useState<any>({});

  useEffect(() => {
    if(id){
      setLoading(true);
      GetFormJson(id).then(res=>{
       // setInfoDetail(res);
        return res;
      }).then((res)=>{
        if(res.customerId){
          GetCustomInfo(res.customerId).then(customInfo=>{
            setInfoDetail({
              ...res,
              keyValue:res.billId,
              customerName:customInfo.name
            });
            setLoading(false);
          });
        }else{
          setLoading(false);
          setInfoDetail(
            res
          )
        }
      })
    }else{
      setLoading(false);
    }
  }, [vertifyVisible]);

  const close = () => {
    closeVertify(false);
  };

  const onSave=()=>{
    form.validateFields((errors, values) => {
      if (!errors) {
        let newData={  ...infoDetail,
          // verifyPerson:ifVertify?localStorage.getItem('userid'):'',
          ifVerify:ifVertify,
          // verifyDate:ifVertify?moment(new Date()).format('YYYY-MM-DD HH:mm:ss'):''
        };
        Audit(newData).then(()=>{
          closeVertify(true);
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
          <Form hideRequiredMark>
          <Spin tip="数据加载中..." spinning={loading}>
            <Row gutter={24}>
              <Col span={8} >
                <Form.Item className="vertifyItem" label="单号" labelCol={{span:6}} wrapperCol={{span:18}} >
                  {getFieldDecorator('billCode', {
                      initialValue:infoDetail.billCode,
                    rules: [{ required: true ,message:'请输入单号' }],
                  })(
                    <Input  disabled={true}></Input>
                  )}
                </Form.Item>
              </Col>
              <Col span={8} >
                <Form.Item label="账单日期" labelCol={{span:6}} wrapperCol={{span:18}} >
                  {getFieldDecorator('billDate', {
                      initialValue:infoDetail.billDate!=null
                      ? moment(new Date(infoDetail.billDate))
                      : moment(new Date()),
                    rules: [{ required: true ,message:'请选择账单日期'}],
                  })(
                    <DatePicker  disabled={true}></DatePicker>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}  >
                <Form.Item label="冲抵人" labelCol={{span:6}} wrapperCol={{span:18}} >
                  {getFieldDecorator('createUserName', {
                      initialValue:infoDetail.createUserName,
                    rules: [{ required: true ,message:'请输入冲抵人'}],
                  })(
                    <Input  disabled={true}></Input>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8} >
                <Form.Item label="业户名称" labelCol={{span:6}} wrapperCol={{span:18}} >
                  {getFieldDecorator('customerName', {
                      initialValue:infoDetail.customerName,
                    rules: [{ required: true ,message:'请输入业主名称'}],
                  })(
                    <Input disabled={true}></Input>
                  )}
                </Form.Item>
              </Col>
              <Col span={8} >
                <Form.Item label="审核日期" labelCol={{span:6}} wrapperCol={{span:18}} >
                  {getFieldDecorator('verifyDate', {
                      initialValue:infoDetail.verifyDate!=null
                      ? moment(new Date(infoDetail.verifyDate))
                      : moment(new Date()),
                    rules: [{ required: true ,message:'请选择审核日期'}],
                  })(
                    <DatePicker  disabled={true}></DatePicker>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="审核人" labelCol={{span:6}} wrapperCol={{span:18}} >
                  {getFieldDecorator('verifyPerson', {
                      initialValue:infoDetail.verifyPerson
                  })(
                    <Input disabled={true}></Input>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="审核情况" labelCol={{span:2}} wrapperCol={{span:22}} >
                  {getFieldDecorator('verifymemo', {
                      initialValue:infoDetail.verifymemo
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

export default Form.create<VertifyProps>()(Vertify);

