//选择房间
import { Button,Col, Form,Input,Row,Icon,Modal, message} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import './style.less';
import AsynLeftTree from '../AsynLeftTree';
interface SelectHouseProps {
  visible: boolean;
  closeModal(): void;
  getSelectTree(id):void;
  form: WrappedFormUtils;
}

const SelectHouse = (props: SelectHouseProps) => {
  const { visible, closeModal,getSelectTree} = props;
  useEffect(() => {
    if(visible){
    }
  }, [visible]);

  const [unitData,setUnitData]=useState<any[]>([]);

  return (
    <Modal
      title="选择单元"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={() => {
        if(unitData.length==0||unitData.isLeaf!=1){
          message.warning('请选择房间');
        }else{
          getSelectTree(unitData);
          closeModal();
        }
      }}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='400px'
    >
      <Row gutter={8}>
        <Col span={18}>
          <Input placeholder="请输入要查询的关键字"/>
        </Col>
        <Col span={6}>
          <Button style={{width:'100%'}}>
          <Icon type="search" />查询</Button>
        </Col>
      </Row>
      <Row style={{height:'400px',overflow:'auto' ,marginTop:'5px',backgroundColor:'rgb(255,255,255)'}}>
        <Col span={24}>
          <AsynLeftTree
            parentid={'0'}
            selectTree={(id, type, info?) => {
              setUnitData(info.node.props);
            }}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default Form.create<SelectHouseProps>()(SelectHouse);



