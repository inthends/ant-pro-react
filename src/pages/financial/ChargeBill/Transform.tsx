//转费
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
import { GetShowDetail,TransferBilling,GetTransferRoomUsers} from './Main.service';
import styles from './style.less';
import  moment from 'moment';

interface TransfromProps {
  transVisible: boolean;
  closeTrans(): void;
  form: WrappedFormUtils;
  id?:string;
reload():void;

}
const Transfrom = (props:  TransfromProps) => {
  const { transVisible, closeTrans, id,form,reload} = props;
  const { getFieldDecorator } = form;
  const title="拆分费用";
  const [infoDetail, setInfoDetail] = useState<any>({});

  const [relationIds, setRelationIds] = useState<any>([]);

  // 打开抽屉时初始化
  useEffect(() => {
    if (transVisible) {
      if(id){
        GetShowDetail(id).then(res=>{
          var infoTemp =Object.assign({},res.entity,
            { feeName:res.feeName, customerName:res.customerName, unitName:res.unitName});
          setInfoDetail(infoTemp);
          return  GetTransferRoomUsers(res.entity.UnitID, res.entity.RelationID);
        }).then(res=>{
          setRelationIds(res);
        });
      }else{
        setInfoDetail({  });
      }
    } else {

    }
  }, [transVisible]);

  const close = () => {
    closeTrans();
  };

  const save=()=>{
    form.validateFields((errors, values) =>{
      var data= {
        RelationID:values.relationID,
        Memo:values.memo
      };

      var splitData={
        Data:JSON.stringify(data),
        keyValue:id
      };
      TransferBilling(splitData).then(res=>{
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
      visible={transVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      <Form hideRequiredMark>

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
            <p style={{fontSize:'18px',fontWeight:'bold'}}>拆分为</p>
          </Row>
          <Row gutter={4}>
          <Col span={24}>
            <Form.Item label="新收费对象"  labelCol={{span:3}} wrapperCol={{span:21}} >
              {getFieldDecorator('relationID', {
                initialValue: infoDetail.relationID,
              })(
                <Select placeholder="=请选择=">
                {relationIds.map(item => (
                  <Option  value={item.key}>
                    {item.title}
                  </Option>
                ))}
              </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={4}>
          <Col span={24}>
          <Form.Item label="审核情况" labelCol={{span:3}} wrapperCol={{span:21}}>
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
export default Form.create< TransfromProps>()(Transfrom);

