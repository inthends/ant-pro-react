//选择所属机构
import { TreeEntity } from '@/model/models';
import {Checkbox, Button,Col, Form,Input,Row,Icon,Modal, message,Tree} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import {GetQuickSimpleTreeAll,UnitFeeSaveForm,GetOrgTreeOnly,GetOrganizeForm} from './Main.service';
import './style.less';
import AsynSelectTree from '../AsynSelectTree';import LeftSelectTree from '../LeftSelectTree';
interface AddHouseFeeProps {
  visible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  feeId?:string;
  reload():void;
}

const AddHouseFee = (props: AddHouseFeeProps) => {
  const { visible, closeModal,feeId,reload } = props;

 const [checkedList,setCheckedList]=useState<string[]>([]);
 const [unitData,setUnitData]=useState<string[]>([]);
// const [houseTreeData,setHouseTreeData]=useState<TreeEntity[]>([]);
  useEffect(() => {
    if(visible){
      // var queryJson={FeeItemID:feeId}
      // GetQuickSimpleTreeAll(JSON.stringify(queryJson)).then((res) => {
      //   setHouseTreeData(res || []);
      // });
    }
  }, [visible]);

  return (
    <Modal
      title="添加设费房产"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={() => {
        if(unitData.length==0){
          message.warning('请选择房屋');
        }else{
          UnitFeeSaveForm({FeeItemID:feeId,JsonFeeIdArray:JSON.stringify(unitData)}).then(res=>{
            closeModal();
            reload();
            message.success('数据保存成功');
          }).catch(()=>{
            message.warning('数据保存错误');
          });
        }
      }}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='600px'
    >
      <Row style={{height:'400px',overflow:'hidden' ,marginTop:'5px',backgroundColor:'rgb(255,255,255)'}}>
        <Col span={12} style={{height:'400px',overflow:'auto'}}>
          <AsynSelectTree
            parentid='0'
            getCheckedKeys={(keys)=>{
              setUnitData(keys);
            }}
            selectTree={(id, type,info?) => {

            }}
          />
        </Col>
        <Col span={12} style={{padding:'5px 10px'}}>
          <div style={{paddingTop:'10px'}}>
            选择房屋状态
          </div>
          <Checkbox.Group
            options={["入住","空置"]}
            value={checkedList}
            onChange={(checkedList)=>{
              setCheckedList(checkedList);
            }}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default Form.create<AddHouseFeeProps>()(AddHouseFee);

