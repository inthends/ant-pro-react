
import {  Button,  Col,  Select,  Form,Input,  Row,Icon,Modal,InputNumber, Drawer,message,Spin,DatePicker, Checkbox } from 'antd';
import { TreeEntity } from '@/model/models';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import {GetTempPaymentFeeItemTreeJson,GetRoomUsers,GetUserRooms} from './Payment.service';
import './style.less';
import LeftTree from '../LeftTree';
import  moment from 'moment';

interface FeeModifyProps {
  visible: boolean;
  closeDrawer(): void;
  form: WrappedFormUtils;
  isEdit:boolean;
  id?:string;
  reload():void;
  organize:any;

}
const FeeModify = (props: FeeModifyProps) => {
  const { visible, closeDrawer,form,isEdit,id,reload,organize} = props;
  const [feeTreeData, setFeeTreeData] = useState<TreeEntity[]>([]);
  // const [tempListData, setTempListData] = useState<any[]>([]);
  const [infoDetail,setInfoDetail]=useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { getFieldDecorator } = form;

  const [relationIds,setRelationID]=useState<any[]>([]);
  const [unitIds,setUnitIds]=useState<any[]>([]);

  const title=isEdit?"修改通知单":"新增通知单";
  useEffect(() => {
    if(visible){
      form.resetFields();
      GetTempPaymentFeeItemTreeJson(organize.id).then(res=>{
        setFeeTreeData(res);
      });
      if(id!=null&&id!=""){

      }
      if(organize.id)
      {
        GetRoomUsers(organize.id).then(res=>{
          setRelationID(res);
          if(res.length>0){
            var info =Object.assign({},infoDetail,{ relationId:res[0].key});
            setInfoDetail(info);
          }
          return info;
        }).then(infoDetail=>{
            GetUserRooms(getRelationId(infoDetail.relationId))
            .then(res=>{
              setUnitIds(res);
              if(res.length>0){
                var info =Object.assign({},infoDetail,{ householdId:res[0].value});
                setInfoDetail(info);
              }
          });
        });
      }
    }
  }, [visible]);

  const [unitData,setUnitData]=useState<string[]>([]);
  const [selectedFeeId,setSelectedFeeId]=useState<string[]>([]);


  const getRelationId=(key)=>{
    if(relationIds==null)
    {
      return null
    }
    for(var i =0;i<relationIds.length;i++)
    {
      if(relationIds[i].key==key){
        return relationIds[i].value;
      }
    }
  }

  const getUnitId=(value)=>{
    if(unitIds==null)
    {
      return null
    }
    for(var i =0;i<unitIds.length;i++)
    {
      if(unitIds[i].value==value){
        return unitIds[i].key;
      }
    }
  }
  const getGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  return (
    <Drawer
        title={title}
        placement="right"
        width={950}
        onClose={closeDrawer}
        visible={visible}
        bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
      >
      <Row gutter={8} style={{height:'calc(100vh - 55px)',overflow:'hidden' ,marginTop:'5px',backgroundColor:'rgb(255,255,255)'}}>
        {
          id!=''?
          null:
          <Col span={8} style={{height:'calc(100vh - 100px)',overflow:'auto'}}>
            <LeftTree
                treeData={feeTreeData}
                selectTree={(id, item) => {
                  if(organize.id){
                    GetFeeItemDetail(id,organize.id).then(res=>{
                      var info =Object.assign({},res,{ feeItemId:id});
                      setInfoDetail(info);
                      return info;
                    }).then(info=>{
                      GetUserRooms(getRelationId(info.relationId))
                        .then(res=>{
                          setUnitIds(res);
                          if(res.length>0)
                            info =Object.assign({},info,{  householdId:res[0].value});
                            setInfoDetail(info);
                      });
                    });
                  }
                }}
              />
          </Col>
        }
        <Col span={16}  style={{height:'calc(100vh - 100px)',padding:'5px',overflow:'auto'}}>
          <Form layout="vertical" hideRequiredMark>
            <Spin tip="数据加载中..." spinning={loading}>
            <Col span={16}>
              <Row>
                <Form.Item label="付款对象" required labelCol={{span:4}} wrapperCol={{span:20}} >
                  {getFieldDecorator('relationId', {
                    initialValue:infoDetail.relationId==null?null:infoDetail.relationId,// getRelationId(infoDetail.relationId),
                    rules: [{ required: true, message: '请选择付款对象' }]
                  })(
                    <Select placeholder="=请选择=" disabled={isEdit?false:true} onSelect={(key)=>{
                      GetUserRooms(getRelationId(key)).then(res=>{
                        setUnitIds(res);
                        var info =Object.assign({},infoDetail,{ householdId:res[0].value});
                        setInfoDetail(info);
                      });
                    }}>
                      {relationIds.map(item => (
                        <Select.Option value={item.key}>
                          {item.title}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Row>
              <Row>
                <Form.Item label="选择房屋" required  labelCol={{span:4}} wrapperCol={{span:20}} >
                  {getFieldDecorator('householdId', {
                    initialValue:infoDetail.householdId==null?null:getUnitId(infoDetail.householdId),
                    rules: [{ required: true, message: '请选择房屋' }]
                  })(
                    <Select placeholder="=请选择="  disabled={isEdit?false:true} >
                      {unitIds.map(item => (
                        <Select.Option  value={item.key}>
                          {item.title}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Row>
              <Row>
                <Col span={10}>
                  <Form.Item label="单价" required labelCol={{span:10}} wrapperCol={{span:14}} >
                    {getFieldDecorator('price', {
                      initialValue: infoDetail.price,
                      rules: [{ required: true, message: '请输入单价' }]
                    })(
                      <InputNumber  disabled={true} style={{width:'100%'}} ></InputNumber>
                    )}
                  </Form.Item>
                </Col>
                <Col span={1}  style={{lineHeight:"32px",textAlign:'center'}}>
                X
                </Col>
                <Col span={6}>
                  <Form.Item label="" required wrapperCol={{span:24}}>
                    {getFieldDecorator('quantity', {
                      initialValue: infoDetail.quantity,
                      rules: [{ required: true, message: '请输入质量' }]
                    })(
                      <InputNumber disabled={true} style={{width:'100%'}}></InputNumber>
                    )}
                  </Form.Item>
                </Col>
                <Col span={1} style={{lineHeight:"32px",textAlign:'center'}}>
                X
                </Col>
                <Col span={6}>
                  <Form.Item label="" required wrapperCol={{span:24}}>
                    {getFieldDecorator('number', {
                      initialValue: infoDetail.number,
                      rules: [{ required: true, message: '请输入数量' }]
                    })(
                      <InputNumber style={{width:'100%'}}></InputNumber>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item label="金额" required   labelCol={{span:4}} wrapperCol={{span:20}} >
                    {getFieldDecorator('amount', {
                      initialValue: infoDetail.amouant,
                      rules: [{ required: true, message: '=请选择=' }]
                    })(
                      <InputNumber disabled={true} style={{width:'100%'}} ></InputNumber>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item label="周期" required   labelCol={{span:10}} wrapperCol={{span:14}} >
                    {getFieldDecorator('cycleValue', {
                      initialValue: infoDetail.cycleValue,
                      rules: [{ required: true, message: '=请选择=' }]
                    })(
                      <InputNumber  style={{width:'100%'}}></InputNumber>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="" required   labelCol={{span:0}} wrapperCol={{span:24}} >
                    {getFieldDecorator('cycleType', {
                      initialValue: infoDetail.cycleType,
                      rules: [{ required: true, message: '请选择周期单位' }]
                    })(
                      <Select placeholder="=请选择="  style={{width:'100%'}}>
                        <Select.Option key='日' value='日'>
                          {'日'}
                        </Select.Option>
                        <Select.Option key='月' value='月'>
                          {'月'}
                        </Select.Option>
                        <Select.Option key='年' value='年'>
                          {'年'}
                        </Select.Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="起始日期" required   labelCol={{span:10}} wrapperCol={{span:14}} >
                    {getFieldDecorator('beginDate', {
                      initialValue: infoDetail.beginDate,
                      rules: [{ required: true, message: '请选择起始日期' }]
                    })(
                      <DatePicker  style={{width:'100%'}}/>
                    )}
                  </Form.Item>
                </Col>
                <Col  span={12}>
                  <Form.Item label="结束日期" required  labelCol={{span:10}} wrapperCol={{span:14}}>
                    {getFieldDecorator('endDate', {
                      initialValue: infoDetail.endDate,
                      rules: [{ required: true, message: '请选择结束日期' }]
                    })(
                      <DatePicker  style={{width:'100%'}}/>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
              <Col span={24}>
                <Form.Item label="备注" required  labelCol={{span:4}} wrapperCol={{span:20}}>
                  {getFieldDecorator('memo', {
                    initialValue: infoDetail.memo,
                    rules: [{ required: false }]
                  })(
                    <Input.TextArea rows={8}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            </Col>
            </Spin>
          </Form>
        </Col>
      </Row>
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
            onClick={()=>closeDrawer()}
            >
              取消
            </Button>
            <Button type="primary"
              onClick={()=>{
                if(unitData.length==0){
                  message.warning('请选择房间');
                }else{
                  if(unitData.length==0)
                  {
                    message.warning('请选择房屋');
                    return;
                  }
                  if(selectedFeeId.length==0)
                  {
                    message.warning('请选择费项');
                    return;
                  }
                  form.validateFields((errors, values) => {
                    if (!errors) {
                      console.log(infoDetail);
                      let newData={
                        BeginDate:moment( values.beginDate).format('YYYY-MM-DD'),
                        EndDate:moment( values.endDate).format('YYYY-MM-DD'),
                        BillType:"通知单",
                        Status:values.status,
                        TemplateId:values.templateId,
                        IncludeBefore:values.includeBefore,
                        CalType:values.calType,
                        Memo:values.memo,
                        MustDate:moment(values.mustDate).format('YYYY-MM-DD'),
                        units:JSON.stringify(unitData),
                        items:JSON.stringify(selectedFeeId)
                      }
                      /*SaveBill(newData).then((res)=>{
                        console.log(res);
                        closeDrawer();
                        reload();
                      });*/
                    }
                  });
                }
              }}
            >
              提交
            </Button>
          </div>
    </Drawer>
  );
};
export default Form.create<FeeModifyProps>()(FeeModify);

