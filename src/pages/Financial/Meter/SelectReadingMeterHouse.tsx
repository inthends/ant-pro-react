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
import {GetHouseTreeListExpand ,UnitMeterSaveForm,GetDataItemTreeJson} from './Meter.service';
import './style.less';
import AsynSelectTree from '../AsynSelectTree';

const Option = Select.Option;

interface SelectReadingMeterHouseProps {
  visible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  readingDetail:any;
  reload():any;
  id?:string;
}

const SelectReadingMeterHouse = (props: SelectReadingMeterHouseProps) => {
  const { visible, closeModal,readingDetail,id } = props;
  const [feeItemData,setFeeItemData]=useState<any[]>([]);
  useEffect(() => {
    if(visible){
      GetDataItemTreeJson('EnergyMeterType').then(res=>{
        setFeeItemData(res);
      });
    }
  }, [visible]);

  const [unitData,setUnitData]=useState<string[]>([]);

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
          /*var newdata=Object.assign({},feeDetail,{units:JSON.stringify(unitData)});
          UnitMeterSaveForm(newdata).then(res=>{
            closeModal();
            message.success('数据保存成功');
          }).catch(()=>{
            message.warning('数据保存错误');
          })*/
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
                  onChange={(value=>{
                   // var info = Object.assign({},infoDetail,{organizeId:value});
                   // setInfoDetail(info);
                  })}
                />
            </Row>
            <Row style={{marginBottom:'5px'}}>
              <Checkbox>自定义费项起止日期</Checkbox>
            </Row>
            <Row style={{marginBottom:'5px'}}>
              <Col>
                <DatePicker/>
              </Col>
            </Row>
            <Row style={{marginBottom:'5px'}}>
              <Col>
                <DatePicker/>
              </Col>
            </Row>
        </Col>
      </Row>
    </Modal>
  );
};

export default Form.create<SelectReadingMeterHouseProps>()(SelectReadingMeterHouse);

