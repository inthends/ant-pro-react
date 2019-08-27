//添加编辑费项
import {
  Button,
  Col,
  Select,
  Form,Input,
  Row,Icon,Modal, message,TreeSelect,Checkbox, DatePicker
} from 'antd';
import { TreeEntity } from '@/model/models';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import {GetHouseTreeListExpand ,UnitMeterSaveForm,GetDataItemTreeJsonNew,GetDataItemTreeJson,SaveUnitForm} from './Meter.service';
import './style.less';
import AsynSelectTree from '../AsynSelectTree';



interface SelectReadingMeterHouseProps {
  visible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  readingDetail:any;
  reload():any;
  id?:string;
}

const SelectReadingMeterHouse = (props: SelectReadingMeterHouseProps) => {
  const { visible, closeModal,readingDetail,id ,reload} = props;
  const [feeItemData,setFeeItemData]=useState<any[]>([]);
  useEffect(() => {
    if(visible){
      GetDataItemTreeJsonNew('EnergyMeterType').then(res=>{
        setFeeItemData(res);
      });
    }
  }, [visible]);

  const [unitData,setUnitData]=useState<string[]>([]);
  const [isSelfCheck,setIsSelfCheck]=useState<boolean>(true);
  const [beginDate,setBeginDate]=useState<string>('');
  const [endDate,setEndDate]=useState<string>('');
  const [meterid,setMeterId]=useState<string>('');

  return (
    <Modal
      title="选择收费项目"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={() => {
        if(unitData.length==0){
          message.warning('请选择房间');
        }else{
          var newdata=Object.assign({},readingDetail,{units:JSON.stringify(unitData),meterid:meterid});
          if(isSelfCheck)
          {
            if(beginDate==''||endDate=='')
            {
              message.warning('请选择开始/结束日期');
              return;
            }
            newdata=Object.assign({},newdata,{BeginDate:beginDate,EndDate:endDate});
          }
          console.log(newdata);
          SaveUnitForm(newdata).then(res=>{
            closeModal();
            reload();
            message.success('数据保存成功');
          }).catch(()=>{
            message.warning('数据保存错误');
          })
        }
      }}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='600px'
    >
      <Row gutter={8} style={{height:'400px',overflow:'auto' ,marginTop:'5px',backgroundColor:'rgb(255,255,255)'}}>
        <Col span={12} style={{height:'395px',overflow:'auto' }}>
          <AsynSelectTree
            parentid={'0'}
            getCheckedKeys={(keys)=>{
              setUnitData(keys);
            }}
            selectTree={(id, type,info?) => {
            }}
          />
        </Col>
        <Col span={12}>
            <Row style={{marginBottom:'5px'}}>
              <TreeSelect
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={feeItemData}
                  placeholder="=请选择="
                  treeDefaultExpandAll
                  onChange={((value, label, extra)=>{
                    console.log(value, label, extra);
                    setMeterId(value);
                  })}
                />
            </Row>
            <Row style={{marginBottom:'5px'}}>
              <Checkbox checked={true} disabled={true}  onChange={(e)=>{
                setIsSelfCheck(e.target.checked);
              }}>自定义费项起止日期</Checkbox>
            </Row>
            <Row style={{marginBottom:'5px'}}>
              <Col span={24}>
                <DatePicker style={{width:'100%'}} disabled={!isSelfCheck} onChange={(date, dateString)=>{
                  setBeginDate(dateString);
                }}/>
              </Col>
            </Row>
            <Row style={{marginBottom:'5px'}}>
              <Col span={24}>
                <DatePicker  style={{width:'100%'}} disabled={!isSelfCheck} onChange={(date, dateString)=>{
                  setEndDate(dateString);
                }}/>
              </Col>
            </Row>
        </Col>
      </Row>
    </Modal>
  );
};

export default Form.create<SelectReadingMeterHouseProps>()(SelectReadingMeterHouse);

