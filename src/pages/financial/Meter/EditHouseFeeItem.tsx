//编辑房屋费表
import {
  Button,
  Col,
  Drawer,
  Form,
  Row,Icon,
  Spin,
  Input,InputNumber,message,Modal
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import {SaveUnitMeterForm,GetUnitMeterInfoFormJson} from './Meter.service';
import './style.less';
import AddFormula from './AddFormula';
import SelectSingleHouse from './SelectSingleHouse';

interface EditHouseFeeItemProps {
  modifyVisible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  id?: string;
  meterinfo?:any;
  reload(): void;
}

const EditHouseFeeItem = (props: EditHouseFeeItemProps) => {
  const { modifyVisible, closeModal, form, id,meterinfo } = props;
  const title = id === undefined ? '新增费表资料' : '修改费表资料';
  const [loading, setLoading] = useState<boolean>(false);
  const { getFieldDecorator } = form;
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [selectHouseVisible, setSelectHouseVisible] = useState<boolean>(false);
  const [addFormulaVisible, setAddFormulaVisible] = useState<boolean>(false);
  useEffect(() => {
    if(modifyVisible){
      if(id!=null&&id!='')
      {
        setLoading(false);
        GetUnitMeterInfoFormJson(id).then(res=>{
          var info=Object.assign({},{allname:res.allname,metername:res.metername},res.entity)
          setInfoDetail(info);
          setLoading(false);
        });
      }else{
        setLoading(false);
      }
    }
  }, [modifyVisible]);

  const close = () => {
    closeModal();
  };

  const getGuid=()=> {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
  }

const onSave=()=>{
    form.validateFields((errors, values) => {
      if (!errors) {
        console.log(meterinfo);
        var info=Object.assign({},{
          MeterId:   meterinfo.meterId,
          OrganizeId:  meterinfo.organizeId,
          MeterType:   meterinfo.meterType,
          MeterKind:  meterinfo.meterKind,
          MeterName: meterinfo. meterName,
          MeterCode: meterinfo. meterCode,
          ParentId:  meterinfo.parentId,
          RunType: meterinfo. runType,
          MeterZoom:  meterinfo.meterZoom,
          MeterRange: meterinfo. meterRange,
          MeterCapacity: meterinfo. meterCapacity,
          Calculation:  meterinfo.calculation,
          EneryType: meterinfo.energyType,
          MeterArea: meterinfo. meterArea,
          MeterAddress:  meterinfo.meterAddress,
          Memo:  meterinfo.memo ,
          FeeItemId: meterinfo.feeItemId,
          FeeItemName: meterinfo.feeItemName,
          IsStop:  meterinfo.isStop==null?false:true,
        },{
          keyValue:id,
          UnitMeterId:id,
          MeterName:values.meterName,
          MeterCode:values.meterCode,
          MeterZoom:values.meterZoom,
          MeterRange:values.meterRange,
          MeterPrice:values.meterPrice,
          MeterAddress:values.meterAddress,
          Memo:values.memo,
          Capacity:values.meterCapacity,
          MinUsage:values.minUsage,
          MaxUsage:values.maxUsage,
          UnitId:infoDetail.unitId,
          Formula: values.formula,
        });

        SaveUnitMeterForm(info).then(res=>{
          closeModal();
          message.success('数据保存成功');
        }).catch(()=>{
          message.warning('数据保存错误');
        })
      }
    });
  };

const closeAddFormula=()=>{
  setAddFormulaVisible(false);
}
const closeSelectHouse=()=>{
  setSelectHouseVisible(false);
}
const [isFormula,setIsFormula]=useState<boolean>(false);
  return (
    <Modal
      title="选择收费项目"
      visible={modifyVisible}
      okText="确认"
      cancelText="取消"
      onCancel={()=>close()}
      onOk={() => {
        onSave()
      }}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='600px'
    >
      <Form  hideRequiredMark>
        <Spin tip="数据加载中..." spinning={loading}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item required={true} label="费表名称" labelCol={{span:6}} wrapperCol={{span:18}} >
                {getFieldDecorator('meterName', {
                    initialValue:infoDetail.metername,
                  rules: [{ required: true ,message:'请输入费表名称' }],
                })(
                  <Input style={{width:'100%'}}  disabled={true}></Input>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item required={true} label="房屋名称" labelCol={{span:6}} wrapperCol={{span:18}} >
                {getFieldDecorator('allName', {
                    initialValue:infoDetail.allname,
                  rules: [{ required: true ,message:'请输入房屋名称' }],
                })(
                  <Input addonAfter={<Icon type="setting" onClick={()=>{
                    setSelectHouseVisible(true);
                  }}/>}/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item  required={true} label="费表编号" labelCol={{span:6}} wrapperCol={{span:18}} >
                  {getFieldDecorator('meterCode', {
                      initialValue:infoDetail.meterCode,
                    rules: [{ required: true ,message:'请输入费表编号'}],
                  })(
                    <Input style={{width:'100%'}} disabled={true}></Input>
                  )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item required={true} label="房屋编号" labelCol={{span:6}} wrapperCol={{span:18}} >
                {getFieldDecorator('unitId', {
                    initialValue:infoDetail.unitId,
                  rules: [{ required: true ,message:'请输入房屋编号' }],
                })(
                  <Input style={{width:'100%'}}  disabled={true}/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item required={true}  label="倍率" labelCol={{span:6}} wrapperCol={{span:18}} >
                  {getFieldDecorator('meterZoom', {
                      initialValue:infoDetail.meterZoom==null?1:infoDetail.meterZoom,
                    rules: [{ required: true ,message:'请输入倍率'}],
                  })(
                    <InputNumber style={{width:'100%'}} ></InputNumber>
                  )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item required={true}  label="量程" labelCol={{span:6}} wrapperCol={{span:18}} >
                {getFieldDecorator('meterRange', {
                    initialValue:infoDetail.meterRange==null?9999:infoDetail.meterRange,
                  rules: [{ required: true ,message:'请输入量程'}],
                })(
                  <InputNumber style={{width:'100%'}} ></InputNumber>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item  required={true} label="单价" labelCol={{span:6}} wrapperCol={{span:18}} >
                  {getFieldDecorator('meterPrice', {
                      initialValue:infoDetail.meterPrice==null?1:infoDetail.meterPrice,
                      rules: [{ required: true ,message:'请输入单价'}],
                  })(
                    <InputNumber style={{width:'100%'}} ></InputNumber>
                  )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item  required={true} label="容量" labelCol={{span:6}} wrapperCol={{span:18}} >
                {getFieldDecorator('meterCapacity', {
                        initialValue:infoDetail.meterCapacity==null?0:infoDetail.meterCapacity,
                })(
                  <InputNumber style={{width:'100%'}} ></InputNumber>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item  required={true} label="最小用量" labelCol={{span:6}} wrapperCol={{span:18}} >
                  {getFieldDecorator('minUsage', {
                      initialValue:infoDetail.minUsage==null?0:infoDetail.minUsage,
                  })(
                    <InputNumber style={{width:'100%'}} ></InputNumber>
                  )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item  required={true} label="最大用量" labelCol={{span:6}} wrapperCol={{span:18}} >
                {getFieldDecorator('maxUsage', {
                      initialValue:infoDetail.maxUsage==null?0:infoDetail.maxUsage,
                })(
                  <InputNumber  style={{width:'100%'}} ></InputNumber>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
            <Form.Item  required={true} label="分摊系数" labelCol={{span:3}} wrapperCol={{span:21}} >
                {getFieldDecorator('formula', {
                    initialValue:infoDetail.formula==null?'<建筑面积>/<单据总建筑面积>':infoDetail.formula,
                  rules: [{ required: true ,message:'请输入分摊系数'}],
                })(
                    <Input addonAfter={<Icon type="setting" onClick={()=>{
                      setAddFormulaVisible(true);
                      setIsFormula(true);
                    }}/>}/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
            <Form.Item  required={true} label="附加说明" labelCol={{span:3}} wrapperCol={{span:21}} >
                {getFieldDecorator('memo', {
                    initialValue:infoDetail.memo
                })(
                  <Input></Input>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Spin>
      </Form>
      <AddFormula
        visible= {addFormulaVisible}
        closeModal={closeAddFormula}
        getFormulaStr={(str,isFormula)=>{
            if(isFormula){
              var info= Object.assign({},infoDetail,{formula:str});
              setInfoDetail(info);
            }else{
              var info= Object.assign({},infoDetail,{calculation:str});
              setInfoDetail(info);
            }
          }}
          isFormula={isFormula}
      />
      <SelectSingleHouse
        visible= {selectHouseVisible}
        closeModal={closeSelectHouse}
        getSelectTree={(houseinfo)=>{
          console.log(houseinfo);
          var info= Object.assign({},infoDetail,{unitName:houseinfo.allname});
          setInfoDetail(info);
          setSelectHouseVisible(false);
        }}
      />
    </Modal>
  );
};

export default Form.create<EditHouseFeeItemProps>()(EditHouseFeeItem);

